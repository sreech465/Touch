
import React from 'react';
import {
  View,
} from 'react-native';

import HeaderPost from './HeaderPost';
import MiddlePost from './MiddlePost';
import FooterPost from './FooterPost';

import { heightToDp } from '../Assets/helpers/Responsive';


const Post = ({ item, navigation, pauseVideo, index, isFrom}) => {

  const headerPostProps = {
    image: item.profile_pic,
    username: item.username,
    location: item.location_name,
    user_id: item.user_id || item.userid,
    navigation: navigation,
    isFrom: isFrom,
    postid: item.postid,
    item
  }

  const footerPostProps = {
    postTime: item.created_timestamp,
    like_count: item.like_count,
    isLiked: item.isLiked,
    postid: item.postid,
    navigation: navigation,
    isFrom: isFrom,
    caption: item.caption,
    index1:index,
    item
  }

  return (
    <View
      style={{
        backgroundColor: 'black',
        width: '100%',
        marginBottom: heightToDp('1'),
        paddingVertical: heightToDp('1')
      }}>
      <HeaderPost {...headerPostProps} />
      <MiddlePost item={item} navigation={navigation} isFrom={isFrom} pauseVideo={pauseVideo} index1={index} />
      <FooterPost {...footerPostProps} />
    </View>
  );
};


export default React.memo(Post);