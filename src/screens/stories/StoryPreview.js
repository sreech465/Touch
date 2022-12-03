import React from 'react';
import { Text, Image, View, StyleSheet } from 'react-native';
import RNBounceable from '@freakycoder/react-native-bounceable';

import { heightToDp, widthToDp } from '../../Assets/helpers/Responsive';


const StoryCircle = props => {
    const {
        source,
        onPress,
        hasStory,
        isSeen,
        showUsername,
        username,
        isFrom
    } = props;

    const isFromHomeScreen = isFrom === 'HomeScreen';

    const renderStoryPreview = () => (
        <>
            <View
                style={
                    StyleSheet.flatten(
                        [styles.profileImgContainer,
                        {
                            borderColor: isSeen ? '#808080' : '#FF5F6D',
                            width: isFromHomeScreen ? widthToDp('18') : widthToDp('25'),
                            height: isFromHomeScreen ? heightToDp('9') : heightToDp('12'),
                        }
                        ]
                    )
                }
            >
                <Image
                    source={source}
                    style={
                        StyleSheet.flatten(
                            [styles.profileImage,
                            {
                                width: isFromHomeScreen ? widthToDp('16') : widthToDp('23'),
                                height: isFromHomeScreen ? heightToDp('8') : heightToDp('11'),
                            }
                            ]
                        )
                    }
                />

            </View>
            {showUsername && <Text numberOfLines={1} style={styles.username}>{username}</Text>}
        </>
    );

    return (
        <RNBounceable onPress={onPress}  >
            <View style={StyleSheet.flatten([styles.container, { width: isFromHomeScreen ? widthToDp('20') : widthToDp('25') }])}>
                {renderStoryPreview()}
            </View>
        </RNBounceable>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: widthToDp('20')

    },
    profileImgContainer: {
        borderWidth: widthToDp('0.6'),
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    profileImage: {
        resizeMode: 'cover',
        borderRadius: 10,
    },
    username: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: heightToDp('1.7')
    }
})

export default StoryCircle;
