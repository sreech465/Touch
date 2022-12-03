import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
} from 'react-native';
import { Bar } from '../../components/StatusBar';
import { heightToDp, widthToDp } from '../../Assets/helpers/Responsive';
import Icon1 from 'react-native-vector-icons/dist/AntDesign';
import { StackActions } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Finance1 = ({ navigation }) => {

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


  const SetVisited = async() => {
    try{
      await AsyncStorage.setItem('is_inv_visited', JSON.stringify(true));
    }catch(e){
      console.log(e);
    }
  }

  useEffect(() => {
    SetVisited();
  }, []);

  return (
    <View style={styles.container}>
      <Bar barStyle="light-content" />
      <ImageBackground
        source={require('../../Assets/assets/Finance1.png')}
        style={styles.image}
        resizeMode="stretch">
        <View
          style={{
            position: 'absolute',
            bottom: heightToDp('17'),
            left: widthToDp('8'),
          }}>
          <View>
            <Text
              style={{
                color: 'white',
                fontSize: heightToDp('3.25'),
                fontFamily: 'Poppins-SemiBold',
              }}>
              Let's Find How to
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: heightToDp('3.25'),
                fontFamily: 'Poppins-SemiBold',
                marginTop: heightToDp(-1.4)
              }}>
              Manage Your
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: heightToDp('3.25'),
                fontFamily: 'Poppins-SemiBold',
                marginTop: heightToDp(-1.4)
              }}>
              Finances
            </Text>
          </View>
          <View
            style={{
              width: widthToDp('65'),
              marginTop: heightToDp('0.5'),
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: heightToDp('1.5'),
                fontFamily: 'Poppins-Regular',
              }}>
              Let's find ways to manage your finnance so that they are easy to understand and nearly arranged
            </Text>
          </View>
        </View>

        <View style={{ position: 'absolute', bottom: heightToDp('4'), right: widthToDp('8') }}>
          <TouchableOpacity onPress={() => navigation.navigate('InvestmentHome')}>
            <LinearGradient
              start={{ x: 1, y: 1 }}
              end={{ x: 0.0, y: 0.0 }}
              locations={[0, 0.32, 1]}
              colors={['#FFAB5A', '#FF5F6D', '#FF5F6D']}
              style={styles.linearGradient}>
              <Icon1
                name="rightcircle"
                size={heightToDp('6')}
                color="#F5F5F5"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  linearGradient: {
    height: 60,
    width: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: heightToDp('80'),
  },
  modalView: {
    backgroundColor: 'black',
    borderRadius: 40,
    paddingHorizontal: widthToDp('8'),
    width: widthToDp('100.5'),
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

export default Finance1;
