import React, { useEffect, useState } from 'react';
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
  BackHandler
} from 'react-native';

import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/dist/Fontisto';
import Icon2 from 'react-native-vector-icons/dist/Ionicons';
import Icon9 from 'react-native-vector-icons/dist/FontAwesome';
import { LinearGradientButton } from '../components/LinearGradientButton';
import { Search,reset } from '../Redux/reducers/searchReducer';
import { StackActions } from '@react-navigation/native';

const SearchScreen = ({ navigation }) => {
  const animation = new Animated.Value(0);
  const animation1 = new Animated.Value(0);

  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(false)
  const [username, setUserName] = useState('');
  const dispatch = useDispatch()
  const SearchDatas = useSelector(state => state.searchData.searchData)
  const owner = useSelector(state => state.user.userdata)
  console.log('search', SearchDatas)

  const SearchTags = [
    {
      key: '1',
      Title: 'Reels'
    },
    {
      key: '2',
      Title: 'Fashion'
    },
    {
      key: '3',
      Title: 'Photography',
    },

    {
      key: '4',
      Title: 'Animal',
    },
    {
      key: '5',
      Title:
        'love',
    },
    {
      key: '6',
      Title: 'Men',
    },
    {
      key: '7',
      Title:
        'Ice Cream',
    },
    {
      key: '8',
      Title:
        'Study',
    },
    {
      key: '9',
      Title:
        'Book',
    },

    {
      key: '10',
      Title:
        'Nice',
    },
    {
      key: '11',
      Title:
        'Food',
    },
    {
      key: '12',
      Title: 'Dog',
    },
  ];

  const SearchOptions = ({ item }) => {

    return <View
      style={{ height: heightToDp('3.7'), marginHorizontal: widthToDp('0.8') }}>
      <LinearGradientButton
        name={item.Title}
        textSize={13}
        fontFamily={'normal'}
        borderRadius={12}
      />
    </View>
  }

  const backAction = () => {
    dispatch(reset())
    const popAction = StackActions.pop(1);
    navigation.dispatch(popAction);
    return true;
  };

  useEffect(() => {
    dispatch(reset())
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const UserView = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ backgroundColor: '#3B3B3B', height: heightToDp('9'), flexDirection: 'row', alignItems: 'center', marginBottom: heightToDp('0.03') }}
        onPress={() => navigation.push('Profile', { user_id: item.userid })}
        activeOpacity={0.8}
      >
        <View
          style={{
            width: widthToDp('12'),
            height: heightToDp('6'),
            borderColor: '#FF5F6D',
            borderWidth: widthToDp('0'),
            borderRadius: 10,
            marginLeft: widthToDp('5'),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}

        >
          <Image
            style={{
              width: widthToDp('10'),
              height: heightToDp('4.8'),
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
          <Text style={{ fontFamily: 'Poppins-Regular', color: 'white', fontSize: heightToDp('1.3') }}>
            {item.first_name}
          </Text>
        </View>

      </TouchableOpacity>
    )
  }

  const searchFuction = () => {
    setLoading(true);
    let data = { searchKeyword: username }
    dispatch(Search(data)).finally(() => setLoading(false))
  }



  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'black' }}>
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
          <Icon name="camera" size={22} color="white" onPress={() => navigation.navigate('PostTab')} />
          <TouchableOpacity onPress={()=>navigation.popToTop()}>

          <Image
            style={{
              width: widthToDp('40'),
              height: heightToDp('4'),
              resizeMode: 'cover',
              borderRadius: 6,
            }}
            source={require("../Assets/assets/touchh.png")}
          />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon2
              name="chatbox-ellipses-sharp"
              size={28}
              color="white"
              onPress={() => navigation.navigate('Message')}
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
              }}
              onPress={() => navigation.push('Profile', { user_id: owner.userid })}
            >
              <Image
                style={{
                  width: widthToDp('8.5'),
                  height: heightToDp('4'),
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
          <View>
            <View style={styles.inputBox}>
              <Icon9 name="search" size={heightToDp('2')} color="#696969" />
              <TextInput
                placeholder="Search"
                placeholderTextColor={'#808080'}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="web-search"
                returnKeyType='search'
                // textContentType="emailAddress"
                value={username}
                onChangeText={text => setUserName(text)}
                onSubmitEditing={() => searchFuction()}
                clearButtonMode="always"
              />
              {Platform.OS !== "ios" && <TouchableOpacity onPress={() => username && setUserName("")} style={styles.clearButton}>
                <Icon name="close-a" color={username ? "white" : "#696969"} size={heightToDp('1.8')} />
              </TouchableOpacity>
              }
            </View>
            {/* <View
                  style={{
                    marginTop:heightToDp('1.3'),
                    marginBottom: heightToDp('1.5'),
                    marginHorizontal:widthToDp('2'),
                  }}>
                    <FlatList
                    data={SearchTags}
                    renderItem={SearchOptions}
                    keyExtractor={item => item.key}
                    horizontal={true}
                    />
                </View> */}
          </View>
        </View>
        <View
          style={{
            marginTop: heightToDp('2'),
            flex: 1
          }}>
          <FlatList
            data={SearchDatas}
            renderItem={UserView}
            keyExtractor={item => item.userid}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '80%',
    height: Platform.OS === "ios" ? heightToDp('4') : heightToDp('5'),
    alignSelf: 'center',
    fontSize: heightToDp('1.7'),
    color: 'white',
    marginLeft: widthToDp('1'),
    marginTop: heightToDp('0.4'),
  },

  inputBox: {
    marginTop: heightToDp('0'),
    marginHorizontal: widthToDp('5.9'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B3B3B',
    borderRadius: 10,
    paddingHorizontal: widthToDp('3')
  },
  clearButton: {
    position: 'absolute',
    right: 10
  }
})

export default SearchScreen;