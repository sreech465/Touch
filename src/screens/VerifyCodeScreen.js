import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  Alert,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  verifyCode,
  addSignUpToken,
} from '../Redux/reducers/authReducer';
import { mainView } from '../Assets/styles';
import { Bar } from '../components/StatusBar';
import {
  IntroStyle,
  forgotPasswordStyle,
} from '../Assets/styles';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import { BlurView } from '@react-native-community/blur';
import { LinearGradientButton } from '../components/LinearGradientButton';
import OTPTextView from 'react-native-otp-textinput';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNOtpVerify from 'react-native-otp-verify';

const VerifyCodeScreen = ({ navigation, route }) => {
  const [number, setNumber] = useState('');
  const [sec, setS] = useState(false);
  const token = useSelector(state => state.user.tokenn);
  console.log('onVerifyscreen', token);
  const { item } = route.params;
  const dispatch = useDispatch();

  const [error, setError] = useState({ hasError: false, msg: "" })

  useEffect(() => {
    if (Platform.OS == 'android') {
      RNOtpVerify.getHash().then(console.log).catch(console.log);

      RNOtpVerify.getOtp()
        .then(_ => RNOtpVerify.addListener(otpHandler))
        .catch(err => console.log(err));
      return () => RNOtpVerify.removeListener();
    }

  }, []);

  const otpHandler = message => {
    console.log('newsms', message);
    const otp = /(\d{6})/g.exec(message)[1];
    setNumber(otp);
    Keyboard.dismiss();
  };

  const data = {
    otp: number,
  };

  const addTokenToStore = () => {
    console.log('.then iS working');
    AsyncStorage.setItem('token', token);
    dispatch(addSignUpToken());
  };

  const onPressverify = () => {
    if (number.length === 0) {
      setError({ hasError: true, msg: "otp must be specified." })
      return;
    }
    if (number.length < 6) {
      //console.log('fgghfh',number.length)
      setError({ hasError: true, msg: "Unable to verify otp." })
      return;
    }

    if (item == 'loginScreen') {
      console.log('code from login screen'),
        dispatch(verifyCode(data)).unwrap().then((res) => {

          if (res.status === 200) {
            setNumber("");
            navigation.navigate("Login")
            Alert.alert("Alert", "your account is  verified successfully.")

          }
          else {
            setError({ hasError: true, msg: res.message })
          }
        }
        );

    }
    else if (item == 'signupScreen') {
      dispatch(verifyCode(data)).unwrap().then(response => {

        if (response.status === 200) {
          addTokenToStore()
          // navigation.navigate("Login")
          // Alert.alert("Alert", "your account is  verified successfully.")
        }
        else {
          setError({ hasError: true, msg: response.message })
        }
      }
      );
    }
    else if (item == 'forgotScreen') {
      dispatch(verifyCode(data)).unwrap().then(response => {
        if (response.status === 200) {
          navigation.navigate('ResetPass', { confirmPwdCode: route.params.code })
        }
        else {
          setError({ hasError: true, msg: response.message })
        }
      }
      );
    }
  };

  const renderErrorMessage = (hasError, errMsg) => {
    return hasError ? (
      <Text
        style={
          {
            fontFamily: 'Poppins-Regular',
            fontSize: 12,
            alignSelf: 'flex-start',
            marginHorizontal: widthToDp('7'),
            color: '#FF5F6D',
          }
        }>
        {errMsg}
      </Text>
    ) : (
      <></>
    )
  }


  return (
    <View style={[mainView, { alignItems: 'center' }]}>
      <Bar barStyle="light-content" />


      <Image
        source={require('../Assets/assets/Group.png')}
        style={[IntroStyle.styleImage, { position: 'absolute', opacity: 1 }]}
        resizeMode="contain"
      />
      <Image
        source={require('../Assets/assets/pass.png')}
        style={[IntroStyle.styleImage2, { alignSelf: 'center' }]}
        resizeMode="contain"
      />
      <View style={[forgotPasswordStyle.styleLoginBox, { padding: 10 }]}>
        <Text
          style={[
            forgotPasswordStyle.styleLoginText,
            {
              marginTop: heightToDp('3'),
              fontFamily: 'Poppins-Regular',
              fontSize: 22,
              alignSelf: 'center',
              marginHorizontal: widthToDp('0'),
              color: 'white',
            },
          ]}>
          Verify mobile number
        </Text>
        <View
          style={{
            marginHorizontal: widthToDp('10'),
            flexDirection: 'row',
            alignSelf: 'center',
          }}>
          {sec ? (
            <Text
              style={[
                forgotPasswordStyle.styleLoginText,
                {
                  marginTop: heightToDp('3'),
                  fontFamily: 'Poppins-Regular',
                  fontSize: 14,
                  alignSelf: 'center',
                  marginHorizontal: widthToDp('0'),
                  color: 'white',
                },
              ]}>
              Please enter your email to receive a confirmation code to set a
              new password.
            </Text>
          ) : (
            <Text
              style={[
                forgotPasswordStyle.styleLoginText,
                {
                  marginTop: heightToDp('3'),
                  fontFamily: 'Poppins-Regular',
                  fontSize: 14,
                  alignSelf: 'center',
                  marginHorizontal: widthToDp('0'),
                  color: 'white',
                },
              ]}>
              Verification code sent to:
            </Text>
          )}
          <View>
            <Text
              style={[
                forgotPasswordStyle.styleLoginText,
                {
                  marginTop: heightToDp('3'),
                  fontWeight: '500',
                  fontSize: 14,
                  alignSelf: 'center',
                  marginHorizontal: widthToDp('1'),
                  color: '#FF5F6D',
                },
              ]}>
              {route.params?.mobile}
            </Text>
          </View>
        </View>
        <OTPInputView
          style={{
            width: widthToDp('80'),
            height: heightToDp('15'),
            alignSelf: 'center',
          }}
          pinCount={6}
          placeholderCharacter={'-'}
          code={number} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
          onCodeChanged={code => {
            setNumber(code);
            setError({ hasError: false, msg: "" })
          }}
          autoFocusOnLoad={false}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled={code => {
            console.log(`Code is ${code}, you are good to go!`);
          }}
        />

        {renderErrorMessage(error.hasError, error.msg)}

        <TouchableOpacity
          style={forgotPasswordStyle.styleButton}
          onPress={() => onPressverify()}>
          <LinearGradientButton name="Confirm Code" />
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
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    margin: 5,
    color: '#ffffff',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
  textInputContainer: {
    marginHorizontal: widthToDp('2.5'),
    marginBottom: heightToDp('3'),
  },
  roundedTextInput: {
    borderRadius: 5,
    borderWidth: 2,
    height: heightToDp('8'),
  },
  underlineStyleBase: {
    width: 45,
    height: 45,
    borderWidth: 1.5,
    borderRadius: 5,
    borderColor: 'gray',
  },

  underlineStyleHighLighted: {
    borderColor: 'white',
  },
});
export default VerifyCodeScreen;
