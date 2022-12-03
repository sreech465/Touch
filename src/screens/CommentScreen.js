/* eslint-disable prettier/prettier */
import { StackActions } from '@react-navigation/native';

import React, { useEffect, useState } from 'react';

import {
  Text,
  View,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux';
import  Comments from '../components/Comments';
import { LoadingView } from '../components/LoadingView';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Icon2 from 'react-native-vector-icons/dist/MaterialIcons';
import Post from '../components/Post';
import { removeAllComments, setAllComments, totalComments } from '../Redux/commentSlice';
import { getPostDetails } from '../Redux/postSlice';

const CommentScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [inputActive, setInputActive] = useState(true);
  const postData = useSelector(state => state.posts.postDetails);
  const user = useSelector(state => state.user.userdata);
  const totalCommentsLength = useSelector(totalComments);
  const dispatch = useDispatch();

  useEffect(() => {
    const getPostDetail = () => {
      dispatch(
        getPostDetails(JSON.stringify({ post_id: route.params?.postId })),
      )
        .unwrap()
        .then(response => {
          let comments = response?.message[0]?.commentdata
            ? response?.message[0]?.commentdata.map(item => {
              return { ...item.comment, replies: item.replies };
            })
            : [];

          if (comments.length === 0) {
            dispatch(removeAllComments());
            return;
          }
          dispatch(setAllComments(comments));
        })
        .finally(() => {
          setLoading(false);
        });
    };

    getPostDetail();
  }, [route.params?.postId]);

  const backAction = () => {
    const popAction = StackActions.pop(1);
    navigation.dispatch(popAction);
    return true;
  };

  console.log('post data by nikhil', postData);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      {loading ? (
        <LoadingView modalVisible={true} />
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: heightToDp('2'),
              marginHorizontal: widthToDp('5'),
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Icon2 name="arrow-back" size={heightToDp('4')} color="white" onPress={() => backAction()} />
            <Text
              style={{
                color: 'white',
                fontFamily: 'Poppins-Regular',
                fontSize: heightToDp('2.8'),
                marginLeft: widthToDp('3')
              }}>
              Comments
            </Text>
            <View>
              <TouchableOpacity
                onPress={() =>
                  navigation.push('Profile', { user_id: user.userid })
                }
                style={{
                  width: widthToDp('10'),
                  height: heightToDp('4.8'),
                  borderColor: '#FF5F6D',
                  borderWidth: widthToDp('0.4'),
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                }}>
                <Image
                  style={{
                    width: widthToDp('7.5'),
                    height: heightToDp('3.8'),
                    resizeMode: 'cover',
                    borderRadius: 6,
                  }}
                  source={{
                    uri: user?.profile_pic,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              paddingTop: heightToDp('1'),
              paddingBottom: heightToDp('2'),
              paddingHorizontal: widthToDp('4'),
              borderBottomColor: 'gray',
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                alignItems: 'center',
                marginRight: widthToDp('3'),
                flexDirection: 'row',
              }}>
              <TouchableOpacity onPress={() =>
                navigation.push('Profile', { user_id: postData.userid })
              }>
                <Image
                  style={{
                    width: 38,
                    height: 38,
                    resizeMode: 'cover',
                    borderRadius: 6,
                  }}
                  source={{ uri: postData?.profile_pic }}
                />
              </TouchableOpacity>

              <View style={{ marginLeft: widthToDp('3') }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 12,
                      fontFamily: 'Poppins-SemiBold',
                    }} onPress={() =>
                      navigation.push('Profile', { user_id: postData.userid })
                    }>
                    {postData.username ? postData.username : ''}
                  </Text>
                </View>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 10.8,
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  {postData.caption ? postData.caption : ''}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  marginRight: widthToDp('1'),
                }}>
                {postData.like_count ? postData.like_count : ''}
              </Text>
              <Icon
                name="favorite"
                color={'red'}
                size={14}
                style={{ marginTop: heightToDp('0.5') }}
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  marginLeft: widthToDp('3'),
                  marginRight: widthToDp('1'),
                }}>
                {totalCommentsLength}
              </Text>
              <Icon2
                name="comment"
                color='white'
                size={14}
                style={{ marginTop: heightToDp('0.5') }}
              />
            </View>
          </View>
          {/* <Post item={{ ...postData, postid: route.params?.postId }} navigation={navigation} /> */}
          <Comments postId={route.params?.postId} />
        </>
      )}
    </SafeAreaView>
  );
};

export default CommentScreen;
