import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  ScrollView,
  BackHandler,
  Pressable,
  SectionList
} from 'react-native';

import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/dist/Fontisto';
import Icon3 from 'react-native-vector-icons/dist/SimpleLineIcons';
import Icon2 from 'react-native-vector-icons/dist/Ionicons';
import Icon9 from 'react-native-vector-icons/dist/AntDesign';
import { LinearGradientButton } from '../components/LinearGradientButton';
import { SmallLinearGradientButton } from '../components/LinearGradientButton';
import { Search } from '../Redux/reducers/searchReducer';
import { StackActions } from '@react-navigation/native';
import { cancelFollowReqAction, confirmFollowReqAction, getUserActivity, removeFollowRequest } from '../Redux/activitySlice';
import moment from 'moment';
import { LoadingView } from '../components/LoadingView';

const Activity = ({ navigation }) => {

  const dispatch = useDispatch();
  const owner = useSelector(state => state.user.userdata);

  const [loading, setLoading] = useState(false);

  const { activeUsers, followRequests, notifications } = useSelector(state => state.activity);


  useEffect(() => {
    setLoading(true);
    dispatch(getUserActivity())
      .unwrap()
      .then(res => console.log('activitysuccess', res))
      .catch(err => console.log('activityerr', err))
      .finally(() => { setLoading(false) })
  }, [])

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

  const OnlineUsers = [
    {
      key: '1',
      img: 'https://image.shutterstock.com/image-photo/cheerful-positive-guy-beard-rejoicing-260nw-1478799818.jpg',
    },
    {
      key: '2',
      img: 'https://image.shutterstock.com/image-photo/cheerful-positive-guy-beard-rejoicing-260nw-1478799818.jpg',
    },
    {
      key: '3',
      img: 'https://image.shutterstock.com/image-photo/cheerful-positive-guy-beard-rejoicing-260nw-1478799818.jpg',
    },

    {
      key: '4',
      img: 'https://image.shutterstock.com/image-photo/cheerful-positive-guy-beard-rejoicing-260nw-1478799818.jpg',
    },
    {
      key: '5',
      img: 'https://image.shutterstock.com/image-photo/cheerful-positive-guy-beard-rejoicing-260nw-1478799818.jpg',
    },
  ];

  const ActiveUser = ({ item }) => {
    return (
      <View style={{ marginRight: widthToDp('3') }}>
        <View>
          <View
            style={{
              alignSelf: 'flex-end',
              marginRight: widthToDp('-1.3'),
              marginBottom: heightToDp('-1.3'),
              zIndex: 1,
              backgroundColor: 'white',
              borderRadius: 50,
            }}>
            <Icon9
              name="checkcircle"
              size={15}
              color="#32CD32"
            //   onPress={() => navigation.navigate('Message')}
            />
          </View>
          <TouchableOpacity
            style={{
              width: 65,
              height: 65,
              borderColor: '#FF5F6D',
              borderWidth: widthToDp('0.4'),
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
            }}
            onPress={() => navigation.push('Profile', { user_id: owner.userid })}>
            <Image
              style={{
                width: 59,
                height: 59,
                resizeMode: 'cover',
                borderRadius: 8,
              }}
              source={{
                uri: item.img,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };


  const handleConfirmRequest = (item) => {
    setLoading(true);
    dispatch(confirmFollowReqAction({ follow_req_id: item.follow_id, follower_id: item.userid }))
      .unwrap()
      .then(_ => {
        dispatch(removeFollowRequest({ follow_id: item.follow_id }))
      }).catch((err) => {
        console.log('confirm request err', err)
      })
      .finally(() => { setLoading(false); })
  }

  const handleCancelRequest = (item) => {
    setLoading(true);
    dispatch(cancelFollowReqAction({ follow_req_id: item.follow_id, follower_id: item.userid }))
      .unwrap()
      .then(_ => {
        dispatch(removeFollowRequest({ follow_id: item.follow_id }))
      }).catch((err) => {
        console.log('cancel request err', err)
      })
      .finally(() => { setLoading(false); })
  }

  const renderFollowRequests = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: '#3B3B3B',
          height: heightToDp('9'),
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: heightToDp('0.03'),
          justifyContent: 'space-between',
          paddingHorizontal: widthToDp('5'),
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => navigation.push('Profile', { user_id: item.userid })}

        >
          <View
            style={{
              width: 45,
              height: 45,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              style={{
                width: 40,
                height: 40,
                resizeMode: 'cover',
                borderRadius: 6,
              }}
              source={{
                uri: item.profile_pic,
              }}
            />
          </View>
          <View style={{ marginLeft: widthToDp('3') }}>
            <Text style={{ fontFamily: 'Poppins-Regular', color: 'white' }}>
              {item.username}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                color: 'gray',
                fontSize: heightToDp('1.3'),
              }}>
              {item.first_name + " " + (item.last_name ? item.last_name : "")}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => handleConfirmRequest(item)}>
            <View
              style={{ width: widthToDp('13'), height: heightToDp('2.4') }}>
              <SmallLinearGradientButton
                name={'Confirm'}
                textSize={heightToDp('1.2')}
                fontFamily={'Poppins-SemiBold'}
                borderRadius={5}
              />
            </View>
          </TouchableOpacity>
          <Pressable style={{ marginLeft: widthToDp('3') }} onPress={() => handleCancelRequest(item)}>
            <Icon2
              name="ios-close-sharp"
              size={18}
              color="gray"
            />
          </Pressable>
        </View>
      </View>
    );
  };


  const navigateNotification = (item) => {
    if (item.action === "FOLL") {
      navigation.push('Profile', { user_id: item.userid })
    } else {
      navigation.push('Post', {
        postId: item.post_id,
      })
    }
  }
  const getActionText = (item) => {
    var text = '';

    switch (item.action) {
      case "FOLL":
        text = "started following you.";
        break;
      case "PCMNT":
        text = "commented on your post.";
        break;
      case "PLK":
        text = "liked your post."
        break;
      default:
        console.log("No Action");
    }
    return text;
  }


  const groupNotificationsByTime = useCallback((notifications) => {
    if (notifications.length === 0) {
      return [];
    }
    const getDayDifference = timestamp => {
      let time = moment(new Date(Number(timestamp)).toISOString()).fromNow();
      console.log('time', time)
      if (time.includes('minute') || time.includes('hour') || time.includes('just')) {
        return "New";
      } else if (time.includes('a day ago')) {
        return "Yesterday";
      }
      return moment(new Date(Number(timestamp))).format('M/DD/YY');
    };

    const groups = notifications.reduce((groupNotifications, notification) => {
      const date = getDayDifference(notification.timestamp);
      if (!groupNotifications[date]) {
        groupNotifications[date] = [];
      }
      groupNotifications[date].push(notification);
      return groupNotifications;
    }, {});

    const groupArrays = Object.keys(groups).map((date) => {
      return {
        title: date,
        data: groups[date]
      };
    });
    return groupArrays;
  }, [notifications.length])

  const NewAcivity = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigateNotification(item)}
        activeOpacity={0.5}
      >
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: widthToDp('5'),
            marginBottom: heightToDp('2')
          }}>
          <View
            style={{
              width: 45,
              height: 45,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              style={{
                width: 40,
                height: 40,
                resizeMode: 'cover',
                borderRadius: 6,
              }}
              source={{
                uri: item.profile_pic,
              }}
            />
          </View>

          <View style={{
            justifyContent: 'space-between',
            marginLeft: widthToDp('3'),
            paddingVertical: heightToDp('0.5')
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Poppins-Bold', color: '#FF5F6D', fontSize: heightToDp('1.5') }}>{item.username}</Text>
              <Text style={{ fontFamily: 'Poppins-Regular', color: 'white', fontSize: heightToDp('1.3') }}>
                {"  " + getActionText(item)}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                color: 'gray',
                fontSize: heightToDp('1.1'),
              }}>
              {moment(new Date(Number(item.timestamp)).toISOString()).fromNow()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle={'light-content'} />
      <LoadingView modalVisible={loading} />
      <ScrollView>
        <View style={{ marginTop: heightToDp('0') }}>
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
                width: '30%',
              }}>
              <Icon
                name="camera"
                size={22}
                color="white"
                onPress={() => navigation.navigate('PostTab')}
              />
             
            </View>
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '30%',
                justifyContent: 'flex-end',
              }}>
              <Icon2
                name="chatbox-ellipses-sharp"
                size={28}
                color="white"
                onPress={() => navigation.navigate('Message')}
              />
              <TouchableOpacity
                onPress={() => navigation.push('Profile', { user_id: owner.userid })}
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
                    uri: owner.profile_pic,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Poppins-SemiBold',
                fontSize: heightToDp('1.7'),
                marginHorizontal: widthToDp('5'),
                marginTop: heightToDp('2.5'),
              }}>
              Follow requests
            </Text>
          </View>
          <View
            style={{
              marginTop: heightToDp('2'),
            }}>
            <FlatList
              data={followRequests}
              renderItem={renderFollowRequests}
              keyExtractor={item => item.userid}
              ListEmptyComponent={() => <Text style={{ color: 'gray', textAlign: 'center' }}>No follow requests</Text>}
            />
          </View>
          <View
            style={{
              marginTop: heightToDp('1'),
            }}>
            <SectionList
              sections={groupNotificationsByTime(notifications)}
              renderItem={NewAcivity}
              keyExtractor={item => item.timestamp}
              renderSectionHeader={({ section: { title } }) => <Text style={{
                color: 'white',
                fontFamily: 'Poppins-SemiBold',
                fontSize: heightToDp('1.7'),
                marginHorizontal: widthToDp('5'),
                marginTop: heightToDp('2.5'),
              }}>{title}</Text>}
              ListEmptyComponent={() => <Text style={{ color: 'gray', textAlign: 'center' }}>No notifications</Text>}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Activity;
