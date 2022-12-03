/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Pressable,
  Modal,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/dist/Fontisto';
import Icon3 from 'react-native-vector-icons/dist/SimpleLineIcons';
import Icon4 from 'react-native-vector-icons/dist/MaterialIcons';
import Icon5 from 'react-native-vector-icons/dist/Feather';
import { LinearGradientButton } from '../components/LinearGradientButton';
import TabsView from '../components/Profiletabs';
import { useDispatch } from 'react-redux';
import { followUser, getProfileInfo } from '../Redux/reducers/userReducer';
import { getFollower, getFollowing } from '../Redux/reducers/userReducer';
import Video from 'react-native-video';
import firestore from '@react-native-firebase/firestore';
import { StackActions } from '@react-navigation/native';
import Stories from './stories';
import { selectStoryById } from './stories/storiesSlice';
import FloatingSideNav from '../components/FloatingSideNav';
import { LoadingView } from '../components/LoadingView';
import Share from '../components/Share';
import { getFeedData } from '../Redux/reducers/feedReducer';
import {
  getStoriesAction,
  selectAllStories,
  setAllStories,
} from './stories/storiesSlice';

const ProfileScreen = ({ navigation, route }) => {
  const userData = useSelector(state => state.user.userdata);

  const userStories = useSelector(state =>
    selectStoryById(state, route.params?.user_id),
  );

  const personalInfo = useSelector(state => state.userData?.profileInfo);

  const [loading, setLoading] = useState(true);
  const offsetValue = React.useRef(0);
  const dispatch = useDispatch();
  const compare = (a, b) => a - b;

  const conversationsRef = firestore().collection('conversations');
  const { userInfo = [], postInfo } = personalInfo || {};
  const profile_social_details = userInfo[0]?.profile_social_details;

  const isOwner = userData.userid === route.params?.user_id;

  const [isModalVisible, setIsModalVisible] = useState(false);

  const shareProps = {
    isVisible: isModalVisible,
    hideModal: () => {
      setIsModalVisible(false);
    },
    headerText: 'Share Profile',
    data: {
      contentType: 'userProfile',
      contentInfo: {
        userId: isOwner ? userData.userid : route.params?.user_id,
        profilePic: isOwner ? userData?.profile_pic : userInfo[0]?.profile_pic,
        username: isOwner ? userData?.username : userInfo[0]?.username,
        fullName: isOwner
          ? userData?.full_name
          : userInfo[0]?.first_name + ' ' + userInfo[0]?.last_name,
        about: isOwner ? userData?.bio : userInfo[0]?.bio,
      },
    },
  };

  useEffect(() => {
    dispatch(
      getProfileInfo({
        profile_id: route.params?.user_id
          ? route.params.user_id
          : userData.userid,
        offset: offsetValue.current,
        limit: 50,
      }),
    )
      .unwrap()
      .then(res => {
        offsetValue.current++;
        console.log(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const backAction = () => {
    const popAction = StackActions.pop(1);
    navigation.dispatch(popAction);
    return true;
  };

  const FetchFollower = () => {
    console.log('FetchFollower.....Step1');
    dispatch(
      getFollower({
        profile_id: route.params?.user_id
          ? route.params.user_id
          : userData.userid,
      }),
    )
      .unwrap()
      .then(res => {
        console.log('inres', res);
        if (res.status === 200) {
          null;
        }
      });
  };

  const FetchFollowing = () => {
    console.log('FetchFollowing.....Step1');
    dispatch(
      getFollowing({
        profile_id: route.params?.user_id
          ? route.params.user_id
          : userData.userid,
      }),
    )
      .unwrap()
      .then(res => {
        console.log('FetchFollowingres', res);
        if (res.status === 200) {
          null;
        }
      });
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const handleSendMessage = async () => {
    if (isOwner) {
      return;
    }
    const currentUserData = {
      userId: userData.userid,
      fullName: userData.full_name,
      profile_pic: userData.profile_pic,
      devicesData: []
    };

    const friendUserData = {
      userId: route.params.user_id,
      fullName: userInfo[0]?.first_name + '  ' + userInfo[0]?.last_name,
      profile_pic: userInfo[0]?.profile_pic,
      devicesData: []
    };
    const uid = [currentUserData.userId, friendUserData.userId]
      .sort(compare)
      .join('_');

    const isConversationExist = (await conversationsRef.doc(uid).get()).exists;

    if (!isConversationExist) {
      await conversationsRef.doc(uid).set({
        members: [currentUserData.userId, friendUserData.userId].sort(compare),
        conversationId: [currentUserData.userId, friendUserData.userId]
          .sort(compare)
          .join('_'),
        recentMessage: {
          message: '',
          createdAt: firestore.Timestamp.now(),
          sentBy: friendUserData.userId,
        },
        [currentUserData.userId]: { ...currentUserData },
        [friendUserData.userId]: { ...friendUserData },
        createdAt: firestore.Timestamp.now(),
      });
    }

    navigation.push('Chat', {
      receiverId: friendUserData.userId,
      profile_pic: friendUserData.profile_pic,
      name: friendUserData.fullName,
    });
  };

  const handleFollowUser = () => {
    dispatch(followUser({ following_id: route.params?.user_id }))
      .unwrap()
      .then(res => {
        if (res.status === 200) {
          const Data = JSON.stringify({
            offset: 0,
            limit: 10,
          });
          dispatch(getFeedData(Data))
            .then(() => {
              setLoading(false);
            })
            .catch(() => {
              setLoading(false);
            });
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
      });
  };

  const MediaBox = ({ item, index }) => {
    const singlePost = JSON.parse(item.post_file)[0];
    return singlePost.type.includes('image') ? (
      <TouchableOpacity
        style={{
          marginHorizontal: widthToDp('0.5'),
          marginVertical: heightToDp('0.2'),
        }}
        onPress={() =>
          navigation.push('Post', {
            type: 'feed',
            index: index,
            postId: item.postid,
          })
        }>
        <View>
          <FastImage
            style={{ width: widthToDp('32'), height: heightToDp('15') }}
            source={{
              uri: singlePost.path,
              // headers: { Authorization: 'someAuthToken' },
              priority: FastImage.priority.high,
            }}
            //source={{ uri: item.node.image.uri }}

            resizeMode={FastImage.resizeMode.cover}
          />
          {/* <Image
            style={{ width: widthToDp('32'), height: heightToDp('15') }}
            source={{ uri: singlePost.path }}
          /> */}
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={{
          marginHorizontal: widthToDp('0.5'),
          marginVertical: heightToDp('0.2'),
        }}
        onPress={() =>
          navigation.push('Post', {
            postId: item.postid,
          })
        }>
        <View>
          {/* <Video
              style={{ width: widthToDp('32'), height: heightToDp('15') }}
              source={{ uri: singlePost.path }}
              resizeMode={'stretch'}
              muted
              repeat
            /> */}
          <Image
            style={{ width: widthToDp('32'), height: heightToDp('15') }}
            source={require('../Assets/assets/playIcon.jpg')}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const ShowProfileValue = (number, title) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text
          style={{
            fontSize: heightToDp('2'),
            fontFamily: 'Poppins-Bold',
            color: 'black',
          }}>
          {number}
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins-Bold',
            color: 'black',
            fontSize: heightToDp('1.2'),
          }}>
          {title}
        </Text>
      </View>
    );
  };

  const renderTabs = () => {
    return (
      <TabsView>
        <>{PostView()}</>
        <Text>Tab 2</Text>
        <Text>Tab 2</Text>
      </TabsView>
    );
  };
  console.log('Loading by nikhil11 ----------------', offsetValue);

  const loadNextFeed = () => {
    console.log('Load api calling with offset:------', offsetValue);
    if (profile_social_details?.post_count < postInfo.length) {
      dispatch(
        getProfileInfo({
          profile_id: route.params?.user_id
            ? route.params.user_id
            : userData.userid,
          offset: offsetValue.current,
          limit: 10,
        }),
      )
        .unwrap()
        .then(res => {
          console.log(
            'Loading by nikhil ----------------',
            res.message[0].postInfo.length,
          );

          offsetValue.current++;
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      null;
    }
  };

  const PostView = () => {
    console.log('numberofPost', postInfo);
    return (
      <>
        <View
          style={{
            width: widthToDp('100'),
            marginTop: heightToDp('2'),
            //alignSelf: 'center',
            alignItems: 'flex-start',
          }}>
          <FlatList
            data={postInfo}
            renderItem={MediaBox}
            keyExtractor={(item, index) => String(index)}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            // onEndReachedThreshold={0.65}
            bounces={false}
            showsHorizontalScrollIndicator={false}
          // onEndReached={loadNextFeed}
          />
        </View>
      </>
    );
  };

  const privateAccount = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: widthToDp('8'),
          borderColor: '#FF5F6D',
          borderWidth: 1,
          padding: widthToDp('2'),
          borderRadius: 6,
          marginTop: heightToDp('2'),
        }}>
        <View style={{ marginRight: widthToDp('2') }}>
          <Icon4 name="lock" size={heightToDp('4')} color="white" />
        </View>
        <View>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            This Account is Private
          </Text>
          <Text style={{ color: 'white', width: '80%' }}>
            Follow this account to see their photos and videos.
          </Text>
        </View>
      </View>
    );
  };

  const headerView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: widthToDp('5'),
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: heightToDp('0.5'),
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '33.33%',
          }}>
          <Icon
            name="camera"
            size={22}
            color="white"
            onPress={() => navigation.navigate('PostTab')}
          />
        </View>
        <TouchableOpacity
          style={{
            marginTop: heightToDp('0'),
            width: '33.33%',
            alignItems: 'center',
          }}
          onPress={() => navigation.popToTop()}>
          <Image
            style={{
              width: widthToDp('40'),
              height: heightToDp('4'),
              resizeMode: 'cover',
            }}
            source={require('../Assets/assets/touchh.png')}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '33.33%',
            justifyContent: 'flex-end',
          }}>
          <Icon5
            name="bell"
            size={25}
            color="white"
            style={{ marginRight: widthToDp('2') }}
            onPress={() => navigation.navigate('Activity')}
          />
          <Icon3
            onPress={() =>
              !isOwner ? setIsModalVisible(true) : navigation.push('Setting')
            }
            name="options-vertical"
            size={25}
            color="white"
          />
        </View>
      </View>
    );
  };

  const UserDetailsView = () => {
    return (
      <View
        style={{
          width: '100%',
          height: heightToDp('33'),
          backgroundColor: '#181818',
          marginTop: heightToDp('1'),
        }}>
        <View
          style={{
            marginHorizontal: widthToDp('5.5'),
            marginVertical: heightToDp('2'),
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <View>
            {userStories === undefined ? (
              <View
                style={{
                  width: widthToDp('25.3'),
                  height: heightToDp('12'),
                  borderColor: '#808080',
                  borderWidth: widthToDp('0.6'),
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: widthToDp('3'),
                  backgroundColor: 'white',
                  marginLeft: widthToDp('2'),
                  marginTop: heightToDp('0.7'),
                  marginBottom: heightToDp('0.8'),
                }}>
                <Image
                  style={{
                    width: widthToDp('23.1'),
                    height: heightToDp('11'),
                    resizeMode: 'cover',
                    borderRadius: 10,
                  }}
                  source={{
                    uri: isOwner
                      ? userData?.profile_pic
                      : userInfo[0]?.profile_pic,
                  }}
                />
              </View>
            ) : (
              <View
                style={{
                  height: heightToDp('13.5'),
                  marginRight: widthToDp('3'),
                }}>
                <Stories storiesData={[userStories]} isFrom="ProfileScreen" />
              </View>
            )}
          </View>

          <View style={{ width: widthToDp('43') }}>
            <Text
              style={{
                color: 'white',
                fontSize: heightToDp('2'),
                fontFamily: 'Poppins-Bold',
              }}>
              {isOwner ? userData?.username : userInfo[0]?.username}
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: heightToDp('1.7'),
                marginBottom: heightToDp('0.2'),
              }}>
              {isOwner
                ? userData?.full_name
                : userInfo[0]?.first_name + ' ' + userInfo[0]?.last_name}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'Poppins-Regular',
                color: 'white',
                fontSize: heightToDp('1.2'),
              }}>
              {isOwner ? userData?.bio : userInfo[0]?.bio}
            </Text>
          </View>
        </View>
        {isOwner ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: heightToDp('1'),
              marginBottom: heightToDp('2'),
              marginHorizontal: widthToDp('6'),
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}>
              <View
                style={{
                  width: widthToDp('42.5'),
                  height: heightToDp('3.7'),
                }}>
                <LinearGradientButton
                  name={'Edit Profile'}
                  textSize={13}
                  borderRadius={12}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('ExploreScreen')}>
              <View
                style={{
                  width: widthToDp('42.5'),
                  height: heightToDp('3.7'),
                }}>
                <LinearGradientButton
                  name={'Explore'}
                  textSize={13}
                  borderRadius={12}
                />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: heightToDp('1'),
              marginBottom: heightToDp('2'),
              marginHorizontal: widthToDp('6'),
            }}>
            <TouchableOpacity onPress={handleFollowUser}>
              <View
                style={{
                  width: !canSendMessage(userInfo[0])
                    ? widthToDp('88')
                    : widthToDp('42.5'),
                  height: heightToDp('3.7'),
                }}>
                <LinearGradientButton
                  name={getFollowReqStatus(userInfo[0])}
                  textSize={13}
                  borderRadius={12}
                />
              </View>
            </TouchableOpacity>
            {canSendMessage(userInfo[0]) && (
              <TouchableOpacity onPress={handleSendMessage}>
                <View
                  style={{
                    width: widthToDp('42.5'),
                    height: heightToDp('3.7'),
                  }}>
                  <LinearGradientButton
                    name={'Send Message'}
                    textSize={13}
                    borderRadius={12}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
        <View
          style={{
            borderRadius: 10,
            width: '88.5%',
            height: heightToDp('8'),
            backgroundColor: '#f2f2f2',
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          {ShowProfileValue(profile_social_details?.post_count, 'Posts')}
          <TouchableOpacity
            onPress={() => {
              if (!canSendMessage(userInfo[0])) {
                null;
              } else {
                FetchFollower(),
                  FetchFollowing(),
                  navigation.navigate('FollowList', {
                    userName: isOwner
                      ? userData?.username
                      : userInfo[0]?.username,
                    index: 0,
                  });
              }
            }}
            disabled={!canSendMessage(userInfo[0])}>
            {ShowProfileValue(
              profile_social_details?.followers_count,
              'Followers',
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (!canSendMessage(userInfo[0])) {
                null;
              } else {
                FetchFollower(),
                  FetchFollowing(),
                  navigation.navigate('FollowList', {
                    userName: isOwner
                      ? userData?.username
                      : userInfo[0]?.username,
                    index: 1,
                  });
              }
            }}
            disabled={!canSendMessage(userInfo[0])}>
            {ShowProfileValue(
              profile_social_details?.following_count,
              'Following',
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const isAccountPrivate = user => user.account_type === 'private';

  const getFollowReqStatus = user => {
    var followText = 'Follow';

    switch (user.follow_status) {
      case 'Not accepted':
        followText = 'Requested';
        break;
      case 'accepted':
        followText = 'UnFollow';
        break;
      default:
        followText = 'Follow';
    }
    return followText;
  };

  const canSendMessage = user => {
    if (user?.account_type === 'public' || isOwner) {
      return true;
    } else if (user.account_type === 'private') {
      if (user.follow_status === 'accepted') {
        return true;
      }
    }
    return false;
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center' }}>
      <StatusBar barStyle="light-content" />
      {loading ? (
        <LoadingView modalVisible={true} />
      ) : (
        <>
          {headerView()}
          <ScrollView>
            {UserDetailsView()}
            {!canSendMessage(userInfo[0]) ? privateAccount() : renderTabs()}
          </ScrollView>
          <FloatingSideNav
            navigation={navigation}
            userId={userData.userid}
            hideOption="profile"
            height={350}
          />
          <Share {...shareProps} />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  con: {
    height: '50%',
    justifyContent: 'space-around',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
  },
  textinp: {
    height: 50,
    borderColor: '#ff4081',
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
  linearGradient: {
    height: 60,
    width: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleLoginText: {
    fontSize: widthToDp('9'),
    color: 'while',
    marginTop: heightToDp('0'),
    fontFamily: 'Poppins-ExtraLight',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    alignSelf: 'center',
    bottom: heightToDp('-5'),
  },
  photoSelectcenteredView: {
    bottom: heightToDp('-5'),
  },
  modalView: {
    margin: 10,
    backgroundColor: '#181818',
    borderRadius: 20,
    paddingTop: heightToDp('2'),
    width: widthToDp('102'),
    height: heightToDp('93'),
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
  photoSelectModalView: {
    height: heightToDp('35'),
    backgroundColor: '#27314F',
    alignItems: 'center',
  },
  photoSelectCancel: {
    alignSelf: 'center',
  },

  button: {
    borderRadius: 10,
    paddingVertical: heightToDp('2'),
    elevation: 2,
    marginBottom: heightToDp('2'),
    width: widthToDp('35'),
  },
  photoSelectOptionButton: {
    width: widthToDp('60'),
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
    fontSize: heightToDp('2'),
    alignSelf: 'center',
  },
});

export default ProfileScreen;
