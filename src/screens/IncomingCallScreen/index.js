import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Vibration,StyleSheet, 
  ImageBackground,
  Pressable,Image
} from 'react-native';
import calls from '../Store';
import bg from '../../Assets/assets/ios_bg.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {Voximplant} from 'react-native-voximplant';
import Sound from 'react-native-sound';
import dings from '../../Assets/Sound/ding.mp3';
Sound.setCategory('Playback');
var audio = new Sound(
  dings,
  null,
  error => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    // if loaded successfully
    console.log(
      'duration in seconds: ' +
        audio.getDuration() +
        'number of channels: ' +
        audio.getNumberOfChannels(),
    );
  },
);

const IncomingCallScreen = ({route, stopVibration}) => {
  const navigation = useNavigation();
  const {callId,isVideoCall} = route.params;
  const [caller, setCaller] = useState('Unknown');
 
  const startVibration = () => {
    //To start the vibration for the defined Duration
    if (Platform.OS === 'ios') {
      // this logic works in android too. you could omit the else statement
      const interval = setInterval(() => Vibration.vibrate(), 1000);
      // it will vibrate for 5 seconds
      setTimeout(() => clearInterval(interval), 5000);
    } else {
      Vibration.vibrate(5000);
    }
  };

  useEffect(() => {
    audio.setVolume(1);
    playPause()
    return () => {
      audio.release();
    };
  }, []);

  useEffect(() => {
    startVibration();
    let call = calls.get(callId);
    setCaller(call.getEndpoints()[0].displayName);
    call.on(Voximplant.CallEvents.Disconnected, callEvent => {
      calls.delete(callEvent.call.callId);
      navigation.goBack();
    });
    return function cleanup() {
      call.off(Voximplant.CallEvents.Disconnected);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callId]);

  async function answerCall() {
    Vibration.cancel();
    try {
      if (Platform.OS === 'android') {
        let permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
        if (isVideoCall) {
          permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
        }
        const granted = await PermissionsAndroid.requestMultiple(permissions);
        const recordAudioGranted =
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
        const cameraGranted =
          granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
        if (recordAudioGranted) {
          if (isVideoCall && !cameraGranted) {
            console.warn(
              'MainScreen: makeCall: camera permission is not granted',
            );
            return;
          }
        } else {
          console.warn(
            'MainScreen: makeCall: record audio permission is not granted',
          );
          return;
        }
      }
      playPause()
      navigation.navigate('Call', {
        isVideoCall: isVideoCall,
        callId: callId,
        isIncomingCall: true,
        displayName:caller
      });
    } catch (e) {
      console.warn(`MainScreen: makeCall failed: ${e}`);
    }
  }
  const playPause = () => {
    if (audio.isPlaying()) {
      audio.pause();
  
    } else {
   
      audio.play(success => {
        if (success) {
          // setPlaying(false);
          console.log('successfully finished playing');
        } else {
          // setPlaying(false);
          console.log('playback failed due to audio decoding errors');
        }
      });
    }
  };

  async function declineCall() {
    Vibration.cancel();
    playPause()
    let call = calls.get(callId);
    call.decline();
  }

  return (
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
    <Text style={styles.name}>{caller}</Text>
    <Text style={styles.phoneNumber}>Touchh</Text>

    <View style={[styles.row, {marginTop: 'auto'}]}>
      <View style={styles.iconContainer}>
        <Ionicons name="alarm" color="white" size={30} />
        <Text style={styles.iconText}>Remind me</Text>
      </View>
      <View style={styles.iconContainer}>
        <Entypo name="message" color="white" size={30} />
        <Text style={styles.iconText}>Message</Text>
      </View>
    </View>

    <View style={styles.row}>
      {/* Decline Button */}
      <Pressable onPress={()=>declineCall()} style={styles.iconContainer}>
        <View style={styles.iconButtonContainer}>
          <Feather name="x" color="white" size={40} />
        </View>
        <Text style={styles.iconText}>Decline</Text>
      </Pressable>

      {/* Accept Button */}
      <Pressable onPress={()=>answerCall()} style={styles.iconContainer}>
        <View
          style={[styles.iconButtonContainer, {backgroundColor: '#2e7bff'}]}>
          <Feather name="check" color="white" size={40} />
        </View>
        <Text style={styles.iconText}>Accept</Text>
      </Pressable>
    </View>
  </ImageBackground>
    // <>
    //   <StatusBar barStyle="dark-content" />
    //   <SafeAreaView style={styles.safearea}>
    //     <View style={styles.container}>
    //       <Text style={styles.incomingCallText}>Incoming call from:</Text>
    //       <Text style={styles.incomingCallText}>{caller}</Text>
    //       <View style={styles.incomingCallButtons}>
    //         <TouchableOpacity
    //           onPress={() => answerCall(true)}
    //           style={styles.button}>
    //           <Text style={styles.textButton}>ANSWER</Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity
    //           onPress={() => declineCall()}
    //           style={styles.button}>
    //           <Text style={styles.textButton}>DECLINE</Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </SafeAreaView>
    // </>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 50,
    marginBottom: 15,
  },
  phoneNumber: {
    fontSize: 20,
    color: 'white',
  },
  bg: {
    backgroundColor: 'red',
    flex: 1,
    alignItems: 'center',
    padding: 10,
    paddingBottom: 50,
  },

  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  iconText: {
    color: 'white',
    marginTop: 10,
  },
  iconButtonContainer: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 50,
    margin: 10,
  },
});


export default IncomingCallScreen;
