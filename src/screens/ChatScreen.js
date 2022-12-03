import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  SectionList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import moment from 'moment';
import Icon9 from 'react-native-vector-icons/dist/MaterialIcons';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { StackActions } from '@react-navigation/native';
import Message from '../components/MultiMediaMsg';
import { useKeyboardVisible } from '../Hooks/useKeyboardVisible';
import Icon2 from 'react-native-vector-icons/dist/Ionicons';
import messaging from '@react-native-firebase/messaging';
import { getUniqueId } from 'react-native-device-info';

moment.updateLocale("en", {
  relativeTime: {
    future: (diff) => (diff == "just now" ? diff : `in ${diff}`),
    past: (diff) => (diff == "just now" ? diff : `${diff} ago`),
    s: "just now",
    ss: "just now"
  }
});

const ChatScreen = ({ navigation, route }) => {

  const [newMessage, setNewMessage] = useState('');

  const [messages, setMessages] = useState([]);

  const [visibleMessages, setVisibleMessages] = useState([]);

  const { voxData, userdata: userData } = useSelector(state => state.user);

  const isKeyboardVisible = useKeyboardVisible();

  const compareFunction = (a, b) => a - b;

  const currentUserId = Number(userData.userid);

  const friendUserId = Number(route.params.receiverId);

  const uid = [currentUserId, friendUserId].sort(compareFunction).join('_');

  const conversationsRef = firestore().collection('conversations');

  const messagesRef = firestore().collection('messages').doc(uid).collection('chat');

  const messagesListRef = useRef();

  const scrollToBottom = () => messagesListRef.current?.scrollToLocation({ animated: true, sectionIndex: 0, itemIndex: 0 });

  const batch = firestore().batch();

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 5 });

  const onViewRef = React.useRef(async ({ viewableItems }) => {
    setVisibleMessages(viewableItems.map(({ item }) => item));
  });

  useEffect(() => {

    const updateSeen = async () => {
      visibleMessages.forEach((item) => {
        if (item.seen === false && item.senderId !== currentUserId) {
          const docRef = messagesRef.doc(item.uid.toString());
          batch.update(docRef, { seen: true, readAt: firestore.Timestamp.now() })
        }
      })
      await batch.commit();
    }

    visibleMessages.length > 0 && updateSeen();

  }, [visibleMessages.length])


  useEffect(() => {
    const subscriber = messagesRef
      .orderBy('timeStamp', 'desc')
      .limit(50)
      .onSnapshot(datasnap => {
        var returnArray = [];

        datasnap.forEach(function (snap) {
          var item = snap.data();
          returnArray.push(item);
        });

        if (messages.length !== returnArray.length) {
          setMessages(returnArray);
        }

      });
    return () => subscriber();
  }, []);

  const backAction = () => {
    const popAction = StackActions.pop(1);
    navigation.dispatch(popAction);
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);


  const groupMessagesByTime = useCallback((messages) => {
    const getDayDifference = (timestamp) => {
      return timestamp.toDate().toDateString();
    }

    const groups = messages.reduce((groupMessages, message) => {
      const date = getDayDifference(message.timeStamp);
      if (!groupMessages[date]) {
        groupMessages[date] = [];
      }
      groupMessages[date].push(message);
      return groupMessages;
    }, {});

    const groupArrays = Object.keys(groups).map((date) => {
      return {
        title: date,
        data: groups[date]
      };
    });
    return groupArrays;
  }, [messages.length])

  const submit = async () => {

    if (newMessage.trim() === '') {
      return;
    }

    var msg = newMessage.trim();
    const newMessageDoc = messagesRef.doc();

    const data = {
      contentType: 'text',
      contentInfo: {
        text: msg
      }
    }

    const newMessageData = {
      msg: data,
      timeStamp: firestore.Timestamp.now(),
      seen: false,
      senderId: currentUserId,
      uid: newMessageDoc.id
    };

    setNewMessage('');
    newMessageDoc.set(newMessageData).then(() => {
      setNewMessage('');
    });

    const registerDevice = async () => {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      return token;
    }

    const deviceData = {
      udid: await getUniqueId().then(uniqueId => uniqueId),
      fcm_token: await registerDevice()
    }


    conversationsRef.doc(uid).update({
      recentMessage: {
        message: data,
        createdAt: firestore.Timestamp.now(),
      },
      senderId: currentUserId,
      receiverId: friendUserId,
      [`${currentUserId}.devicesData`]: firestore.FieldValue.arrayUnion(deviceData)
    })

  };


  const renderButton = () => {
    return (
      <View style={{
        height: heightToDp('6'),
        width: widthToDp('15'),
        marginLeft: widthToDp('2'),
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <TouchableOpacity
          onPress={() => newMessage.trim() !== '' && submit()}
          style={{ alignSelf: 'flex-start' }}
        >
          {newMessage ? <Icon9
            name="send"
            size={35}
            color="white"
          /> : <Icon9
            name="add-circle"
            size={45}
            color="white"
          />}
        </TouchableOpacity>
      </View>
    );
  };

  const renderMessageHeader = () => {
    return (
      <View style={{ marginTop: heightToDp('0') }}>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: heightToDp('1.4'),
            marginHorizontal: widthToDp('5'),
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon2 name="arrow-back" size={heightToDp('4')} color="white" onPress={() => backAction()} />
            <TouchableOpacity
              style={{
                width: widthToDp('10'),
                height: heightToDp('4.8'),
                borderColor: '#FF5F6D',
                borderWidth: widthToDp('0.4'),
                borderRadius: 10,
                marginLeft: widthToDp('5'),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}
              onPress={() =>
                navigation.push('Profile', { user_id: friendUserId })
              }>
              <Image
                style={{
                  width: widthToDp('8.5'),
                  height: heightToDp('4'),
                  resizeMode: 'cover',
                  borderRadius: 6,
                }}
                source={{
                  uri: route.params?.profile_pic,
                }}
              />
            </TouchableOpacity>
            <View style={{ marginLeft: widthToDp('2.5') }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: heightToDp('1.7'),
                }}>
                {route.params?.name}
              </Text>
            </View>
          </View>
          {voxData !== "" && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: widthToDp('16'),
              }}>
              <Icon9
                name="call"
                size={20}
                color="white"
                onPress={() => makeCall(false)}
              />
              <Icon9
                name="videocam"
                size={30}
                color="white"
                onPress={() => makeCall(true)}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  async function makeCall(isVideoCall) {
    try {
      if (Platform.OS === 'android') {
        let permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
        if (isVideoCall) {
          permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
        }
        const granted = await PermissionsAndroid.requestMultiple(permissions);
        const recordAudioGranted =
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
        const cameraGranted =
          granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
        if (recordAudioGranted) {
          if (isVideoCall && !cameraGranted) {
            console.warn(
              'MainScreen: makeCall: camera permission is not granted',
            );
            return;
          }
        } else {
          console.warn(
            'MainScreen: makeCall: record audio permission is not granted',
          );
          return;
        }
      }
      navigation.navigate('Call', {
        isVideoCall: isVideoCall,
        callee: '0' + String(friendUserId),
        isIncomingCall: false,
        displayName: route.params?.name
      });
    } catch (e) {
      console.warn(`MainScreen: makeCall failed: ${e}`);
    }
  }

  const lastSeenMsg = messages.find(message => message.seen === true);

  const renderMessage = ({ item }) => {

    let readAt = item?.readAt ? moment(item.readAt.toDate().toISOString()).fromNow() : '';

    const isLastSeenMsg = lastSeenMsg?.uid === item.uid;

    const isOwnerMsg = item.senderId === currentUserId;

    const renderSeenTime = () => {
      if (readAt !== '' && isLastSeenMsg && isOwnerMsg) {
        return (<Text
          style={{
            color: 'gray',
            textAlign: 'right',
            marginRight: widthToDp('4')
          }}>
          {`seen ${readAt}`}</Text>)
      }
      else {
        return <></>
      }
    }

    return (
      <>
        {renderSeenTime()}
        <Message message={item} friendProfileImage={route.params?.profile_pic} />
      </>
    )
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle={'light-content'} />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: 'black' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {renderMessageHeader()}

        <SectionList
          sections={groupMessagesByTime(messages)}
          renderItem={renderMessage}
          keyExtractor={item => item.timeStamp}
          style={{ marginBottom: heightToDp('1.5') }}
          ref={messagesListRef}
          renderSectionFooter={({ section: { title } }) => <Text style={{ color: 'gray', textAlign: 'center', marginVertical: heightToDp('1.5') }}>{title}</Text>}
          onContentSizeChange={() => { messages.length > 0 && scrollToBottom() }}
          inverted
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
        />

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
            marginBottom: Platform.OS === 'ios' ? heightToDp('1') : isKeyboardVisible ? heightToDp('7') : heightToDp('2')
          }}>
          <TextInput
            placeholder=" Type a message"
            placeholderTextColor="black"
            value={newMessage}
            autoCapitalize="none"
            onChangeText={setNewMessage}
            style={{
              backgroundColor: '#D0D3D4',
              width: widthToDp('80'),
              borderRadius: 25,
              color: 'black',
              height: heightToDp('6'),
              paddingHorizontal: widthToDp('4.5'),
            }}
          />
          {renderButton()}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView >
  );
};

export default ChatScreen;
