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
import {
  UploadsoftcopyStyle,
  IntroStyle,
} from '../Assets/styles';
import {BlurView} from '@react-native-community/blur';
import Icon3 from 'react-native-vector-icons/dist/Feather';
import {LinearGradientButtonwithicon} from '../components/LinearGradientButton';

const Uploadsoftcopy = ({navigation}) => {
  const [aadharNo, setAadharNo] = useState('');
  const [panNo, setPanNo] = useState('');
  const [atmNo, setAtmNo] = useState('');
  const [ifscNo, setIfscNo] = useState('');

  const color = '#FF5F6D';

  return (
    <View style={[mainView]}>
      <Bar barStyle="light-content" />
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
          flexDirection: 'row',
          marginHorizontal: widthToDp('7'),
          marginTop: heightToDp('8'),
          justifyContent: 'space-between',
        }}>
        <View>
          {/* <Icon
          name="chevron-double-left"
          size={heightToDp('4')}
          color="#F5F5F5"
        /> */}
        <View>
            <Text
            style={{
              marginLeft: widthToDp('2'),
              fontSize: widthToDp('5.7'),
              color: 'white',
              fontFamily: 'Poppins-SemiBold',
            }}>
            Fill the Details
          </Text>
        </View>
          <Text
            style={{
              marginLeft: widthToDp('2'),
              fontSize: widthToDp('2.5'),
              color: 'white',
              fontFamily: 'Poppins-Regular',
            }}>
            Fill the Details for a smooth and easy service
          </Text>
          <Text
            style={{
              marginLeft: widthToDp('2'),
              fontSize: widthToDp('2.5'),
              color: 'white',
              fontFamily: 'Poppins-Regular',
            }}>
            stocks and buying products
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={{alignSelf: 'center', marginTop: heightToDp('3')}}
        onPress={() => navigation.navigate('UploadDoc')}>
        <View style={{width: widthToDp('80'), height: heightToDp('7')}}>
          <LinearGradientButtonwithicon
            name={'Aadhar Card'}
            textSize={17}
            fontFamily={'Poppins-Regular'}
            borderRadius={5}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{alignSelf: 'center', marginTop: heightToDp('3')}}
>
        <View style={{width: widthToDp('80'), height: heightToDp('7')}}>
          <LinearGradientButtonwithicon
            name={'PAN Card'}
            textSize={17}
            fontFamily={'Poppins-Regular'}
            borderRadius={5}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{alignSelf: 'center', marginTop: heightToDp('3')}}
>
        <View style={{width: widthToDp('80'), height: heightToDp('7')}}>
          <LinearGradientButtonwithicon
            name={'Driving License'}
            textSize={17}
            fontFamily={'Poppins-Regular'}
            borderRadius={5}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() =>navigation.navigate('Interest')} style={{position:'absolute',bottom:20, right:15}}>
            <View style={UploadsoftcopyStyle.buttonStyleOuterCircle}>
              <View style={UploadsoftcopyStyle.buttonStyleInnerCircle}>
                <Icon1
                  name="arrowright"
                  size={heightToDp('3')}
                  color="#F5F5F5"
                />
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

export default Uploadsoftcopy;
