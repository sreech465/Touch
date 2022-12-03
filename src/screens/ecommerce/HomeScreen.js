import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  BackHandler,
  Pressable,
  Linking,
} from 'react-native';
import { mainView } from '../../Assets/styles';
import { Bar } from '../../components/StatusBar';
import { heightToDp, widthToDp } from '../../Assets/helpers/Responsive';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Icon9 from 'react-native-vector-icons/dist/FontAwesome';
import Icon10 from 'react-native-vector-icons/dist/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, StackActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProductCategories,
  getProductsBySubCategory,
  getProductSubCategories,
  getsearchProducts,
} from '../../Redux/ecommerceSlice';
import { clear } from '../../Redux/ecommerceSlice';

const Ecommerce2 = ({ navigation }) => {
  const [product, setP] = useState('');
  const dispatch = useDispatch();
  const { profile_pic, full_name, userid } = useSelector(
    state => state.user.userdata,
  );
  const { topSliders, ecommerce_category, bottomSliders } = useSelector(
    state => state.ecommerce.categories,
  );
  const searchResult = useSelector(state => state.ecommerce.searchedProducts);
  const backAction = () => {
    if (product) {
      const popAction = StackActions.pop(0);
      navigation.dispatch(popAction);
      dispatch(clear());
      setP('');
      return true;
    } else {
      const popAction = StackActions.pop(1);
      navigation.dispatch(popAction);
      return true;
    }
  };
  console.log('searchResult', searchResult);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  useEffect(() => {
    dispatch(getProductCategories());
    dispatch(clear());
    // dispatch(getProductSubCategories(0));
    // dispatch(getProductsBySubCategory(0));
  }, []);

  const getSearchResult = () => {
    const keyword = { searchKeyword: product, offset: 0, limit: 10 };
    dispatch(getsearchProducts(keyword));
  };

  const renderTopSliders = ({ item }) => {
    console.log('eccom', item);
    return (
      <Pressable
        style={{
          width: widthToDp('55'),
          height: heightToDp('18'),
          backgroundColor: 'white',
          marginLeft: widthToDp('4'),
          borderRadius: 15,
        }}
        onPress={() => navigation.navigate('WebView', { url: item.link })}>
        <Image
          style={{
            width: widthToDp('55'),
            height: heightToDp('18'),
            resizeMode: 'contain',
            borderRadius: 6,
          }}
          source={{
            uri: item.image,
          }}
        />
        {/* <Text>{item.type}</Text> */}
      </Pressable>
    );
  };

  const renderBottomSliders = ({ item }) => {
    return (
      <Pressable
        style={{
          width: widthToDp('28'),
          height: heightToDp('21'),
          backgroundColor: '#525252',
          borderRadius: 15,
          borderColor: 'white',
          borderWidth: 1,
          marginRight: widthToDp('4'),
        }}
        onPress={() => navigation.navigate('WebView', { url: item.link })}>
        <Image
          style={{
            width: widthToDp('28'),
            height: heightToDp('16'),
            resizeMode: 'cover',
            borderRadius: 15,
            borderColor: 'white',
            borderWidth: 1,
            alignSelf: 'center',
            marginTop: heightToDp('-0.1'),
          }}
          source={{
            uri: item.image,
          }}
        />
        {/* <View
          style={{
            backgroundColor: '#FF5F6D',
            width: widthToDp('12'),
            paddingVertical: heightToDp('0.2'),
            alignItems: 'center',
            justifyContent: 'center',
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            borderTopLeftRadius: 15,
            position: 'absolute',
            top: -1,
            left: -1,
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Poppins-SemiBold',
              fontSize: heightToDp('1.5'),
            }}>
            -30%
          </Text>
        </View> */}
        <View
          style={{
            width: 30,
            height: 30,
            backgroundColor: 'white',
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            bottom: heightToDp('6'),
            right: widthToDp('1'),
            elevation: 4,
          }}>
          <Icon name="plus" size={heightToDp('2.4')} color="black" />
        </View>

        <Text
          style={{
            color: 'white',
            fontFamily: 'Poppins-SemiBold',
            fontSize: heightToDp('1.4'),
            marginHorizontal: widthToDp('2'),
            marginTop: heightToDp('1.3'),
          }}>
          {item.type}
        </Text>
      </Pressable>
    );
  };

  const renderCategories = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          marginBottom: widthToDp('2.5'),
          alignItems: 'center',
          width: '33%',
        }}
        activeOpacity={0.8}
        onPress={() =>
          navigation.push('EcommerceSubCategories', {
            category_id: item.category_id,
          })
        }>
        <Image
          style={{
            width: 50,
            height: 50,
            resizeMode: 'contain',
          }}
          source={{ uri: item.image }}
        />
        <Text
          style={{
            color: 'white',
            fontFamily: 'Poppins-Regular',
            fontSize: heightToDp('1.3'),
            marginTop: heightToDp('1'),
          }}>
          {item?.category_name}
        </Text>
      </TouchableOpacity>
    );
  };

  const UserView = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ marginHorizontal: widthToDp('5') }}
        activeOpacity={0.5}
        onPress={() => navigation.navigate('WebView', { url: item.link })}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: heightToDp('2.5'),
            marginBottom: heightToDp('0.7'),
          }}>
          <View
            style={{
              borderRadius: 10,
            }}>
            <Image
              style={{
                width: 65,
                height: 65,
                resizeMode: 'cover',
                borderRadius: 6,
              }}
              source={{
                uri: item.image,
              }}
            />
          </View>
          <View style={{ marginLeft: widthToDp('3'), width: '78%' }}>
            <Text
              style={{
                fontFamily: 'Poppins-Bold',
                color: 'white',
                fontSize: heightToDp('2'),
              }}>
              {item.product_name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon9
                name="rupee"
                style={{ marginTop: heightToDp('-0.3') }}
                size={15}
                color="white"
              />
              <Text
                style={{
                  marginHorizontal: widthToDp('1'),
                  fontFamily: 'Poppins-SemiBold',
                  color: 'white',
                  fontSize: heightToDp('1.8'),
                }}>
                {item.price}
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  color: '#00FF00',
                  fontSize: heightToDp('1.8'),
                }}>
                {item.discount + '% off'}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                color: 'gray',
                fontSize: heightToDp('1.5'),
              }}>
              {item.sub_category_name}
            </Text>
          </View>
        </View>
        <View style={{ borderColor: 'gray', borderWidth: 0.4 }}></View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[mainView]}>
      <Bar barStyle="light-content" />
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: widthToDp('5'),
            marginVertical: heightToDp('1.4'),
          }}>
          <Icon10
            name="keyboard-backspace"
            size={25}
            color="white"
            onPress={backAction}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginLeft: widthToDp('3') }}>
              <Text
                style={{
                  color: 'gray',
                  fontFamily: 'Poppins-Regular',
                  fontSize: heightToDp('1.3'),
                }}>
                welcome
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: heightToDp('1.7'),
                }}>
                {full_name}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderColor: '#FF5F6D',
                borderWidth: widthToDp('0.4'),
                borderRadius: 10,
                marginLeft: widthToDp('2'),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}
              onPress={() => navigation.push('Profile', { user_id: userid })}>
              <Image
                style={{
                  width: widthToDp('8.5'),
                  height: heightToDp('4'),
                  resizeMode: 'cover',
                  borderRadius: 6,
                }}
                source={{
                  uri: profile_pic,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: heightToDp('1.2'),
            }}>
            <View style={styles.inputBox}>
              <Icon9 name="search" size={heightToDp('1.8')} color="#AEAEAE" />
              <TextInput
                placeholder="Find your fav producs ..."
                placeholderTextColor={'#808080'}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={product}
                onChangeText={text => setP(text)}
                onSubmitEditing={() => getSearchResult()}
              />
            </View>
            <View style={styles.inputBox2}>
              <Icon9 name="sliders" size={heightToDp('3')} color="#696969" />
            </View>
          </View>
        </View>
        {searchResult.length <= 0 ? (
          <>
            <View style={{ marginVertical: heightToDp('3.5') }}>
              <FlatList
                horizontal={true}
                data={topSliders}
                renderItem={renderTopSliders}
                keyExtractore={item => item.id}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: widthToDp('5'),
                marginTop: heightToDp('2'),
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'Poppins-Bold',
                    fontSize: heightToDp('2'),
                    marginRight: widthToDp('2'),
                  }}>
                  Categories
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: heightToDp('1'),
                marginBottom: heightToDp('1.5'),
                marginHorizontal: widthToDp('1'),
              }}>
              <FlatList
                data={ecommerce_category}
                renderItem={renderCategories}
                keyExtractore={item => item.category_id}
                numColumns={3}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: widthToDp('5'),
                marginTop: heightToDp('2'),
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'Poppins-Bold',
                    fontSize: heightToDp('1.8'),
                    marginRight: widthToDp('2'),
                  }}>
                  Hot Offers
                </Text>
              </View>
            </View>
            <View style={{ marginTop: heightToDp('1.3') }}>
              <FlatList
                horizontal={true}
                data={bottomSliders}
                renderItem={renderBottomSliders}
                keyExtractore={item => item.id}
                style={{ paddingLeft: widthToDp('5') }}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </>
        ) : (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View
              style={{
                marginTop: heightToDp('1'),
              }}>
              <FlatList
                data={searchResult}
                renderItem={UserView}
                keyExtractor={item => item.id}
              />
            </View>
          </View>
        )}
      </ScrollView>
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
  inputBox: {
    marginTop: heightToDp('0'),
    marginLeft: widthToDp('5'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: widthToDp('3'),
  },
  inputBox2: {
    marginLeft: widthToDp('0'),
    marginRight: widthToDp('5'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: widthToDp('4'),
    paddingVertical: heightToDp('1'),
  },
  input: {
    width: '70%',
    height: Platform.OS === 'ios' ? heightToDp('4') : heightToDp('5'),
    alignSelf: 'center',
    fontSize: heightToDp('1.8'),
    color: '#AEAEAE',
    marginLeft: widthToDp('1'),
    marginTop: heightToDp('0.4'),
  },
});

export default Ecommerce2;
