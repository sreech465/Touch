import { View, Text, Image } from 'react-native';
import React, { useState } from 'react';

const Cropper = () => {
  const [media, setMedia] = useState('');
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
  };

  return (
    <View>
      <Image
        // style={styles.image}
        source={{ uri: media.uri }}
        resizeMode={'contain'}
        onPress={() => setSelectedCar(media)}
        alt=""
      />
      <Text>Cropper</Text>
    </View>
  );
};

export default Cropper;
