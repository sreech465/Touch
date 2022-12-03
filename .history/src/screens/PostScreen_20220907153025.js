/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { widthToDp, heightToDp } from '../Assets/helpers/Responsive';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  ScrollView,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { launchImageLibrary } from 'react-native-image-picker';
import { Bar } from '../components/StatusBar';
import ImageCrop from 'react-image-crop-component';

import {
  AdenCompat,
  _1977Compat,
  BrannanCompat,
  BrooklynCompat,
  ClarendonCompat,
  EarlybirdCompat,
  GinghamCompat,
  HudsonCompat,
  InkwellCompat,
  KelvinCompat,
  LarkCompat,
  LofiCompat,
  MavenCompat,
  MayfairCompat,
  MoonCompat,
  NashvilleCompat,
  PerpetuaCompat,
  ReyesCompat,
  RiseCompat,
  SlumberCompat,
  StinsonCompat,
  ToasterCompat,
  ValenciaCompat,
  WaldenCompat,
  WillowCompat,
  Xpro2Compat,
  Normal,
} from 'react-native-image-filter-kit';
import PhotoBox from '../components/PhotoBox';
import { mainView } from '../Assets/styles';
import Icon from 'react-native-vector-icons/dist/Fontisto';
import CameraRoll from '@react-native-community/cameraroll';
import { loginStyle } from '../Assets/styles';
import Icon3 from 'react-native-vector-icons/dist/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { uploadPost } from '../Redux/postSlice';
import { useDispatch } from 'react-redux';
import Video from 'react-native-video';
import ImageCropDialog from './ImageCropDialog';
import {
  Image as ImageCompressor,
  Video as VideoCompressor,
} from 'react-native-compressor';
import {
  checkPermission,
  permissionAlert,
  PERMISSIONS,
} from '../Assets/helpers/Permissions';
import { StackActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addNewPost } from '../Redux/reducers/feedReducer';
import Icon1 from 'react-native-vector-icons/dist/MaterialIcons';
import { CropView } from 'react-native-image-crop-tools';
import Cropper from 'react-easy-crop';

const FILTERS = [
  {
    title: 'Normal',
    filterComponent: Normal,
  },
  {
    title: 'Aden',
    filterComponent: AdenCompat,
  },
  {
    title: 'Maven',
    filterComponent: MavenCompat,
  },
  {
    title: 'Mayfair',
    filterComponent: MayfairCompat,
  },
  {
    title: 'Moon',
    filterComponent: MoonCompat,
  },
  {
    title: 'Nashville',
    filterComponent: NashvilleCompat,
  },
  {
    title: 'Perpetua',
    filterComponent: PerpetuaCompat,
  },
  {
    title: 'Reyes',
    filterComponent: ReyesCompat,
  },
  {
    title: 'Rise',
    filterComponent: RiseCompat,
  },
  {
    title: 'Slumber',
    filterComponent: SlumberCompat,
  },
  {
    title: 'Stinson',
    filterComponent: StinsonCompat,
  },
  {
    title: 'Brooklyn',
    filterComponent: BrooklynCompat,
  },
  {
    title: 'Earlybird',
    filterComponent: EarlybirdCompat,
  },
  {
    title: 'Clarendon',
    filterComponent: ClarendonCompat,
  },
  {
    title: 'Gingham',
    filterComponent: GinghamCompat,
  },
  {
    title: 'Hudson',
    filterComponent: HudsonCompat,
  },
  {
    title: 'Inkwell',
    filterComponent: InkwellCompat,
  },
  {
    title: 'Kelvin',
    filterComponent: KelvinCompat,
  },
  {
    title: 'Lark',
    filterComponent: LarkCompat,
  },
  {
    title: 'Lofi',
    filterComponent: LofiCompat,
  },
  {
    title: 'Toaster',
    filterComponent: ToasterCompat,
  },
  {
    title: 'Valencia',
    filterComponent: ValenciaCompat,
  },
  {
    title: 'Walden',
    filterComponent: WaldenCompat,
  },
  {
    title: 'Willow',
    filterComponent: WillowCompat,
  },
  {
    title: 'Xpro2',
    filterComponent: Xpro2Compat,
  },
  {
    title: 'Aden',
    filterComponent: AdenCompat,
  },
  {
    title: '_1977',
    filterComponent: _1977Compat,
  },
  {
    title: 'Brannan',
    filterComponent: BrannanCompat,
  },
];

const PostScreen = ({ navigation }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels);
  }, []);
  const [media, setMedia] = useState('');

  const [photoWithFilter, setPhotoWithFilter] = useState('');

  const [multiMedia, setMultiMedia] = useState([]);

  const [selectedFilterIndex, setIndex] = useState(0);
  const [texHeight, settexHeight] = useState(40);

  const [mediaSelected, setMediaSelected] = useState(false);

  const [keyboardShow, setKeyboardShow] = React.useState();

  const [isNext, setIsNext] = useState(false);
  const [loading, setLoading] = useState(false);

  const [caption, setCaption] = useState('');

  const [selectedCar, setSelectedCar] = useState(null);

  const scrollRef = useRef();

  const dispatch = useDispatch();

  const errorAlert = res => Alert.alert('Error', JSON.stringify(res));

  const isImage = media?.type?.includes('image');

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  // onCropped = _onCropped().bind();
  // _onCropped = function () {
  //   let image = e.image;
  //   let image_data = e.data;
  // };

  //   _onCropped: function (e) {
  //     let image = e.image
  //     let image_data = e.data
  // }

  // const getPhotos = () => {
  //   CameraRoll.getPhotos({
  //     first: 98,
  //     assetType: Platform.OS == 'ios' ? 'Photos' : 'All',
  //   })
  //     .then(r => {
  //       setMedia({
  //         uri: r.edges[0].node.image.uri,
  //         type: r.edges[0].node.type,
  //       });
  //       setMultiMedia([...r.edges, { type: 'all photos' }]);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };
  const getPhotos = () => {
    CameraRoll.getPhotos({
      first: 98,
      assetType: Platform.OS == 'ios' ? 'Photos' : 'All',
    });

    setMedia({
      uri: 'https://ik.imagekit.io/ikmedia/backlit.jpg',
      type: 'image/jpeg',
      id: 1,
      croppedImageUrl: null,
    });
    // setMultiMedia(uri, { type: 'all photos' });
  };

  // const getPhotos = () => {
  //   setMedia({
  //     uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQticSAvS1qCo3CvZNC5Fbfv1sTAlbvPfPmUoZQMq5K&s',
  //     type: 'image/jpeg',
  //   });
  //   setMultiMedia(uri, { type: 'all photos' });
  // };

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

  useEffect(() => {
    const permissions =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
    const alertMsg = 'Please allow permission to access storage.';

    checkPermission(permissions).then(isPermissionGranted => {
      if (isPermissionGranted) {
        getPhotos();
      } else {
        permissionAlert(alertMsg, navigation);
      }
    });
  }, []);

  const onExtractImage = ({ nativeEvent }) => {
    setPhotoWithFilter(nativeEvent.uri);
  };

  const onSelectFilter = selectedIndex => {
    setIndex(selectedIndex);
  };

  // const cropImage = uri => {
  //   <CropView
  //     sourceUrl={uri}
  //     style={styles.cropView}
  //     ref={cropViewRef}
  //     onImageCrop={res => console.warn(res)}
  //     keepAspectRatio
  //     aspectRatio={{ width: 100, height: 20 }}
  //   />;
  // };
  const onCancel = () => {
    setSelectedCar(null);
  };

  const setCroppedImageFor = (id, crop, zoom, aspect, croppedImageUrl) => {
    const newCarsList = [...media];
    const carIndex = media.findIndex(x => x.id === id);
    const car = media[carIndex];
    const newCar = { ...car, croppedImageUrl, crop, zoom, aspect };
    newCarsList[carIndex] = newCar;
    setMedia(newCarsList);
    setSelectedCar(null);
  };

  const resetImage = id => {
    setCroppedImageFor(id);
  };

  const handleUploadPost = async () => {
    setLoading(true);
    const compressImage = async uri =>
      await ImageCompressor.compress(uri, {
        compressionMethod: 'auto',
      });

    const compressVideo = async uri =>
      await VideoCompressor.compress(uri, {
        compressionMethod: 'auto',
      }).then(uri => uri.replace('file://', 'file:///'));

    const fileExtension = media.uri.split('.').slice(-1, 2)[0];

    const fileName = new Date().getTime() + '.' + fileExtension;

    const mediaURI = isImage
      ? await compressImage(photoWithFilter)
      : await compressVideo(media.uri);
    const photoData = {
      uri: mediaURI,
      type: media.type,
      name: fileName,
    };

    const uploadData = {
      post_file: photoData,
      post_type: isImage ? 'image' : 'video',
      post_text: caption.trim(),
      post_type_url: '',
    };

    dispatch(uploadPost(uploadData))
      .unwrap()
      .then(res => {
        const isPosted = res.status === 200;

        if (!isPosted) {
          errorAlert(res);
        }
        console.log('New data------', res.data[0]);
        if (isPosted) {
          setCaption('');
          setMediaSelected(false);
          setIsNext(false);
          dispatch(addNewPost(res.data[0]));
          navigation.navigate('Home');
        }
        setLoading(false);
      });
  };

  const SelectedFilterComponent = FILTERS[selectedFilterIndex].filterComponent;

  const renderFilterComponent = (item, index) => {
    const FilterComponent = item.filterComponent;
    const image = (
      <Image
        style={styles.filterSelector}
        source={{ uri: media.uri }}
        resizeMode={'contain'}
      />
    );
    return (
      <TouchableOpacity onPress={() => onSelectFilter(index)}>
        <Text style={styles.filterTitle}>{item.title}</Text>
        <FilterComponent image={image} />
      </TouchableOpacity>
    );
  };

  const options = {
    noData: true,
    mediaType: 'mixed',
  };

  const launchGallery = () => {
    launchImageLibrary(options, response => {
      console.log('selectedPhoto', response);
      if (response?.assets?.length > 0) {
        setMedia({
          uri: response.assets[0].uri,
          type: response.assets[0].type,
        });
      }
    });
  };
  const renderItem = useCallback(({ item, index }) => {
    if (item.type == 'all photos') {
      return (
        <TouchableOpacity
          onPress={launchGallery}
          style={{
            marginHorizontal: widthToDp('0.5'),
            marginVertical: heightToDp('0.2'),
            backgroundColor: '#181818',
            height: 140,
            width: widthToDp('33'),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon1
            name="collections"
            color="gray"
            size={heightToDp('15')}
            style={{ position: 'absolute', zIndex: -10 }}
          />
          <View
            style={{
              backgroundColor: 'black',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
              opacity: 0.6,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: heightToDp('3'),
                textAlign: 'center',
              }}>
              See All
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return <PhotoBox item={item} setMedia={x => setMedia(x)} />;
  }, []);
  console.log('media', media);
  const renderGallery = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: widthToDp('5'),
            marginVertical: heightToDp('1.2'),
          }}>
          <Text
            style={{
              fontSize: heightToDp('3.4'),
              color: 'white',
              fontWeight: '400',
            }}
            onPress={() => setMediaSelected(false)}>
            Gallery
          </Text>
          {!mediaSelected && (
            <Icon
              name="checkbox-active"
              size={25}
              color="white"
              onPress={() => {
                setMediaSelected(true);
                scrollToTop();
              }}
            />
          )}
        </View>

        <View
          style={{ marginBottom: heightToDp('5'), height: heightToDp('80') }}>
          {!mediaSelected ? (
            <FlatList
              data={multiMedia}
              renderItem={renderItem}
              keyExtractor={(item, index) => String(index)}
              numColumns={3}
              initialNumToRender={3}
              maxToRenderPerBatch={3}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled
            />
          ) : (
            media.type.includes('image') && (
              <ScrollView horizontal={true} nestedScrollEnabled={false}>
                {FILTERS.map((item, index) => {
                  return (
                    <View style={{ marginTop: 25 }}>
                      {renderFilterComponent(item, index)}
                    </View>
                  );
                })}
              </ScrollView>
            )
          )}
        </View>
      </>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: 'black' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {/*  */}

          <ScrollView
            // stickyHeaderIndices={!mediaSelected ? [1] : []}
            // scrollEnabled={!mediaSelected}
            showsVerticalScrollIndicator={false}
            ref={scrollRef}>
            {
              media != '' && (
                // (media.type.includes('image') ? (
                // !mediaSelected ? (
                <>
                  {/* {selectedCar ? (
                    <ImageCropDialog
                      id={selectedCar.id}
                      imageUrl={selectedCar.uri}
                      cropInit={selectedCar.crop}
                      zoomInit={selectedCar.zoom}
                      aspectInit={selectedCar.aspect}
                      onCancel={onCancel}
                      setCroppedImageFor={setCroppedImageFor}
                      resetImage={resetImage}
                    />
                  ) : null} */}

                  <Image
                    style={styles.image}
                    source={{ uri: media.uri }}
                    resizeMode={'contain'}
                    onPress={() => setSelectedCar(media)}
                    alt=""
                  />

                  {/* <Cropper
                    image="https://ik.imagekit.io/ikmedia/backlit.jpg"
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                  <View>
                    <TextInput
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={e => {
                        setZoom(e.target.value);
                      }}
                      style={styles.zoomrange}
                    /> */}
                  {/* <ImageCrop
                    src="https://ik.imagekit.io/ikmedia/backlit.jpg"
                    setWidth={300}
                    setHeight={300}
                    square={false}
                    resize={true}
                    border={'dashed #ffffff 2px'}
                    onCrop={onCropped}
                  /> */}
                </>
              )
              // ) : (
              // ) : (
              //   <>

              //     <SelectedFilterComponent
              //       onExtractImage={data => onExtractImage(data)}
              //       extractImageEnabled={true}
              //       image={
              //         <View>
              //           <Image
              //             style={styles.image}
              //             // source={{ uri: media.uri }}
              //             //resizeMode={'contain'}
              //           />
              //         </View>
              //       }
              //     />
              //   </>
              // )
              //   <Video
              //     style={styles.image}
              //     source={{ uri: media.uri }}
              //     resizeMode={'stretch'}
              //     volume={10}
              //     repeat
              //   />
              // ))
            }
            {!isNext && renderGallery()}
          </ScrollView>
          {isNext && (
            <View
              style={[
                styles.captionContainer,
                { height: keyboardShow ? heightToDp('75') : heightToDp('50') },
              ]}>
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Write a caption"
                  placeholderTextColor={'gray'}
                  style={[styles.input, { height: texHeight }]}
                  autoCapitalize="none"
                  value={caption}
                  onChangeText={setCaption}
                  multiline={true}
                  onContentSizeChange={event => {
                    settexHeight(event.nativeEvent.contentSize.height);
                  }}
                />
                <Icon3 name="edit" size={heightToDp('3')} color="#F5F5F5" />
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
        {!keyboardShow && multiMedia != '' ? (
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: heightToDp('5'),
              alignSelf: 'center',
            }}
            onPress={
              !isNext && mediaSelected
                ? () => setIsNext(true)
                : !isNext && !mediaSelected
                ? () => setMediaSelected(true)
                : !loading
                ? handleUploadPost
                : () => {}
            }>
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
                {!isNext ? (
                  <Icon3
                    name="arrowright"
                    size={heightToDp('3')}
                    color="#F5F5F5"
                  />
                ) : !loading ? (
                  <Icon3 name="check" size={heightToDp('3')} color="#F5F5F5" />
                ) : (
                  <ActivityIndicator size={heightToDp('11')} color="white" />
                )}
              </LinearGradient>
            </View>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: heightToDp('48'),
  },
  filterSelector: {
    width: widthToDp('22'),
    height: heightToDp('18'),
    margin: 5,
  },
  filterTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: 'white',
  },
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
  captionContainer: {
    height: heightToDp(45),
    width: '100%',
    backgroundColor: '#1c1c1c',
  },
  inputBox: {
    widthToDp: widthToDp('90'),
    marginBottom: heightToDp('2.5'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: widthToDp(5),
    paddingBottom: heightToDp(7),
    borderBottomColor: '#4f4d4d',
    borderBottomWidth: 1,
  },
  input: {
    width: widthToDp('80'),
    height: widthToDp('10'),
    paddingHorizontal: 5,
    alignSelf: 'center',
    fontSize: heightToDp('1.8'),
    color: 'white',
    marginLeft: widthToDp('3'),
    fontFamily: 'Poppins-Regular',
    borderColor: 'transparent',
    borderBottomWidth: 0,
    borderBottomColor: '#4f4d4d',
    justifyContent: 'flex-end',
    marginTop: heightToDp('2'),
  },
  buttonStyleOuterCircle: {
    height: 73,
    width: 73,
    alignSelf: 'flex-end',
    marginRight: widthToDp('3'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    marginTop: heightToDp('4.5'),
  },
  cropView: {
    width: widthToDp('5'),
    height: heightToDp('4'),
  },
});

export default PostScreen;
