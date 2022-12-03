
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, View, StyleSheet, StatusBar, Image, Animated, TouchableOpacity,Platform } from 'react-native';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import AppIntroSlider from 'react-native-app-intro-slider';
import Auth from '../screens/Auth'
import { widthToDp, heightToDp } from '../Assets/helpers/Responsive';
import { IntroStyle } from '../Assets/styles';
import { backgroundColor } from '../Assets/color';
import LinearGradient from 'react-native-linear-gradient';
import SignUpScreen from './SignUpScreen';
import {  Bar } from '../components/StatusBar';
import LoginScreen from './LoginScreen';

const slides = [
    {
        key: '1',
        text: `Find friends & Explore`,
        text1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam gravida condimentum justo dapibus tempus',


        image: require('../Assets/assets/Intro1.png'),
        backgroundColor: '#59b2ab',
        height: '0'
    },
    {
        key: '2',
        text: 'Earn easy with our App',
        text1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam gravida condimentum justo dapibus tempus',

        image: require('../Assets/assets/Intro2.png'),
        backgroundColor: '#febe29',
        height: '0'

    },
    {
        key: '3',
        text: `Easy way to trade & buy`,
        text1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam gravida condimentum justo dapibus tempus',

        image: require('../Assets/assets/Intro3.png'),
        backgroundColor: '#22bcb5',
        height: '0'

    },
    {
        key: '4',
        text: `Networking & Connecting`,
        text1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam gravida condimentum justo dapibus tempus',

        image: require('../Assets/assets/Intro4.png'),
        backgroundColor: '#22bcb5',
        height: '0'

    }
]

var slider: AppIntroSlider;

const IntroScreen = (props) => {
    const [showRealApp, setS] = useState(false)
    const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        Animated.spring(
            fadeAnim,
            {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true
            }
        ).start();
    }, [fadeAnim])





    const renderItem = ({ item }) => {

        return (
            <Animated.View style={{
                opacity: fadeAnim, // Binds directly
                transform: [{
                    translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [150, 0]  // 0 : 150, 0.5 : 75, 1 : 0
                    }),
                }], alignItems: "center", backgroundColor: backgroundColor.backgroundColor, flex: 1
            }}
            >

                <Bar barStyle="light-content" />

                <Image source={item.image} style={IntroStyle.styleImage} resizeMode="contain" />
                <Text style={[IntroStyle.styleIntroBox,{fontFamily:'Poppins-SemiBold'}]}>{item.text}</Text>
                <Text style={[IntroStyle.styleIntroBox,{marginTop:heightToDp('2'),fontFamily:'Poppins-Regular',fontSize:widthToDp('3.2'),width:widthToDp('70'),textAlign:"center"}]}>{item.text1}</Text>
                <Text style={IntroStyle.styleIntroBox}>{item.text2}</Text>

                <TouchableOpacity
                    style={IntroStyle.styleButton}
                    onPress={() => {
                        (currentIndex + 1) > 3 ? setS(true) : slider.goToSlide(currentIndex + 1, true)
                    }}
                >
                    <LinearGradient
                        start={{ x: 0.9, y: 1.8 }}
                        end={{ x: 0.0, y: 1.8 }}
                        locations={[0, 0.4, 0.6]}
                        colors={['#FFAB5A', '#FF5F6D', '#FF5F6D']}
                        style={styles.linearGradient}>
                        <Text style={styles.buttonText}>Next</Text>
                    </LinearGradient>
                </TouchableOpacity>


            </Animated.View>
        );
    }

    if (showRealApp) {
        return <LoginScreen navigation={props.navigation} />
    } else {

    return <SafeAreaView style={{ flex: 1, backgroundColor:backgroundColor.backgroundColor }}>
                <AppIntroSlider renderItem={renderItem} renderPagination={() => null} data={slides} onSlideChange={index => {
                    setCurrentIndex(index);
                }} ref={(ref) => (slider = ref!)} />
                <View style={[{
                    flexDirection: 'row',
                    position: 'absolute',
                    bottom: Platform.OS === "ios" ? heightToDp('16') : heightToDp('18'),
                    alignSelf: 'center',
                }]}>
                    {slides.map((index, slide) => {
                        return (
                            <>
                            <View style={styles.hhh}>
                                <View
                                style={[
                                    styles.hh,
                                    {
                                        backgroundColor:
                                            slide === currentIndex ? '#FF5F6D' : 'white',
                                    },
                                ]} 
                            />
                            </View>
                            
                            </>
                            
                    );
            })} 
                </View>
    </SafeAreaView>
    }

}




const styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
        fontFamily:'Poppins-Bold'
        
    },
    hh: {
        height: 10,
        width: 10,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    hhh: {
        height: 12,
        width: 12,
        borderRadius: 8,
        marginHorizontal: 7,
        backgroundColor:'white',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
})



export default IntroScreen;