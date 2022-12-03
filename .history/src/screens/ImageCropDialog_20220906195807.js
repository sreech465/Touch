// import { View, Text } from 'react-native';
// import React from 'react';
// import Cropper from 'react-easy-crop';

// const aspectRatios = [
//   { value: 4 / 3, text: '4/3' },
//   { value: 16 / 9, text: '16/9' },
//   { value: 1 / 2, text: '1/2' },
// ];

// const onCropChange = crop => {
//   setCrop(crop);
// };

// const ImageCropDialog = ({ id, imageUrl, cropInit, zoomInit, aspectInit }) => {
//   if (zoomInit == null) {
//     zoomInit = 1;
//   }

//   if (cropInit == null) {
//     cropInit = { x: 0, y: 0 };
//   }
//   if (aspectInit == null) {
//     aspectInit = aspectRatios[0];
//   }
//   const [zoom, setZoom] = useState(zoomInit);
//   const [crop, setCrop] = useState(cropInit);
//   const [aspect, setAspect] = useState(aspectInit);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   return (
//     <div>
//       <div className="backdrop"></div>
//       <div className="crop-container">
//         <Cropper
//           image={imageUrl}
//           zoom={zoom}
//           crop={crop}
//           aspect={aspect.value}
//           onCropChange={onCropChange}
//           onZoomChange={onZoomChange}
//           onCropComplete={onCropComplete}
//         />
//       </div>
//     </div>
//   );
// };

// export default ImageCropDialog;

import { View, Text } from 'react-native';
import React from 'react';

const ImageCropDialog = () => {
  return (
    <View>
      <Text>ni3ncici</Text>
    </View>
  );
};

export default ImageCropDialog;
