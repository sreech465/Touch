import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux';

import { mainView } from '../Assets/styles';
import { Bar } from '../components/StatusBar';
import { ForgotPassword } from '../Redux/reducers/authReducer';
import { IntroStyle, forgotPasswordStyle } from '../Assets/styles';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import { LinearGradientButton } from '../components/LinearGradientButton';

const ForgotPasswordScreen = ({ route, navigation }) => {
  const [number, setNumber] = useState('');
  const dispatch = useDispatch();
  const [error, setError] = useState({ hasError: false, msg: '' });

  const Data = {
    mobile: number,
  };

  const OnResetpass = () => {
    console.log('step1');
    if (number.length === 0) {
      setError({ hasError: true, msg: 'Mobile number must be specified.' });
      return;
    }
    if (number.length < 10) {
      setError({ hasError: true, msg: 'Mobile contains 10 digits.' });
      return;
    }
    dispatch(ForgotPassword(Data))
      .unwrap()
      .then(response => {
        if (response.status === 200) {
          navigation.navigate('VerifyCode', {
            item: 'forgotScreen',
            code: response.data.confirmPwdCode,
            mobile: number,
          });
        } else {
          setError({
            hasError: true,
            msg: response.errors.map(error => error.msg).join('\r\n'),
          });
        }
      })
      .finally(() => setNumber(''));
  };

  const renderErrorMessage = (hasError, errMsg) => {
    return hasError ? (
      <Text
        style={[
          {
            marginTop: heightToDp('1'),
            fontFamily: 'Poppins-Regular',
            fontSize: 12,
            alignSelf: 'flex-start',
            marginHorizontal: widthToDp('5'),
            color: '#FF5F6D',
            marginBottom: heightToDp('-3.5'),
          },
        ]}>
        {errMsg}
      </Text>
    ) : (
      <></>
    );
  };

  return (
    <SafeAreaView style={[mainView]}>
      <KeyboardAvoidingView
        style={[mainView]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView>
             <View style={{ alignItems: 'center' }}>
          <Bar barStyle="light-content" />
          <Image
            source={require('../Assets/assets/Group.png')}
            style={[
              IntroStyle.styleImage,
              { position: 'absolute', opacity: 1 },
            ]}
            resizeMode="contain"
          />
          <Image
            source={require('../Assets/assets/pass.png')}
            style={[
              IntroStyle.styleImage2,
              { position: 'absolute', opacity: 1 },
            ]}
            resizeMode="contain"
          />
            <Text
              style={[
                forgotPasswordStyle.styleLoginText,
                {
                  marginTop: heightToDp('45'),
                  fontFamily: 'Poppins-Regular',
                  fontSize: 25,
                  alignSelf: 'center',
                  marginHorizontal: widthToDp('0'),
                  color: 'white',
                },
              ]}>
              Forget Password?
            </Text>
            <View style={{ marginHorizontal: widthToDp('5') }}>
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
                Please enter your mobile number receive a confirmation code to
                set a new password.
              </Text>
            </View>

            <View style={forgotPasswordStyle.inputBox}>
              <TextInput
                placeholder={'Enter Mobile number'}
                placeholderTextColor={'gray'}
                style={forgotPasswordStyle.input}
                autoCapitalize="none"
                keyboardType={'numeric'}
                textContentType={'telephoneNumber'}
                value={number}
                maxLength={10}
                onChangeText={text => {
                  setNumber(text);
                  setError({ hasError: false, msg: '' });
                }}
              />
            </View>
            {renderErrorMessage(error.hasError, error.msg)}
            <View>
              <Text
                onPress={() => setS(true)}
                style={[
                  forgotPasswordStyle.styleLoginText,
                  {
                    marginTop: heightToDp('-1'),
                    fontWeight: '500',
                    fontSize: 13.5,
                    alignSelf: 'flex-end',
                    marginRight: widthToDp('5'),
                    color: '#FF5F6D',
                  },
                ]}></Text>
            </View>
            <TouchableOpacity
              style={forgotPasswordStyle.styleButton}
              onPress={() => OnResetpass()}>
              <LinearGradientButton name={'Confirm'} />
            </TouchableOpacity>
          
        </View>
          </ScrollView>
       
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
