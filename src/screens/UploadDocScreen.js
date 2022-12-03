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
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/dist/AntDesign';
import {UploadsoftcopyStyle, IntroStyle} from '../Assets/styles';
import {BlurView} from '@react-native-community/blur';
import Icon3 from 'react-native-vector-icons/dist/FontAwesome';
import {LinearGradientButtonwithicon} from '../components/LinearGradientButton';

const UploadDocScreen = props => {
  const [aadharNo, setAadharNo] = useState('');
  const [panNo, setPanNo] = useState('');
  const [atmNo, setAtmNo] = useState('');
  const [ifscNo, setIfscNo] = useState('');

  const color = '#FF5F6D';

  return (
    <View style={[mainView]}>
      <Image
        source={require('../Assets/assets/MaskGroup26.png')}
        style={[
          IntroStyle.styleImage,
          {position: 'absolute', opacity: 1, left: widthToDp(-33)},
        ]}
        resizeMode="contain"
      />
      <View
        style={{
          width: widthToDp('100'),
          height: heightToDp('50'),
          backgroundColor: '#FF5F6D',
          opacity: 0.7,
        }}></View>
      <Bar barStyle="light-content" />
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: widthToDp('7'),
          justifyContent: 'space-between',
          position: 'absolute',
          top: 60,
        }}>
        <View>
          <Text
            style={{
              marginLeft: widthToDp('2'),
              fontSize: widthToDp('5.7'),
              color: 'white',
              fontFamily: 'Poppins-SemiBold',
            }}>
            Upload Aadhar card
          </Text>
        </View>
      </View>
      <View style={{
          flexDirection: 'row',
          marginHorizontal: widthToDp('40'),
          justifyContent: 'space-between',
          position: 'absolute',
          top: 130,
        }}>
        <Image
        source={require('../Assets/assets/upload.png')}
        style={{height:heightToDp('20')}}
        resizeMode="contain"
      />
      </View>
      
      <TouchableOpacity>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FF5F6D',
            width: widthToDp('40'),
            height: heightToDp('6'),
            alignSelf: 'center',
            marginTop: heightToDp('-3'),
            flexDirection: 'row',
          }}>
          <Icon name="camera-outline" size={heightToDp('3')} color="#F5F5F5" />
          <Text
            style={{
              marginLeft: widthToDp('2'),
              fontSize: widthToDp('3.2'),
              color: 'white',
              fontFamily: 'Poppins-Regular',
            }}>
            Use Camera
          </Text>
        </View>
      </TouchableOpacity>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          marginTop: heightToDp('4'),
        }}>
        <Text
          style={{
            fontSize: widthToDp('3.2'),
            color: 'white',
            fontFamily: 'Poppins-Regular',
          }}>
          OR
        </Text>
      </View>

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          marginTop: heightToDp('4'),
          flexDirection: 'row',
          width: widthToDp('50'),
        }}>
        <Icon3 name="file-picture-o" size={heightToDp('2.5')} color="#F5F5F5" />
        <Text
          style={{
            marginLeft: widthToDp('3'),
            fontSize: widthToDp('2.8'),
            color: 'white',
            fontFamily: 'Poppins-Light',
          }}>
          Select the document from Gallery JPG, PNG, PDF
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => OnPressSigup()}
        style={{position: 'absolute', bottom: 20, right: 15}}>
        <View style={UploadsoftcopyStyle.buttonStyleOuterCircle}>
          <View style={UploadsoftcopyStyle.buttonStyleInnerCircle}>
            <Icon1 name="arrowright" size={heightToDp('3')} color="#F5F5F5" />
          </View>
        </View>
      </TouchableOpacity>
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
    marginLeft: widthToDp('2'),
    fontSize: widthToDp('3'),
    color: 'white',
    fontFamily: 'Poppins-Regular',
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

export default UploadDocScreen;
