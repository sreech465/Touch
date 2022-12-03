import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  StatusBar,
  ScrollView,KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { mainView, PersonalInfoStyle } from '../../Assets/styles';
import { Bar } from '../../components/StatusBar';
import { heightToDp, widthToDp } from '../../Assets/helpers/Responsive';
import Icon1 from 'react-native-vector-icons/dist/AntDesign';
import { UploadsoftcopyStyle, IntroStyle, } from '../../Assets/styles';
import Geolocation from 'react-native-geolocation-service';
import DropDown from '../../components/DropDown';
import CheckBox from '../../components/CheckBox';
import { checkMultiplePermissions, permissionAlert, PERMISSIONS } from '../../Assets/helpers/Permissions';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { uploadInterestsAction } from '../../Redux/networkSlice';
import { LoadingView } from '../../components/LoadingView';

const genderData = [
  {
    id: 1,
    name: 'men',
  },
  {
    id: 2,
    name: 'women',
  },
  {
    id: 3,
    name: 'both',
  },
]

const initialValues = {
  show_me: '',
  mode: 'Please select',
  latitude: '',
  longitude: '',
  interest: 'Please select',
  ethinicity: 'Please select',
  meet_people: 'traveling',
  about_me: '',
  location: 'Current location',
}

const InterestScreen = ({ navigation }) => {

  const [formValues, setFormValues] = useState(initialValues);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ hasError: false, errMsg: '' });

  const dispatch = useDispatch();
  const [keyboardShow, setKeyboardShow] = React.useState();

  const requestLocationPermission = async () => {
    const permissions =
      Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]
        : [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
    const alertMsg = 'Please allow permission to access your location.';
    checkMultiplePermissions(permissions).then(isPermissionGranted => {
      if (isPermissionGranted) {
        Geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) => {
            setFormValues((prevValues) => ({ ...prevValues, latitude, longitude }));
          },
          (error) => {
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
      }
      else {
        permissionAlert(alertMsg, navigation);
      }
    })

  }

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardShow(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setTimeout(() => {
          setKeyboardShow(false);
        }, 100);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  const requestLocationPermissionIos=async()=>{
    const auth = await Geolocation.requestAuthorization("whenInUse");
    if(auth === "granted") {
       // do something if granted...
       Geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          console.log('66uuuyyhjhdrdgdgf',latitude,longitude)

          setFormValues((prevValues) => ({ ...prevValues, latitude, longitude }));
        },
        (error) => {
          console.log('Error',error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
      );
    }
  }


  useEffect(() => {
    console.log('hjhdrdgdgf')
    if(Platform.OS === "ios"){
    
      requestLocationPermissionIos()
    }
    else{
      requestLocationPermission();
    }
   // 
  }, []);

  const handleUploadInterest = () => {
    setIsLoading(true);
    const interestData = { ...formValues };
    delete interestData.location;
    const requiredError = Object.values(interestData).map((value) => (value === "" || value === "Please select"));

    if (requiredError.includes(true)) {
      setIsLoading(false);
      setErrors({ hasError: true, errMsg: "All fields are required." })
    }
    else if (formValues.about_me.length < 10) {
      setIsLoading(false);
      setErrors({ hasError: true, errMsg: "About me must be at least 10 characters long." })
    }
    else {
      console.log('gcdhrdth',interestData)
      dispatch(uploadInterestsAction(interestData))
        .unwrap()
        .then(() => {
          navigation.push('Network');
        })
        .catch(({ errors }) => {
          setErrors({ hasError: true, errMsg: errors.map((error) => error.msg).join("\r\n") })
        }
        )
        .finally(() => setIsLoading(false));
    }
  }


  const handleFormChange = (name, value) => {
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    setErrors({ hasError: false, errMsg: '' })
  }

  const Header = () => {
    return (<View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: heightToDp('4')
      }}>
      <View>
        <View style={{ width: widthToDp('50') }}>
          <Text
            style={{
              fontSize: widthToDp('5.7'),
              color: 'white',
              fontFamily: 'Poppins-SemiBold',
            }}>
            What are you interested in ?
          </Text>
        </View>

        <Text
          style={{
            fontSize: widthToDp('2.5'),
            color: 'white',
            fontFamily: 'Poppins-Regular',
          }}>
          You can change this later
        </Text>
      </View>
    </View>)
  }

  const AboutMeInput = useCallback(({ value, onChange }) => {
    return (<View style={{
      marginBottom: heightToDp('2')
    }}>
      <Text style={{ color: 'gray', marginBottom: heightToDp('0.5'), fontWeight: 'bold' }}>About Me</Text>
      <View style={{
        backgroundColor: '#3F3C3D',
        borderRadius: 8,
      }}>
        <TextInput
          placeholder="Tell a few words about yourself for everyone"
          placeholderTextColor={'gray'}
          style={{
            borderRadius: 8,
            paddingHorizontal: widthToDp('2'),
            borderWidth: 0.15,
            borderBottomWidth: 1,
            borderColor: '#FF5F6D',
            color: 'white',
            textAlignVertical: 'top',
            height: heightToDp('10'),
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={value}
          multiline
          onChangeText={text => onChange('about_me', text)} />
      </View>
    </View>)
  }, [])

  const NextButton = ({ onPress }) => {
    return (<TouchableOpacity
      onPress={onPress}
      style={{ position: 'absolute', bottom: 20, right: 15 }}>
      <View style={UploadsoftcopyStyle.buttonStyleOuterCircle}>
        <View style={UploadsoftcopyStyle.buttonStyleInnerCircle}>
          <Icon1 name="arrowright" size={heightToDp('3')} color="#F5F5F5" />
        </View>
      </View>
    </TouchableOpacity>)
  }


  const renderErrorMessage = (hasError, errMsg) => {
    return hasError ? (
      <Text
        style={
          {
            marginTop: heightToDp('0.5'),
            fontFamily: 'Poppins-Regular',
            fontSize: 12,
            alignSelf: 'flex-start',
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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black', paddingTop: Platform.OS === 'android' ? 40 : 0 }}>
      <KeyboardAvoidingView  style={[mainView]}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <LoadingView modalVisible={isLoading} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Bar barStyle="light-content" />
        <Image
          source={require('../../Assets/assets/MaskGroup26.png')}
          style={[
            IntroStyle.styleImage,
            { position: 'absolute', opacity: 1, left: widthToDp(-33) },
          ]}
          resizeMode="contain"
        />
        <View  style={{width:widthToDp('86'),position:'absolute',bottom:heightToDp('5'),alignSelf:'center' }}>
          <Header />
          <CheckBox onPress={handleFormChange} value={formValues.show_me} labelName='Show Me' fieldName='show_me' options={genderData} />
          <DropDown handleFormChange={handleFormChange} value={formValues.mode} fieldName="mode" labeName="Mode" options={['Business Network', 'Friendship']} />
          <DropDown handleFormChange={handleFormChange} value={formValues.location} fieldName="location" labeName="Location" options={['Current location']} disabled renderRightComponent={() => <Image source={require('../../Assets/assets/locationIcon.png')} />} />
          <DropDown handleFormChange={handleFormChange} value={formValues.interest} fieldName="interest" labeName="Interest" options={['Fashion', 'Sports']} />
          <DropDown handleFormChange={handleFormChange} value={formValues.ethinicity} fieldName="ethinicity" labeName="Ethinicity" options={['All']} />
          <AboutMeInput value={formValues.about_me} onChange={handleFormChange} />
          {renderErrorMessage(errors.hasError, errors.errMsg)}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
      <NextButton onPress={handleUploadInterest} />
    </SafeAreaView>
  );
};

export default InterestScreen;