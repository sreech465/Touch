/* eslint-disable prettier/prettier */
import React, { useRef, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import {
    FlatList,
    Modal,
    StyleSheet,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { heightToDp } from '../../Assets/helpers/Responsive';
import { deleteStoryAction, likeStoryAction, removeStory, updateCurrentUserIndex, updateStory } from './storiesSlice';
import StoryPreview from './StoryPreview';
const { CubeNavigationHorizontal } = require('react-native-3dcube-navigation');

import StoryContainer from './StoryContainer';

const Stories = ({ storiesData, isFrom, showUsername }) => {

    const user = useSelector(state => state.user.userdata)

    const [isModelOpen, setModel] = useState(false);

    const currentUserIndex = useSelector(state => state.stories.currentUserIndex);

    const [currentScrollValue, setCurrentScrollValue] = useState(0);

    const modalScroll = useRef(null);

    const dispatch = useDispatch();

    const errorAlert = (res) => Alert.alert('Error', JSON.stringify(res));

    const deleteStory = (userId, storyId) => {
        const filteredDeletedStory = storiesData.filter(item => item.id === Number(userId))[0].stories.filter(item => item.id !== Number(storyId));
        dispatch(deleteStoryAction(storyId))
            .unwrap()
            .then((res) => {
                if (filteredDeletedStory.length === 0) {
                    onStoryClose();
                    return res.status === 200 ? dispatch(removeStory(userId)) : errorAlert(res);
                }
                return res.status === 200 ? dispatch(updateStory({ id: userId, changes: { stories: filteredDeletedStory } })) : errorAlert(res);
            });
    };

    const likeStory = (userId, storyId) => {

        const updatedStories = storiesData.filter(item => item.id === Number(userId))[0].stories.map(item => {
            if (item.id === Number(storyId)) {
                let likedValue = item?.is_liked === 1 ? 0 : 1;
                console.log('like story', likedValue);
                return { ...item, is_liked: likedValue };
            }
            return item;
        }
        );
        dispatch(likeStoryAction({
            story_id: storyId,
            reaction_id: 1,
        }))
            .unwrap()
            .then((res) => res.status === 200 ? dispatch(updateStory({ id: userId, changes: { stories: updatedStories } })) : errorAlert(res));
    };


    const onStorySelect = index => {
        dispatch(updateCurrentUserIndex(index));
        setModel(true);
    };

    const onStoryClose = () => {
        setModel(false);
    };

    const onStoryNext = (isScroll) => {
        const newIndex = currentUserIndex + 1;
        if (storiesData.length - 1 > currentUserIndex) {
            dispatch(updateCurrentUserIndex(newIndex));
            if (!isScroll) {
                try {
                    modalScroll.current.scrollTo(newIndex, true);
                } catch (e) {
                    console.warn('error=>', e);
                }
            }
        } else {
            setModel(false);
        }
    };

    const onStoryPrevious = (isScroll) => {
        const newIndex = currentUserIndex - 1;
        if (currentUserIndex > 0) {
            dispatch(updateCurrentUserIndex(newIndex));
            if (!isScroll) {
                modalScroll.current.scrollTo(newIndex, true);
            }
        }
    };

    const onScrollChange = scrollValue => {
        if (currentScrollValue > scrollValue) {
            onStoryNext(true);
            console.log('next');
            setCurrentScrollValue(scrollValue);
        }
        if (currentScrollValue < scrollValue) {
            onStoryPrevious(false);
            console.log('previous');
            setCurrentScrollValue(scrollValue);
        }
    };



    const isAllStoriesSeen = (stories) => {
        const result = stories.map((story) => (story.isSeen === 1)).every(Boolean);
        return result;
    }


    return (
        <View style={styles.container}>
            <FlatList
                data={storiesData}
                horizontal
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                    <View style={styles.boxStory}>
                        <StoryPreview
                            source={{ uri: user.userid === item.id ? user.profile_pic : item.profile }}
                            hasStory
                            isSeen={isAllStoriesSeen(item.stories)}
                            username={user.userid === item.id ? user.username : item.username}
                            showUsername={showUsername}
                            onPress={() => onStorySelect(index)}
                            isFrom={isFrom}
                        />
                    </View>
                )}
            />

            <Modal
                animationType="slide"
                transparent={false}
                visible={isModelOpen}
                style={styles.modal}
                onShow={() => {
                    if (currentUserIndex > 0) {
                        modalScroll.current.scrollTo(currentUserIndex, false);
                    }
                }}
                onRequestClose={onStoryClose}>
                <CubeNavigationHorizontal
                    callBackAfterSwipe={g => onScrollChange(g)}
                    ref={modalScroll}
                    style={styles.container}
                >

                    {storiesData.map((item, index) => (
                        <StoryContainer
                            key={item.id}
                            onClose={onStoryClose}
                            onStoryNext={onStoryNext}
                            onStoryPrevious={onStoryPrevious}
                            dataStories={item}
                            isNewStory={index !== currentUserIndex}
                            likeStory={likeStory}
                            currentUserIndex={currentUserIndex}
                            deleteStory={deleteStory}
                        />
                    ))}

                </CubeNavigationHorizontal>
            </Modal>
        </View>
    );
};

const styles = new StyleSheet.create({
    boxStory: {
        marginLeft: 9,
    },
    ItemSeparator: { height: 1, backgroundColor: '#ccc' },
    container: {
        flex: 1,
        paddingVertical: 5,
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#FFF',
    },
    superCircle: {
        borderWidth: 3,
        borderColor: 'blue',
        borderRadius: 60,
    },
    modal: {
        flex: 1,
    },
    title: {
        marginTop: heightToDp('0.6'),
        fontSize: 12,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Poppins-SemiBold',
    },
});

export default Stories;
