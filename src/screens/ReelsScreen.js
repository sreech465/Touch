import React, {useEffect,useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  BackHandler
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import {heightToDp, widthToDp} from '../Assets/helpers/Responsive';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Fontisto';
import {loginStyle} from '../Assets/styles';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from '@react-navigation/native';

const ReelsScreen = ({ navigation }) => {
  const OptionData = [
    {
      key: '1',
      Icon: 'music-note',
      Text:'Audio'
    },
    {
      key: '2',
      Icon: 'emoticon-happy-outline',
      Text:'Effects'
    },
    {
      key: '3',
      Icon: 'timer-outline',
      Text:'Timer'
    },

    {
      key: '4',
      Icon: 'skip-forward',
      Text:'1X'
    },
  ];

  const options = ({item}) => {
    return (
        <>
        <View style={{marginVertical:heightToDp('2'), alignItems:'center'}}>
            <Icon2 name={item.Icon} size={heightToDp('3.5')} color="white"/>
        <Text style={{marginTop:5,color:'white', fontFamily:'Poppins-Regular',fontSize:heightToDp('1.8')}}>{item.Text}</Text>
        </View>
        
        </>
    );
  };

  const backAction = () => {
    const popAction = StackActions.pop(1);
    navigation.dispatch(popAction);
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  return (
    <View style={{backgroundColor: 'black', flex: 1}}>
      <View
        style={{
          marginHorizontal: widthToDp('5'),
          position: 'absolute',
          top: heightToDp('22'),
        }}>
        <FlatList
          data={OptionData}
          renderItem={options}
          keyExtractor={item => item}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'absolute',
          alignSelf: 'center',
          bottom: heightToDp('4'),
          width: widthToDp('80'),
        }}>
        <View style={{width:widthToDp('8'),height:heightToDp('1.5')}}></View>
        <TouchableOpacity>
          <View style={styles.buttonStyleOuterCircle}>
            <LinearGradient
              start={{x: 1, y: 1}}
              end={{x: 0.0, y: 0.0}}
              locations={[0, 0.32, 1]}
              colors={['#FFAB5A', '#FF5F6D', '#FF5F6D']}
              style={styles.linearGradient}></LinearGradient>
          </View>
        </TouchableOpacity>
        <Icon2
          name="camera-flip-outline"
          size={heightToDp('4')}
          color="white"
        />
      </View>
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
    height: 60,
    width: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonStyleOuterCircle: {
    height: 68,
    width: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
});

export default ReelsScreen;
