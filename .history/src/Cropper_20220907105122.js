import { View, Text, Image } from 'react-native';
import React, { useState } from 'react';
import CameraRoll from '@react-native-community/cameraroll';
const Cropper = () => {
  return (
    <View>
      <Image
        // style={styles.image}
        source={{ uri: 'https://ik.imagekit.io/ikmedia/backlit.jpg' }}
        resizeMode={'contain'}
        onPress={() => setSelectedCar(media)}
        alt=""
      />
      <Text>Cropper</Text>
    </View>
  );
};

export default Cropper;
