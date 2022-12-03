import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Pressable,
  BackHandler,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mainView } from '../../Assets/styles';
import { Bar } from '../../components/StatusBar';
import { heightToDp, widthToDp } from '../../Assets/helpers/Responsive';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/dist/Ionicons';
import Slider from 'react-native-slider';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import { fontWhite, backgroundColor } from '../../Assets/color';
import {
  clearRequestMessage,
  getNetworkUsersAction,
  sendRequestToNetworkUserAction,
  undoNetworkUserAction,
} from '../../Redux/networkSlice';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingView } from '../../components/LoadingView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradientButton } from '../../components/LinearGradientButton';
import { StackActions } from '@react-navigation/native';

const Network = ({ navigation }) => {
  const [userLocation, setUserLocation] = useState('');
  const [range, setRange] = useState({ start: 0, end: 20 });
  const [isLoading, setIsLoading] = useState(true);

  const [isSendRequest, setIsSendRequest] = useState(false);

  const [selectedUser, setSelectedUser] = useState({});

  const dispatch = useDispatch();

  const { networkUsers, requestMsg } = useSelector(state => state.network);

  const owner = useSelector(state => state.user.userdata);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Touch App',
          message: ' App access to your location ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        if (granted) {
          Geolocation.getCurrentPosition(
            position => {
              console.log(position);
              setUserLocation(position);
            },
            error => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
          );
        }
        console.log('You can use the location');
        // alert("You can use the location");
      } else {
        console.log('location permission denied');
        // alert("Location permission denied");
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.warn(err);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      console.log('fhftdrd');
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          setUserLocation(position);
        },
        error => {
          // See error code charts below.
          console.log('Error', error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } else if (Platform.OS == 'android') {
      requestLocationPermission();
    } else {
    }

    //requestLocationPermission();
  }, []);

  const SetVisited = async () => {
    try {
      await AsyncStorage.setItem('isVisitedNetworkScreen', JSON.stringify(true));
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    SetVisited();
  }, []);


  const backAction = () => {
    if (isSendRequest) {
      const popAction = StackActions.pop(0);
      navigation.dispatch(popAction);
      handleCloseButton();
      return true;
    } else {
      const popAction = StackActions.pop(1);
      navigation.dispatch(popAction);
      return true;
    }
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, [isSendRequest]);

  useEffect(() => {
    userLocation?.coords?.latitude && getnetworkUsers();
  }, [userLocation?.coords?.latitude]);

  const getnetworkUsers = () => {
    setIsLoading(true);
    const { latitude, longitude } = userLocation.coords;
    const networkData = {
      mode: 'Business Network',
      startdist: range.start,
      enddist: range.end * 100,
      latitude: latitude,
      longitude: longitude,
    };
    dispatch(getNetworkUsersAction(networkData)).finally(() => {
      setIsLoading(false);
    });
  };

  const handleSliderChange = value => {
    setRange(prev => ({ ...prev, end: value }));
  };

  const handleConnectToUser = user => {
    dispatch(clearRequestMessage());
    setIsSendRequest(true);
    setIsLoading(true);
    setSelectedUser(user);
    dispatch(
      sendRequestToNetworkUserAction({
        networkUserId: user.userid,
        message: 'test',
      }),
    ).finally(() => {
      setIsLoading(false);
    });
  };

  const handleUndoRequest = () => {
    setIsLoading(true);

    if (requestMsg == 'Request undo successfully.') {
      dispatch(
        sendRequestToNetworkUserAction({
          networkUserId: selectedUser.userid,
          message: 'test',
        }),
      ).finally(() => {
        setIsLoading(false);
      });
    } else {
      dispatch(
        undoNetworkUserAction({ networkUserId: selectedUser.userid }),
      ).finally(() => {
        setIsLoading(false);
      });
    }
  };

  const handleCloseButton = () => {
    dispatch(clearRequestMessage());
    setIsSendRequest(false);
  };

  const Profiles = ({ item }) => {
    console.log('ygfygfg', item);
    return (
      <View style={{ alignItems: 'center', marginRight: widthToDp('4') }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#FF5F6D',
            width: widthToDp('21'),
            borderRadius: 8,
          }}>
          <Image
            style={{
              width: widthToDp('21'),
              height: heightToDp('13'),
              resizeMode: 'cover',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
            source={{
              uri: item.profile_pic,
            }}
          />
          <Pressable onPress={() => handleConnectToUser(item)}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Poppins-Regular',
                fontSize: heightToDp('1.3'),
                marginVertical: heightToDp('0.5'),
              }}>
              Connect
            </Text>
          </Pressable>
        </View>
        <Text
          style={{
            color: fontWhite.color,
            fontFamily: 'Poppins-Regular',
            fontSize: heightToDp('1.3'),
          }}>
          {item.username}
        </Text>
      </View>
    );
  };

  const renderSendUserRequest = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          height: '100%',
          width: '100%',
          backgroundColor: 'transparent',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000090',
            borderRadius: 40,
            padding: widthToDp('5'),
          }}>
          <Pressable
            onPress={handleCloseButton}
            style={{ alignSelf: 'flex-end', marginBottom: heightToDp('2') }}>
            <Icon1 name="close" color="white" size={heightToDp('3')} />
          </Pressable>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: heightToDp('2'),
            }}>
            <View style={{ alignItems: 'center' }}>
              <Image
                style={{
                  width: widthToDp('18'),
                  height: heightToDp('9'),
                  resizeMode: 'center',
                  marginTop: heightToDp('2'),
                  borderColor: '#FF5F6D',
                  borderWidth: 1,
                  borderRadius: 12,
                  marginBottom: heightToDp('0.5'),
                }}
                source={{
                  uri: owner.profile_pic,
                }}
              />
              <Text style={{ color: 'white' }}>Me</Text>
            </View>
            <View
              style={{
                borderWidth: 0.8,
                borderStyle: 'dashed',
                borderRadius: 1,
                borderColor: '#FF5F6D',
                width: 60,
                marginBottom: heightToDp('0.5'),
              }}></View>
            <View style={{ alignItems: 'center' }}>
              <Image
                style={{
                  width: widthToDp('26'),
                  height: heightToDp('13'),
                  resizeMode: 'center',
                  borderColor: '#FF5F6D',
                  borderWidth: 1,
                  borderRadius: 12,
                  marginBottom: heightToDp('0.5'),
                }}
                source={{
                  uri: selectedUser.profile_pic,
                }}
              />
              <Text style={{ color: 'white' }}>{selectedUser.username}</Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: widthToDp('4.5'),
              color: 'white',
              marginBottom: heightToDp('2'),
              fontWeight: 'bold',
            }}>
            {requestMsg}
          </Text>

          <TouchableOpacity
            style={{
              width: widthToDp('75'),
              height: heightToDp('5.5'),
              alignSelf: 'center',
              borderRadius: 12,
              marginBottom: heightToDp('2'),
            }}
            onPress={handleUndoRequest}>
            <LinearGradientButton
              start={{ x: 0.9, y: 1.8 }}
              end={{ x: 0.0, y: 1.8 }}
              locations={[0, 0.4, 0.6]}
              colors={['#FFAB5A', '#FF5F6D', '#FF5F6D']}
              linearGradient={styles.linearGradient}
              buttonTextStyle={styles.buttonText}
              borderRadius={6}
              name={
                requestMsg === 'Request undo successfully.'
                  ? 'Connect'
                  : 'Undo Request'
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const emptyListMsg = () => {
    return (
      <Text
        style={{
          color: 'gray',
          textAlign: 'center',
          width: widthToDp('40'),
        }}>
        {requestMsg}
      </Text>
    );
  };

  return (
    <SafeAreaView style={[mainView]}>
      <Bar barStyle="light-content" />
      <LoadingView modalVisible={isLoading} />
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: widthToDp('4'),
          marginTop: heightToDp('1.1'),
          marginBottom: heightToDp('1'),
          alignItems: 'center',
        }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon
            name="chevron-double-left"
            size={heightToDp('4')}
            color={fontWhite.color}
          />
        </Pressable>
        <Text
          style={{
            fontSize: widthToDp('5'),
            color: fontWhite.color,
            fontFamily: 'Poppins-Regular',
            marginLeft: widthToDp('2'),
          }}>
          Network
        </Text>
      </View>
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        {userLocation?.coords ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: userLocation?.coords?.latitude,
              longitude: userLocation?.coords?.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            <Marker
              coordinate={{
                latitude: userLocation?.coords?.latitude,
                longitude: userLocation?.coords?.longitude,
              }}>
              <Image
                source={require('../../Assets/assets/live.png')}
                style={{ width: 26, height: 28 }}
                resizeMode="contain"
              />
            </Marker>
            {networkUsers.length > 0 &&
              networkUsers.map((item, index) => {
                return <Marker
                  coordinate={{ latitude: Number(item.latitude), longitude: Number(item.longitude) }} onPress={() => navigation.push('Profile', { user_id: item.userid })}>
                  <View style={{ alignItems: "center", }} >
                    <Image
                      source={{ uri: item.profile_pic }}
                      style={{ width: 38, height: 38, borderRadius: 8, }}
                      resizeMode="stretch"

                    />
                    <Text style={{ fontSize: heightToDp('1.4'), fontFamily: 'Poppins-Bold', color: 'purple', width: '60%', textAlign: "center" }}>{item.username}</Text>
                  </View>
                </Marker>
              })}
          </MapView>
        ) : null}
        {isSendRequest ? (
          renderSendUserRequest()
        ) : (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: heightToDp('40'),
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              backgroundColor: backgroundColor.backgroundColor,
              bottom: heightToDp('0'),
              paddingTop: heightToDp('4'),
            }}>
            <View style={{ marginHorizontal: widthToDp('6') }}>
              <Text
                style={{
                  color: fontWhite.color,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                Distance
              </Text>
              <Slider
                trackStyle={styles.track}
                thumbStyle={styles.thumb}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="#FF5F6D"
                value={range.end}
                onValueChange={handleSliderChange}
                disabled={isLoading}
                onSlidingComplete={getnetworkUsers}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: heightToDp('-1'),
                  marginHorizontal: widthToDp('1.4'),
                }}>
                <Text
                  style={{
                    color: fontWhite.color,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {range.end.toFixed() + ' ' + 'km'}
                </Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginHorizontal: widthToDp('6'),
                  marginTop: heightToDp('1.5'),
                }}>
                <Text
                  style={{
                    color: fontWhite.color,
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  Connect with near-by friends
                </Text>
              </View>
              <FlatList
                horizontal={true}
                data={networkUsers}
                renderItem={Profiles}
                keyExtractor={item => item.userid}
                style={{
                  marginHorizontal: widthToDp('2'),
                  marginTop: heightToDp('1'),
                }}
                ListEmptyComponent={emptyListMsg}
              />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
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
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  linearGradient: {
    height: heightToDp('7.5'),
    width: widthToDp('60'),
    alignSelf: 'center',
  },
  optionText: {
    fontSize: widthToDp('4.5'),
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
  wideoptionText: {
    fontSize: widthToDp('4'),
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginLeft: widthToDp('4'),
  },
  smallButtonView: {
    width: widthToDp('20'),
    height: heightToDp('9'),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wideButton: {
    alignItems: 'center',
    borderRadius: 8,
    height: heightToDp('9'),
    width: widthToDp('90'),
    backgroundColor: '#404040',
    marginBottom: heightToDp('3'),
    flexDirection: 'row',
    paddingHorizontal: widthToDp('5'),
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'gray',
    shadowColor: '#FF5F6D',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    shadowOpacity: 0.15,
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: '#FF5F6D',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 50,
    shadowColor: '#FF5F6D',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.35,
  },
});

export default Network;
