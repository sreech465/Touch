import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import {

  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
  BackHandler,
} from 'react-native';
import { useSelector } from 'react-redux';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import Icon from 'react-native-vector-icons/dist/Fontisto';
import Icon1 from 'react-native-vector-icons/dist/MaterialIcons';
import Icon6 from 'react-native-vector-icons/dist/Feather';
import TabsView from '../components/tabs';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import { StackActions } from '@react-navigation/native';
import { LoadingView } from '../components/LoadingView'
const MessageScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const userData = useSelector(state => state.user.userdata);

  const currentUserId = Number(userData.userid);

  const conversationsRef = firestore().collection('conversations');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const subscriber = conversationsRef
      .where('members', 'array-contains', currentUserId)
      .orderBy('recentMessage.createdAt', 'desc')
      .onSnapshot(datasnap => {
        var returnArray = [];

        datasnap.forEach(function (snap) {
          var item = snap.data();
          if (item.recentMessage.message !== "") {
            returnArray.push(item);
          }
        });

        setConversations(returnArray);
        setIsLoading(false);
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

  const formatTime = timestamp => {
    let date = timestamp.toDate();
    let time = moment(new Date(Number(date)).toISOString()).fromNow();
    if (time.includes('minute') || time.includes('hour') || time.includes('just')) {
      return moment(date).format('h:mm')
    } else if (time.includes('a day ago')) {
      return "Yesterday";
    }
    return moment(date).format('M/DD/YY');
  };


  const renderRecentMessage = (recentMsg) => {


    switch (recentMsg.contentType) {
      case "text":
        return (<Text
          numberOfLines={1}
          style={{
            color: 'gray',
            width: widthToDp('60'),
          }}>
          {recentMsg.contentInfo.text}
        </Text>)
      case 'post':
        return (<View style={{ flexDirection: 'row' }}>
          <Icon1 name="perm-media" size={heightToDp('2.5')} color="gray" />
          <Text style={{ color: 'gray', marginLeft: widthToDp('3') }}>Shared post</Text>
        </View>)
      case 'reel':
        return (<View style={{ flexDirection: 'row' }}>
          <Icon6 name="video" size={heightToDp('2.5')} color='gray' />
          <Text style={{ color: 'gray', marginLeft: widthToDp('3') }}>Shared reel</Text>
        </View>)
      case 'userProfile':
        return (<View style={{ flexDirection: 'row' }}>
          <Icon1 name="account-circle" size={heightToDp('2.5')} color='gray' />
          <Text style={{ color: 'gray', marginLeft: widthToDp('3') }}>Shared profile</Text>
        </View>)
      default:
        return (<View style={{ flexDirection: 'row' }}>
          <Icon1 name="error" size={heightToDp('2.5')} color='red' />
          <Text style={{ color: 'red', marginLeft: widthToDp('3') }}>{`${recentMsg.contentType} is not handled.`}</Text>
        </View>)
    }
  }

  const chatbox = ({ item }) => {
    const { members } = item || {};
    const friendUserId = members.find(item => item !== currentUserId);

    return (
      <Pressable
        onPress={() =>
          navigation.push('Chat', {
            receiverId: friendUserId,
            profile_pic: item[friendUserId]?.profile_pic,
            name: item[friendUserId]?.fullName,
          })
        }>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: widthToDp('2'),
            marginVertical: heightToDp('3'),
            width: '100%',
          }}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{
                width: widthToDp('11.5'),
                height: heightToDp('5.5'),
                borderColor: '#FF5F6D',
                borderWidth: widthToDp('0.4'),
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: widthToDp('3'),
                backgroundColor: 'white',
              }}
              source={{
                uri: item[friendUserId]?.profile_pic,
              }}
            />
            <View style={{ marginLeft: widthToDp('3') }}>
              <Text style={{ color: 'white' }}>
                {item[friendUserId]?.fullName}
              </Text>
              {renderRecentMessage(item.recentMessage.message)}
            </View>
          </View>

          <Text style={{ color: 'gray' }}>
            {formatTime(item?.recentMessage?.createdAt)}
          </Text>
        </View>
      </Pressable >
    );
  };

  const emptyChatHistory = () => <View style={{
    color: 'gray',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: widthToDp('100'),
    marginTop: heightToDp('10')
  }}><Text style={{
    color: 'gray',
    fontSize: heightToDp('2')
  }}>No chat history found</Text>
  </View>

  const renderTabs = () => {
    return (
      <TabsView>
        <FlatList
          data={conversations}
          renderItem={chatbox}
          keyExtractor={item => item.conversationId}
          ListEmptyComponent={isLoading ? <LoadingView modalVisible={isLoading} /> : emptyChatHistory}
        />
        <Text>Tab 2</Text>
      </TabsView>
    );
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center' }}>
      <StatusBar barStyle={'light-content'} />
      <View style={{ marginTop: heightToDp('0'), flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: heightToDp('1.4'),
            marginHorizontal: widthToDp('5'),
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Icon
            name="camera"
            size={22}
            color="white"
            onPress={() => navigation.navigate('PostTab')}
          />
          <TouchableOpacity onPress={()=>navigation.popToTop()}>

          <Image
            style={{
              width: widthToDp('40'),
              height: heightToDp('4'),
              resizeMode: 'cover',
            }}
            source={require('../Assets/assets/touchh.png')}
          />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Profile', { user_id: userData?.userid })
              }
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
              }}>
              <Image
                style={{
                  width: widthToDp('8.5'),
                  height: heightToDp('4'),
                  resizeMode: 'cover',
                  borderRadius: 6,
                }}
                source={{
                  uri: userData?.profile_pic,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {renderTabs()}
      </View>
    </SafeAreaView>
  );
};

export default MessageScreen;
