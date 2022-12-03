import React from 'react';
import { Text, View, TouchableOpacity, Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import { likeFuction, postlikeFuction } from '../Redux/reducers/feedReducer';
import Icon2 from 'react-native-vector-icons/dist/Ionicons';
import Icon6 from 'react-native-vector-icons/dist/Feather';
import Icon8 from 'react-native-vector-icons/dist/AntDesign';
import Icon9 from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { likePost } from '../Redux/postSlice';
import moment from 'moment';
import { useState } from 'react';
import Share from './Share';

const FooterPost = ({
  postTime,
  like_count,
  isLiked,
  caption,
  postid,
  navigation,
  isFrom,
  index1,
  item,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewAll, setViewAll] = useState(false);

  const dispatch = useDispatch();

  const onLikeclick = () => {
    console.log('jghfghfhtgf', isFrom);
    if (isFrom === 'postDetailScreen') {
      dispatch(likePost());
    }
    dispatch(
      //likeFuction(JSON.stringify({ post_id: postid, reaction_id: '1',index:index1 })),
      likeFuction({
        post_id: postid,
        reaction_id: isLiked == 0 ? 1 : 0,
        index: index1,
        like_count: like_count,
        isFrom: isFrom,
      }),
    ).then(() => {
      // if (isFrom === "postDetailScreen") {
      //   dispatch(likePost())
      // }
      dispatch(
        postlikeFuction(
          JSON.stringify({
            post_id: postid,
            reaction_id: isLiked == 0 ? 1 : 0,
          }),
        ),
      );
    });
  };

  const getPostLikeText = likeCount => {
    var postLikeText = '';
    if (likeCount === 1) {
      postLikeText = likeCount + ' ' + 'Like';
    }
    if (likeCount > 1) {
      postLikeText = likeCount + ' ' + 'Likes';
    }
    return postLikeText;
  };

  const shareProps = {
    isVisible: isModalVisible,
    hideModal: () => {
      setIsModalVisible(false);
    },
    headerText: 'Share Post',
    data: {
      contentType: 'post',
      contentInfo: {
        postId: item.postid,
        profilePic: item.profile_pic,
        username: item.username,
        caption: item.caption,
        uri: JSON.parse(item.post_file)[0],
      },
    },
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginRight: widthToDp('2'),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            width: widthToDp('33'),
            marginHorizontal: widthToDp('2'),
            marginTop: heightToDp('2'),
            //backgroundColor:"red"
          }}>
          <TouchableOpacity
            onPress={() => onLikeclick()}
            style={{ paddingHorizontal: 10 }}>
            <Icon8
              name={isLiked > 0 ? 'heart' : 'hearto'}
              size={25}
              color={isLiked > 0 ? 'red' : 'white'}
            />
          </TouchableOpacity>
          <Icon2
            name="chatbubble-ellipses-outline"
            size={25}
            color="white"
            style={{
              transform: [{ rotateY: '180deg' }],
              paddingHorizontal: 10,
            }}
            onPress={() =>
              navigation.push('CommentScreen', {
                postId: postid,
              })
            }
          />
          <Pressable
            onPress={() => {
              setIsModalVisible(true);
            }}
            style={{ paddingHorizontal: 10 }}>
            <Icon6 name="send" size={25} color="white" />
          </Pressable>
        </View>
      </View>

      <View
        style={{
          marginHorizontal: widthToDp('4'),
          marginTop: heightToDp('0.6'),
        }}>
     
          <Text
            style={{
              color: 'white',
              fontSize: heightToDp('2'),
              fontFamily: 'Poppins-SemiBold',
            }}>
            {like_count >= 1 ? getPostLikeText(like_count):' '}
          </Text>
       
        {viewAll == true ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {caption !== '' && (
              <Text
                style={{
                  marginTop: heightToDp('-0.3'),
                  color: 'white',
                  fontSize: heightToDp('1.7'),
                  fontFamily: 'Poppins-Regular',
                  width: widthToDp('92'),
                }}>
                {caption + "  "}<Text
                  onPress={() => setViewAll(false)}
                  numberOfLines={1}
                  style={{
                    marginTop: heightToDp('-0.3'),
                    color: '#FF5F6D',
                    fontSize: heightToDp('1.7'),
                    fontFamily: 'Poppins-Regular',
                  }}>
                  ...Hide
                </Text>
              </Text>
            )}
                
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {caption !== '' && (
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={{
                  marginTop: heightToDp('-0.3'),
                  color: 'white',
                  fontSize: heightToDp('1.7'),
                  fontFamily: 'Poppins-Regular',
                  width: widthToDp('70'),
                }}>
                {caption}
              </Text>
            )}
            {caption !== '' ? (
              caption.length > 39 ? (
                <Text
                  onPress={() => setViewAll(true)}
                  numberOfLines={1}
                  style={{
                    marginTop: heightToDp('-0.3'),
                    color: '#FF5F6D',
                    fontSize: heightToDp('1.7'),
                    fontFamily: 'Poppins-Regular',
                  }}>
                  more
                </Text>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </View>
        )}

        <View
          style={{
            marginTop: heightToDp('-0.3'),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: item.comment_count ? 'space-between' : 'flex-end',
          }}>
          {item.comment_count ? (
            <Text
              style={{
                color: '#FF5F6D',
                fontSize: heightToDp('1.7'),
                fontFamily: 'Poppins-Regular',
              }}
              onPress={() =>
                navigation.push('CommentScreen', {
                  postId: postid,
                })
              }>
              View all Comments
            </Text>
          ) : null}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                color: 'gray',
                fontFamily: 'Poppins-Regular',
                fontSize: heightToDp('1.7'),
                marginRight: widthToDp('1'),
              }}>
              {moment(new Date(Number(postTime)).toISOString()).fromNow()}
            </Text>
            <Icon9 name="clock-fast" size={18} color="gray" />
          </View>
        </View>
      </View>
      <Share {...shareProps} />
    </View>
  );
};

export default React.memo(FooterPost);
