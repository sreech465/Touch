/* eslint-disable prettier/prettier */
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  Alert,
  Dimensions,
  BackHandler,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Fontisto';
import Icon4 from 'react-native-vector-icons/dist/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import { CropView } from 'react-native-image-crop-tools';
import { loginStyle } from '../Assets/styles';
import LinearGradient from 'react-native-linear-gradient';
import {
  getVideoMetaData,
  Image as ImageCompressor,
  Video as VideoCompressor,
  getRealPath,
} from 'react-native-compressor';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  checkPermission,
  permissionAlert,
  PERMISSIONS,
} from '../Assets/helpers/Permissions';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllStories,
  selectStoryById,
  setAllStories,
  updateStory,
  uploadNewStoryAction,
} from './stories/storiesSlice';
import Video from 'react-native-video';
import { StackActions, useIsFocused } from '@react-navigation/native';
import {
  Camera,
  parsePhysicalDeviceTypes,
  useCameraDevices,
} from 'react-native-vision-camera';
import { set } from 'immer/dist/internal';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

function getMaxFps(format) {
  return format.frameRateRanges.reduce((prev, curr) => {
    if (curr.maxFrameRate > prev) return curr.maxFrameRate;
    else return prev;
  }, 0);
}

const StoryScreen = ({ navigation }) => {
  const camera = useRef(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [permissions, setPermissions] = useState(null);
  const[cameraType,setCameraType]=useState(true)
  // const [cameraPosition, setCameraPosition] = useState('front');
  const [cameraPosition, setCameraPosition] = useState('back');
  const [isVideo, setIsVideo] = useState(false);
  const [timer, setTimer] = useState(0);

  const devices = useCameraDevices('wide-angle-camera');
  const deviceControl = useCameraDevices();
  const devices1 = Camera.getAvailableCameraDevices();

  const device = devices[cameraPosition];

  console.log(device, 'pt12');
  const supportsCameraFlipping = useMemo(
    () => devices.back != null && devices.front != null,
    [devices.back, devices.front],
  );
  const supportsFlash = device?.hasFlash ?? false;
  const currentUserId = useSelector(state => state.user.userdata.userid);

  const currentUserStories = useSelector(state =>
    selectStoryById(state, currentUserId),
  );

  const allStories = useSelector(selectAllStories);

  const [media, setMedia] = React.useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const permissions =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const alertMsg = 'Please allow permission to access camera.';

    checkPermission(permissions).then(isPermissionGranted => {
      if (isPermissionGranted) {
        console.log('camera permission granted', isPermissionGranted);
        setPermissions(true);
      } else {
        permissionAlert(alertMsg, navigation);
      }
    });
  }, []);

  const onCameraInitialized = useCallback(() => {
    console.log('Camera initialized!');
    setIsCameraInitialized(true);
  }, []);

  const device1 = devices.back;

  const format = useMemo(() => {
    return device1?.formats.reduce((prev, curr) => {
      if (prev == null) return curr;
      if (getMaxFps(curr) > getMaxFps(prev)) return curr;
      else return prev;
    }, undefined);
  }, [device1?.formats]);

  const errorAlert = res => Alert.alert('Error', JSON.stringify(res));

  const ImageData = [
    {
      key: '1',
      type: 'filter',
      Image:
        'https://img.freepik.com/free-psd/natural-light-lens-flare-psd-gold-background-sun-ray-effect_53876-140441.jpg',
    },
    {
      key: '2',
      type: 'filter',
      Image:
        'https://wallup.net/wp-content/uploads/2016/03/10/314795-nature-blue-plants-bokeh-filter-748x468.jpg',
    },
    {
      key: '3',
      type: 'filter',
      Image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSwFPGUJ3WhU-NObtzTKstkcC9416_R0nUpA&usqp=CAU',
    },

    {
      key: '4',
      type: 'filter',
      Image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbH38NBbc17vpSye6-NiFZVo5G5wYVFZoaig&usqp=CAU',
    },
    {
      key: '5',
      type: 'filter',
      Image:
        'https://s1.mzstatic.com/us/r30/Purple4/v4/07/f0/a4/07f0a4ea-53e3-60af-f074-4d8eaeae0942/mzl.zqqttjtr.png',
    },
  ];

  const handleChoosePhoto = () => {
    const options = {
      noData: true,
      mediaType: 'mixed',
    };

    const permissions =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
    const alertMsg = 'Please allow permission to access storage.';

    checkPermission(permissions).then(isPermissionGranted => {
      if (isPermissionGranted) {
        launchImageLibrary(options, response => {
          console.log('selectedPhoto', response);
          if (response?.assets?.length > 0) {
            setMedia({
              path: response.assets[0].uri,
              type: response.assets[0].type,
              fileName: response.assets[0].fileName,
            });
          }
        });
      } else {
        permissionAlert(alertMsg, navigation);
      }
    });
  };

  const backAction = () => {
    const popAction = StackActions.pop(1);
    navigation.dispatch(popAction);
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);
  // const recordVideo=async()=>{
  //   console.log('vstep1')
  //   camera.current.startRecording({
  //     // flash: 'on',
  //     onRecordingFinished: (video) => console.log(video),
  //     onRecordingError: (error) => console.error(error),

  //   }).then((vid)=>console.log(vid))
  //   setTimeout(await camera.current.stopRecording(),1000)
  //   // setInterval(()=>setTimer(timer+1))

  //   // if (camera && camera.current && isCameraInitialized) {
  //   //   console.log('vstep2')
  //   //   await camera.current
  //   //   .startRecording({
  //   //         flash:'on',
  //   //         enableAutoStabilization: true,
  //   //         skipMetadata: true,
  //   //         photoCodec: 'mp4',
  //   //         quality: 100,

  //   //         onRecordingFinished:(v)=>setMedia(v),
  //   //         onRecordingError:(e)=>console.log(e,'vid error')

  //   //       })

  //   //       setTimeout(await camera.current.stopRecording(),1000)
  //   //     }
  //   }
  const stopRecording = () => {
    console.log('stop recording');
    setTimer(0);
    clearInterval();
  };

  const isFocused = useIsFocused();

  const captureButton = async () => {
    try {
      if (camera && camera.current && isCameraInitialized) {
        await camera.current

          .takePhoto({
            // flash:'on',
            enableAutoStabilization: true,
            skipMetadata: true,
            photoCodec: 'jpeg',
            quality: 100,
          })
          .then(async img => {
            var z = img.path.split('/');
            const path =
              Platform.OS === 'ios' ? img.path : await getRealPath(img.path);
            setMedia({
              path: path,
              type: 'image/jpeg',
              fileName: z[z.length - 1],
            });
          });
      }
    } catch (error) {
      console.log('hey');
      console.log({ error });
    }
  };

  const recordButton = async () => {
    
    // setInterval(()=>setTimer((prev)=>prev+1),1000)
    try {
      if (camera && camera.current && isCameraInitialized) {
        await camera.current.startRecording({
          // flash: 'on',

          onRecordingFinished: v =>
            setMedia({ ...v, type: 'video/mp4', fileName: v.path }),

          onRecordingError: e => console.log(e, 'error occured'),
        });
        // setInterval(()=>setTimer((prev)=>prev+1),500)
        setTimeout(
          async () => await camera.current.stopRecording(),
          5000

        
        );
      }
    } catch (error) {
      console.log('hey');
      console.log({ error });
    }
  };
  // const stopRecord=async()=>{
  //   setTimeout(
  //     async () => await camera.current.stopRecording(),

  //     4000,
  //   );

  // }


const screenTimer=()=>{
 
  // setInterval(()=>setTimer(prev=>setTimer(prev+1)),1000)
  setInterval(()=>setTimer(timer+1),1000)
}

  const handleUploadStory = async () => {
    const imageFormat = {
      fileName: 'mrousavy4631862312946302942.jpg',
      path: 'file:///data/user/0/com.touchhapp/cache/mrousavy4631862312946302942.jpg',
      type: 'image/jpeg',
    };

    const visionformat = {
      size: 12467.504,
      duration: 5.01072,
      path: 'file:///data/user/0/com.touchhapp/cache/VisionCamera-20220903_1408187468471742670951707.mp4',
      type: 'mp4',
    };
    const working = {
      path: 'content://com.android.providers.media.documents/document/video%3A134529',
      type: 'video/mp4',
      fileName: 'video:134529',
    };

    console.log(media, 'hello');
    if (true) {
      if (Object.keys(media).length === 0) {
        return;
      }
      setLoading(true);
      const isImage = media.type.includes('image');

      const compressImage = async uri =>
        await ImageCompressor.compress(uri, {
          compressionMethod: 'auto',
          quality: 0.5,
        });

      const compressVideo = async uri =>
        await VideoCompressor.compress(uri, {
          compressionMethod: 'auto',
          minimumFileSizeForCompress: 0,
        }).then(uri => uri.replace('file://', 'file:///'));

      const mediaURI = isImage
        ? await compressImage(media.path)
        : await compressVideo(media.path);

      console.log(mediaURI, 'media url');
      !isImage &&
        console.log(
          'meta data',
          getVideoMetaData(media.uri),
          getVideoMetaData(mediaURI),
        );

      const photoData = {
        uri: mediaURI,
        type: media.type,
        name: media.fileName,
      };
      console.log('photoDAta', photoData);

      const uploadData = {
        post_file: photoData,
        file_type: isImage ? 'image' : 'video',
        text: '',
      };
      // console.log(uploadData)
      dispatch(uploadNewStoryAction(uploadData))
        .unwrap()
        .then(res => {
          const isPosted = res.status === 200;

          if (isPosted) {
            const storyItem = res.data[0];

            const newStoryData = {
              id: storyItem.story_id,
              url: storyItem.file_path,
              type: storyItem.file_type,
              created: storyItem.timestamp,
              text: storyItem.text,
              is_liked: storyItem.isLiked,
              duration: 2,
            };

            const newStory = {
              id: storyItem.user_id,
              username: storyItem.username,
              title: '',
              profile: storyItem.profile_pic,
              stories: [newStoryData],
            };

            setMedia('');
            console.log('stories', newStoryData, currentUserStories);
            if (!currentUserStories) {
              dispatch(setAllStories([newStory, ...allStories]));
            } else {
              dispatch(
                updateStory({
                  id: currentUserId,
                  changes: {
                    stories: [...currentUserStories.stories, newStoryData],
                  },
                }),
              );
            }

            navigation.navigate('Home');
          }

          if (!isPosted) {
            errorAlert(res);
          }
          setLoading(false);
        });
    }
  };

  const storyEffects = ({ item }) => {
    return (
      <Image
        style={{
          width: widthToDp('12'),
          height: heightToDp('6'),
          marginHorizontal: widthToDp('1'),
          marginBottom: heightToDp('1.5'),
          resizeMode: 'contain',
          borderRadius: 50,
        }}
        source={{
          uri: item.Image,
        }}
      />
    );
  };


  

  const onFlipCameraPressed = () => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  };

  if (!device || !permissions) {
    return null;
  } else {
    return (
      <View
        style={{
          backgroundColor: 'black',
          // backgroundColor:'green',
          flex: 1,
          justifyContent: 'center',
        }}>
        {media == '' ? (
          <>
          {/* {screenTimer}
           */}
          
        
         {/* {!cameraType? <Text style={{fontSize:40,color:'red',zIndex:2000,position:'absolute',top:'1%',left:'43%'}}
          onPress={()=>
            true?
            setInterval(()=>setTimer((prev)=>prev+1),1000):
            clearInterval()
          }
          >
           
          {timer}
          </Text>:null} */}
            <Camera
              ref={camera}
              onInitialized={onCameraInitialized}
              style={StyleSheet.absoluteFill}
              device={device}
              video={true}
              photo={true}
              audio={true}
              supportsParallelVideoProcessin={true}
              format={format}
              isActive={isFocused}
              supportsCameraFlipping={true}
              hasFlash={true}
            />
          </>
        ) : (
          <>
            {Object.keys(media).length != 0 && media.type.includes('image') ? (
              // false
              // true
              <FastImage
                style={{ width: '100%', height: '100%' }}
                source={{
                  uri: media.path,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <>
                <View>
                  <Text style={{color:'red',fontSize:20 }}>{timer}</Text>
                </View>

                <Video
                  style={{ width: '100%', height: '100%' }}
                  source={{ uri: media.path }}
                  resizeMode={'stretch'}
                  volume={10}
                  repeat
                />
              </>
            )}
          </>
        )}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'absolute',
            alignSelf: 'center',
            bottom: heightToDp('4'),
            width: widthToDp('80'),
          }}>
          <Icon
            name={media ? 'ios-close' : 'images-outline'}
            size={heightToDp('3.8')}
            color="white"
            onPress={() => {
              if (!loading) {
                if (media) {
                  setMedia('');
                } else {
                  handleChoosePhoto();
                }
              }
            }}
          />
           <Icon
          name={
            cameraType
            // !true
             ? 'aperture-outline' : 'contrast-outline'}
            size={heightToDp('3.8')}
            color="white"
            onPress={() => {
              setCameraType(!cameraType)
              console.log(cameraType,'type')
            }}
          />
          <TouchableOpacity
            onPress={() => {
              console.log('step1');
              if (loading) {
                console.log('step2');

                return;
              } else {
                console.log('step3');

                if (media == '') {
                  console.log('step4');
                  if(cameraType){
                    captureButton();


                  }else{
                    recordButton();


                  }

                
                 
                } else {
                  console.log('step5');
                  handleUploadStory();
                }
              }
            }}>
            <View
              style={[
                loginStyle.buttonStyleOuterCircle,
                { alignSelf: 'center', marginTop: heightToDp('2.5') },
              ]}>
              <LinearGradient
                start={{ x: 1, y: 1 }}
                end={{ x: 0.0, y: 0.0 }}
                locations={[0, 0.32, 1]}
                colors={['#FFAB5A', '#FF5F6D', '#FF5F6D']}
                style={[styles.linearGradient, { alignItems: 'center' }]}>
                {!loading ? (
                  !media ? null : (
                    <Icon4
                      name="check"
                      size={heightToDp('3')}
                      color="#F5F5F5"
                    />
                  )
                ) : (
                  <ActivityIndicator size={heightToDp('11')} color="white" />
                )}
              </LinearGradient>
            </View>
          </TouchableOpacity>
          {supportsCameraFlipping && (
            <Icon2
              name="camera-flip-outline"
              size={heightToDp('4')}
              color="white"
              onPress={onFlipCameraPressed}
            />
          )}
        </View>

        {/* {supportsFlash && (
          <PressableOpacity style={styles.button} onPress={onFlashPressed} disabledOpacity={0.4}>
            <IonIcon name={flash === 'on' ? 'flash' : 'flash-off'} color="white" size={24} />
          </PressableOpacity>
        )}
        {supports60Fps && (
          <PressableOpacity style={styles.button} onPress={() => setIs60Fps(!is60Fps)}>
            <Text style={styles.text}>
              {is60Fps ? '60' : '30'}
              {'\n'}FPS
            </Text>
          </PressableOpacity>
        )}
        {supportsHdr && (
          <PressableOpacity style={styles.button} onPress={() => setEnableHdr((h) => !h)}>
            <MaterialIcon name={enableHdr ? 'hdr' : 'hdr-off'} color="white" size={24} />
          </PressableOpacity>
        )}
        {canToggleNightMode && (
          <PressableOpacity style={styles.button} onPress={() => setEnableNightMode(!enableNightMode)} disabledOpacity={0.4}>
            <IonIcon name={enableNightMode ? 'moon' : 'moon-outline'} color="white" size={24} />
          </PressableOpacity>
        )} */}
      </View>

      // <View style={{ backgroundColor: 'black', flex: 1, justifyContent: 'center' }}>

      //   {Object.keys(media).length > 0 && (media.type.includes('image') ? (
      //     <Image
      //       source={{ uri: media.uri }}
      //       style={{ width: '100%', height: '100%' }}
      //       resizeMode="contain"
      //     />
      //   ) :
      //     <Video
      //       style={styles.media}
      //       source={{ uri: media.uri }}
      //       resizeMode="contain"
      //       volume={10}
      //       repeat
      //     />)
      //   }
      //   <View
      //     style={{
      //       marginHorizontal: widthToDp('3'),
      //       position: 'absolute',
      //       top: heightToDp('22'),
      //     }}>
      //     <FlatList
      //       data={ImageData}
      //       renderItem={storyEffects}
      //       keyExtractor={item => item.key}
      //     />
      //     <View style={{
      //       width: widthToDp('12'),
      //       height: heightToDp('6'),
      //       marginHorizontal: widthToDp('1'),
      //       backgroundColor: 'white',
      //       borderRadius: 50,
      //       justifyContent: 'center',
      //       alignItems: 'center',
      //     }}>
      //       <Icon3 name="search" size={heightToDp('3')} color="black" />
      //     </View>
      //   </View>
      // <View
      //   style={{
      //     flexDirection: 'row',
      //     alignItems: 'center',
      //     justifyContent: 'space-between',
      //     position: 'absolute',
      //     alignSelf: 'center',
      //     bottom: heightToDp('4'),
      //     width: widthToDp('80'),
      //   }}>
      //   <Icon name="images-outline" size={heightToDp('3.5')} color="white" onPress={!loading ? handleChoosePhoto : () => { }} />
      //   <TouchableOpacity onPress={handleUploadStory}>
      //     <View
      //       style={[
      //         loginStyle.buttonStyleOuterCircle,
      //         { alignSelf: 'center', marginTop: heightToDp('2.5') },
      //       ]}>
      //       <LinearGradient
      //         start={{ x: 1, y: 1 }}
      //         end={{ x: 0.0, y: 0.0 }}
      //         locations={[0, 0.32, 1]}
      //         colors={['#FFAB5A', '#FF5F6D', '#FF5F6D']}
      //         style={[styles.linearGradient, { alignItems: 'center' }]}>
      //         {!loading ?
      //           <Icon4 name="check" size={heightToDp('3')} color="#F5F5F5" /> :
      //           <ActivityIndicator size={heightToDp('11')} color='white' />
      //         }
      //       </LinearGradient>
      //     </View>
      //   </TouchableOpacity>
      //   <Icon2
      //     name="camera-flip-outline"
      //     size={heightToDp('4')}
      //     color="white"
      //     onPress={handleCameraLaunch}
      //   />
      // </View>
      // </View>
    );
  }
};
// };

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
    height: 65,
    width: 65,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linearGradient1: {
    height: 48,
    width: 38,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyleOuterCircle: {
    height: 70,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    backgroundColor: 'white',
  },
  media: {
    width: dimensions.width,
    height: dimensions.height,
  },
});

export default StoryScreen;

{
  /* <View
              style={[
                loginStyle.buttonStyleOuterrRctangle,
                {
                  alignSelf: 'flex-end',
                  marginTop: heightToDp('0'),
                  position: 'absolute',
                  top: 120,
                },
              ]}>
              <LinearGradient
                start={{ x: 1, y: 1 }}
                end={{ x: 0.0, y: 0.0 }}
                locations={[0, 0.32, 1]}
                colors={!isVideo ? ['#FFAB5A', '#FF5F6D', '#FF5F6D'] : []}
                style={[styles.linearGradient1, { alignItems: 'center' }]}>
                <Pressable
                  style={{ marginVertical: 5 }}
                  onPress={() => {
                    setIsVideo(false);
                  }}
                  disabledOpacity={0.4}>
                  <IonIcon name="camera-reverse" color="white" size={24} />
                </Pressable>
              </LinearGradient>
              <LinearGradient
                start={{ x: 1, y: 1 }}
                end={{ x: 0.0, y: 0.0 }}
                locations={[0, 0.32, 1]}
                colors={isVideo ? ['#FFAB5A', '#FF5F6D', '#FF5F6D'] : []}
                style={[styles.linearGradient1, { alignItems: 'center' }]}>
                <Pressable
                  style={{ marginVertical: 5 }}
                  onPress={() => {
                    setIsVideo(true);
                  }}
                  disabledOpacity={0.4}>
                  <IonIcon name="md-videocam" color="white" size={24} />
                </Pressable>
              </LinearGradient>
            </View> */
}

//   onLongPress={() => {
//     if (loading) {
//       console.log('step2')

//       return;
//     } else {
//       console.log('step3')

//       if (media == '') {
//         console.log('step4')
//         recordVideo()

//       } else {
//         console.log('step5')
//         handleUploadStory();

//       }
//     }

// }}
// delayLongPress={1000}
