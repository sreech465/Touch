import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react'
import { Image, StyleSheet, View } from 'react-native';
import { Text, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import Icon6 from 'react-native-vector-icons/dist/Feather';
import Icon1 from 'react-native-vector-icons/dist/MaterialIcons';
import moment from 'moment';

const formatTime = (timestamp) => {
    return moment(timestamp.toDate()).format("LT");
}

// Make a new component for different type of message

export const TextMessage = ({ message, friendProfileImage }) => {

    const ownerId = useSelector(state => state.user.userdata.userid);

    const isOwnerMsg = message.senderId === ownerId;

    const messageTextLength = message.msg.contentInfo?.text.length;

    if (!isOwnerMsg) {
        return (
            <View style={styles.msgLeftSide}>
                <View style={{
                    width: widthToDp('60'),
                    flexDirection: 'row',
                    alignItems: 'flex-start'
                }}>
                    <Image
                        style={styles.friendProfileImage}
                        source={{ uri: friendProfileImage }}
                    />
                    <View
                        style={{
                            backgroundColor: '#3B3B3B',
                            borderRadius: 25,
                            marginLeft: widthToDp('3'),
                            paddingVertical: widthToDp('1.5'),
                            flexDirection: messageTextLength < 15 ? 'row' : 'column'
                        }}>
                        <Text style={styles.msgText}>
                            {message.msg.contentInfo.text}
                        </Text>
                        <Text style={{
                            color: 'gray',
                            alignSelf: 'flex-end',
                            marginRight: widthToDp('3'),
                            fontSize: heightToDp('1.6'),
                        }}>{formatTime(message?.timeStamp)}</Text>
                    </View>
                </View>
            </View >
        );
    } else {
        return (
            <View style={styles.msgRightSide}>
                <View style={{ width: widthToDp('60'), alignItems: 'flex-end' }}>
                    <View
                        style={{
                            borderRadius: 25,
                            backgroundColor: '#6495ED',
                            paddingVertical: widthToDp('1.5'),
                            flexDirection: messageTextLength < 15 ? 'row' : 'column'
                        }}>
                        <Text style={styles.msgText}>
                            {message.msg.contentInfo.text}
                        </Text>
                        <Text style={{
                            color: 'black',
                            alignSelf: 'flex-end',
                            marginRight: widthToDp('3'),
                            fontSize: heightToDp('1.6'),
                        }}>{formatTime(message?.timeStamp)}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

export const PostMessage = ({ message, friendProfileImage }) => {

    const ownerId = useSelector(state => state.user.userdata.userid);

    const isOwnerMsg = message.senderId === ownerId;

    const navigation = useNavigation();

    const { contentInfo } = message.msg;

    const isImage = contentInfo.uri.type == 'image';

    return (
        <View style={isOwnerMsg ? styles.msgRightSide : styles.msgLeftSide}>
            {!isOwnerMsg && <Image
                style={styles.friendProfileImage}
                source={{ uri: friendProfileImage }}
            />}
            <TouchableOpacity
                style={styles.postContainer}
                onPress={() =>
                    navigation.push('Post', {
                        postId: contentInfo.postId,
                    })
                }>
                <View>
                    <View style={styles.postHeader}>
                        <Image style={styles.postProfilePic}
                            source={{ uri: contentInfo.profilePic }}
                            resizeMode="cover"
                        />
                        <Text numberOfLines={1} style={styles.postUsername}>
                            {contentInfo.username}
                        </Text>
                    </View>
                    <View style={styles.postMediaContainer}>
                        {isImage ? <Image
                            style={{ height: heightToDp('30') }}
                            source={{ uri: contentInfo.uri.path }}
                            resizeMode="cover"
                        /> :
                            <Image
                                style={{
                                    height: heightToDp('30'),
                                    width: "100%"
                                }}
                                source={require('../Assets/assets/playIcon.jpg')}
                                resizeMode="cover"
                            />
                        }
                    </View>
                    {contentInfo.caption !== "" && <Text numberOfLines={2} style={styles.postFooter}>
                        <Text numberOfLines={1} style={styles.postUsername}>{`${contentInfo.username}  `}</Text>
                        {contentInfo.caption}
                    </Text>}
                </View>
                <Text style={{ color: 'gray', alignSelf: 'flex-end', margin: widthToDp('2') }}>{formatTime(message?.timeStamp)}</Text>
            </TouchableOpacity >
        </View >
    )
}

export const ReelMessage = ({ message, friendProfileImage }) => {

    const ownerId = useSelector(state => state.user.userdata.userid);

    const isOwnerMsg = message.senderId === ownerId;

    const navigation = useNavigation();

    const { contentInfo } = message.msg;

    return (
        <>
            <View style={isOwnerMsg ? styles.msgRightSide : styles.msgLeftSide}>
                {!isOwnerMsg && <Image
                    style={styles.friendProfileImage}
                    source={{ uri: friendProfileImage }}
                />}
                <TouchableOpacity
                    style={styles.reelContainer}
                    onPress={() => navigation.navigate('Reels', { reelId: contentInfo.reelId })}
                >
                    <View>
                        <Icon6
                            name="video"
                            size={heightToDp('4')}
                            color='#FF5F6D'
                            style={styles.reelIcon}
                        />

                        <Image
                            style={{
                                height: heightToDp('35'),
                                width: "100%",
                                borderRadius: widthToDp('2')
                            }}
                            source={require('../Assets/assets/playIcon.jpg')}
                            resizeMode="cover"
                        />
                        <View style={styles.reelFooter}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image style={styles.reelProfilePic}
                                    source={{ uri: contentInfo.profilePic }}
                                    resizeMode="cover"
                                />
                                <Text numberOfLines={1} style={styles.reelUsername}>
                                    {contentInfo.username}
                                </Text>
                            </View>
                            <Text style={{ color: 'gray', alignSelf: 'flex-end' }}>{formatTime(message?.timeStamp)}</Text>
                        </View>
                    </View>
                </TouchableOpacity >
            </View >
        </>
    )
}


export const ProfileMessage = ({ message, friendProfileImage }) => {

    const ownerId = useSelector(state => state.user.userdata.userid);

    const isOwnerMsg = message.senderId === ownerId;

    const navigation = useNavigation();

    const { contentInfo } = message.msg;

    return (
        <View style={isOwnerMsg ? styles.msgRightSide : styles.msgLeftSide}>
            {!isOwnerMsg && <Image
                style={styles.friendProfileImage}
                source={{ uri: friendProfileImage }}
            />}
            <TouchableOpacity
                style={styles.profileContainer}
                onPress={() =>
                    navigation.push('Profile', {
                        user_id: contentInfo.userId,
                    })
                }>
                <View style={styles.profileContent}>
                    <Image style={styles.userProfilePic}
                        source={{ uri: contentInfo.profilePic }}
                        resizeMode="cover"
                    />
                    <View>
                        <Text numberOfLines={1} style={styles.profileUsername}>
                            {contentInfo.username}
                        </Text>
                        <Text numberOfLines={1} style={styles.profileFullName}>
                            {contentInfo.fullName}
                        </Text>
                        <Text numberOfLines={2} style={styles.profileAbout}>
                            {contentInfo.about}
                        </Text>
                    </View>
                </View>
                <Text style={{ color: 'gray', alignSelf: 'flex-end', margin: widthToDp('2') }}>{formatTime(message?.timeStamp)}</Text>
            </TouchableOpacity >
        </View >
    )
}

// Identify the content type of the message and return the respective component

const Message = ({ message, friendProfileImage }) => {

    switch (message.msg.contentType) {
        case "text":
            return <TextMessage message={message} friendProfileImage={friendProfileImage} />
        case "post":
            return <PostMessage message={message} friendProfileImage={friendProfileImage} />
        case "reel":
            return <ReelMessage message={message} friendProfileImage={friendProfileImage} />
        case "userProfile":
            return <ProfileMessage message={message} friendProfileImage={friendProfileImage} />
        default:
            return (<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Icon1 name="error" size={heightToDp('2.5')} color='red' />
                <Text style={{ color: 'red', marginLeft: widthToDp('3'), fontSize: heightToDp('2.3') }}>{`${message.msg.contentType} is not handled.`}</Text>
            </View>)
    }
}

const styles = StyleSheet.create({
    friendProfileImage: {
        height: 32,
        width: 32,
        borderRadius: 20,
        alignSelf: 'center',
        padding: 5,
    },
    msgLeftSide: {
        marginVertical: heightToDp('0.5'),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: widthToDp('3'),
    },
    msgRightSide: {
        marginVertical: heightToDp('0.5'),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: widthToDp('3'),
    },
    msgText: {
        color: 'white',
        fontFamily: 'Poppins-Regular',
        fontSize: widthToDp('4.7'),
        marginHorizontal: widthToDp('4'),
    },
    postContainer: {
        marginVertical: heightToDp('0.2'),
        width: widthToDp('65'),
        backgroundColor: '#181818',
        borderRadius: heightToDp('1.5'),
        marginLeft: widthToDp('3')
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: widthToDp('3'),
        paddingVertical: heightToDp('1'),
    },
    postProfilePic: {
        width: widthToDp('9'),
        height: heightToDp('4'),
        borderRadius: heightToDp('0.5'),
        marginRight: widthToDp('3')
    },
    postUsername: {
        color: '#FF5F6D',
        fontWeight: 'bold',
        width: widthToDp('46')
    },
    postMediaContainer: {
        borderColor: 'gray',
        borderWidth: heightToDp('0.05'),
    },
    postFooter: {
        color: 'white',
        flexDirection: 'row',
        paddingHorizontal: widthToDp('3'),
        paddingVertical: heightToDp('1'),
    },

    reelContainer: {
        marginLeft: widthToDp('3'),
        backgroundColor: '#181818',
        width: widthToDp('40'),
        padding: widthToDp('0.5'),
        borderRadius: widthToDp('2')
    },
    reelIcon: {
        position: 'absolute',
        right: widthToDp('2'),
        zIndex: 1,
    },
    reelProfilePic: {
        width: widthToDp('9'),
        height: heightToDp('4'),
        borderRadius: heightToDp('2'),
        marginRight: widthToDp('2')
    },
    reelUsername: {
        color: '#FF5F6D',
        fontWeight: 'bold',
        width: widthToDp('25')
    },
    reelFooter: {
        position: 'absolute',
        bottom: 5,
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: widthToDp('1'),
    },
    profileContainer: {
        marginLeft: widthToDp('3'),
        width: widthToDp('65'),
        backgroundColor: '#181818',
        padding: widthToDp('0.5'),
        borderRadius: widthToDp('2'),

    },
    profileContent: {
        flexDirection: 'row',
        paddingHorizontal: widthToDp('2'),
        paddingTop: heightToDp('1'),
    },
    userProfilePic: {
        width: widthToDp('20'),
        height: heightToDp('10'),
        borderRadius: heightToDp('0.5'),
        marginRight: widthToDp('3')
    },
    profileUsername: {
        color: '#FF5F6D',
        fontWeight: 'bold',
        fontSize: heightToDp('2.1'),
        width: widthToDp('35')
    },
    profileFullName: {
        color: 'gray',
        fontWeight: 'bold',
        fontSize: heightToDp('1.8'),
        width: widthToDp('35')
    },
    profileAbout: {
        color: 'gray',
        fontSize: heightToDp('1.8'),
        width: widthToDp('35')
    }
});


export default React.memo(Message);