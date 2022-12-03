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
import {mainView} from '../Assets/styles';
import {Bar} from '../components/StatusBar';
import {heightToDp, widthToDp} from '../Assets/helpers/Responsive';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import Icon1 from 'react-native-vector-icons/dist/AntDesign';
import {PersonalInfoStyle, EditProfileStyle, SignUpStyle,IntroStyle} from '../Assets/styles';
import {BlurView} from '@react-native-community/blur';
import Icon3 from 'react-native-vector-icons/dist/Feather';
import LinearGradient from 'react-native-linear-gradient';

const PersonalInfoScreen = props => {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [sec, setS] = useState(true);

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
        <Icon name="arrow-back" size={heightToDp('4')} color="white" onPress={()=> backAction()} />
          <Text
            style={{
              marginLeft: widthToDp('2'),
              fontSize: widthToDp('5.7'),
              color: 'white',
              fontFamily:'Poppins-SemiBold'
            }}>
            {'Personal Info'}
          </Text>
        </View>
      </View>
      <View style={PersonalInfoStyle.inputBox}>
          <TextInput
            placeholder="Name"
            placeholderTextColor={'gray'}
            style={PersonalInfoStyle.input}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={username}
            onChangeText={text => setU(text)}
          />
          <View style={{marginTop:heightToDp('1.2')}}>
            <Icon3
          name="chevron-right"
          size={heightToDp('2.6')}
          color="#FF5F6D"
        />
          </View>
          
        </View>
        <View style={PersonalInfoStyle.inputBox}>
          <TextInput
            placeholder="User Name"
            placeholderTextColor={'gray'}
            style={PersonalInfoStyle.input}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={username}
            onChangeText={text => setU(text)}
          />
          <View style={{marginTop:heightToDp('1.2')}}>
            <Icon3
          name="chevron-right"
          size={heightToDp('2.6')}
          color="#FF5F6D"
        />
          </View>
        </View>
        <View style={PersonalInfoStyle.inputBox}>
          <TextInput
            placeholder="Website"
            placeholderTextColor={'gray'}
            style={PersonalInfoStyle.input}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={username}
            onChangeText={text => setU(text)}
          />
            <View style={{marginTop:heightToDp('1.2')}}>
            <Icon3
          name="chevron-right"
          size={heightToDp('2.6')}
          color="#FF5F6D"
        />
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

export default PersonalInfoScreen;


