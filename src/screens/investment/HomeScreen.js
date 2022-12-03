import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  BackHandler,
  Pressable,
  Linking,
  ScrollView,
} from 'react-native';
import { mainView } from '../../Assets/styles';
import { Bar } from '../../components/StatusBar';
import { heightToDp, widthToDp } from '../../Assets/helpers/Responsive';
import Icon9 from 'react-native-vector-icons/dist/FontAwesome';
import Icon10 from 'react-native-vector-icons/dist/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SmallLinearGradientButton } from '../../components/LinearGradientButton';
import { StackActions } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { getInvestmentCategories,getsearchInvestments } from '../../Redux/investmentsSlice';
import {clear} from '../../Redux/investmentsSlice';
const Finance3 = ({ navigation }) => {
  const [searchKeyword, setSearchKeyword] = useState('');

  const { popularFunds, collections, quickAccess } = useSelector(state => state.investment);
  const { profile_pic, full_name, userid } = useSelector(state => state.user.userdata);
  const searchResult = useSelector(state => state.investment.searchInvestments);
  const dispatch = useDispatch();
  console.log('searchResultinv',searchResult)
  useEffect(() => {
    dispatch(clear());
    dispatch(getInvestmentCategories())
  }, [])

  const backAction = () => {
    if (searchResult.length > 0) {
      const popAction = StackActions.pop(0);
      dispatch(clear());
      setP('');
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
  }, []);

  const getSearchResult = () => {
    const keyword = { searchKeyword: searchKeyword, offset: 0, limit: 12 };
    console.log('ser')
    dispatch(getsearchInvestments(keyword));
  };

  const renderPopularFunds = ({ item }) => {
    console.log('onInvestment',item);
    return (
      <Pressable
        style={{
          width: widthToDp('70'),
          height: heightToDp('18'),
          backgroundColor: '#262626',
          marginLeft: widthToDp('4'),
          borderRadius: 15,
          paddingHorizontal: widthToDp('2.8'),
          paddingVertical: heightToDp('1.5')
        }}
        onPress={() => navigation.navigate('WebView',{url: item.external_link})}
      >
        <Image
          style={{
            width: widthToDp('7'),
            height: heightToDp('3.4'),
            resizeMode: 'contain',
            borderRadius: 6,
          }}
          source={{
            uri: item.image,
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: heightToDp('1') }}>
          <Text style={{ color: 'white', fontFamily: 'Poppins-Regular', fontSize: heightToDp('1.79') }}>{item.title}</Text>
          <Text style={{ color: 'white', fontFamily: 'Poppins-Regular', fontSize: heightToDp('1.8') }}>{item.returns_percentage + "%"}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontFamily: 'Poppins-Regular', fontSize: heightToDp('1.79') }}>{item.description}</Text>
          <Text style={{ color: '#B3B3B3', fontFamily: 'Poppins-Regular', fontSize: heightToDp('1.3') }}>{`${item.returns_years}Y Returns`}</Text>
        </View>
        <Text style={{ color: '#B3B3B3', fontFamily: 'Poppins-Regular', fontSize: heightToDp('1.3'), marginTop: heightToDp('3') }}>{item.category_name}</Text>
      </Pressable>
    );
  };

  const renderQuickAccess = ({ item }) => {
    return (
      <View
        style={{
          marginRight: widthToDp('5'),
          marginTop: heightToDp('1'),
          width: widthToDp('38.5'),
          height: heightToDp('18'),
          backgroundColor: '#FF5F6D',
          borderRadius: 20,
          alignItems: 'center',
        }}>
        <View
          style={{
            width: widthToDp('38.3'),
            height: heightToDp('17.7'),
            backgroundColor: '#262626',
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            shadowColor: 'gray',
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.60,
            shadowRadius: 20,

            elevation: 20,
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Poppins-SemiBold',
              fontSize: heightToDp('2.3'),
              marginHorizontal: widthToDp('2'),
              marginTop: heightToDp('3'),
              alignSelf: 'center',
            }}>
            {item.title}
          </Text>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Poppins-Regular',
              fontSize: heightToDp('1.7'),
              marginHorizontal: widthToDp('2'),
              marginTop: heightToDp('2'),
              alignSelf: 'center',
            }}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  const UserView = ({ item }) => {
    return (
      <TouchableOpacity style={{ marginHorizontal: widthToDp('5') }} activeOpacity={0.5} onPress={() => navigation.navigate('WebView',{url:item.external_link})}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: heightToDp('2.5'),
            marginBottom: heightToDp('0.7')
          }}>
          <View
            style={{
              borderRadius: 10,
              marginTop: heightToDp('0.5'),
            }}>
            <Image
              style={{
                width: 33,
                height: 33,
                resizeMode: 'cover',
                borderRadius: 6,
              }}
              source={{
                uri: item.image,
              }}
            />
          </View>
          <View style={{ marginLeft: widthToDp('3'), width: '86%' }}>
            <Text style={{ fontFamily: 'Poppins-Regular', color: 'white', fontSize: heightToDp('1.6') }}>
              {item.title}
            </Text>
            <View style={{ marginVertical: heightToDp('-0.4'), flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: 'Poppins-Regular', color: 'white', fontSize: heightToDp('1.6') }}>
                {item.category_name}
              </Text>
              <Text style={{ fontFamily: 'Poppins-Regular', color: 'white', fontSize: heightToDp('1.6') }}>
                {item.returns_percentage + "%"}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                color: 'gray',
                fontSize: heightToDp('1.3'),
              }}>
              {item.description}
            </Text>
          </View>
        </View>
        <View style={{ borderColor: 'gray', borderWidth: 0.4 }}></View>
      </TouchableOpacity>
    );
  };

  const renderCollections = ({ item }) => {
    return (
      <TouchableOpacity style={{
        marginBottom: widthToDp('2.5'),
        alignItems: 'center',
        width: "33%"
      }} onPress={() => navigation.navigate('InvestmentFunds', { category_id: item.id })} activeOpacity={0.8}>
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
            // width: 0,
          }}
        >
          {item?.category_name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[mainView]}>
      <Bar barStyle="light-content" />
      <ScrollView>
        <View style={
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: widthToDp('5'),
            marginVertical: heightToDp('1.4'),
          }
        }>
          <Icon10
            name="keyboard-backspace"
            size={25}
            color="white"
            onPress={() => navigation.navigate("ExploreScreen")}
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
              onPress={() => navigation.push("Profile", { user_id: userid })}
            >
              <Image
                style={{
                  width: widthToDp('8.5'),
                  height: heightToDp('4'),
                  resizeMode: 'cover',
                  borderRadius: 6,
                }}
                source={{
                  uri: profile_pic
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
              marginTop: heightToDp('2'),
            }}>
            <View style={styles.inputBox}>
              <Icon9 name="search" size={heightToDp('1.8')} color="#AEAEAE" />
              <TextInput
                placeholder="Search..."
                placeholderTextColor={'#808080'}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={searchKeyword}
                onChangeText={text => setSearchKeyword(text)}
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
          <View
            style={{
              marginBottom: heightToDp('1'),
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginRight: widthToDp('5'),
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Poppins-Bold',
                fontSize: heightToDp('1.8'),
                marginLeft: widthToDp('5'),
              }}>
              Popular funds
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('InvestmentFunds', { category_id: 0 })}>
                <Text style={{textSize:heightToDp('1.5'),
                  fontFamily:'Poppins-SemiBold',
                  color:'#FF5F6D'}}
                  
                >
                  View all
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal={true}
            data={popularFunds}
            renderItem={renderPopularFunds}
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
              Collections
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
            data={collections}
            renderItem={renderCollections}
            keyExtractore={item => item.id}
            numColumns={3}
          />

        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: widthToDp('5'),
            marginTop: heightToDp('1'),
          }}>
          <Text
            style={{
              color: '#AEAEAE',
              fontFamily: 'Poppins-Bold',
              fontSize: heightToDp('2'),
              marginRight: widthToDp('2'),
            }}>
            Quick Access
          </Text>
        </View>
        <View style={{ marginTop: heightToDp('0.5') }}>
          <FlatList
            horizontal={true}
            data={quickAccess}
            renderItem={renderQuickAccess}
            keyExtractore={item => item.id}
            style={{ paddingLeft: widthToDp('5') }}
          />
        </View>
        </>
        ):(
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

export default Finance3;
