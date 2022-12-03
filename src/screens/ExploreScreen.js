import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  ImageBackground,
} from 'react-native';
import { mainView } from '../Assets/styles';
import { Bar } from '../components/StatusBar';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/dist/Ionicons';
import Icon3 from 'react-native-vector-icons/dist/AntDesign';
import Icon6 from 'react-native-vector-icons/dist/FontAwesome5';
import Icon7 from 'react-native-vector-icons/dist/Fontisto';
import { useSelector, useDispatch } from 'react-redux';
import { getUserPoints } from '../Redux/activitySlice';
import moment from 'moment';
import { LoadingView } from '../components/LoadingView';
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';

const ExploreScreen = ({ navigation }) => {
  const { full_name, userid } = useSelector(state => state.user.userdata);
  const { total_points, detailedPoints } = useSelector(state => state.activity.points);
  const [loading, setLoading] = useState(true)
  const recentPoint = detailedPoints[0];
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserPoints())
      .finally(() => setLoading(false));
  }, []);


  const getActionText = (item) => {
    if (!item) return;
    var text = '';
    const relativeTime = moment(new Date(Number(item.timestamp)).toISOString()).fromNow()
    switch (item.action) {
      case "FOLL":
        text = `followed ${item.first_name} ${relativeTime} `;
        break;
      case "PCMNT":
        text = `commented on ${item.first_name}'s post ${relativeTime} `;
        break;
      case "PLK":
        text = `liked ${item.first_name}'s post ${relativeTime} `
        break;
      default:
        console.log("No Action");
    }
    return text;
  }
  const GetVisitedEcom = async () => {
    try {
      const IsVisited = await AsyncStorage.getItem('is_ecom_visited')
      if (JSON.parse(IsVisited) === true) {
        navigation.navigate('EcommerceHome');
      } else {
        navigation.navigate('EcommerceIntro');
      }
    } catch (e) {
      console.log(e);
    }
  }

  const GetVisitedInv = async () => {
    try {
      const IsVisited = await AsyncStorage.getItem('is_inv_visited')
      if (JSON.parse(IsVisited) === true) {
        navigation.navigate('InvestmentHome');
      } else {
        navigation.navigate('InvestmentIntro');
      }
    } catch (e) {
      console.log(e);
    }
  }

  const GetVisitedNetworkScreen = async () => {
    try {
      const IsVisited = await AsyncStorage.getItem('isVisitedNetworkScreen')
      if (JSON.parse(IsVisited) === true) {
        navigation.navigate('Network');
      } else {
        navigation.navigate('NetworkIntro');
      }
    } catch (e) {
      console.log(e);
    }
  }
  const backAction = () => {
    const popAction = StackActions.pop(1);
    navigation.dispatch(popAction);
  };


  return (
    <SafeAreaView style={[mainView]}>
      <Bar barStyle="light-content" />
      {loading ? <LoadingView modalVisible={true} /> :
        <ScrollView >
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: widthToDp('4'),
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: heightToDp('1')
            }}>
            <Pressable onPress={() => navigation.pop()}>
            <Icon1 name="arrow-back" size={heightToDp('4')} color="white" onPress={()=> backAction()} />
            </Pressable>
            <Text
              style={{
                fontSize: widthToDp('4.7'),
                color: 'white',
                fontFamily: 'Poppins-Regular',
              }}>
              {'Explore'}
            </Text>
          </View>
          <View
            style={{
              marginHorizontal: widthToDp('5.5'),
            }}>
            <Text
              style={{
                fontSize: widthToDp('4.7'),
                color: 'white',
                fontFamily: 'Poppins-Bold',
              }}>
              {`Hi ${full_name} !!`}
            </Text>
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  height: heightToDp('28'),
                  marginTop: heightToDp('2'),
                }}>
                <TouchableOpacity
                  onPress={() => GetVisitedInv()}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      style={{
                        width: widthToDp('42'),
                        height: heightToDp('30'),
                        borderRadius: 25,
                      }}
                      source={require('../Assets/assets/Group66124.png')}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        { position: 'absolute', bottom: heightToDp('2') },
                      ]}>
                      Investments
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={{ justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    onPress={() => GetVisitedEcom()}>
                    <View
                      style={{
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{
                          width: widthToDp('43'),
                          height: heightToDp('15'),
                          borderRadius: 20,
                        }}
                        source={require('../Assets/assets/Group66167.png')}
                      />
                      <View
                        style={{
                          position: 'absolute',
                          right: widthToDp('4'),
                          top: heightToDp('2'),
                        }}>
                        <Text style={styles.optionText}>Market</Text>
                        <Text style={styles.optionText}>Place</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => navigation.navigate('Reels')}
                  >
                    <Image
                      style={{
                        width: widthToDp('43'),
                        height: heightToDp('11'),
                        borderRadius: 20
                      }}
                      source={require('../Assets/assets/Group66168.png')}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        {
                          position: 'absolute',
                          alignSelf: 'center',
                        },
                      ]}>
                      Reels
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  height: heightToDp('18'),
                  marginTop: heightToDp('2'),
                }}>
                <TouchableOpacity
                  onPress={GetVisitedNetworkScreen}>
                  <Image
                    style={{
                      width: widthToDp('43'),
                      height: heightToDp('18'),
                      borderRadius: 20
                    }}
                    source={require('../Assets/assets/Group66166.png')}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      bottom: heightToDp('3'),
                      left: widthToDp('5'),
                    }}>
                    <Text style={styles.optionText}>Network</Text>
                  </View>
                </TouchableOpacity>
                <View style={{ justifyContent: 'space-between' }}>
                  <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => navigation.push('Search')}>
                    <Image
                      style={styles.smallButtonView}
                      source={require('../Assets/assets/Rectangle17906.png')}
                    />
                    <View style={{ position: 'absolute', alignSelf: 'center' }}>
                      <Icon7 name="search" size={22} color="white" />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => navigation.push('Message')}>
                    <Image
                      style={styles.smallButtonView}
                      source={require('../Assets/assets/Rectangle17907.png')}
                    />
                    <View style={{ position: 'absolute', alignSelf: 'center' }}>
                      <Icon name="message-outline" size={22} color="white" />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ justifyContent: 'space-between' }}>
                  <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => navigation.push('Setting')}>
                    <Image
                      style={styles.smallButtonView}
                      source={require('../Assets/assets/Rectangle17908.png')}
                    />
                    <View style={{ position: 'absolute', alignSelf: 'center' }}>
                      <Icon name="flag-outline" size={30} color="white" />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => navigation.push('Profile', { user_id: userid })}>
                    <Image
                      style={styles.smallButtonView}
                      source={require('../Assets/assets/Rectangle17909.png')}
                    />
                    <View style={{ position: 'absolute', alignSelf: 'center' }}>
                      <Icon1 name="person-outline" size={22} color="white" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </>
            <TouchableOpacity
              onPress={() => navigation.navigate('ActivityPoints')}>
              <Image style={{
                width: widthToDp('91'),
                height: heightToDp('25'),
                marginTop: heightToDp('2'),
                borderRadius: 20,
                resizeMode: 'cover'
              }}
                source={require('../Assets/assets/Group66170.png')} />
              <View style={{ position: 'absolute', left: widthToDp('5'), bottom: heightToDp('1') }}>
                <View style={{ marginTop: heightToDp('2') }}>
                  <Text
                    style={StyleSheet.flatten([
                      styles.optionText,
                      { fontSize: widthToDp('8') },
                    ])}>
                    {total_points}
                  </Text>
                  <Text style={styles.optionText}>Number of points</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: heightToDp('7')
                  }}>
                  <Text
                    style={[styles.optionText]}>
                    Activity of points
                  </Text>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('ActivityPoints')}>
                    <Text
                      style={{
                        fontSize: widthToDp('4'),
                        color: '#EC5C6A',
                        fontFamily: 'Poppins-Regular',
                        right: -90,
                      }}>
                      View All
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
            <View
              style={{
                marginHorizontal: widthToDp('0'),
                marginVertical: heightToDp('2'),
              }}>
              {recentPoint ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: widthToDp('3'),
                      backgroundColor: 'white',
                    }}
                    source={{
                      uri: recentPoint.profile_pic,
                    }}
                  />
                  <View>
                    <Text style={{ color: 'white' }}>{recentPoint?.username}</Text>
                    <Text numberOfLines={2} style={{ fontSize: heightToDp('1.4'), color: 'gray', width: widthToDp("60") }}>{getActionText(recentPoint)}</Text>
                  </View>
                </View>
                <View>
                  <Text style={{ color: 'red', alignSelf: 'flex-end' }}>{`+${recentPoint?.points}`}</Text>
                  <Text style={{ color: 'gray', fontSize: heightToDp("1.4") }}>Points</Text>
                </View>
              </View> : <></>}
            </View>
          </View>
        </ScrollView>
      }
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
    height: heightToDp('7.5'),
    width: widthToDp('16'),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
    height: heightToDp('8'),
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'stretch',
    borderRadius: 10
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
});

export default ExploreScreen;
