import {useNavigation} from '@react-navigation/native';
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  StyleSheet,
} from 'react';
import {
  Alert,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  Modal,
  TouchableHighlight,
  FlatList,
  PermissionsAndroid,Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../Styles';
import {Voximplant} from 'react-native-voximplant';
import calls from '../Store';
import bg from '../../Assets/assets/ios_bg.png';
import callIcon from '../../Assets/assets/call.png';

import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CallingScreen = ({route}) => {
  const navigation = useNavigation();
  const {isIncomingCall, isVideoCall, callee,displayName} = route.params;
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [callState, setCallState] = useState('Connecting');
  const callId = useRef(route.params.callId);
  const [localVideoStreamId, setLocalVideoStreamId] = useState('');
  const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');
  const [audioDeviceSelectionVisible, setaudioDeviceSelectionVisible] =
    useState(false);
  const [audioDevices, setaudioDevices] = useState([]);

  const voximplant = Voximplant.getInstance();

  useEffect(() => {
    let callSettings = {
      video: {
        sendVideo: isVideoCall,
        receiveVideo: isVideoCall,
      },
    };

    let call;
    let endpoint;
    async function makeCall() {
      call = await voximplant.call(callee, callSettings);
      subscribeToCallEvents();
      console.log('--------ggjy', call.callId);
      callId.current = call.callId;
      calls.set(call.callId, call);
    }

    async function answerCall() {
      call = calls.get(callId.current);
      subscribeToCallEvents();
      endpoint = call.getEndpoints()[0];
      subscribeToEndpointEvents();
      await call.answer(callSettings);
    }

    function subscribeToCallEvents() {
      call.on(Voximplant.CallEvents.Connected, callEvent => {
        setCallState('Connected');
      });
      call.on(Voximplant.CallEvents.Disconnected, callEvent => {
        calls.delete(callEvent.call.callId);
        navigation.goBack();
      });
      call.on(Voximplant.CallEvents.Failed, callEvent => {
        showCallError(callEvent.reason);
      });
      call.on(Voximplant.CallEvents.ProgressToneStart, callEvent => {
        setCallState('Ringing...');
      });
      call.on(Voximplant.CallEvents.LocalVideoStreamAdded, callEvent => {
        setLocalVideoStreamId(callEvent.videoStream.id);
      });
      call.on(Voximplant.CallEvents.EndpointAdded, callEvent => {
        console.log('endpoint added');
        endpoint = callEvent.endpoint;
        subscribeToEndpointEvents();
      });
    }

    function subscribeToEndpointEvents() {
      endpoint.on(
        Voximplant.EndpointEvents.RemoteVideoStreamAdded,
        endpointEvent => {
          setRemoteVideoStreamId(endpointEvent.videoStream.id);
        },
      );
    }

    function showCallError(reason) {
      console.log('reason',reason)
      if(reason=='Decline'){
        Alert.alert('User ', reason+ ' the call', [
          {
            text: 'OK',
            onPress: () => {
              calls.delete(callId.current);
              navigation.goBack();
            },
          },
        ]);
      }
      else{
        Alert.alert('User is offline', '', [
          {
            text: 'OK',
            onPress: () => {
              calls.delete(callId.current);
              navigation.goBack();
            },
          },
        ]);
      }
   
    }

    if (isIncomingCall) {
      answerCall();
    } else {
      makeCall();
    }

    return function cleanup() {
      call.off(Voximplant.CallEvents.Connected);
      call.off(Voximplant.CallEvents.Disconnected);
      call.off(Voximplant.CallEvents.Failed);
      call.off(Voximplant.CallEvents.ProgressToneStart);
      call.off(Voximplant.CallEvents.LocalVideoStreamAdded);
      call.off(Voximplant.CallEvents.EndpointAdded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideoCall]);

  const endCall = useCallback(() => {
    let call = calls.get(callId.current);

    call.hangup();
  }, []);

  const switchAudioDevice = async () => {
    console.log('CallScreen[' + this.callId + '] switchAudioDevice');
    let devices =
      await Voximplant.Hardware.AudioDeviceManager.getInstance().getAudioDevices();
    setaudioDevices(devices);
    setaudioDeviceSelectionVisible(true);
  };

  const selectAudioDevice = async device => {
    console.log('CallScreen[' + callId + '] selectAudioDevice: ' + device);
    Voximplant.Hardware.AudioDeviceManager.getInstance().selectAudioDevice(
      device,
    );
    setaudioDeviceSelectionVisible(false);
  };
  const onSwitchAudio = () => {
    console.warn('onReverseCamera');
  };

  const flatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#607D8B',
          marginTop: 10,
          marginBottom: 10,
        }}
      />
    );
  };
  const sendVideo = async doSend => {
    let call = calls.get(callId.current);
    console.log('CallScreen[' + callId + '] sendVideo: ' + doSend);
    try {
      if (doSend && Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn(
            'CallScreen[' +
              this.callId +
              '] sendVideo: failed due to camera permission is not granted',
          );
          return;
        }
      }
      call.sendVideo(!isCameraOn);
      setIsCameraOn(currentValue => !currentValue);
    } catch (e) {
      console.warn(
        `Failed to sendVideo(${doSend}) due to ${e.code} ${e.message}`,
      );
    }
    // call.sendVideo(isCameraOn);
    // setIsCameraOn(currentValue => !currentValue);
  };

  const onToggleCamera = () => {
    sendVideo(!isCameraOn);
  };

  const onToggleMicrophone = () => {
    let call = calls.get(callId.current);
    call.sendAudio(!isMicOn);
    setIsMicOn(currentValue => !currentValue);
  };

  return (
    <>
   
      <StatusBar translucent backgroundColor="transparent" />
        <View style={styles.useragent}>

         {isVideoCall ? <View style={styles.videoPanel}>
            <Voximplant.VideoView
              style={styles.remotevideo}
              videoStreamId={remoteVideoStreamId}
              scaleType={Voximplant.RenderScaleType.SCALE_FILL}
            />
            {isCameraOn ? (
              <Voximplant.VideoView
                style={styles.selfview}
                videoStreamId={localVideoStreamId}
                scaleType={Voximplant.RenderScaleType.SCALE_FIT}
                showOnTop={true}
              />
            ) : null}
          </View> : <Image source={bg} style={{}}/>}

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              alignSelf: 'center',
              top: 55,
              
            }}>
          
            <Text style={styles.call_connecting_name}>{displayName}</Text>
            <Text style={styles.call_connecting_label}>{callState}</Text>
            {/* {!isVideoCall && <Image source={callIcon} style={{height:130,width:130,marginTop:200}} resizeMode="contain"/>} */}
          </View>
        
        </View>

        <View style={styles.buttonsContainer}>
          <Pressable
            onPress={() => switchAudioDevice()}
            style={styles.iconButton}>
            <AntDesign name="sound" size={30} color={'white'} />
          </Pressable>

          {isVideoCall && (
            <Pressable
              onPress={() => onToggleCamera()}
              style={styles.iconButton}>
              <MaterialIcons
                name={isCameraOn ? 'camera-off' : 'camera'}
                size={30}
                color={'white'}
              />
            </Pressable>
          )}

          <Pressable
            onPress={() => onToggleMicrophone()}
            style={styles.iconButton}>
            <MaterialIcons
              name={isMicOn ? 'microphone-off' : 'microphone'}
              size={30}
              color={'white'}
            />
          </Pressable>

          <Pressable
            onPress={() => endCall()}
            style={[styles.iconButton, {backgroundColor: 'red'}]}>
            <MaterialIcons name="phone-hangup" size={30} color={'white'} />
          </Pressable>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={audioDeviceSelectionVisible}
          onRequestClose={() => {}}>
          <TouchableHighlight
            onPress={() => {
              setaudioDeviceSelectionVisible(false);
            }}
            style={styles.container}>
            <View style={[styles.container, styles.modalBackground]}>
              <View
                style={[
                  styles.innerContainer,
                  styles.innerContainerTransparent,
                ]}>
                <FlatList
                  data={audioDevices}
                  keyExtractor={(item, index) => item}
                  ItemSeparatorComponent={flatListItemSeparator}
                  renderItem={({item}) => (
                    <Text
                      onPress={() => {
                        selectAudioDevice(item);
                      }}>
                      {' '}
                      {item}{' '}
                    </Text>
                  )}
                />
              </View>
            </View>
          </TouchableHighlight>
        </Modal>

    </>
  );
};

export default CallingScreen;
