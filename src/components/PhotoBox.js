import React, { useEffect, useRef, useState,useMemo } from 'react';
import { widthToDp, heightToDp } from '../Assets/helpers/Responsive';
import {
  View,
  TouchableOpacity,
  Image,

} from 'react-native';
import Video from 'react-native-video';

const PhotoBox = ({ item,setMedia }) => {

    return item.node.type.includes('image') ? (
      <TouchableOpacity
        onPress={() =>
          setMedia({ uri: item.node.image.uri, type: item.node.type })
        }
        style={{
          marginHorizontal: widthToDp('0.5'),
          marginVertical: heightToDp('0.2'),
        }}>
        <View>
          <Image
            style={{ width: widthToDp('33'), height: 140 }}
            source={{ uri: item.node.image.uri }}
          />
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={() =>
          setMedia({ uri: item.node.image.uri, type: item.node.type })
        }
        style={{
          marginHorizontal: widthToDp('0.5'),
          marginVertical: heightToDp('0.2'),
        }}>
        <View>
          <Video
            style={{ width: widthToDp('33'), height: 140 }}
            source={{ uri: item.node.image.uri }}
            resizeMode={'stretch'}
            muted
            repeat
          />
        </View>
      </TouchableOpacity>
    );
  };

  export default React.memo(PhotoBox);