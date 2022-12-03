import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { mainView } from '../Assets/styles';
import { Bar } from '../components/StatusBar';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import Icon1 from 'react-native-vector-icons/dist/AntDesign';
import {
  EditProfileStyle,
  SignUpStyle,
  IntroStyle,
  styleLoginText,
} from '../Assets/styles';
import Icon3 from 'react-native-vector-icons/dist/Feather';
import { Updateuser } from '../Redux/reducers/userReducer';
import { useDispatch, useSelector } from 'react-redux';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import {
  checkPermission,
  permissionAlert,
  PERMISSIONS,
} from '../Assets/helpers/Permissions';
import { Image as ImageCompressor } from 'react-native-compressor';
import { updateUserData } from '../Redux/reducers/authReducer';
import { LoadingView } from '../components/LoadingView';
const EditProfileScreen = props => {
  const user = useSelector(state => state.user.userdata);
  const dispatch = useDispatch();

  const {
    profile_pic,
    username,
    full_name,
    website,
    bio: bioData,
  } = user || {};

  const [fullName, setFullName] = useState(full_name);
  const [userName, setUserName] = useState(username);
  const [webSite, setWebsite] = useState(website ? website : '');
  const [bio, setBio] = useState(bioData ? bioData : '');
  const [image, setImage] = useState({ uri: profile_pic });
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bioInputHeight, setBioInputHeight] = useState(43);

  const initialErrorState = {
    full_name: { hasError: false, errMsg: '' },
    user_name: { hasError: false, errMsg: '' },
    website: { hasError: false, errMsg: '' },
    bio: { hasError: false, errMsg: '' },
  };
  const [errors, setErrors] = useState(initialErrorState);

  useEffect(() => {
    if (bio?.length > 50) {
      setBioInputHeight(70);
    }
  }, []);

  const onChangeResetError = fieldName => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: { hasError: false, errMsg: '' },
    }));
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    const compressImage = async uri =>
      await ImageCompressor.compress(uri, {
        compressionMethod: 'auto',
        quality: 0.5,
      });

    const photoname = 'photo' + Date.now().toString() + '.jpg';

    const newdata = {
      full_name: fullName,
      user_name: userName,
      image: {
        uri: image.uri.includes('http')
          ? image.uri
          : await compressImage(image.uri),
        type: 'image/jpeg',
        name: photoname,
      },
      website: webSite,
      profile_desc: bio.trim(),
    };

    dispatch(Updateuser(newdata))
      .unwrap()
      .then(res => {
        const isProfileUpdated = res.status === 200;

        if (isProfileUpdated) {
          const { data } = res;
          const updatedData = {
            full_name:
              data.first_name + ' ' + (data.last_name ? data.last_name : ''),
            username: data.username,
            profile_pic: data.profile_pic,
            bio: data.bio,
            website: data.website,
          };
          dispatch(updateUserData(updatedData));
        }
        if (isProfileUpdated) {
          props.navigation.goBack();
        }

        if (res.status === 422) {
          res.errors.map(err => {
            setErrors(prev => ({
              ...prev,
              [err.param]: {
                ...prev[err.param],
                errMsg: err.msg,
                hasError: true,
              },
            }));
          });
        }
      })
      .finally(() => setLoading(false));
  };

  //console.log('errors', errors);

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
      } else {
        permissionAlert(alertMsg);
      }
      setModalVisible(!modalVisible);
    });
  };

  const openCamera = () => {
    setModalVisible(!modalVisible);
    var options = {
      mediaType: 'photo',
      noData: true,
    };

    const permissions =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const alertMsg = 'Please allow permission to access camera.';
    console.log('step0',permissions)

    checkPermission(permissions).then(isPermissionGranted => {
      console.log('step1')
      if (isPermissionGranted) {
        console.log('step3')

        launchCamera(options, res => {
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
      } else {
        console.log('step4')

        permissionAlert(alertMsg);
      }
      console.log('step5')

     setModalVisible(!modalVisible);
    });
  };

  const imageSelectModel = () => {
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
              <TouchableOpacity
                style={[styles.button, styles.buttonOpen]}
                onPress={() => OpenPhotos()}>
                <Text style={styles.textStyle}>Choose from Library</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonOpen]}
                onPress={() => openCamera()}>
                <Text style={styles.textStyle}>Choose from Camera</Text>
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
      <KeyboardAvoidingView
        style={[mainView]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView>
          <View>
            <Bar barStyle="light-content" />

            <Image
              source={require('../Assets/assets/MaskGroup26.png')}
              style={[
                IntroStyle.styleImage,
                { position: 'absolute', opacity: 1, left: widthToDp(-33) },
              ]}
              resizeMode="contain"
            />
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: widthToDp('4'),
                marginTop: heightToDp('2'),
                justifyContent: 'space-between',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable onPress={() => props.navigation.goBack()}>
                  <Icon1
                    name="close"
                    size={heightToDp('3.5')}
                    color="#F5F5F5"
                  />
                </Pressable>
                <Text
                  style={{
                    marginLeft: widthToDp('3'),
                    fontSize: widthToDp('5.7'),
                    color: 'white',
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  {'Edit Profile'}
                </Text>
              </View>
              <View>
                <Icon3
                  onPress={handleUpdateProfile}
                  name="check"
                  size={heightToDp('3.5')}
                  color="#FFAB5A"
                />
              </View>
            </View>
            <ScrollView>
              <View style={{ alignSelf: 'center', marginTop: heightToDp('2') }}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <View
                    style={[
                      SignUpStyle.cameraOuterBox,
                      {
                        width: widthToDp('25'),
                        height: heightToDp('12.5'),
                        backgroundColor: 'white',
                        borderWidth: 3,
                      },
                    ]}>
                    <Image
                      style={{
                        width: widthToDp('23.2'),
                        height: heightToDp('11.4'),
                        resizeMode: 'center',
                        borderRadius: 10,
                        marginTop: heightToDp('0.3'),
                      }}
                      source={{
                        uri: image.uri,
                      }}
                      resizeMode="cover"
                    />
                  </View>
                </TouchableOpacity>

                <Pressable
                  style={{ position: 'absolute', bottom: -9, right: -13 }}
                  onPress={() => setModalVisible(true)}>
                  <Image
                    style={{
                      width: widthToDp('7'),
                      height: heightToDp('3.7'),
                      resizeMode: 'contain',
                      borderRadius: 10,
                      marginTop: heightToDp('0.3'),
                    }}
                    source={require('../Assets/assets/GroupCamera.png')}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  marginTop: heightToDp('1.8'),
                  marginBottom: heightToDp('1.5'),
                }}>
                <Text
                  style={{
                    color: '#FF5F6D',
                    fontSize: widthToDp('4.3'),
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Upload profile photo
                </Text>
              </View>
              <View style={EditProfileStyle.inputBox}>
                <TextInput
                  placeholder="Name"
                  placeholderTextColor={'white'}
                  style={EditProfileStyle.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  value={fullName}
                  onChangeText={text => {
                    setFullName(text);
                    onChangeResetError('full_name');
                  }}
                />
              </View>
              {errors.full_name.hasError ? (
                <Text
                  style={{
                    marginTop: heightToDp('1'),
                    fontFamily: 'Poppins-Regular',
                    fontSize: 12,
                    alignSelf: 'flex-start',
                    marginHorizontal: widthToDp('14'),
                    color: '#FF5F6D',
                    marginBottom: heightToDp('-3.5'),
                  }}>
                  {errors.full_name.errMsg}
                </Text>
              ) : (
                <></>
              )}
              <View style={EditProfileStyle.inputBox}>
                <TextInput
                  placeholder="User Name"
                  placeholderTextColor={'white'}
                  style={EditProfileStyle.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  value={userName}
                  onChangeText={text => {
                    setUserName(text);
                    onChangeResetError('user_name');
                  }}
                />
              </View>
              {errors.user_name.hasError ? (
                <Text
                  style={{
                    marginTop: heightToDp('1'),
                    fontFamily: 'Poppins-Regular',
                    fontSize: 12,
                    alignSelf: 'flex-start',
                    marginHorizontal: widthToDp('14'),
                    color: '#FF5F6D',
                    marginBottom: heightToDp('-3.5'),
                  }}>
                  {errors.user_name.errMsg}
                </Text>
              ) : (
                <></>
              )}
              <View style={EditProfileStyle.inputBox}>
                <TextInput
                  placeholder="Website"
                  placeholderTextColor={'white'}
                  style={EditProfileStyle.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  value={webSite}
                  onChangeText={text => {
                    setWebsite(text);
                    onChangeResetError('website');
                  }}
                />
              </View>
              {errors.website.hasError ? (
                <Text
                  style={{
                    marginTop: heightToDp('1'),
                    fontFamily: 'Poppins-Regular',
                    fontSize: 12,
                    alignSelf: 'flex-start',
                    marginHorizontal: widthToDp('14'),
                    color: '#FF5F6D',
                    marginBottom: heightToDp('-3.5'),
                  }}>
                  {errors.website.errMsg}
                </Text>
              ) : (
                <></>
              )}
              <View style={EditProfileStyle.inputBox}>
                <TextInput
                  placeholder="Bio"
                  placeholderTextColor={'white'}
                  style={StyleSheet.flatten([
                    EditProfileStyle.input,
                    { height: bioInputHeight, maxHeigth: 60 },
                  ])}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  value={bio}
                  onChangeText={text => {
                    setBio(text);
                    onChangeResetError('bio');
                  }}
                  onContentSizeChange={event => {
                    setBioInputHeight(event.nativeEvent.contentSize.height);
                  }}
                  multiline
                  maxLength={90}
                />
              </View>
              {errors.bio.hasError ? (
                <Text
                  style={{
                    marginBottom: heightToDp('1'),
                    fontFamily: 'Poppins-Regular',
                    fontSize: 12,
                    alignSelf: 'flex-start',
                    marginHorizontal: widthToDp('14'),
                    color: '#FF5F6D',
                    marginBottom: heightToDp('-3.5'),
                  }}>
                  {errors.bio.errMsg}
                </Text>
              ) : (
                <></>
              )}
              <View
                style={{
                  alignSelf: 'flex-start',
                  marginTop: heightToDp('7'),
                  marginHorizontal: widthToDp('14'),
                }}>
                <View>
                  <Text
                    onPress={() => props.navigation.navigate('PersonalInfo')}
                    style={{
                      color: '#FF5F6D',
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                    }}>
                    Personal information settings
                  </Text>
                </View>
                {/* <View
                  style={{
                    marginTop: heightToDp('4'),
                    marginBottom: heightToDp('0'),
                  }}>
                  <Text
                    onPress={() => props.navigation.navigate('Setting')}
                    style={{
                      color: '#FF5F6D',
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                    }}>
                    General settings
                  </Text>
                </View> */}
                {/* <View
                  style={{
                    marginTop: heightToDp('4'),
                    marginBottom: heightToDp('0'),
                  }}>
                  <Text
                    onPress={() => props.navigation.navigate('About')}
                    style={{
                      color: '#FF5F6D',
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                    }}>
                    About
                  </Text>
                </View> */}
              </View>
              {modalVisible && imageSelectModel()}
            </ScrollView>
            <LoadingView modalVisible={loading} />
          </View>
        </ScrollView>
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
    height: heightToDp('7.5'),
    width: widthToDp('16'),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: heightToDp('67'),
  },
  modalView: {
    margin: 10,
    backgroundColor: 'black',
    borderRadius: 20,
    padding: heightToDp('3'),
    width: widthToDp('101'),
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

export default EditProfileScreen;
