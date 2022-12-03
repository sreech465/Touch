import React,{useState} from 'react'
import { View, Text,TextInput,Button ,StyleSheet,TouchableOpacity} from 'react-native'
import {useDispatch,useSelector} from 'react-redux'
import {signinUser,signupUser} from '../Redux/reducers/authReducer'
import {increment} from '../Redux/reducers/authReducer'
import Icon from 'react-native-vector-icons/dist/Fontisto';

const Auth = () => {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [auth,setAuth] = useState("signin")
    const dispatch  = useDispatch()
    const count=useSelector(state => state.user.counter)

    const Authenticate = ()=>{
        if(auth=='signin'){
             dispatch(signinUser({email,password}))
        }else{
            dispatch(signupUser({email,password}))
        }
    }
    return (
        <View style={styles.con}>
            
                         <Text style={styles.text}>{'UNDERS CONSTRUCTION'}</Text>

            
        </View>
    )
}
 const styles = StyleSheet.create({
     con:{
         height:"50%",
         justifyContent:"space-around",
         marginHorizontal:20
     },
     text:{
         fontSize:24,
         textAlign:"center"
     },
     textinp:{
         height:50,
         borderColor:"#ff4081",
         borderWidth:2
     }

 })
export default Auth
