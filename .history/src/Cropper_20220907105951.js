import { View, Text, Image } from 'react-native';
import React from 'react';

const Cropper = () => {
  return (
    <View>
      <Image
        source={{ uri: 'https://ik.imagekit.io/ikmedia/backlit.jpg' }}
        resizeMode={'contain'}
        alt=""
      />
    </View>
  );
};

export default Cropper;
