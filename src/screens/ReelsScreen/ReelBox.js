import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  BackHandler,
  Platform,
  Pressable
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { heightToDp, widthToDp } from '../../Assets/helpers/Responsive';
import Video from 'react-native-video';
import Icon7 from 'react-native-vector-icons/dist/MaterialIcons';
import Icon2 from 'react-native-vector-icons/dist/Ionicons';
import Icon6 from 'react-native-vector-icons/dist/FontAwesome';
import Icon8 from 'react-native-vector-icons/dist/AntDesign';
import Icon9 from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { SmallLinearGradientButton } from '../../components/LinearGradientButton';
import moment from 'moment';
import { StackActions } from '@react-navigation/native';
import Share from '../../components/Share';
import { selectAllReels, reelLikeAction,updateReel } from '../../Redux/reelSlice';
const { height, width } = Dimensions.get('window');

const ReelBox = ({ item, index, currentIndex, likeReel }) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
  
    const shareProps = {
      isVisible: isModalVisible,
      hideModal: () => { setIsModalVisible(false); },
      headerText: 'Share Reel',
      data: {
        contentType: 'reel',
        contentInfo: {
          reelId: item.reels_id,
          profilePic: item.profile_pic,
          username: item.username,
          uri: item.file_path
        }
      }
    }
  
    const videoRef = useRef(null);
    const onBuffer = e => {
      console.log('buffering ......', e);
    };
    const onVideoError = e => {
      console.log('Error raised ......', e);
    };
  
  
    useEffect(() => {
      if (!!videoRef.current) {
        videoRef.current.seek(0);
      }
    }, [currentIndex]);
  
    return (
      <View style={{ flex: 1 }}>
        <Video
          source={{
            uri: item.file_path,
          }}
          resizeMode="contain"
          ref={videoRef}
          onBuffer={onBuffer}
          onError={onVideoError}
          paused={currentIndex != index}
          // paused={true}
          repeat
          style={styles.backgroundVideo}
        />
        <View style={styles.headers}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                width: 42,
                height: 42,
                borderColor: '#FF5F6D',
                borderWidth: widthToDp('0.5'),
                borderRadius: 10,
                marginRight: widthToDp('2.5'),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}
              onPress={() =>
                navigation.push('Profile', { user_id: item.userid })
              }>
              <Image
                style={{
                  width: 38,
                  height: 38,
                  resizeMode: 'cover',
                  borderRadius: 6,
                }}
                source={{
                  uri: item.profile_pic,
                }}
              />
            </TouchableOpacity>
            <View>
              <Text
                style={{
                  color: 'white',
                  fontSize: heightToDp('1.8'),
                  fontFamily: 'Poppins-SemiBold',
                }}>
                {item.username}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: heightToDp('1.4'),
                  fontFamily: 'Poppins-SemiBold',
                }}>
                0 Followers
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => { }}>
            <View
              style={{
                width: widthToDp('18'),
                height: heightToDp('3'),
                justifyContent: 'center',
              }}>
              <SmallLinearGradientButton
                name={'Follow'}
                textSize={heightToDp('1.4')}
                fontFamily={'Poppins-Regular'}
                borderRadius={50}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.details}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ justifyContent: 'flex-end' }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: heightToDp('2'),
                  fontFamily: 'Poppins-Bold',
                }}>
                {item.description}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: heightToDp('1.6'),
                    marginRight: widthToDp('2'),
                    fontFamily: 'Poppins-regular',
                  }}>
                  0 views
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon8 name="clockcircle" size={12} color="white" />
                  <Text
                    style={{
                      color: 'white',
                      fontSize: heightToDp('1.6'),
                      fontFamily: 'Poppins-Regular',
                      marginLeft: widthToDp('2')
                    }}>
                    {moment(
                      new Date(Number(item.timestamp)).toISOString(),
                    ).fromNow()}
                  </Text>
                </View>
  
              </View>
            </View>
            <View>
              <View
                style={{
                  alignItems: 'center',
                  height: heightToDp('23'),
                  justifyContent: 'space-between',
                }}>
                <Icon8 name = {item.isLiked === 1? "heart":"hearto"} size={30} color={item.isLiked === 1? "red":"white"} onPress={() =>likeReel(item.reels_id)}/>
                <Text
                  style={{
                    color: 'white',
                    fontSize: heightToDp('2'),
                    fontFamily: 'Poppins-Bold',
                  }}>
                  {item.like_count}
                </Text>
                <Icon9
                  name="comment-processing-outline"
                  size={32}
                  color="white"
                  style={{ transform: [{ rotateY: '180deg' }] }}
                />
                <Text
                  style={{
                    color: 'white',
                    fontSize: heightToDp('2'),
                    fontFamily: 'Poppins-Bold',
                  }}>
                  0
                </Text>
                <Pressable onPress={() => { setIsModalVisible(true); }}>
                  <Icon6 name="send-o" size={30} color="white" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        <Share {...shareProps} />
      </View>
    );
  };

  const styles = StyleSheet.create({
    backgroundVideo: {
      height: height,
      width: width,
    },
    headers: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: widthToDp('5'),
      position: 'absolute',
      width: widthToDp('100'),
      top: heightToDp('6'),
      alignItems: 'center',
    },
    details: {
      flex: 1,
      paddingHorizontal: widthToDp('5'),
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? heightToDp('4') : heightToDp('4'),
      width: widthToDp('100'),
    },
  });

  export default React.memo(ReelBox);