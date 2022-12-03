import React, { useEffect, useState } from 'react';
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
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { heightToDp, widthToDp } from '../../Assets/helpers/Responsive';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/dist/Fontisto';
import Icon2 from 'react-native-vector-icons/dist/Ionicons';
import Icon9 from 'react-native-vector-icons/dist/FontAwesome';
import { LinearGradientButton } from '../../components/LinearGradientButton';
import { Search } from '../../Redux/reducers/searchReducer';
import { getInvestmentByCategories } from '../../Redux/investmentsSlice';

const Finance4 = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { categorySearch } = useSelector(state => state.investment);

  const category_id = route.params?.category_id ? route.params.category_id : 0

  useEffect(() => {
    dispatch(getInvestmentByCategories(category_id))
  }, [])


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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle={'light-content'} />
      <View style={{ marginTop: heightToDp('5') }}>
        {/* <View>
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
                value={username}
                onChangeText={text => setU(text)}
                onSubmitEditing={() => searchFuction()}
              />
            </View>
            <View style={styles.inputBox2}>
              <Icon9
                onPress={() => navigation.navigate('FinanceSearch')}
                name="sliders"
                size={heightToDp('3')}
                color="#696969"
              />
            </View>
          </View>
        </View> */}
        <View
          style={{
            marginTop: heightToDp('2'),
          }}>
          <View style={{ marginLeft: widthToDp('5'), marginBottom: heightToDp('1') }}>
            <Text style={{ color: 'white', fontFamily: 'Poppins-SemiBold' }}>
              All mutual funds
            </Text>
          </View>
          <FlatList
            data={categorySearch}
            renderItem={UserView}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

export default Finance4;
