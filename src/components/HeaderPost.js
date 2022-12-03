/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Text, View, Image, Pressable } from 'react-native';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import Icon3 from 'react-native-vector-icons/dist/SimpleLineIcons';
import Report from './Report';
import FastImage from 'react-native-fast-image'

const reportOptions = [
  {
    optionText: 'Violence or dangerous organizations',
    key: 1,
  },
  {
    optionText: 'Scam or fraud',
    key: 2,
  },
  {
    optionText: 'Intellectual property violation',
    key: 3,
  },
];

const HeaderPost = ({
  image,
  username,
  location,
  user_id,
  postid,
  navigation,
  item,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const reportProps = {
    content_type: 'POST',
    content_id: postid,
    content_owner_id: user_id,
    reportOptions: reportOptions,
    isVisible: isModalVisible,
    reportStatus: item.post_report,
    hideModal: () => {
      setIsModalVisible(false);
    },
  };

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          paddingLeft: widthToDp('3.8'),
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: heightToDp('1'),
        }}>
        <Pressable
          style={{
            flexDirection: 'row',
          }}
          onPress={() => navigation.push('Profile', { user_id })}>
          <View
            style={{
              width: 42,
              height: 42,
              borderColor: '#FF5F6D',
              borderWidth: widthToDp('0.4'),
              borderRadius: 7,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: widthToDp('3'),
              backgroundColor: 'white',
            }}>
            <FastImage
               style={{
                width: 38,
                height: 38,
                resizeMode: 'cover',
                borderRadius: 5,
              }}
              source={{
                uri: image,
                // headers: { Authorization: 'someAuthToken' },
                priority: FastImage.priority.high,
              }}
              //source={{ uri: item.node.image.uri }}

              resizeMode={FastImage.resizeMode.cover}
            />
            {/* <Image
              style={{
                width: 45.7,
                height: 45.7,
                resizeMode: 'cover',
                borderRadius: 5,
              }}
              source={{ uri: image }}
            /> */}
          </View>
          <View>
            <Text
              style={{
                color: 'white',
                fontSize: heightToDp('1.9'),
                fontFamily: 'Poppins-SemiBold',
              }}>
              {username ? username : ''}
            </Text>
            {/* <Text style={{ fontFamily: 'Poppins-Regular', color: 'white', fontSize: heightToDp('1.5') }}>
            {location}
          </Text> */}
          </View>
        </Pressable>
        <Pressable onPress={() => setIsModalVisible(true)}>
          <Icon3 name="options-vertical" size={25} color="white" />
        </Pressable>
      </View>
      <Report {...reportProps} />
    </>
  );
};

export default React.memo(HeaderPost);
