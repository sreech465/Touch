import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Modal,
    BackHandler
} from 'react-native';
import { Bar } from '../../components/StatusBar';
import { heightToDp, widthToDp } from '../../Assets/helpers/Responsive';
import Icon1 from 'react-native-vector-icons/dist/AntDesign';
import { StackActions } from '@react-navigation/native';
import { LinearGradientButton } from '../../components/LinearGradientButton';
import LinearGradient from 'react-native-linear-gradient';

const IntroScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(true);

    const backAction = () => {
        const popAction = StackActions.pop(1);
        navigation.dispatch(popAction);
        return true;
    };

    useEffect(() => {
        // setModalVisible(true);
        BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, 
    []);

    const imageSelectModel = () => {
        return (
            <View style={styles.centeredView}>
                <Modal
                    // animationType="slide"
                    transparent={true}
                    visible={true}
                    onRequestClose={() => {

                    }}
                >
                    
                </Modal>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Bar barStyle="light-content" />
            <ImageBackground
                source={require('../../Assets/assets/Network.png')}
                style={styles.image}
                resizeMode="stretch">
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View
                                style={{
                                    borderRadius: 50,
                                    width: widthToDp('13'),
                                    height: heightToDp('0.4'),
                                    backgroundColor: '#FF5F6D',
                                    alignSelf: 'center',
                                    marginTop: heightToDp('0.8'),
                                }}></View>
                            <View
                                style={{ width: widthToDp('70'), marginTop: heightToDp('3') }}>
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: heightToDp('3'),
                                        fontFamily: 'Poppins-SemiBold',
                                    }}>
                                    Let's Find People around you with same interest.
                                </Text>
                                {/* <Text
                                    style={{
                                        color: 'white',
                                        fontSize: heightToDp('1.5'),
                                        fontFamily: 'Poppins-SemiBold',
                                    }}>
                                    we provide the best producs for you
                                </Text> */}
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: heightToDp('2.3'),
                                    justifyContent: 'space-between',
                                    marginRight: widthToDp('4')
                                }}>
                                <TouchableOpacity onPress={() => navigation.push('NetworkInterest')}>
                                    <View
                                        style={{ width: widthToDp('55'), height: heightToDp('5.2') }}>
                                        <LinearGradientButton
                                            name={'Get Started'}
                                            textSize={17}
                                            fontFamily={'Poppins-SemiBold'}
                                            borderRadius={5}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.push('NetworkInterest')}>
                                    <LinearGradient
                                        start={{ x: 1, y: 1 }}
                                        end={{ x: 0.0, y: 0.0 }}
                                        locations={[0, 0.32, 1]}
                                        colors={['#FFAB5A', '#FF5F6D', '#FF5F6D']}
                                        style={styles.linearGradient}>
                                        <Icon1
                                            name="rightcircle"
                                            size={heightToDp('4')}
                                            color="#F5F5F5"
                                        />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor:'black'
    },
    linearGradient: {
        height: 50,
        width: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: heightToDp('-6'),
        alignSelf: 'center'
    },
    modalView: {
        backgroundColor: 'black',
        borderRadius: 40,
        paddingHorizontal: widthToDp('8'),
        width: widthToDp('102'),
        height: heightToDp('35'),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        borderColor: 'gray',
        borderWidth: 0.6,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 10,
        paddingVertical: heightToDp('3'),
        elevation: 2,
        marginBottom: heightToDp('2'),
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
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonStyleOuterCircle: {
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: 'white',
    },
});

export default IntroScreen;
