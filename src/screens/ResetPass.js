import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { loginStyle, mainView } from '../Assets/styles';
import { Bar } from '../components/StatusBar';
import {
  IntroStyle,
  forgotPasswordStyle,
  VerifyCodeStyle,
} from '../Assets/styles';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import { BlurView } from '@react-native-community/blur';
import { LinearGradientButton } from '../components/LinearGradientButton';
import { ConfirmPassword } from '../Redux/reducers/authReducer';
import { StackActions } from '@react-navigation/native';

const ResetPass = ({ navigation, route }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { confirmPwdCode } = route.params;
  const [sec, setS] = useState(false);
  const [errors, setErrors] = useState({ hasError: false, msg: "" })
  const dispatch = useDispatch();

  console.log('codeisfromFPW', confirmPwdCode);

  const data = {
    password: password,
    confirm_password: confirmPassword,
    confirm_pwd_code: confirmPwdCode,
  };

  const onPressChangePass = () => {

    if (password.length === 0 || confirmPassword.length === 0) {
      setErrors({ hasError: true, msg: "password must be spcified." })
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ hasError: true, msg: "New Password and confirm password should be same." })
      return;
    }

    const isPasswordValid = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,16}$/.test(password);
    const passwordErrorMsg = "Password should contain 1 uppercase,1 lower case,1 special character and minimum 6 character length."

    if (!isPasswordValid) {
      setErrors({ hasError: true, msg: passwordErrorMsg })
      return;
    }

    dispatch(ConfirmPassword(data))
      .unwrap()
      .then(response => {
        console.log('#########', response);
        if (response.status === 200) {
          setS(true);
          // Alert.alert("Alert", res.message)
        }
        else {
          Alert.alert("Alert", JSON.stringify(response))
        }
      });
  };

  const renderErrorMessage = (hasError, errMsg) => {
    return hasError ? (
      <Text
        style={
          {
            marginTop: heightToDp('1'),
            fontFamily: 'Poppins-Regular',
            fontSize: 12,
            alignSelf: 'flex-start',
            marginHorizontal: widthToDp('5'),
            color: '#FF5F6D',
            marginBottom: heightToDp('-3.5'),
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
      <View style={[forgotPasswordStyle.styleLoginBox2, { padding: 10 }]}>
        <Text
          style={[
            forgotPasswordStyle.styleLoginText,
            {
              marginTop: heightToDp('3'),
              fontFamily: 'Poppins-Bold',
              fontSize: 22,
              alignSelf: 'flex-start',
              marginHorizontal: widthToDp('6'),
              color: 'white',
            },
          ]}>
          New Password
        </Text>
        <View
          style={{ marginHorizontal: widthToDp('6'), alignSelf: 'flex-start' }}>
          {sec ? (
            <Text
              style={[
                forgotPasswordStyle.styleLoginText,
                {
                  marginTop: heightToDp('0'),
                  fontFamily: 'Poppins-Regular',
                  fontSize: 14,
                  alignSelf: 'center',
                  marginHorizontal: widthToDp('0'),
                  color: '#4BB543',
                },
              ]}>
              New password saved successfully.
            </Text>
          ) : (
            <Text
              style={[
                forgotPasswordStyle.styleLoginText,
                {
                  marginTop: heightToDp('0'),
                  fontFamily: 'Poppins-Regular',
                  fontSize: 14,
                  alignSelf: 'center',
                  marginHorizontal: widthToDp('0'),
                  color: 'white',
                },
              ]}>
              Please Write Your New Password.
            </Text>
          )}
        </View>
        <View
          style={[
            loginStyle.inputBox,
            { marginTop: heightToDp('2'), borderWidth: 0.8, borderRadius: 5 },
          ]}>
          <TextInput
            placeholder="Password"
            placeholderTextColor={'gray'}
            style={loginStyle.input}
            autoCapitalize="none"
            value={password}
            onChangeText={text => { setPassword(text); setErrors({ hasError: false }) }}
          />
        </View>
        <View
          style={[
            loginStyle.inputBox,
            { marginTop: heightToDp('2'), borderWidth: 0.8, borderRadius: 5 },
          ]}>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor={'gray'}
            style={loginStyle.input}
            autoCapitalize="none"
            value={confirmPassword}
            onChangeText={text => { setConfirmPassword(text); setErrors({ hasError: false }) }}
          />
        </View>
        {renderErrorMessage(errors.hasError, errors.msg)}

        {sec ? (
          <TouchableOpacity
            style={[
              forgotPasswordStyle.styleButton,
              { marginTop: heightToDp('8') },
            ]}
            onPress={() => navigation.dispatch(StackActions.popToTop())}>
            <LinearGradientButton name="Try Login" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              forgotPasswordStyle.styleButton,
              { marginTop: heightToDp('8') },
            ]}
            onPress={() => onPressChangePass()}>
            <LinearGradientButton name="Confirm Password" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ResetPass;
