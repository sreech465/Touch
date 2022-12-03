import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Pressable,
  Modal, Image, FlatList
} from 'react-native';

import GestureRecognizer from 'react-native-swipe-gestures';
import Story from './Story';
import UserView from './UserView';
import ProgressArray from './ProgressArray';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import Icon5 from 'react-native-vector-icons/dist/AntDesign';
import { heightToDp, widthToDp } from '../../Assets/helpers/Responsive';
const SCREEN_WIDTH = Dimensions.get('window').width;
import { useNavigation } from '@react-navigation/native';
import { GetStoryView, InsertStoryView, updateStory } from './storiesSlice';
import { isResponseOk } from '../../Assets/helpers/ApiRoute';

const StoryContainer = props => {
  const { dataStories } = props;
  const { stories = [] } = dataStories || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPause, setIsPause] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(6);
  const [storyViews, setStoryViews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const story = stories.length ? stories[currentIndex] : {};
  const userData = useSelector(state => state.user.userdata);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isOwner = dataStories.id === userData.userid;

  // const onVideoLoaded = (length) => {
  //   props.onVideoLoaded(length.duration);
  // };

  useEffect(() => {
    if (props.currentUserIndex === 0 && Number(dataStories.id) === Number(userData.userid)) {
      getOwnerStoryViews();
    } else {
      insertNewStoryView();
    }
  }, [currentIndex, props.currentUserIndex])


  const updateStorySeen = (userid, storyid) => {

    const updatedStory = stories.map((story) => {
      if (story.id === storyid) {
        return { ...story, isSeen: 1 };
      }
      return story;
    });

    dispatch(updateStory({ id: userid, changes: { stories: updatedStory } }))
  }

  const getOwnerStoryViews = () => {
    // if (Number(dataStories.id) === Number(userData.userid)) {
    dispatch(GetStoryView(story))
      .unwrap()
      .then(res => {
        if (isResponseOk(res)) {
          setStoryViews(res.data);
        }
      })
    // }
  }

  const insertNewStoryView = () => {
    if (dataStories.id !== userData.userid) {
      if (story.isSeen === 0) {
        dispatch(InsertStoryView({ story_id: story.id }));
        updateStorySeen(dataStories.id, story.id);
      }
    }
  }


  const changeStory = evt => {
    if (evt.locationX > SCREEN_WIDTH / 2) {
      nextStory();
    } else {
      prevStory();
    }
  };

  const nextStory = () => {
    if (stories.length - 1 > currentIndex) {
      setCurrentIndex(currentIndex + 1);
      setLoaded(false);
      setDuration(6);
    } else {
      props.onStoryNext(false);
    }
  };

  const prevStory = () => {
    if (currentIndex > 0 && stories.length) {
      setCurrentIndex(currentIndex - 1);
      setLoaded(false);
      setDuration(6);
    } else {
      // setCurrentIndex(0);
      props.onStoryPrevious(false);
    }
  };

  const onImageLoaded = () => {
    setLoaded(true);
  };

  const onVideoLoaded = length => {
    setLoaded(true);
    setDuration(length.duration);
  };

  const onPause = result => {
    setIsPause(result);
  };

  const loading = () => {
    if (!isLoaded) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color="white" size={25} />
        </View>
      );
    }
  };

  const ViewSuser = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: 'black',
          height: heightToDp('9'),
          width: widthToDp('90'),
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: heightToDp('0.03'),
          borderRadius: 10,
          marginBottom: heightToDp('1')
        }}
        onPress={() => navigation.push('Profile', { user_id: item.user_id })}
        activeOpacity={0.8}>
        <View
          style={{
            width: widthToDp('12'),
            height: heightToDp('6'),
            borderColor: '#FF5F6D',
            borderWidth: widthToDp('0'),
            borderRadius: 10,
            marginLeft: widthToDp('5'),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}>
          <Image
            style={{
              width: widthToDp('10'),
              height: heightToDp('4.8'),
              resizeMode: 'cover',
              borderRadius: 6,
            }}
            source={{
              uri: item.profile_pic,
            }}
          />

        </View>
        <View style={{ marginLeft: widthToDp('3') }}>
          <Text style={{ fontFamily: 'Poppins-Regular', color: 'white' }}>
            {item.username}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              color: 'white',
              fontSize: heightToDp('1.3'),
            }}>
            {item.first_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ListModal = () => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            setIsPause(false);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  marginHorizontal: widthToDp('5'),
                  marginTop: heightToDp('1'),
                  alignItems: 'center',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '85%' }}>
                  <Text style={styles.textStyle}>Viewers</Text>
                  <Icon5 name="closecircle" size={20} color="white" onPress={() => { setModalVisible(!modalVisible), setIsPause(false); }} />
                </View>
                <View
                  style={{
                    marginTop: heightToDp('2'),
                  }}>
                  <FlatList
                    data={storyViews}
                    renderItem={ViewSuser}
                    keyExtractor={item => item.user_id}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const getViewsData = Data => {
    if (Data.status === 200) {
      setStoryViews(Data.data);
    } else {
      null;
    }
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const onSwipeDown = () => {
    props.onClose();
  };





  return (
    <>
      <GestureRecognizer
        onSwipeDown={onSwipeDown}
        config={config}
        style={styles.container}>
        <TouchableOpacity
          activeOpacity={1}
          // delayLongPress={500}
          onPress={e => changeStory(e.nativeEvent)}
          onLongPress={() => onPause(true)}
          onPressOut={() => onPause(false)}
          style={styles.container}>
          <View style={styles.container}>
            <Story
              onImageLoaded={onImageLoaded}
              pause={isPause}
              isNewStory={props.isNewStory}
              onVideoLoaded={onVideoLoaded}
              story={story}
              userId={dataStories.id}
              Views={getViewsData}
              updateStorySeen={updateStorySeen}
            />

            {loading()}

            <UserView
              name={dataStories.username}
              profile={dataStories.profile}
              datePublication={stories[currentIndex]?.created}
              onClosePress={props.onClose}
              userId={dataStories.id}
            />

            <ProgressArray
              next={nextStory}
              isLoaded={isLoaded}
              duration={duration}
              pause={isPause}
              isNewStory={props.isNewStory}
              stories={stories}
              currentIndex={currentIndex}
              currentStory={stories[currentIndex]}
              length={stories.map((_, i) => i)}
              progress={{ id: currentIndex }}
            />
          </View>
        </TouchableOpacity>
      </GestureRecognizer>
      <View style={styles.actionsContainer}>
        {!isOwner && <View style={{ justifyContent: 'center' }}>
          <Icon
            name="favorite"
            color={story?.is_liked === 1 ? 'red' : 'white'}
            onPress={() => props.likeStory(dataStories.id, story.id)}
            size={30}
          />
        </View>
        }
        {isOwner && <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
          <TouchableOpacity onPress={() => { setModalVisible(!modalVisible), setIsPause(true) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name="remove-red-eye"
                color={'white'}
                size={25}
              />
              <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: 'white' }}>
                {' ' + storyViews.length}
              </Text>
            </View>
          </TouchableOpacity>

          <Pressable onPress={() => props.deleteStory(dataStories.id, story.id)} style={{ alignSelf: 'center' }}>
            <Icon
              name="delete-forever"
              color="red"
              size={30}

            />
          </Pressable>

        </View>
        }
      </View>
      {isOwner && ListModal()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 6 : 4,
    marginBottom: 5,
  },
  progressBarArray: {
    flexDirection: 'row',
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 35,
    width: '98%',
    height: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userView: {
    flexDirection: 'row',
    position: 'absolute',
    top: 55,
    width: '98%',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 12,
    color: 'white',
  },
  time: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 3,
    marginLeft: 12,
    color: 'white',
  },
  content: { width: '100%', height: '100%' },
  loading: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  modal: {
    width: '100%',
    height: '90%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bar: {
    width: 50,
    height: 8,
    backgroundColor: 'gray',
    alignSelf: 'center',
    borderRadius: 4,
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    bottom: heightToDp(-4),
  },
  photoSelectcenteredView: {
    bottom: heightToDp('-5'),
  },
  modalView: {
    margin: 10,
    backgroundColor: '#181818',
    borderRadius: 20,
    paddingTop: heightToDp('2'),
    width: widthToDp('102'),
    height: heightToDp('93'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderColor: '#FF5F6D',
    borderWidth: 2,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  photoSelectModalView: {
    height: heightToDp('35'),
    backgroundColor: '#27314F',
    alignItems: 'center',
  },
  photoSelectCancel: {
    alignSelf: 'center',
  },

  button: {
    borderRadius: 10,
    paddingVertical: heightToDp('2'),
    elevation: 2,
    marginBottom: heightToDp('2'),
    width: widthToDp('35'),
  },
  photoSelectOptionButton: {
    width: widthToDp('60'),
  },
  closebutton: {
    borderRadius: 10,
    paddingVertical: heightToDp('1'),
    elevation: 2,
    marginBottom: heightToDp('2'),
    width: widthToDp('30'),
  },
  buttonOpen: {
    backgroundColor: '#FF5F6D',
  },
  buttonClose: {
    backgroundColor: '#FF5F6D',
  },
  textStyle: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    fontSize: heightToDp('2'),
    alignSelf: 'center',
  },
});

export default StoryContainer;
