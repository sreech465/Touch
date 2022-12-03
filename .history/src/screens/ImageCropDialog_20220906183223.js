import { View, Text } from 'react-native';
import React from 'react';

const aspectRatios = [
  { value: 4 / 3, text: '4/3' },
  { value: 16 / 9, text: '16/9' },
  { value: 1 / 2, text: '1/2' },
];

const ImageCropDialog = ({ id, imageUrl, cropInit, zoomInit, aspectInit }) => {
  if (zoomInit == null) {
    zoomInit = 1;
  }

  if (cropInit == null) {
    cropInit = { x: 0, y: 0 };
  }
  if (aspectInit == null) {
    aspectInit = aspectRatios[0];
  }
  return (
    <div>
      <div className="backdrop"></div>
      <div className="crop-container"></div>
    </div>
  );
};

export default ImageCropDialog;
