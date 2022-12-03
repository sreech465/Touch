import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {mainView} from '../Assets/styles';
import {Bar} from '../components/StatusBar';
import {heightToDp, widthToDp} from '../Assets/helpers/Responsive';
import Icon2 from 'react-native-vector-icons/dist/Ionicons';
import Icon1 from 'react-native-vector-icons/dist/Ionicons';
import {loginStyle, IntroStyle, SignUpStyle} from '../Assets/styles';
import {BlurView} from '@react-native-community/blur';
import Icon3 from 'react-native-vector-icons/dist/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from '@react-navigation/native';

const HelpScreen = ({ navigation}) => {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [sec, setS] = useState(true);

  const backAction = () => {
    const popAction = StackActions.pop(1);
    navigation.dispatch(popAction);
  };

  return (
    <SafeAreaView style={[mainView, {alignItems: 'center'}]}>
      <Bar barStyle="light-content" />
      <Image
        source={require('../Assets/assets/MaskGroup26.png')}
        style={[IntroStyle.styleImage, {position: 'absolute', opacity: 1,left:widthToDp(-33)}]}
        resizeMode="contain"
      />
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-start',
          marginLeft: widthToDp('4'),
          alignItems: 'center',
          marginTop: heightToDp('2'),
        }}>
        <Icon2 name="arrow-back" size={heightToDp('4')} color="white" onPress={()=> backAction()} />
        <Text
          style={{
            marginLeft: widthToDp('3'),
            fontSize: widthToDp('5.7'),
            color: 'white',
            fontFamily:'Poppins-SemiBold'
          }}>
          {'Help'}
        </Text>
      </View>
      <ScrollView
        style={{
          marginTop: heightToDp('2.5'),
          alignSelf: 'flex-start',
          marginLeft: widthToDp('10'),
          marginRight: widthToDp('14'),
        }}>
        <View style={{alignItems: 'flex-start'}}>
          <Text style={{color: '#FF5F6D', fontSize: 15.9,fontFamily:'Poppins-Medium'}}>
            Common with Terms and Conditions Agreements 09-12-2020
          </Text>
          <Text
            style={{
              color: '#F5F5F5',
              fontSize: 13,
              marginVertical: heightToDp('2'),
              fontFamily:'Poppins-Regular'
            }}>
            You may disclose Confidential Information to the extent such
            Confidential Information is required to be disclosed by law, by any
            governmental or other regulatory authority or by a court or other
            authority of competent jurisdiction, provided that, to the extent
            You are legally permitted to do so, You give Reallyenglish as much
            notice of such disclosure as possible and, where notice of
            disclosure is not prohibited and is given in accordance with this
            clause 4.3, You take into account the reasonable requests of
            Reallyenglish in relation to the content of such disclosure.
          </Text>
          <Text style={{color: '#FF5F6D', fontSize: 18,fontFamily:'Poppins-Medium'}}>1. DATA PROTECTION</Text>
          <Text
            style={{
              color: '#F5F5F5',
              fontSize: 13,
              marginVertical: heightToDp('2'),
              fontFamily:'Poppins-Regular'
            }}>
            1. Both parties will comply with all applicable requirements of
            applicable data protection laws, and Reallyenglish shall make
            available a copy of its privacy policy available to all End Users.
          </Text>
        </View>
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
});

export default HelpScreen;
