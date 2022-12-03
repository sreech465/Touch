/* eslint-disable prettier/prettier */
import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import { heightToDp } from '../Assets/helpers/Responsive';

import PaginationDot from 'react-native-animated-pagination-dot';
import VideoPlayer from 'react-native-video-player';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image'

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
const MiddlePost = ({ item, isFrom, pauseVideo, index1 }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [currentIndex1, setCurrentIndex1] = React.useState(0);

  let data = (item.post_file && JSON.parse(item.post_file)) || [];
  let player = useRef(null);
  const onViewRef = React.useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  });
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });
  const isFromPostDetailScreen = isFrom === 'postDetailScreen';
  // console.log(index,pauseVideo, index==pauseVideo)

  const renderImage = (mediaItem, index) => {
   // console.log('image', mediaItem)
    return (
      <FastImage
      style={[
        styles.media,
        {
          height: isFromPostDetailScreen ? heightToDp(50) : heightToDp(50),
        },
      ]}
     source={{
      uri: mediaItem.path,
         // headers: { Authorization: 'someAuthToken' },
         priority: FastImage.priority.high,
     }}
     //source={{ uri: item.node.image.uri }}

     resizeMode={FastImage.resizeMode.cover}
 />
      // <Image
      //   style={[
      //     styles.media,
      //     {
      //       height: isFromPostDetailScreen ? heightToDp(50) : heightToDp(50),
      //     },
      //   ]}
      //   source={{
      //     uri: mediaItem.path,
      //   }}
      //   resizeMode="cover"
      // />
    );
  };
  const renderVideo = (mediaItem, index) => {
    //console.log('video', mediaItem)

    return (
      <Video
        ref={async ref => {
          player = ref;
        }}
        style={[
          styles.media,
          {
            height: isFromPostDetailScreen ? heightToDp(50) : heightToDp(50),
          },
        ]}
        source={{ uri: mediaItem.path }}
        resizeMode="cover"
        controls={false}
        repeat
        paused={pauseVideo == index1 && currentIndex == index ? false : true}

      /// paused={this.props.user.voicId == this.props.voicId ? false : true}
      // audioOnly={true}
      />
    );
  };
  const renderItem = (mediaItem, index) => {
    switch (mediaItem.type) {
      case 'image':
        return renderImage(mediaItem, index);

      case 'video':
        return renderVideo(mediaItem, index)


      default:
        Alert.alert('NUMBER NOT FOUND');
    }
  };

  return (
    <>
      <FlatList
        horizontal={true}
        data={data}
        scrollEnabled
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        legacyImplementation={false}
        keyExtractor={(_, index) => index}
        renderItem={({ item, index }) => renderItem(item, index)}
        scrollEventThrottle={16}
        nestedScrollEnabled
      />
      {data.length > 1 && (
        <View style={styles.pagination}>
          <PaginationDot
            activeDotColor={'white'}
            curPage={currentIndex}
            maxPage={data.length}
          />
        </View>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  pagination: {
    paddingTop: 8,
    alignItems: 'center',
  },
  media: {
    width: dimensions.width,
  },
});

export default React.memo(MiddlePost);
