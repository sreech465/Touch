import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import {

  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal
} from 'react-native';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';

export const LoadingView = ({ modalVisible, isGif = true }) => {


  return (
    modalVisible && <View style={styles.centeredView}>
      <Modal
        animationType="none"
        transparent={modalVisible}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={{}}>
            <Image
              style={{
                width: isGif ? 100 : 300,
                width: 100

                // height: 100,
              }}
          //    source={isGif ? require('../Assets/assets/Spinner-0.9s-200px.gif') : require('../Assets/assets/touch.gif')}
          source={require('../Assets/assets/Spinner-0.9s-200px.gif')}

              resizeMode="contain"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'transparent',
    position: 'absolute',
    height: "100%",
    width: "100%",
    zIndex: 999
  },
  modalView: {
    margin: 10,
    backgroundColor: "black",
    borderRadius: 20,
    padding: heightToDp('3'),
    width: widthToDp('28'),
    height: heightToDp('12'),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    borderColor: '#FF5F6D',
    borderWidth: 2,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    opacity: 0.3
  },
});
