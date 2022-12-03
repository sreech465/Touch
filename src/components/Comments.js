/* eslint-disable prettier/prettier */
import React from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, FlatList } from 'react-native';
import { Image, TextInput } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import { useKeyboardVisible } from '../Hooks/useKeyboardVisible';
import {
  postCommentAction,
  editUserCommentAction,
  postCommentLikeAction,
  deleteUserCommentAction,
  postCommentRepliesAction,
  updateCommentReplyAction,
  postCommentReplyLikeAction,
  deleteCommentReplyAction,
  selectAllComments,
  updateComment,
  removeComment,
  addComment,
  getComments,
  getCommentReplies,
  setAllComments,
  removeAllComments,
  addManyComments,
} from '../Redux/commentSlice';
import { useNavigation } from '@react-navigation/native';

const Comments = ({ postId }) => {
  const [comment, setComment] = React.useState('');
  const navigation = useNavigation();
  const [selectedCommentId, setSelectedCommentId] = React.useState();

  const [selectedCommentReplyId, setSelectedCommentReplyId] = React.useState();

  const [isEditComment, setIsEditComment] = React.useState(false);

  const offset = React.useRef(0);

  const [limit, setLimit] = React.useState(10);

  const replyOffset = React.useRef(1);

  const [replyLimit, setReplyLimit] = React.useState(5);

  const [isEditReplyComment, setIsEditReplyComment] = React.useState(false);

  const [isReplyComment, setIsReplyComment] = React.useState(false);

  const commentInputRef = React.useRef();

  const comments = useSelector(selectAllComments);

  const currentUserId = useSelector(state => state.user.userdata.userid);

  const dispatch = useDispatch();

  const errorAlert = res => Alert.alert('Error', JSON.stringify(res));

  const focusInput = () => commentInputRef.current.focus();

  const blurInput = () => commentInputRef.current.blur();

  const canEditDelete = userId => currentUserId === userId;

  const cancelReply = () => {
    setComment('');
    setIsReplyComment(false);
  };

  const isKeyboardVisible = useKeyboardVisible();

  React.useEffect(() => {
    if (!isKeyboardVisible) {
      blurInput();
    }
  }, [isKeyboardVisible]);

  React.useEffect(() => {
    renderComments();
  }, []);

  const renderComments = () => {
    console.log('commectNew id', postId);
    const data = {
      post_id: postId,
      offset: offset.current,
      limit: limit,
    };
    dispatch(getComments(data))
      .unwrap()
      .then(response => {
        let comments = response?.message
          ? response.message.map(item => {
            return { ...item.comment, replies: item.replies };
          })
          : [];
        console.log('comments', comments);
        if (comments.length === 0) {
          dispatch(removeAllComments());
          return;
        } else {
          if (offset === 0) {
            dispatch(setAllComments(comments));
          } else {
            dispatch(addManyComments(comments));
            offset.current++;
          }
        }
      })
  };

  const getMoreReply = id => {
    const input = {
      comment_id: id,
      offset: replyOffset.current,
      limit: replyLimit,
    };
    let selectedCommented = comments.find(
      item => Number(item.id) === Number(id),
    );
    dispatch(getCommentReplies(input))
      .unwrap()
      .then(response => {
        console.log('getMoreReply2', response);
        let reply = response?.message?.replies;
        dispatch(
          updateComment({
            id,
            changes: { replies: [...selectedCommented.replies, ...reply] },
          }),
        );
        offset.current++;
      });
  };

  const postComments = () => {
    if (comment === '') {
      return;
    }
    let updateCommentData = {
      comment_id: selectedCommentId,
      text: comment.trim(),
    };

    if (isEditComment) {
      dispatch(editUserCommentAction(JSON.stringify(updateCommentData)))
        .unwrap()
        .then(res =>
          res.status === 200
            ? dispatch(
              updateComment({ id: selectedCommentId, changes: { comment } }),
            )
            : errorAlert(res),
        )
        .finally(() => {
          setComment('');
          setIsEditComment(false);
          setSelectedCommentId('');
          blurInput();
        });
      return;
    }

    let postCommentReplyData = {
      comment_id: selectedCommentId,
      text: comment.trim(),
      reaction_id: '0',
    };

    if (isReplyComment) {
      let selectedCommented = comments.filter(
        item => Number(item.id) === selectedCommentId,
      )[0];

      dispatch(postCommentRepliesAction(JSON.stringify(postCommentReplyData)))
        .unwrap()
        .then(res => {
          let newReplyComment = {
            ...res.data[0].replyCommentInfo[0],
            ...res.data[0].userInfo[0],
          };
          delete newReplyComment.profile_social_details;
          let replies =
            selectedCommented.replies?.length > 0
              ? [...selectedCommented.replies, newReplyComment]
              : [newReplyComment];
          res.status === 200
            ? dispatch(
              updateComment({ id: selectedCommentId, changes: { replies } }),
            )
            : errorAlert(res);
        })
        .finally(() => {
          setComment('');
          setIsReplyComment(false);
          setSelectedCommentId('');
          blurInput();
        });
      return;
    }

    if (isEditReplyComment) {
      let selectedCommented = comments.filter(
        item => Number(item.id) === Number(selectedCommentId),
      )[0];

      const updatedReplies = selectedCommented.replies.map(reply => {
        if (reply.id === selectedCommentReplyId) {
          let replyCopy = { ...reply };
          replyCopy.text = comment.trim();
          return replyCopy;
        }
        return reply;
      });

      let updateCommentReplyData = {
        comment_reply_id: selectedCommentReplyId,
        text: comment.trim(),
      };

      dispatch(updateCommentReplyAction(updateCommentReplyData))
        .unwrap()
        .then(res => {
          res.status === 200
            ? dispatch(
              updateComment({
                id: selectedCommentId,
                changes: { replies: [...updatedReplies] },
              }),
            )
            : errorAlert(res);
        })
        .finally(() => {
          setComment('');
          setSelectedCommentId('');
          setSelectedCommentReplyId('');
          setIsEditReplyComment(false);
          blurInput();
        });
      return;
    }

    let commentData = {
      post_id: postId,
      text: comment.trim(),
      reaction_id: '0',
    };

    dispatch(postCommentAction(JSON.stringify(commentData)))
      .unwrap()
      .then(res => {
        let newComment = {
          ...res.data[0].commentData[0],
          ...res.data[0].userInfo[0],
        };
        newComment.comment = newComment.text;
        delete newComment.text;
        delete newComment.profile_social_details;
        res.status === 200 ? dispatch(addComment(newComment)) : errorAlert(res);
      })
      .finally(() => {
        setComment('');
        setSelectedCommentId('');
        blurInput();
      });
  };

  const likeComment = (id,like_count,is_liked) => {
    //let selectedCommented = comments.filter(item => Number(item.id) === id)[0];

    let isLiked = is_liked === 1 ? 0 : 1;
    let updateCommentData = {
      comment_id: id,
      reaction_id: 1,
    };

    let likeCount = like_count || 0;
    likeCount = is_liked === 1 ? likeCount - 1 : likeCount + 1;

      dispatch(
        updateComment({ id, changes: { isLiked, like_count: likeCount } }),
      )
          dispatch(postCommentLikeAction(JSON.stringify(updateCommentData)))
        
  
  };

  const likeReplyComment = (id, comment_id,like_count,is_liked) => {
    let selectedCommented = comments.filter(
      item => Number(item.id) === Number(comment_id),
    )[0];
 

    let isLiked = is_liked === 1 ? 0 : 1;

    let updateCommentData = {
      comment_reply_id: id,
      reaction_id: 1,
    };

    let likeCount = like_count || 0;
    likeCount = is_liked === 1 ? likeCount - 1 : likeCount + 1;

    const updatedReplies = selectedCommented.replies.map(reply => {
      if (reply.id === id) {
        return { ...reply, isLiked, like_count: likeCount }
      }
      return reply;
    });
    dispatch(
      updateComment({
        id: comment_id,
        changes: { replies: [...updatedReplies] },
      }),
    );
    dispatch(
      postCommentReplyLikeAction(JSON.stringify(updateCommentData)),
    )
  };

  const updateUserComment = id => {
    isReplyComment && cancelReply();

    setIsEditComment(true);
    setSelectedCommentId(id);
    let selectedCommented = comments.filter(item => Number(item.id) === id)[0];
    setComment(selectedCommented.comment);
    focusInput();
  };

  const replyToComment = id => {
    setIsReplyComment(true);
    setSelectedCommentId(id);
    focusInput();
  };

  const deleteComment = id => {
    dispatch(deleteUserCommentAction(JSON.stringify({ comment_id: id })))
      .unwrap()
      .then(res =>
        res.status === 200 ? dispatch(removeComment(id)) : errorAlert(res),
      );
  };

  const updateCommentReply = (id, comment_id) => {
    isReplyComment && cancelReply();

    setIsEditReplyComment(true);
    setSelectedCommentReplyId(id);
    setSelectedCommentId(comment_id);
    let selectedCommented = comments.filter(
      item => Number(item.id) === Number(comment_id),
    )[0];
    let oldReplies = selectedCommented.replies;
    const selectedReply = oldReplies.filter(reply => reply.id === id)[0];
    setComment(selectedReply.text);
    focusInput();
  };

  const deleteCommentReply = (id, comment_id) => {
    let selectedCommented = comments.filter(
      item => Number(item.id) === Number(comment_id),
    )[0];
    let oldReplies = selectedCommented.replies;
    const replies = oldReplies.filter(reply => reply.id !== id);
    const selectedReply = oldReplies.filter(reply => reply.id === id)[0];

    let deleteReplyData = {
      comment_reply_id: id,
      text: selectedReply.text,
    };

    dispatch(
      deleteCommentReplyAction({ id, body: JSON.stringify(deleteReplyData) }),
    )
      .unwrap()
      .then(res => {
        res.status === 200
          ? dispatch(updateComment({ id: comment_id, changes: { replies } }))
          : errorAlert(res);
      });
  };

  const renderProfileImage = (uri, replyComment = false) => {
    return (
      <Image
        source={{ uri }}
        style={
          replyComment
            ? StyleSheet.flatten([
              styles.userProfileImage,
              styles.replyUserProfileImage,
            ])
            : styles.userProfileImage
        }
      />
    );
  };

  const renderReplyProfileImage = (uri, replyComment = false) => {
    return (
      <Image
        source={{ uri }}
        style={
          replyComment
            ? StyleSheet.flatten([styles.userProfileImage2])
            : styles.userProfileImage
        }
      />
    );
  };

  const renderReplyingTo = () => {
    let selectedCommented = comments.filter(
      item => Number(item.id) === selectedCommentId,
    )[0];
    return (
      <View style={styles.replyingToBar}>
        <Text style={styles.replyingToTextColor}>
          Replying to {selectedCommented.username}
        </Text>
        <Icon name="clear" color="black" size={20} onPress={cancelReply} />
      </View>
    );
  };

  const diffDateWithNow = date => {
    let startDate = new Date(Number(date));
    // Do your operations
    let endDate = new Date();
    let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
    let minutes = seconds / 60;
    let hours = minutes / 60;
    let days = hours / 24;
    let current;
    if (days >= 1) {
      current = days == 1 ? 'day' : 'days';
      return Math.trunc(days) + ' ' + current;
    } else if (hours > 1) {
      current = hours == 1 ? 'hour' : 'h';
      return Math.trunc(hours) + ' ' + current;
    } else {
      current = minutes == 1 ? 'minute' : 'm';
      return Math.trunc(minutes) + ' ' + current;
    }
  };

  const postNewComment = () => {
    return (
      <View style={styles.postNewComment}>
        {isReplyComment && renderReplyingTo()}
        <View style={styles.postCommentInputContainer}>
          <TextInput
            placeholder={isReplyComment ? 'Add a reply...' : 'Add a comment...'}
            placeholderTextColor="white"
            value={comment}
            autoCapitalize="none"
            onChangeText={setComment}
            style={styles.commentTextInput}
            multiline
            ref={commentInputRef}
          />
          <TouchableOpacity
            onPress={() => postComments()}
            style={{
              backgroundColor: '#FF5F6D',
              width: widthToDp('20'),
              height: heightToDp('5'),
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: heightToDp('2.2'),
                fontFamily: 'Poppins-SemiBold',
              }}>
              Post
            </Text>
          </TouchableOpacity>
          {/* <Button title="Post" color={'#FF5F6D'} onPress={postComments} /> */}
        </View>
      </View>
    );
  };

  const renderReplyComment = item => {
    return (
      <View style={styles.replyComment}>
        {item ? (
          <>
            <View
              style={[
                styles.commentContainer,
                { marginLeft: widthToDp('10') },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={styles.comment}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.push('Profile', { user_id: item.user_id })
                    }>
                    {renderReplyProfileImage(item?.profile_pic, true)}
                  </TouchableOpacity>
                  <View>
                    <View
                      style={{ flexDirection: 'row', width: widthToDp('60') }}>
                      <Text style={StyleSheet.flatten([styles.userNameStyle])}>
                        {item.username}
                        <Text
                          style={StyleSheet.flatten([styles.commentTextStyle])}>
                          {' ' + item.text}
                        </Text>
                      </Text>
                    </View>

                    <View style={styles.actions}>
                      <Text style={styles.replyCommentTextColor}>
                        {diffDateWithNow(item.timestamp)}
                      </Text>
                      {canEditDelete(item.user_id) && (
                        <Text
                          style={styles.replyCommentTextColor}
                          onPress={() =>
                            updateCommentReply(item.id, item.comment_id)
                          }>
                          Edit
                        </Text>
                      )}
                      {canEditDelete(item.user_id) && (
                        <Text
                          style={styles.replyCommentTextColor}
                          onPress={() =>
                            deleteCommentReply(item.id, item.comment_id)
                          }>
                          {' '}
                          Delete
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                <TouchableOpacity  onPress={() => likeReplyComment(item.id, item.comment_id,item.like_count,item.isLiked)} >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {renderLikeCount(item.like_count)}
                  <Icon
                    name="favorite"
                    color={item?.isLiked === 1 ? 'red' : 'white'}
                    style={{padding:5}}
                    size={17}
                  />
                </View>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : null}
      </View>
    );
  };

  const renderLikeCount = count => {
    // let likeText = 'like';
    // if (!count || count === 0) {
    //   return;
    // }
    // if (count > 1) {
    //   likeText = 'likes';
    // }
    return (
      <Text
        style={[
          styles.replyCommentTextColor,
          {
            marginRight: widthToDp('1'),
            fontSize: 14,
            color: '#FF5F6D',
            marginTop: heightToDp('0.4'),
          },
        ]}>
        {count}
      </Text>
    );
  };

  const renderUserComment = item => {
    console.log('comment', item);
    return item && item.profile_pic ? (
      <>
        <View style={styles.commentContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: widthToDp('4'),
            }}>
            <View style={styles.comment}>
              <TouchableOpacity
                onPress={() =>
                  navigation.push('Profile', { user_id: item.userid })
                }>
                {renderProfileImage(item.profile_pic)}
              </TouchableOpacity>
              <View style={{ marginLeft: widthToDp('3.5') }}>
                <View style={{ flexDirection: 'row', width: widthToDp('70') }}>
                  <Text style={styles.userNameStyle}>
                    {item.username}{' '}
                    <Text style={styles.commentTextStyle}>{item.comment}</Text>
                  </Text>
                </View>

                <View style={styles.actions}>
                  <Text style={styles.replyCommentTextColor}>
                    {diffDateWithNow(item.timestamp)}
                  </Text>
                  <Text
                    style={styles.replyCommentTextColor}
                    onPress={() => replyToComment(item.id)}>
                    reply
                  </Text>
                  {canEditDelete(item.user_id || item.userid) && (
                    <Text
                      style={styles.replyCommentTextColor}
                      onPress={() => updateUserComment(item.id)}>
                      Edit
                    </Text>
                  )}
                  {canEditDelete(item.user_id || item.userid) && (
                    <Text
                      style={styles.replyCommentTextColor}
                      onPress={() => deleteComment(item.id)}>
                      Delete
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <TouchableOpacity  onPress={() => likeComment(item.id,item.like_count,item.isLiked)}>
            <View style={{ flexDirection: 'row',}}>
              {renderLikeCount(item.like_count)}
         
              <Icon
                name="favorite"
                color={item.isLiked ==1 ? 'red' : 'white'} 
                size={17}
                style={{padding:5}}
              />
              
             
            </View>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={item.replies}
          renderItem={({ item: item1 }) => renderReplyComment(item1)}
          keyExtractor={item1 => item1.id}
        />
        {item.replies ? (
          <TouchableOpacity
            onPress={() => getMoreReply(item.id)}
            style={{ marginHorizontal: widthToDp('18') }}>
            <Text
              style={{
                fontSize: 11,
                color: 'gray',
                fontFamily: 'Poppins-Regular',
              }}>
              -------- View More replies
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </>
    ) : null;
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          marginBottom: heightToDp('0'),
          marginTop: heightToDp('1'),
        }}>
        <FlatList
          data={comments}
          keyExtractor={item => item.id}
          renderItem={({ item }) => renderUserComment(item)}
          showsVerticalScrollIndicator={false}
          bounces={false}
          onEndReachedThreshold={0.2}
          onEndReached={renderComments}
        />
      </View>
      {Platform.OS === 'android' ? (
        postNewComment()
      ) : (
        <KeyboardAvoidingView behavior="padding">
          {postNewComment()}
        </KeyboardAvoidingView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    marginVertical: heightToDp('1'),
  },
  userNameStyle: {
    fontFamily: 'Poppins-SemiBold',
    marginRight: widthToDp('1'),
    color: '#FF5F6D',
    fontSize: 12.5,
  },
  replyUserNameStyle: {
    fontSize: 14,
  },
  userProfileImage: {
    height: 38,
    width: 38,
    borderRadius: 6,
  },
  userProfileImage2: {
    height: 25,
    width: 25,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: heightToDp('0.5'),
    marginHorizontal: widthToDp('3.5'),
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentTextStyle: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontSize: 12,
  },
  replyCommentTextStyle: {
    fontSize: 14,
  },
  actionsContainer: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  editCommentTextColor: {
    color: '#ff7100',
  },
  replyCommentTextColor: {
    color: 'gray',
    marginRight: widthToDp('4'),
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10.5,
  },
  deleteCommentTextColor: {
    color: 'red',
  },
  likeCountTextColor: {
    color: 'white',
  },

  replyComment: {
    marginHorizontal: widthToDp('4'),
  },
  commentTextInput: {
    width: widthToDp('70'),
    marginHorizontal: widthToDp('3.3'),
    borderRadius: 10,
    color: 'white',
    opacity: 0.7,
    height: heightToDp(5.4),
    borderColor: 'white',
    borderWidth: 1,
    padding:Platform.OS=='ios'? 15:10,
    paddingTop:Platform.OS=='ios'?12:0
  },
  postCommentInputContainer: {
    flexDirection: 'row',
    bottom: 15,
    marginTop: 25,
    alignItems: 'center',
  },
  postCommentButton: {
    marginLeft: widthToDp('1'),
    justifyContent: 'center',
  },
  postNewComment: {
    alignSelf: 'flex-end',
    alignSelf: 'center',
  },
  replyingToTextColor: {
    color: 'black',
    fontSize: 15,
    textAlign: 'left',
  },
  replyingToBar: {
    backgroundColor: '#D0D3D4',
    height: heightToDp(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: widthToDp(6),
  },
});

export default React.memo(Comments)