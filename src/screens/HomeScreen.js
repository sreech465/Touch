/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Modal,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Voximplant } from 'react-native-voximplant';
import calls from './Store';

import { useDispatch, useSelector } from 'react-redux';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import { getFeedData } from '../Redux/reducers/feedReducer';
import { getReels } from '../Redux/reelSlice';
import { setAllReels } from '../Redux/reelSlice';
import Icon from 'react-native-vector-icons/dist/Fontisto';
import Icon6 from 'react-native-vector-icons/dist/Feather';
import Post from '../components/Post';
import { LoadingView } from '../components/LoadingView';
import Stories from './stories/index';
import messaging from '@react-native-firebase/messaging';
import {
  getStoriesAction,
  selectAllStories,
  setAllStories,
} from './stories/storiesSlice';

import FloatingSideNav from '../components/FloatingSideNav';
import { getFollower, getFollowing } from '../Redux/reducers/userReducer';
const HomeScreen = ({ navigation }) => {
  const voximplant = Voximplant.getInstance();

  // const loading = useSelector(state => state.feed.loading);
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.user.userdata);
  const [modalVisible, setModalVisible] = useState(false);
  const [pauseVideo, setPause] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  // const [show, setShow] = useState('');

  const dispatch = useDispatch();

  const feedData = useSelector(state => state.feed.feedData);
  const offset = useSelector(state => state.feed.feedOffset);

  const storiesData = useSelector(selectAllStories);


  const Data = JSON.stringify({
    offset: offset,
    limit: 10,
  });

  const backAction = () => {
    setModalVisible(true);
    return true;
  };

  const onRefresh = () => {
    //Clear old data of the list
    setRefreshing(true)
    console.log('Api sssssssLoading ----------------');

    const Data = JSON.stringify({
      offset: 0,
      limit: 10,
    });

    setTimeout(() => {
      getAllStories()
      dispatch(getFeedData(Data))
        .then(() => {
          console.log('sssssssLoading ----------------');
          setRefreshing(false)

          setLoading(false);
        })
        .catch(() => {
          setRefreshing(false)

          setLoading(false);
        });
    }, 1000)

  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  useEffect(() => {
    dispatch(getFollower({ profile_id: user.userid }));
    dispatch(getFollowing({ profile_id: user.userid }));
  }, [])

  useEffect(() => {

    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    }
    requestUserPermission();
  }, []);

  useEffect(() => {
    const unsubcribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      Platform.OS == 'android' && Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });
    return unsubcribe;
  }, []);


  useEffect(() => {
    setLoading(true);
    // dispatch(getFeedData(Data, () => setLoading(false)))
    loadNextFeed();
  }, []);

  useEffect(() => {
    setLoading(true);
    dispatch(getReels())
      .unwrap()
      .then(res => {
        setLoading(false);
        setRefreshing(false)
        dispatch(setAllReels(res.data))
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const getAllReels = () => {
    dispatch(getReels())
      .unwrap()
      .then(res => {
        setLoading(false);
        setRefreshing(false)
        dispatch(setAllReels(res.data))
      })
      .catch(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    voximplant.on(Voximplant.ClientEvents.IncomingCall, incomingCallEvent => {
      calls.set(incomingCallEvent.call.callId, incomingCallEvent.call);
      // startVibration()
      navigation.navigate('InCall', {
        callId: incomingCallEvent.call.callId,
        isVideoCall: incomingCallEvent.video,
      });
    });
    return function cleanup() {
      voximplant.off(Voximplant.ClientEvents.IncomingCall);
    };
  });


  const getAllStories = () => {
    dispatch(getStoriesAction())
      .unwrap()
      .then(response => {
        let reShapedResponse = response.data.map(item => {
          return {
            id: item.userid,
            username: item.username,
            title: '',
            profile: item.profile_pic,
            stories: item.story.map(storyItem => ({
              id: storyItem.story_id,
              url: storyItem.file_path,
              type: storyItem.file_type,
              created: storyItem.timestamp,
              text: storyItem.story_text,
              is_liked: storyItem.is_liked,
              isSeen: storyItem.is_viewed,
              duration: 2,
            })),
          };
        });
        dispatch(setAllStories(reShapedResponse));
      });
  }
  useEffect(() => {
    getAllStories()
  }, []);

  const loadNextFeed = () => {
    dispatch(getFeedData(Data))
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const imageSelectModel = () => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <Text style={styles.textStyle}>Hold on!</Text>
                <Text style={styles.textStyle}>
                  Are you sure you want to go back?
                </Text>
              </View>
              <View
                style={{
                  marginHorizontal: widthToDp('10'),
                  marginTop: heightToDp('3'),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => BackHandler.exitApp()}>
                  <Text style={styles.textStyle}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const renderHeaderComponent = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: widthToDp('5'),
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: heightToDp('0'),
              width: '33.33%',
            }}>
            <Icon
              name="camera"
              size={22}
              color="white"
              onPress={() => navigation.navigate('PostTab')}
            />
          </View>
          <View
            style={{
              marginTop: heightToDp('0'),
              width: '33.33%',
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: widthToDp('40'),
                height: heightToDp('4'),
                resizeMode: 'cover',
              }}
              source={require('../Assets/assets/touchh.png')}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '33.33%',
              justifyContent: 'flex-end',
            }}>
            <Icon6
              name="bell"
              size={25}
              color="white"
              onPress={() => navigation.navigate('Activity')}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.push('Profile', { user_id: user.userid })
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
                  width: widthToDp('7.5'),
                  height: heightToDp('3.8'),
                  resizeMode: 'cover',
                  borderRadius: 6,
                }}
                source={{
                  uri: user?.profile_pic,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            paddingVertical: 5,
          }}
        />
        {storiesData?.length > 0 && (
          <View
            style={{
              marginHorizontal: widthToDp('2'),
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: heightToDp('2'),
                  fontFamily: 'poppins-ExtraBold',
                  marginLeft: widthToDp('1')
                }}>
                Discover
              </Text>
            </View>
          </View>
        )}
        <View
          style={{
            marginBottom: widthToDp('2'),
          }}>
          <Stories storiesData={storiesData} showUsername isFrom="HomeScreen" />
        </View>
      </>
    );
  };


  const renderItem = useCallback(
    ({ item, index }) => (
      <Post
        item={item}
        navigation={navigation}
        isFrom="feedScreen"
        pauseVideo={pauseVideo}
        index={index}
      />
    ),
    [],
  );

  const keyExtractor = useCallback(item => item.postid.toString(), []);

  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    if (viewableItems && viewableItems.length > 0) {
      setPause(viewableItems[0].index);
    }
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center' }}>
      <StatusBar barStyle={'light-content'} />
      <LoadingView modalVisible={loading} isGif={false} />
      {/* {refreshing ? <ActivityIndicator size='large'/> : null} */}
      {feedData ? (
        <FlatList
          data={feedData}

          onEndReachedThreshold={0.75}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={_onViewableItemsChanged}
          viewabilityConfig={{
            viewAreaCoveragePercentThreshold: 90,
          }}
          ListHeaderComponent={renderHeaderComponent()}
          // bounces={false}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={loadNextFeed}

          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }

        />
      ) : (
        <></>
      )}

      {!loading && (
        <FloatingSideNav navigation={navigation} userId={user.userid} />
      )}

      {imageSelectModel()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    alignSelf: 'center',
    bottom: heightToDp('-10'),
  },
  modalView: {
    margin: 10,
    backgroundColor: '#181818',
    borderRadius: 20,
    paddingTop: heightToDp('4'),
    width: widthToDp('101'),
    height: heightToDp('35'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderColor: '#FF5F6D',
    borderWidth: 2,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    paddingVertical: heightToDp('2'),
    elevation: 2,
    marginBottom: heightToDp('2'),
    width: widthToDp('35'),
  },
  closebutton: {
    borderRadius: 10,
    paddingVertical: heightToDp('1'),
    elevation: 2,
    marginBottom: heightToDp('2'),
    width: widthToDp('30'),
  },
  buttonOpen: {
    backgroundColor: '#FF5F6D',
  },
  buttonClose: {
    backgroundColor: '#FF5F6D',
  },
  textStyle: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    fontSize: heightToDp('2.1'),
  },
});

export default HomeScreen;
