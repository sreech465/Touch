import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { mainView } from '../Assets/styles';
import { Bar } from '../components/StatusBar';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import Icon2 from 'react-native-vector-icons/dist/Ionicons';
import Icon1 from 'react-native-vector-icons/dist/AntDesign';
import {
  PersonalInfoStyle,
  SettingStyle,
  SignUpStyle,
  IntroStyle,
} from '../Assets/styles';
import { BlurView } from '@react-native-community/blur';
import Icon3 from 'react-native-vector-icons/dist/Feather';
import LinearGradient from 'react-native-linear-gradient';
import ToggleSwitch from 'toggle-switch-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateUserData } from '../Redux/reducers/authReducer';
import { getProfileInfo, updateAccountType } from '../Redux/reducers/userReducer';
import { StackActions } from '@react-navigation/native';

const AccountSetting = ({ navigation }) => {
  const [buttonv, setButtonV] = useState('');
  const dispatch = useDispatch()
  const ProfileInfo=useSelector(state=>state.userData.profileInfo);
  const user = useSelector(state => state.user.userdata);

  console.log("AccountSetting",user);


  const backAction = () => {
    const popAction = StackActions.pop(1);
    navigation.dispatch(popAction);
  };
  const OptionTitle = ({ title, onPress }) => {
    return (
      <Pressable style={{ marginTop: heightToDp('1.7') }} onPress={onPress}>
        <Text style={{ color: 'gray', fontWeight: '600' }}>{title}</Text>
      </Pressable>
    );
  };

  useEffect(() => {
    if(user.account_type === 'private'){
      setButtonV(true);
    }else{
      setButtonV(false);
    }
  },[user.account_type])

  const OptionTitleWithRedText = ({ title }) => {
    return (
      <View style={{ marginTop: heightToDp('1.7') }}>
        <Text style={{ color: '#FF5F6D', fontWeight: '600' }}>{title}</Text>
      </View>
    );
  };

  const ButtonToggel = () => {
    console.log(buttonv,"toggle fun",ProfileInfo)
    const setAccount = user?.account_type === 'public'?"private":"public";
    const data = {
      mobile:user?.mobile,
            email:"test@gmail.com",
            gender:user?.gender,
            account_type: setAccount
    }
      dispatch(updateAccountType(data)).unwrap().then(res=> {
        console.log('Afertoget',res)
        if(res.status == 200){
          console.log('updatecoountdispatch');
          dispatch(updateUserData({account_type:setAccount}));
        } 
      })
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      "Do you want to logout ?",
      [
        {
          text: 'Yes',
          onPress: () => {
            dispatch(logout());
          },
        },
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  }
  return (
    <View style={[mainView]}>
      <Bar barStyle="light-content" />
      <Image
        source={require('../Assets/assets/MaskGroup26.png')}
        style={[
          IntroStyle.styleImage,
          { position: 'absolute', opacity: 1, left: widthToDp(-33) },
        ]}
        resizeMode="contain"
      />
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: widthToDp('4'),
          marginTop: heightToDp('8'),
          justifyContent: 'space-between',
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon2 name="arrow-back" size={heightToDp('4')} color="white" onPress={()=> backAction()} />
          <Text
            style={{
              marginLeft: widthToDp('2'),
              fontSize: widthToDp('5.7'),
              color: 'white',
              fontFamily: 'Poppins-SemiBold',
            }}>
            {'Settings'}
          </Text>
        </View>
      </View>
      <View
        style={{ marginHorizontal: widthToDp('0'), marginTop: heightToDp('3') }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: widthToDp('6'),
            alignItems: 'center'
          }}>
          <Text style={{ color: 'gray', fontWeight: '600' }}>Private account</Text>
          <View>
            <ToggleSwitch
              isOn={buttonv}
              onColor="#FF5F6D"
              offColor="gray"
              labelStyle={{ color: 'black', fontWeight: '900' }}
              size="medium"
              onToggle={isOn => ButtonToggel()}
            />
          </View>
        </View>
        <View
          style={{
            borderBottomColor: 'gray',
            borderBottomWidth: 1,
            marginTop: heightToDp('2'),
          }}
        />
        <View
          style={{
            marginHorizontal: widthToDp('6'),
            marginTop: heightToDp('2'),
          }}>
          <View>
            <Text
              style={{
                color: 'white',
                fontSize: heightToDp('2'),
                fontWeight: 'bold',
              }}>
              Interactions
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <OptionTitle title="Limits" />
            <OptionTitle title="Off" />
          </View>
          <OptionTitle title="Hidden words" />
          <OptionTitle title="Comments" />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <OptionTitle title="Posts" />
            <OptionTitle title="Everyone" />
          </View>
          <OptionTitle title="Guides" />
        </View>
        <View
          style={{
            borderBottomColor: 'gray',
            borderBottomWidth: 1,
            marginTop: heightToDp('2'),
          }}
        />
        <View
          style={{
            marginHorizontal: widthToDp('6'),
            marginTop: heightToDp('2'),
          }}>
          <View>
            <Text
              style={{
                color: 'white',
                fontSize: heightToDp('2'),
                fontWeight: 'bold',
              }}>
              Interactions
            </Text>
          </View>
          <OptionTitleWithRedText title="Restricted accounts" />
          <OptionTitleWithRedText title="Blocked accounts" />
          <OptionTitleWithRedText title="Muted accounts" />
          <OptionTitle title="Delete Account" />
          <OptionTitle title="Logout" onPress={handleLogout} />
        </View>
      </View>
    </View>
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
});

export default AccountSetting;
