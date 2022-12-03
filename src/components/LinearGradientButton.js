import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';

export const LinearGradientButton = (props) => {
    return (
        <LinearGradient
            start={{ x: 0.9, y: 1.8 }}
            end={{ x: 0.0, y: 1.8 }}
            locations={[0, 0.4, 0.6]}
            colors={['#FFAB5A', '#FF5F6D', '#FF5F6D']}
            style={[styles.linearGradient, { borderRadius: props.borderRadius }, { ...props.linearGradient }]}>
            <Text style={[styles.buttonText, { fontSize: props.textSize, fontFamily: props.fontFamily }, { ...props.buttonTextStyle }]}>{props.name ? props.name : null}</Text>
        </LinearGradient >
    )
}

export const SmallLinearGradientButton = (props) => {
    return (
        <LinearGradient
            start={{ x: 0.9, y: 1.8 }}
            end={{ x: 0.0, y: 1.8 }}
            locations={[0, 0.4, 0.6]}
            colors={['#FFAB5A', '#FF5F6D', '#FF5F6D']}
            style={[styles.SmalllinearGradient, { borderRadius: props.borderRadius }]}>
            <Text style={[styles.SmallbuttonText, { fontSize: props.textSize, fontFamily: props.fontFamily }]}>{props.name ? props.name : null}</Text>
        </LinearGradient>
    )
}

export const LinearGradientButtonwithicon = (props) => {
    return (
        <LinearGradient
            start={{ x: 0.9, y: 1.8 }}
            end={{ x: 0.0, y: 1.8 }}
            locations={[0, 0.4, 0.6]}
            colors={['#FFAB5A', '#FF5F6D', '#FF5F6D']}
            style={[styles.linearGradient, { borderRadius: props.borderRadius }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.buttonText, { fontSize: props.textSize, fontFamily: props.fontFamily }]}>{props.name ? props.name : null}</Text>
                <View style={{ width: widthToDp('7'), height: heightToDp('3.5'), borderColor: 'white', borderWidth: 2, borderRadius: 50, marginLeft: widthToDp('4') }}>

                </View>
            </View>

        </LinearGradient>
    )
}



const styles = StyleSheet.create({
    con: {
        height: "50%",
        justifyContent: "space-around",
        marginHorizontal: 20
    },
    text: {
        fontSize: 24,
        textAlign: "center"
    },
    textinp: {
        height: 50,
        borderColor: "#ff4081",
        borderWidth: 2
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        justifyContent: 'center',
    },
    SmalllinearGradient: {
        flex: 1,
        paddingLeft: 1,
        paddingRight: 1,
        borderRadius: 5,
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center',
        margin: 5,
        color: '#ffffff',
        backgroundColor: 'transparent',
        fontFamily: 'Poppins-SemiBold'

    },
    SmallbuttonText: {
        fontSize: 18,
        textAlign: 'center',
        margin: 0,
        color: '#ffffff',
        backgroundColor: 'transparent',
        fontFamily: 'Poppins-SemiBold'

    },

})
