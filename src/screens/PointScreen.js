import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'

import {heightToDp, widthToDp} from '../Assets/helpers/Responsive';

import Icon from 'react-native-vector-icons/dist/Fontisto';
import Icon2 from 'react-native-vector-icons/dist/Ionicons';
import Icon3 from 'react-native-vector-icons/dist/SimpleLineIcons';
import Icon4 from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Icon5 from 'react-native-vector-icons/dist/Ionicons';
import Icon6 from 'react-native-vector-icons/dist/Feather';
import Icon7 from 'react-native-vector-icons/dist/Entypo';
import Icon8 from 'react-native-vector-icons/dist/AntDesign';
import {LinearGradientButton} from '../components/LinearGradientButton';

const PointScreen = ({navigation}) => {
  const animation = new Animated.Value(0);
  const animation1 = new Animated.Value(0);

  const [show, setShow] = useState(true);

  // useEffect(()=>{
  //   startAnimating1()
  // })
  const Post = ({seturl, setname, setuserpic}) => {
    return (
      <View>
        <View
          style={{
            backgroundColor: '#181818',
            width: '100%',
            height: heightToDp('50'),
            marginBottom: heightToDp('1'),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: heightToDp('0.8'),
              paddingHorizontal: widthToDp('2'),
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: widthToDp('12.5'),
                  height: heightToDp('6'),
                  borderColor: '#FF5F6D',
                  borderWidth: widthToDp('0.4'),
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: widthToDp('3'),
                  backgroundColor: 'white',
                }}>
                <Image
                  style={{
                    width: widthToDp('10.8'),
                    height: heightToDp('5.3'),
                    resizeMode: 'cover',
                    borderRadius: 6,
                  }}
                  source={{
                    uri: setuserpic,
                  }}
                />
              </View>
              <View style={{justifyContent: 'flex-start', alignSelf: 'center'}}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: heightToDp('1.7'),
                    fontWeight: 'bold',
                  }}>
                  {setname}
                </Text>
                <Text style={{color: 'white', fontSize: heightToDp('1.5')}}>
                  Pune,india
                </Text>
              </View>
            </View>
            <Icon3 name="options-vertical" size={25} color="white" />
          </View>
          <View style={{marginVertical: heightToDp('0')}}>
            <View>
              {/* <Icon4 name="heart" size={25} color="red" />
            <Icon4 name="heart" size={25} color="red" /> */}
            </View>
            <Image
              style={{
                width: '100%',
                height: heightToDp('32'),
                resizeMode: 'cover',
              }}
              source={{
                uri: seturl,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginRight: widthToDp('2'),
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: widthToDp('26'),
                marginHorizontal: widthToDp('3'),
                marginVertical: heightToDp('1'),
              }}>
              <Icon8 name="heart" size={25} color="red" />
              <Icon2
                name="chatbubble-ellipses-outline"
                size={25}
                color="white"
                style={{transform: [{rotateY: '180deg'}]}}
              />
              <Icon6 name="send" size={25} color="white" />
            </View>
            <Icon4 name="record-circle-outline" size={25} color="white" />
          </View>

          <View style={{marginHorizontal: widthToDp('4')}}>
            <Text style={{color: 'white', fontSize: heightToDp('1.6')}}>
              10,230 likes
            </Text>
            <Text style={{color: 'white', fontSize: heightToDp('1.4')}}>
              Today's menu from lots of love
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const ImageData = [
    {
      key: '1',
      Image:
        'https://www.expatica.com/app/uploads/sites/6/2014/05/sauerbraten-1536x1024.jpg',
    },
    {
      key: '2',
      Image:
        'https://www.expatica.com/app/uploads/sites/6/2014/05/kartoffelpuffer-1536x1024.jpg',
    },
    {
      key: '3',
      Image:
        'https://www.expatica.com/app/uploads/sites/6/2014/05/sauerbraten-1536x1024.jpg',
    },

    {
      key: '4',
      Image:
        'https://www.expatica.com/app/uploads/sites/6/2014/05/kartoffelpuffer-1536x1024.jpg',
    },
    {
      key: '5',
      Image:
        'https://www.expatica.com/app/uploads/sites/6/2014/05/sauerbraten-1536x1024.jpg',
    },
    {
      key: '6',
      Image: 'https://www.expatica.com/app/uploads/sites/6/2014/05/brezel.jpg',
    },
    {
        key: '1',
        Image:
          'https://www.expatica.com/app/uploads/sites/6/2014/05/sauerbraten-1536x1024.jpg',
      },
      {
        key: '2',
        Image:
          'https://www.expatica.com/app/uploads/sites/6/2014/05/kartoffelpuffer-1536x1024.jpg',
      },
      {
        key: '3',
        Image:
          'https://www.expatica.com/app/uploads/sites/6/2014/05/sauerbraten-1536x1024.jpg',
      },
  
      {
        key: '4',
        Image:
          'https://www.expatica.com/app/uploads/sites/6/2014/05/kartoffelpuffer-1536x1024.jpg',
      },
      {
        key: '5',
        Image:
          'https://www.expatica.com/app/uploads/sites/6/2014/05/sauerbraten-1536x1024.jpg',
      },
      {
        key: '6',
        Image: 'https://www.expatica.com/app/uploads/sites/6/2014/05/brezel.jpg',
      },
  ];

  const Story = ({item}) => {
    return (
      <Image
        style={{
          width: widthToDp('28.7'),
          height: heightToDp('17'),
          marginHorizontal: widthToDp('1'),
          marginBottom:heightToDp('1.5'),
          resizeMode: 'cover',
          borderRadius: 8,
        }}
        source={{
          uri: item.Image,
        }}
      />
    );
  };

  const animatedStyles = {
    // transform: [
    //   {
    //     scaleY:animation
    //   }
    // ]
    // width:animation,
    height: animation,
    opacity: animation1,
  };

  const startAnimating = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 700,
    }).start();

    Animated.timing(animation1, {
      toValue: 0,
      duration: 500,
    }).start();
  };

  const ShowProfileValue = (number, title) => {
    return (
      <View style={{alignItems: 'center'}}>
        <Text
          style={{
            fontSize: heightToDp('2'),
            fontWeight: '700',
          }}>
          {number}
        </Text>
        <Text style={{fontSize: heightToDp('1.2')}}>{title}</Text>
      </View>
    );
  };

  const startAnimating1 = () => {
    Animated.timing(animation, {
      toValue: 600,
      duration: 600,
    }).start();
    Animated.timing(animation1, {
      toValue: 0.7,
      duration: 800,
    }).start();
  };
  console.log('hdhdhhjd', animation);
  ////onPress={()=> startAnimating1()}
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: 'black', justifyContent: 'center'}}>
      <StatusBar barStyle={'dark-content'} />
      <ScrollView>
        <View style={{marginTop: heightToDp('4')}}>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: heightToDp('1.4'),
              marginHorizontal: widthToDp('5'),
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Icon name="camera" size={25} color="white" />
            <Text style={{color: 'white', fontSize: 25}}>touchh</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon2
                name="chatbox-ellipses-sharp"
                size={35}
                color="white"
                onPress={() => navigation.navigate('PostTab')}
              />
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
                }}>
                <Image
                  style={{
                    width: widthToDp('8.5'),
                    height: heightToDp('4'),
                    resizeMode: 'cover',
                    borderRadius: 6,
                  }}
                  source={{
                    uri: 'https://cdn.siasat.com/wp-content/uploads/2021/11/photo_2021-11-06_14-35-10.webp',
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View
              style={{
                width: '100%',
                height: heightToDp('35'),
                backgroundColor: '#181818',
                marginHorizontal:widthToDp('3'),
                marginVertical:heightToDp('0.4'),
                borderRadius:15
              }}>
              <View
                style={{
                  marginHorizontal: widthToDp('5.5'),
                  marginVertical: heightToDp('2'),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <View
                    style={{
                      width: widthToDp('25'),
                      height: heightToDp('12'),
                      borderColor: '#FF5F6D',
                      borderWidth: widthToDp('0.6'),
                      borderRadius: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: widthToDp('3'),
                      backgroundColor: 'white',
                    }}>
                    <Image
                      style={{
                        width: widthToDp('23'),
                        height: heightToDp('11'),
                        resizeMode: 'cover',
                        borderRadius: 10,
                      }}
                      source={{
                        uri: 'https://cdn.siasat.com/wp-content/uploads/2021/11/photo_2021-11-06_14-35-10.webp',
                      }}
                    />
                  </View>
                  <View style={{position: 'absolute', bottom: -9, right: 2}}>
                    <Image
                      style={{
                        width: widthToDp('7'),
                        height: heightToDp('3.5'),
                        resizeMode: 'contain',
                        borderRadius: 10,
                        marginTop: heightToDp('0.3'),
                      }}
                      source={require('../Assets/assets/GroupCamera.png')}
                    />
                  </View>
                </View>

                <View style={{width: widthToDp('43')}}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: heightToDp('2'),
                      fontWeight: 'bold',
                    }}>
                    Rakesh Sharma
                  </Text>
                  <Text style={{color: 'white', fontSize: heightToDp('1.6')}}>
                    Point:152
                  </Text>

                  <Text
                    numberOfLines={2}
                    style={{color: 'white', fontSize: heightToDp('1.6')}}>
                    Premium
                  </Text>
                </View>
                <View>
                  <Icon3 name="options-vertical" size={25} color="white" />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: heightToDp('1'),
                  marginBottom: heightToDp('2'),
                  marginHorizontal:widthToDp('6')
                }}>
                    <TouchableOpacity onPress={()=> navigation.navigate('EditProfile')}>
                        <View
                  style={{width: widthToDp('42.5'), height: heightToDp('3.7')}}>
                  <LinearGradientButton
                    name={'Edit Profile'}
                    textSize={13}
                    fontFamily={'normal'}
                    borderRadius={12}
                  />
                </View>
                    </TouchableOpacity>
                
                    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                        <View
                  style={{width: widthToDp('42.5'), height: heightToDp('3.7')}}>
                  <LinearGradientButton
                    name={'Explore'}
                    textSize={13}
                    fontFamily={'normal'}
                    borderRadius={12}
                  />
                </View>
                    </TouchableOpacity>
              </View>
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
                {ShowProfileValue(10, 'Posts')}
                {ShowProfileValue(14, 'Friends')}
                <TouchableOpacity>
                    {ShowProfileValue(157, 'Points')}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              marginHorizontal: widthToDp('2'),
              marginBottom: heightToDp('2'),
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
                }}>
                Post
              </Text>
            </View>
            <View style={{marginHorizontal:widthToDp('2')}}>
              <FlatList
                data={ImageData}
                renderItem={Story}
                keyExtractor={item => item}
                numColumns={3}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <Animated.View
        style={[
          {
            width: '12%',
            alignItems: 'center',
            position: 'absolute',
            justifyContent: 'space-around',
            backgroundColor: 'white',
            borderRadius: 22,
          },
          animatedStyles,
        ]}>
        <Icon4 name="puzzle" size={38} color="#404040" />
        <Icon4 name="camera-iris" size={38} color="#404040" />
        <Icon5 name="md-settings-sharp" size={38} color="#404040" />
        <Icon6 name="search" size={38} color="#404040" />
        <Icon4 name="home-variant" size={38} color="#404040" />

        <TouchableOpacity
          style={{position: 'absolute', bottom: 10, right: -10}}
          onPress={() => {
            startAnimating(), setShow(false);
          }}>
          <Icon7 name="circle-with-cross" size={20} color="red" />
        </TouchableOpacity>
      </Animated.View>
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
});

export default PointScreen;