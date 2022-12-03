import React, {useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {mainView} from '../Assets/styles';
import {Bar} from '../components/StatusBar';
import {heightToDp, widthToDp} from '../Assets/helpers/Responsive';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

const CreatePost = () => {



  return (
    <SafeAreaView style={[mainView]}>
      <View>
        <Bar barStyle="light-content" />
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-start',
              marginLeft: widthToDp('4'),
              alignItems: 'center',
              marginTop: heightToDp('8'),
            }}>
            <Icon
              name="chevron-double-left"
              size={heightToDp('4')}
              color="#F5F5F5"
            />
          </View>
          <View>
          </View>
          MyTabs(TitleData)
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreatePost;
