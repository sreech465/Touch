import React from 'react'
import {  StatusBar} from 'react-native';


export const Bar=(props)=>{
    return  <StatusBar translucent backgroundColor="transparent" barStyle={props.barStyle} />

}