import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux';
import { signupUser } from '../Redux/reducers/authReducer';
import Icon from 'react-native-vector-icons/dist/Feather';
import Icon1 from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/dist/Ionicons';
import Icon3 from 'react-native-vector-icons/dist/AntDesign';
import { mainView } from '../Assets/styles';
import { Bar } from '../components/StatusBar';
import { SignUpStyle, IntroStyle, loginStyle } from '../Assets/styles';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import messaging from '@react-native-firebase/messaging';
import { getUniqueId } from 'react-native-device-info';
import { checkPermission, permissionAlert, PERMISSIONS } from '../Assets/helpers/Permissions';
import { Image as ImageCompressor } from 'react-native-compressor';

const SignUpScreen = ({ navigation }) => {

  const [phone, setPhone] = useState(false);

  const initialState = {
    full_name: { value: "", hasError: false, errorMessage: "" },
    user_name: { value: "", hasError: false, errorMessage: "" },
    gender: { value: "", hasError: false, errorMessage: "" },
    mobile: { value: "", hasError: false, errorMessage: "" },
    password: { value: "", hasError: false, errorMessage: "" },
  }

  const [fieldValues, setFieldValues] = useState(initialState)

  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);

  const [isPhotoSelectVisible, setIsPhotoSelectVisible] = useState(false);

  const [image, setImage] = useState({})

  const dispatch = useDispatch();

  const compressImage = async (uri) => await ImageCompressor.compress(
    uri,
    {
      compressionMethod: 'auto',
      quality: 0.5,
    },
  );

  const handleChange = (fieldName, value) => {
    setFieldValues((prev) => ({ ...prev, [fieldName]: { value, hasError: false, errorMessage: "" }, }));
  }


  const handleSignup = async () => {

    console.log('Signup_step1');
    const photoname = 'photo' + Date.now().toString() + '.jpg';

    const imageData = image.uri ? {
      uri: await compressImage(image.uri),
      type: "image/jpeg",
      name: photoname,
    } : ""

    // input validations
    const optionalInputs = {
      image: imageData
    };

    const requiredInputs = {
      full_name: fieldValues.full_name.value,
      user_name: fieldValues.user_name.value,
      gender: fieldValues.gender.value,
      mobile: fieldValues.mobile.value,
      password: fieldValues.password.value,
    }

    let fieldNames = {
      full_name: "Name",
      user_name: "Username",
      gender: "Gender",
      mobile: "Mobile",
      password: "Password",
    }


    Object.keys(requiredInputs).forEach(key => {
      if (!Boolean(requiredInputs[key])) {
        setFieldValues((prev) => ({ ...prev, [key]: { ...prev[key], hasError: true, errorMessage: `${fieldNames[key]} must be specified.` } }))
      }
      else {
        setFieldValues((prev) => ({ ...prev, [key]: { ...prev[key], hasError: false, errorMessage: "" } }))
      }
    })

    const isPasswordValid = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,16}$/.test(requiredInputs.password);
    const passwordErrorMsg = "Password should contain 1 uppercase,1 lower case,1 special character and minimum 6 character length."

    if (!(requiredInputs.full_name.length === 0) && (requiredInputs.full_name.length < 3)) {
      setFieldValues((prev) => ({ ...prev, full_name: { ...prev["full_name"], hasError: true, errorMessage: `valid Username must be specified.` } }))
    }
    if (!(requiredInputs.user_name.length === 0) && (requiredInputs.user_name.length < 3)) {
      setFieldValues((prev) => ({ ...prev, user_name: { ...prev["user_name"], hasError: true, errorMessage: `valid Name must be specified.` } }))
    }

    if (!(requiredInputs.mobile.length === 0) && (requiredInputs.mobile.length < 10)) {
      setFieldValues((prev) => ({ ...prev, mobile: { ...prev["mobile"], hasError: true, errorMessage: "Mobile contains 10 digits." } }))
    }
    if (!(requiredInputs.password.length === 0) && !isPasswordValid) {
      setFieldValues((prev) => ({ ...prev, password: { ...prev["password"], hasError: true, errorMessage: passwordErrorMsg } }))
    }


    const isRequiredInputsFilled = Object.keys(requiredInputs).map(key => fieldValues[key].hasError);

    console.log('Signup_step1', Object.keys(requiredInputs).map(key => fieldValues[key].hasError), isRequiredInputsFilled.includes(true));

    const registerDevice = async () => {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      return token;
    }

    const deviceData = {
      udid: await getUniqueId().then(uniqueId => uniqueId),
      fcm_token: await registerDevice()
    }

    const body = { ...requiredInputs, ...optionalInputs, ...deviceData }

    if (Object.values(requiredInputs).every(Boolean) && !isRequiredInputsFilled.includes(true)) {
      dispatch(signupUser({ ...body })).unwrap().then((res) => {
        console.log("signup ", res)
        if (res.status === 200) {
          navigation.navigate('VerifyCode', { item: 'signupScreen', mobile: fieldValues.mobile.value })
          return;
        } else if (res.status === 422) {
          res.errors.map(err => {
            setFieldValues((prevErr) => ({ ...prevErr, [err.param]: { value: fieldValues[err.param].value, hasError: true, errorMessage: err.msg } }))
          })
        }
      }
      );
    }
  };

  useEffect(() => {
    Platform.OS === 'ios' ? setPhone(true) : setPhone(false);
  }, []);



  const OpenPhotos = () => {
    const options = {
      noData: true,
      mediaType: 'photo',
    };

    const permissions =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

    const alertMsg = 'Please allow permission to access storage.';

    checkPermission(permissions).then(isPermissionGranted => {
      if (isPermissionGranted) {
        launchImageLibrary(options, res => {
          setIsPhotoSelectVisible(!isPhotoSelectVisible)
          console.log('Response = ', res.assets);
          if (res.didCancel) {
            console.log('User cancelled image picker');
          } else if (res.errorCode) {
            console.log('ImagePicker Error: ', res.errorMessage);
          } else {
            let source = res.assets;
            setImage(source[0]);
            console.log('Response2 = ', source[0].uri);
          }
        })
      }
      else {
        permissionAlert(alertMsg);
      }
      setIsPhotoSelectVisible(!isPhotoSelectVisible)
    });

  };


  const openCamera = () => {
    var options = {
      mediaType: 'photo',
      noData: true,
    };

    const permissions =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const alertMsg = 'Please allow permission to access camera.';

    checkPermission(permissions).then((isPermissionGranted) => {
      if (isPermissionGranted) {
        launchCamera(options, (res) => {
          setIsPhotoSelectVisible(!isPhotoSelectVisible)
          console.log('Response = ', res.assets);
          if (res.didCancel) {
            console.log('User cancelled image picker');
          } else if (res.errorCode) {
            console.log('ImagePicker Error: ', res.errorMessage);
          } else {
            let source = res.assets;
            setImage(source[0]);
            console.log('Response2 = ', source[0].uri);
          }
        });
      }
      else {
        permissionAlert(alertMsg);
      }
      setIsPhotoSelectVisible(!isPhotoSelectVisible);
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


  const getImageSelectModal = () => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isPhotoSelectVisible}
          onRequestClose={() => {
            setIsPhotoSelectVisible(!isPhotoSelectVisible);
          }}
        >
          <View style={StyleSheet.flatten([styles.centeredView, styles.photoSelectcenteredView])}>
            <View style={StyleSheet.flatten([styles.modalView, styles.photoSelectModalView])}>
              <TouchableOpacity
                style={StyleSheet.flatten([styles.button, styles.buttonOpen, styles.photoSelectOptionButton])}
                onPress={() => OpenPhotos()}
              >
                <Text style={styles.textStyle}>Choose from Library</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={StyleSheet.flatten([styles.button, styles.buttonOpen, styles.photoSelectOptionButton])}
                onPress={() => openCamera()}
              >
                <Text style={styles.textStyle}>Choose from Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={StyleSheet.flatten([styles.closebutton, styles.buttonClose, styles.photoSelectCancel])}
                onPress={() => setIsPhotoSelectVisible(!isPhotoSelectVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>)
  }

  const genderSelectionModal = () => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isGenderModalVisible}
          onRequestClose={() => {
            setIsGenderModalVisible(!isGenderModalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  marginHorizontal: widthToDp('10'),
                  marginTop: heightToDp('3'),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => { setIsGenderModalVisible(!isGenderModalVisible), handleChange("gender", 'Male') }}>
                  <Text style={styles.textStyle}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => { setIsGenderModalVisible(!isGenderModalVisible), handleChange("gender", 'Female') }}>
                  <Text style={styles.textStyle}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };


  return (
    <SafeAreaView style={[mainView]}>
      <KeyboardAvoidingView
        style={[mainView]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
          <View style={{ alignItems: 'center' }}>
            <Bar barStyle="light-content" />

            <Image
              source={require('../Assets/assets/Group.png')}
              style={[
                IntroStyle.styleImage,
                { position: 'absolute', opacity: 0.8 },
              ]}
              resizeMode="contain"
            />

            <Text
              style={[
                SignUpStyle.styleLoginText,
                {
                  alignSelf: 'flex-end',
                  marginTop: phone ? heightToDp('2') : heightToDp('6'),
                  fontFamily: 'Poppins-Regular',
                },
              ]}>
              Create
            </Text>
            <Text
              style={[
                SignUpStyle.styleLoginText,
                {
                  alignSelf: 'flex-end',
                  marginTop: heightToDp('-2'),
                  fontSize: widthToDp('9.8'),
                  fontFamily: 'Poppins-SemiBold',
                },
              ]}>
              Account
            </Text>

            <View
              style={{
                padding: 10, top: phone ? heightToDp('11') : heightToDp('17'), backgroundColor: '#FFFFFF20',
                maxHeight: "100%",
                width: widthToDp('80'),
                borderRadius: 20,
                top: heightToDp('0'),
              }}>
              <View style={{ alignSelf: 'center' }}>
                {image.uri ? <TouchableOpacity onPress={() => setIsPhotoSelectVisible(true)}>
                  <View
                    style={[
                      SignUpStyle.cameraOuterBox,
                      { width: widthToDp('20'), height: heightToDp('9'), backgroundColor: 'white', borderWidth: 3 },
                    ]}>
                    <Image
                      style={{
                        width: widthToDp('20'),
                        height: heightToDp('9'),
                        resizeMode: 'contain',
                        borderRadius: 10,
                        marginTop: heightToDp('0.3'),
                        borderColor: '#FF5F6D',
                        borderWidth: 1.5
                      }}
                      source={{
                        uri: image.uri,
                      }}
                    />
                  </View>
                </TouchableOpacity>
                  :
                  <Pressable onPress={() => setIsPhotoSelectVisible(true)}>
                    <View style={SignUpStyle.cameraOuterBox}>
                      <Icon1 name="camera-plus" size={25} color="#F5F5F5" />
                    </View>
                  </Pressable>
                }

              </View>
              <View
                style={{
                  alignSelf: 'center',
                  marginTop: heightToDp('1.5'),
                  marginBottom: heightToDp('-1.8'),
                }}>
                <Text
                  style={{
                    color: '#F5F5F5',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Upload profile photo
                </Text>
              </View>
              <View>
                <View style={SignUpStyle.inputBox}>
                  <Icon1
                    name="email-outline"
                    size={heightToDp('2')}
                    color="#F5F5F5"
                  />
                  <TextInput
                    placeholder="Mobile number"
                    placeholderTextColor={'#F5F5F5'}
                    style={SignUpStyle.input}
                    autoCapitalize="none"
                    keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                    value={fieldValues.mobile.value}
                    onChangeText={text => handleChange("mobile", text)}
                    maxLength={10}
                  />
                </View>
                {renderErrorMessage(fieldValues.mobile.hasError, fieldValues.mobile.errorMessage)}
                <View style={SignUpStyle.inputBox}>
                  <Icon name="user" size={heightToDp('2')} color="#F5F5F5" />
                  <TextInput
                    placeholder="Full Name"
                    placeholderTextColor={'#F5F5F5'}
                    style={SignUpStyle.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={fieldValues.full_name.value}
                    onChangeText={text => handleChange("full_name", text)}
                  />
                </View>
                {renderErrorMessage(fieldValues.full_name.hasError, fieldValues.full_name.errorMessage)}
                <View style={SignUpStyle.inputBox}>
                  <Icon name="user" size={heightToDp('2')} color="#F5F5F5" />
                  <TextInput
                    placeholder="User Name"
                    placeholderTextColor={'#F5F5F5'}
                    style={SignUpStyle.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={fieldValues.user_name.value}
                    onChangeText={text => handleChange("user_name", text)}
                  />
                </View>
                {renderErrorMessage(fieldValues.user_name.hasError, fieldValues.user_name.errorMessage)}
                <TouchableOpacity onPress={() => setIsGenderModalVisible(true)} style={[SignUpStyle.inputBox, { alignItems: 'center' }]}>
                  <Icon name="user" size={heightToDp('2')} color="#F5F5F5" />

                  <View>
                    <Text style={{ marginVertical: widthToDp('2.2'), marginLeft: widthToDp('6'), color: 'white', fontFamily: 'Poppins-Regular', fontSize: heightToDp('1.5') }}>
                      {fieldValues.gender.value ? fieldValues.gender.value : "Gender"}
                    </Text>
                  </View>
                </TouchableOpacity>
                {renderErrorMessage(fieldValues.gender.hasError, fieldValues.gender.errorMessage)}
                <View style={SignUpStyle.inputBox}>
                  <Icon2
                    name="md-key-outline"
                    size={heightToDp('2')}
                    style={{ transform: [{ rotateX: '180deg' }] }}
                    color="#F5F5F5"
                  />
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor={'#F5F5F5'}
                    style={SignUpStyle.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={fieldValues.password.value}
                    onChangeText={text => handleChange("password", text)}
                  />
                </View>
                {renderErrorMessage(fieldValues.password.hasError, fieldValues.password.errorMessage)}
                <TouchableOpacity onPress={handleSignup}>
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
            </View>
            <View
              style={{
                marginHorizontal: widthToDp('15'),
                marginVertical: phone ? heightToDp('1') : heightToDp('1'),
              }}>
              <Text
                onPress={() => navigation.navigate('TermsScreen')}
                style={{
                  color: '#FF5F6D',
                  textAlign: 'center',
                  fontSize: 13,
                  fontFamily: 'Poppins-Regular',
                }}>
                By signing up, you agree to our Terms, Data Policy CooKies
                Policy
              </Text>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {genderSelectionModal()}
      {getImageSelectModal()}

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
    alignSelf: 'center',
    bottom: heightToDp('-5'),
  },
  photoSelectcenteredView: {
    bottom: heightToDp('-5'),
  },
  modalView: {
    margin: 10,
    backgroundColor: '#181818',
    borderRadius: 20,
    paddingTop: heightToDp('4'),
    width: widthToDp('101'),
    height: heightToDp('25'),
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
  photoSelectModalView: {
    height: heightToDp('35'),
    backgroundColor: "#27314F",
    alignItems: "center",
  },
  photoSelectCancel: {
    alignSelf: 'center'
  },

  button: {
    borderRadius: 10,
    paddingVertical: heightToDp('2'),
    elevation: 2,
    marginBottom: heightToDp('2'),
    width: widthToDp('35'),
  },
  photoSelectOptionButton: {
    width: widthToDp("60")
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
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    fontSize: heightToDp('1.7'),
  },
});
export default SignUpScreen;
