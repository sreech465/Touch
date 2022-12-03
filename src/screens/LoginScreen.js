import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { APP_NAME, ACC_NAME } from '../Constant';
import { Voximplant } from 'react-native-voximplant';
import { useDispatch, useSelector } from 'react-redux';
import {
  login,
  signinUser,
  signupUser,
  getVerifyed,
} from '../Redux/reducers/authReducer';
import Icon from 'react-native-vector-icons/dist/Feather';
import Icon1 from 'react-native-vector-icons/dist/Ionicons';
import { addVoxData } from '../Redux/reducers/authReducer'
import { mainView } from '../Assets/styles';
import { Bar } from '../components/StatusBar';
import { loginStyle, IntroStyle, SignUpStyle } from '../Assets/styles';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import Icon3 from 'react-native-vector-icons/dist/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { LoadingView } from '../components/LoadingView';
import messaging from '@react-native-firebase/messaging';
import { getUniqueId } from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';
import { isResponseOk } from '../Assets/helpers/ApiRoute';

const LoginScreen = ({ navigation }) => {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [checkU, setCheckU] = useState(false);
  const [checkP, setCheckP] = useState(false);
  // const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState({ msg: "", hasError: false });
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false)
  const voximplant = Voximplant.getInstance();
  const Token = useSelector(state => state.user);
  // const loading = useSelector(state => state.user.loading);
  const [phone, setPhone] = useState(false);


  useEffect(() => {
    username.length > 0 && setCheckU(false);
    password.length > 0 && setCheckP(false);
    Platform.OS === 'ios' ? setPhone(true) : setPhone(false);
    setError({ msg: '', hasError: false })
  }, [username.length, password.length]);

  const connect = async (userId) => {
    console.log('data3---------------')

    try {
      const status = await voximplant.getClientState();
      console.log('datass---------------2', status)

      if (status === Voximplant.ClientState.DISCONNECTED) {
        console.log('data1---------------')

        await voximplant.connect().then(() => {
          console.log('data1zzz---------------')
          signIn(userId)
        })

      } else if (status === Voximplant.ClientState.LOGGED_IN) {
        signIn()
        // redirectHome();
      }
    }
    catch (e) {

    }
  }

  const signIn = async (userId) => {
    console.log('------------checking----------')
    try {

      const fqUsername = `${'0' + userId}@${APP_NAME}.${ACC_NAME}.voximplant.com`;

      console.log('------------checking----------', fqUsername)

      const x = await voximplant.login(fqUsername, 'voxpswd0' + userId);
      dispatch(addVoxData(x))

      console.log('ddgfdg', x, fqUsername);
    } catch (e) {
      console.log(e);
      Alert.alert(e.name, `Error code: ${e.code}`);
    }
  };

  const addUserToFirebase = async user => {
    const usersRef = firestore()
      .collection("users").doc(user.userid.toString())

    const isUserExist = async () => {
      const doc = await usersRef.get();
      if (!doc.exists) {
        console.log('No such document!', doc.exists);
        return false;
      } else {
        console.log('Document data:', doc, doc.data());
        return true;
      }
    }
    const isAlreadyAdded = await isUserExist();
    if (!isAlreadyAdded) {
      usersRef.set(user)
        .then(() => console.log('added user to firebase'));
    }

  };


  const OnPressLogin = async () => {
    const Data = {
      mobile: username,
      password: password,
    };
    console.log('step1');
    if (username.length === 0 || password.length === 0) {
      if (username.length === 0) {
        setCheckU(true);
      }
      if (password.length === 0) {
        setCheckP(true);
      }
      return;
    }

    if (!checkU && !checkP) {

      const registerDevice = async () => {
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        return token;
      }

      const deviceData = {
        udid: await getUniqueId().then(uniqueId => uniqueId),
        fcm_token: await registerDevice()
      }

      dispatch(signinUser({ ...Data, ...deviceData }, (userId) => (userId)))
        .unwrap()
        .then(response => {
          if (isResponseOk(response)) {
            addUserToFirebase(response.data.user);
            connect(String(response.data.user.userid));
          }
          else if (response.data == 'Mobile number not verified.') {
            setModalVisible(true);
          } else if (response.status == 422 && response?.errors) {
            console.log("test", response.errors.map((error) => error.msg))
            setError({ msg: response.errors.map((error) => error.msg).join("\r\n"), hasError: true });
          }
          else if (response.status == 400) {
            setError({ msg: response.data, hasError: true });
          }
        });
    }
  };

  const VerifyAccount = () => {
    const Data = {
      mobile: username,
    };
    dispatch(getVerifyed(Data))
      .unwrap()
      .then(response => {
        console.log('before', response);
        if (response.message == 'code sent successfully.') {
          setModalVisible(!modalVisible);
          navigation.navigate('VerifyCode', { item: "loginScreen" });
        }
      });
  };

  const ReVerify = () => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text
                style={[styles.textStyle, { marginVertical: widthToDp('5') }]}>
                You are already registered verify this account!
              </Text>
              <TouchableOpacity
                style={[styles.button, styles.buttonOpen]}
                onPress={() => VerifyAccount()}>
                <Text style={styles.textStyle}>Verify your account</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.closebutton, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <SafeAreaView style={[mainView]}>
      <View>
        <LoadingView modalVisible={loading} />
      </View>
      <KeyboardAvoidingView style={[mainView]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <Bar barStyle="light-content" />

            <Image
              source={require('../Assets/assets/Group.png')}
              style={[IntroStyle.styleImage, { position: 'absolute', opacity: 0.8 }]}
              resizeMode="contain"
            />
            <Image
              style={{
                width: widthToDp('40'),
                height: heightToDp('4'),
                resizeMode: 'cover',
                marginTop: phone ? heightToDp('4.5') : heightToDp('6.5')
              }}
              source={require("../Assets/assets/touchh.png")}
            />
            <View
              style={{
                backgroundColor: '#C0C0C0',
                height: phone
                  ? heightToDp('46') : heightToDp('51'),
                width: widthToDp('80'),
                position: 'absolute',
                top: phone ? heightToDp('20') : heightToDp('24'),
                bottom: 0,
                opacity: 0.2,
                borderRadius: 22,
                alignSelf: 'center',
              }}></View>
            <View style={[loginStyle.styleLoginBox, { padding: 2, top: phone ? heightToDp('19') : heightToDp('24'), }]}>
              <View
                style={{ alignSelf: 'flex-end', marginHorizontal: widthToDp('5') }}>
                <Text
                  style={[
                    loginStyle.styleLoginText,
                    { fontFamily: 'Poppins-Bold' },
                  ]}>
                  Welcome
                </Text>
              </View>
              <View style={loginStyle.inputBox}>
                <Icon name="user" size={heightToDp('2')} color="white" />
                <TextInput
                  placeholder="User Name/Mobile number"
                  placeholderTextColor={'white'}
                  style={loginStyle.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  value={username}
                  onChangeText={text => setU(text)}
                // maxLength={10}
                />
              </View>
              {checkU ? (
                <Text
                  style={[
                    styles.styleLoginText,
                    {
                      marginTop: heightToDp('1'),
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      alignSelf: 'flex-start',
                      marginHorizontal: widthToDp('5'),
                      color: '#FF5F6D',
                      marginBottom: heightToDp('-3.5')
                    },
                  ]}>
                  Username is required
                </Text>
              ) : (
                <></>
              )}

              <View style={[loginStyle.inputBox, { marginTop: heightToDp('2.5') }]}>
                <Icon1 name="key-outline" size={heightToDp('2')} color="white" />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor={'white'}
                  style={loginStyle.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  value={password}
                  onChangeText={text => setP(text)}
                />
              </View>
              {checkP ? (
                <Text
                  style={[
                    styles.styleLoginText,
                    {
                      marginTop: heightToDp('1'),
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      alignSelf: 'flex-start',
                      marginHorizontal: widthToDp('5'),
                      color: '#FF5F6D',
                      marginBottom: heightToDp('-3.5')
                    },
                  ]}>
                  Password is required
                </Text>
              ) : (
                <></>
              )}
              {error.hasError ? (
                <Text
                  style={[
                    styles.styleLoginText,
                    {
                      marginTop: heightToDp('1'),
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      alignSelf: 'flex-start',
                      marginHorizontal: widthToDp('5'),
                      color: '#FF5F6D',
                      marginBottom: heightToDp('-3.5')
                    },
                  ]}>
                  {error.msg}
                </Text>
              ) : (
                <></>
              )}
              <Text
                onPress={() => navigation.navigate('ForgotPassword')}
                style={[
                  loginStyle.styleLoginText,
                  {
                    marginTop: heightToDp('3.5'),
                    fontFamily: 'Poppins-Regular',
                    fontSize: 12,
                    alignSelf: 'flex-end',
                    marginHorizontal: widthToDp('5'),
                    color: '#FF5F6D',
                  },
                ]}>
                Forgot Password
              </Text>

              <TouchableOpacity onPress={() => OnPressLogin()}>
                <View style={loginStyle.buttonStyleOuterCircle}>
                  <LinearGradient
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0.0, y: 0.0 }}
                    locations={[0, 0.32, 1]}
                    colors={['#FFAB5A', '#FF5F6D', '#FF5F6D']}
                    style={styles.linearGradient}>
                    <Icon3
                      name="arrowright"
                      size={heightToDp('3')}
                      color="#F5F5F5"
                    />
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: widthToDp('20'),
                marginTop: phone ? heightToDp('70') : heightToDp('73'),
              }}>
              <Text
                // onPress={() => props.navigation.navigate('SignUp')}
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 12,
                  fontFamily: 'Poppins-Regular',
                }}>
                Don't have an account ?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text
                  style={{
                    color: '#FF5F6D',
                    textAlign: 'center',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: widthToDp('17'),
                marginTop: heightToDp('5'),
              }}>
              <Text
                onPress={() => navigation.navigate('TermsScreen')}
                style={{
                  color: '#FF5F6D',
                  textAlign: 'center',
                  fontSize: 13,
                  fontFamily: 'Poppins-Regular',
                }}>
                By signing up, you agree to our Terms, Data Policy and CooKies
                Policy
              </Text>
            </View>
          </View>
        </ScrollView>

        {ReVerify()}
      </KeyboardAvoidingView>
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
    height: 60,
    width: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleLoginText: {
    fontSize: widthToDp('9'),
    color: 'while',
    marginTop: heightToDp('0'),
    fontFamily: 'Poppins-ExtraLight',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: heightToDp('-6'),
    alignSelf: 'center'
  },
  modalView: {
    margin: 10,
    backgroundColor: '#171717',
    borderRadius: 20,
    padding: heightToDp('3'),
    width: widthToDp('102'),
    height: heightToDp('35'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderColor: '#FF5F6D',
    borderWidth: 2,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    paddingVertical: heightToDp('3'),
    elevation: 2,
    marginBottom: heightToDp('2'),
    width: widthToDp('60'),
  },
  closebutton: {
    borderRadius: 10,
    paddingVertical: heightToDp('1'),
    elevation: 2,
    marginBottom: heightToDp('2'),
    width: widthToDp('30'),
  },
  buttonOpen: {
    backgroundColor: '#FF5F6D',
  },
  buttonClose: {
    backgroundColor: '#FF5F6D',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
export default LoginScreen;
