import React, {useEffect,useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler
} from 'react-native';
import {mainView} from '../Assets/styles';
import {Bar} from '../components/StatusBar';
import {heightToDp, widthToDp} from '../Assets/helpers/Responsive';
import Icon2 from 'react-native-vector-icons/dist/Ionicons';
import Icon1 from 'react-native-vector-icons/dist/AntDesign';
import {PersonalInfoStyle,SettingStyle, SignUpStyle,IntroStyle} from '../Assets/styles';
import {BlurView} from '@react-native-community/blur';
import Icon3 from 'react-native-vector-icons/dist/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from '@react-navigation/native';

const SettingScreen = ({navigation}) => {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [sec, setS] = useState(true);


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

  return (
    <View style={[mainView]}>
      <Bar barStyle="light-content" />
      <Image
        source={require('../Assets/assets/MaskGroup26.png')}
        style={[IntroStyle.styleImage, {position: 'absolute', opacity: 1,left:widthToDp(-33)}]}
        resizeMode="contain"
      />
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: widthToDp('4'),
          marginTop: heightToDp('8'),
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon2 name="arrow-back" size={heightToDp('4')} color="white" onPress={()=> backAction()} />
          <Text
            style={{
              marginLeft: widthToDp('2'),
              fontSize: widthToDp('5.7'),
              color: 'white',
              fontFamily:'Poppins-SemiBold'
            }}>
            {'Settings'}
          </Text>
        </View>
      </View>
      <View style={{marginHorizontal:widthToDp('7'), marginTop:heightToDp('3')}}>
        <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
          <View style={{marginTop:heightToDp('0'), flexDirection:'row'}}>
        <Image
            style={SettingStyle.Imagee}
            source={require('../Assets/assets/ic_notifications_active_24px.png')}
          />
          <View>
            <Text style={SettingStyle.TitleText} >
            Notifications
          </Text>
          <Text style={SettingStyle.TitleTextt}>
            {'know about your message & groups'}
          </Text>
          </View>
        </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('TermsScreen')}>
          <View style={SettingStyle.optionBox}>
        <Image
            style={SettingStyle.Image}
            source={require('../Assets/assets/ic_security_24px.png')}
          />
          <View><Text style={SettingStyle.TitleText} >
            {'Terms & Policy'}
          </Text>
          <Text style={SettingStyle.TitleTextt}>
            end-to-end encrypted chat
          </Text></View>
        </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('AccountSetting')}>
        <View style={SettingStyle.optionBox}>
        <Image
            style={SettingStyle.Image}
            source={require('../Assets/assets/ic_account_circle_24px.png')}
          />
        <View><Text style={SettingStyle.TitleText} >
            Account
          </Text>
          <Text style={SettingStyle.TitleTextt}>
          end-to-end encrypted chat
          </Text></View>
          
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Help')}>
          <View style={SettingStyle.optionBox}>
        <Image
            style={SettingStyle.Image}
            source={require('../Assets/assets/ic_help_24px.png')}
          />
        <View><Text style={SettingStyle.TitleText} >
            Help
          </Text>
          <Text style={SettingStyle.TitleTextt}>
            help centre, contact us
          </Text></View>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('About')}>
          <View style={SettingStyle.optionBox}>
        <Image
            style={SettingStyle.Image}
            source={require('../Assets/assets/ic_error_24px.png')}
          />
        <View><Text style={SettingStyle.TitleText} >
            About
          </Text>
          <Text style={SettingStyle.TitleTextt}>
            Data policy, terms of use
          </Text></View>
        </View>
        </TouchableOpacity>
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

  


export default SettingScreen;