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
  PersonalInfoStyle,
  AdddetailsStyle,
  SignUpStyle,
  IntroStyle,
} from '../Assets/styles';
import {BlurView} from '@react-native-community/blur';
import Icon3 from 'react-native-vector-icons/dist/Feather';
import {LinearGradientButton} from '../components/LinearGradientButton';

const AddDetailsScreen = ({navigation}) => {
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
          marginHorizontal: widthToDp('4'),
          marginTop: heightToDp('8'),
          justifyContent: 'space-between',
        }}>
        <View>
          {/* <Icon
          name="chevron-double-left"
          size={heightToDp('4')}
          color="#F5F5F5"
        /> */}
          <Text
            style={{
              marginLeft: widthToDp('2'),
              fontSize: widthToDp('5.7'),
              color: 'white',
              fontFamily: 'Poppins-SemiBold',
            }}>
            Fill the Details
          </Text>
          <Text
            style={{
              marginLeft: widthToDp('2'),
              fontSize: widthToDp('2.5'),
              color: 'white',
              fontFamily: 'Poppins-Regular',
            }}>
            Fill the Details for a smooth and easy service
          </Text>
        </View>
      </View>
      <View
        style={{marginHorizontal: widthToDp(4), marginTop: heightToDp('2')}}>
        <Text style={styles.textinp}>Aadhar Card Number</Text>
      </View>
      <View style={AdddetailsStyle.inputBox}>
        <TextInput
          placeholder=""
          placeholderTextColor={'gray'}
          style={AdddetailsStyle.input}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={aadharNo}
          onChangeText={text => setAadharNo(text)}
        />
      </View>
      <View style={{marginHorizontal: widthToDp(4)}}>
        <Text style={styles.textinp}>PAN Card Number</Text>
      </View>
      <View style={AdddetailsStyle.inputBox}>
        <TextInput
          placeholder=""
          placeholderTextColor={'gray'}
          style={AdddetailsStyle.input}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={panNo}
          onChangeText={text => setPanNo(text)}
        />
      </View>
      <View style={{marginHorizontal: widthToDp(4)}}>
        <Text style={styles.textinp}>ATM Card Account No</Text>
      </View>
      <View style={AdddetailsStyle.inputBox}>
        <TextInput
          placeholder=""
          placeholderTextColor={'gray'}
          style={AdddetailsStyle.input}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={atmNo}
          onChangeText={text => setAtmNo(text)}
        />
      </View>
      <View style={{marginHorizontal: widthToDp(4)}}>
        <Text style={styles.textinp}>IFSC Number</Text>
      </View>
      <View style={AdddetailsStyle.inputBox}>
        <TextInput
          placeholder=""
          placeholderTextColor={'gray'}
          style={AdddetailsStyle.input}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={ifscNo}
          onChangeText={text => setIfscNo(text)}
        />
      </View>
      <TouchableOpacity
        style={{alignSelf: 'center', marginTop: heightToDp('15')}}
        onPress={() => navigation.navigate('Uploadsoftcopy')}>
        <View style={{width: widthToDp('50'), height: heightToDp('5.5')}}>
          <LinearGradientButton
            name={'Next'}
            textSize={17}
            fontFamily={'Poppins-SemiBold'}
            borderRadius={5}
          />
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

export default AddDetailsScreen;
