import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    Pressable,
    FlatList,
} from 'react-native';
import { mainView } from '../Assets/styles';
import { Bar } from '../components/StatusBar';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import { IntroStyle } from '../Assets/styles';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { StackActions } from '@react-navigation/native';

const ActivityPoints = ({ navigation }) => {
    const { detailedPoints } = useSelector(state => state.activity.points);
    const backAction = () => {
        const popAction = StackActions.pop(1);
        navigation.dispatch(popAction);
      };
    
    const getActionText = (item) => {
        if (!item) return;
        var text = '';
        const relativeTime = moment(new Date(Number(item.timestamp)).toISOString()).fromNow()
        switch (item.action) {
            case "FOLL":
                text = `followed ${item.first_name} ${relativeTime} `;
                break;
            case "PCMNT":
                text = `commented on ${item.first_name}'s post ${relativeTime} `;
                break;
            case "PLK":
                text = `liked ${item.first_name}'s post ${relativeTime} `
                break;
            default:
                console.log("No Action");
        }
        return text;
    }

    const renderPointCard = ({ item }) => {
        return (
            <View
                style={{
                    marginHorizontal: widthToDp('5.5'),
                    marginVertical: heightToDp('2'),
                }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: widthToDp('3'),
                                backgroundColor: 'white',
                            }}
                            source={{
                                uri: item.profile_pic,
                            }}
                        />
                        <View>
                            <Text style={{ color: 'white' }}>{item?.username}</Text>
                            <Text numberOfLines={2} style={{ fontSize: heightToDp('1.4'), color: 'gray', width: widthToDp("60") }}>{getActionText(item)}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={{ color: 'red', alignSelf: 'flex-end' }}>{`+${item?.points}`}</Text>
                        <Text style={{ color: 'gray', fontSize: heightToDp("1.4") }}>Points</Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={[mainView]}>
            <Bar barStyle="light-content" />
            <Image
                source={require('../Assets/assets/MaskGroup26.png')}
                style={[IntroStyle.styleImage, { position: 'absolute', opacity: 1, left: widthToDp(-33) }]}
                resizeMode="contain"
            />
            <View
                style={{
                    flexDirection: 'row',
                    marginHorizontal: widthToDp('4'),
                    marginTop: heightToDp('8'),
                    alignItems: 'center',
                }}>
                <Pressable onPress={() => navigation.pop()}>
                <Icon name="arrow-back" size={heightToDp('4')} color="white" onPress={()=> backAction()} />
                </Pressable>
                <Text
                    style={{
                        fontSize: widthToDp('4.2'),
                        color: 'white',
                        fontFamily: 'Poppins-Bold',
                        marginLeft: widthToDp('3')
                    }}>
                    Point Activity
                </Text>
            </View>
            <FlatList
                data={detailedPoints}
                renderItem={renderPointCard}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    con: {
        height: '50%',
        justifyContent: 'space-around',
        marginHorizontal: 20,
    },
    text: {
        fontSize: 24,
        textAlign: 'center',
    },
    textinp: {
        height: 50,
        borderColor: '#ff4081',
        borderWidth: 2,
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
        fontWeight: 'bold',
    },
    linearGradient: {
        height: heightToDp('7.5'),
        width: widthToDp('16'),
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: {
        fontSize: widthToDp('4.5'),
        color: 'white',
        fontFamily: 'Poppins-SemiBold',
    },
    wideoptionText: {
        fontSize: widthToDp('4'),
        color: 'white',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: widthToDp('4'),
    },
    smallButtonView: {
        width: widthToDp('18'),
        height: heightToDp('9'),
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'stretch',
    },
    wideButton: {
        alignItems: 'center',
        borderRadius: 8,
        height: heightToDp('9'),
        width: widthToDp('90'),
        backgroundColor: '#404040',
        marginBottom: heightToDp('3'),
        flexDirection: 'row',
        paddingHorizontal: widthToDp('5'),
    },
});

export default ActivityPoints;
