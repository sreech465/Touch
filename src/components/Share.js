import React, { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native';
import { Text } from 'react-native';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import AnimatedModal from './AnimatedModal';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { LoadingView } from './LoadingView';
import messaging from '@react-native-firebase/messaging';
import { getUniqueId } from 'react-native-device-info';

// you can use this share component to share any type of content via in-app messaging.
// you need to write the respective component in MultiMediaMsg component 
// to show different content type in chat screen
// also you need to write condition in message screen to hanlde recent message of particular content type

// The props shape of share component
// shareProps = {
//     isVisible: Boolean,
//     hideModal: () => {},
//     data: {
//       contentType: 'text' | 'post' | 'reel' | 'link' | 'userProfile'...,
//       contentInfo: {}
//     }
//   }

const conversationsRef = firestore().collection('conversations');

const Share = ({ isVisible, hideModal, headerText, data }) => {

    const followingList = useSelector(state => state.userData.following);

    const followersList = useSelector(state => state.userData.follower);

    const combinedList = (followersList && followingList) ? [...followersList, ...followingList] : [];

    const userIds = combinedList.map(item => item.userid);

    // To remove duplicate user from combined list

    const shareList = combinedList.filter(({ userid }, index) => !userIds.includes(userid, index + 1));

    const userData = useSelector(state => state.user.userdata);

    const [sentList, setSentList] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const handleSendTo = async (receiver) => {

        setIsLoading(true);

        const currentUserData = {
            userId: userData.userid,
            fullName: userData.full_name,
            profile_pic: userData.profile_pic,
        }

        const friendUserData = {
            userId: receiver.userid,
            fullName: receiver.first_name + '  ' + (receiver.last_name ? receiver.last_name : ""),
            profile_pic: receiver.profile_pic,
        }

        const compare = (a, b) => a - b;

        const uid = [currentUserData.userId, friendUserData.userId].sort(compare).join('_');

        const isConversationExist = (await conversationsRef.doc(uid).get()).exists;

        if (!isConversationExist) {
            await conversationsRef.doc(uid)
                .set({
                    members: [currentUserData.userId, friendUserData.userId].sort(compare),
                    conversationId: [currentUserData.userId, friendUserData.userId]
                        .sort(compare)
                        .join('_'),
                    recentMessage: {
                        message: '',
                        createdAt: firestore.Timestamp.now(),
                        sentBy: currentUserData.userId
                    },
                    [currentUserData.userId]: { ...currentUserData },
                    [friendUserData.userId]: { ...friendUserData },
                    createdAt: firestore.Timestamp.now(),
                }).then(() => console.log("added conversation", uid));
        }

        const messagesRef = firestore().collection('messages').doc(uid).collection('chat').doc();

        const newMessage = {
            msg: data,
            senderId: currentUserData.userId,
            seen: false,
            timeStamp: firestore.Timestamp.now(),
            uid: messagesRef.id
        };

        await messagesRef.set(newMessage);

        const registerDevice = async () => {
            await messaging().registerDeviceForRemoteMessages();
            const token = await messaging().getToken();
            return token;
        }

        const deviceData = {
            udid: await getUniqueId().then(uniqueId => uniqueId),
            fcm_token: await registerDevice()
        }

        await conversationsRef.doc(uid).update({
            recentMessage: {
                message: data,
                createdAt: firestore.Timestamp.now()
            },
            senderId: currentUserData.userId,
            receiverId: friendUserData.userId,
            [`${currentUserData.userId}.devicesData`]: firestore.FieldValue.arrayUnion(deviceData)
        })

        setSentList([...sentList, receiver.userid]);
        setIsLoading(false);
    }

    const renderUser = ({ item }) => {
        return (
            <Pressable style={styles.userContainer}>
                <View style={styles.flexRow}>
                    <Image
                        style={styles.profileImage}
                        source={{
                            uri: item.profile_pic
                        }}
                    />
                    <View style={styles.nameContainer}>
                        <Text numberOfLines={1} style={styles.userFullName}>
                            {`${item.first_name} ${item.last_name}`}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={styles.username}>
                            {item.username}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => { !sentList.includes(item.userid) && handleSendTo(item) }}>
                    <LinearGradient
                        start={{ x: 0.9, y: 1.8 }}
                        end={{ x: 0.0, y: 1.8 }}
                        locations={[0, 0.4, 0.6]}
                        colors={sentList.includes(item.userid) ? ["#9a9a9a", "#707070", "#454545"] : ['#FFAB5A', '#FF5F6D', '#FF5F6D']}
                        style={[styles.buttonStyle]}>
                        <Text style={styles.buttonText}>{sentList.includes(item.userid) ? 'Sent' : 'Send'}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Pressable>
        );
    };

    return (
        <AnimatedModal isVisible={isVisible} hideModal={hideModal} headerText={headerText} >
            <LoadingView modalVisible={isLoading} />
            <FlatList
                data={shareList}
                renderItem={renderUser}
                keyExtractor={item => item.userid}
                contentContainerStyle={{ paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
            />
        </AnimatedModal>
    )
}

const styles = StyleSheet.create({
    userContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: heightToDp('3'),
    },
    profileImage: {
        width: widthToDp('11.5'),
        height: heightToDp('5.5'),
        borderColor: '#FF5F6D',
        borderWidth: widthToDp('0.4'),
        borderRadius: 10,
    },
    nameContainer: {
        marginLeft: widthToDp('4')
    },
    userFullName: {
        color: 'white',
    },
    username: {
        color: 'gray',
    },
    flexRow: {
        flexDirection: 'row'
    },
    buttonStyle: {
        width: widthToDp('18'),
        paddingVertical: widthToDp('2'),
        paddingHorizontal: widthToDp('4'),
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
    }
});

export default Share;