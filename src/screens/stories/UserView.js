/* eslint-disable */
import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View,Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';

const diffDateWithNow = date => {
  let startDate = new Date(Number(date));
  // Do your operations
  let endDate = new Date();
  let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
  let minutes = seconds / 60;
  let hours = minutes / 60;
  let days = hours / 24;
  let current;
  console.log('userview', days, hours, Math.trunc(minutes));
  if (days >= 1) {
    current = Math.trunc(days) < 2 ? 'day' : 'days';
    return Math.trunc(days) + ' ' + current;
  } else if (hours > 1) {
    current = Math.trunc(hours) < 2 ? 'hour' : 'hours';
    return Math.trunc(hours) + ' ' + current;
  } else {
    current = Math.trunc(minutes) < 2 ? 'minute' : 'minutes';
    return Math.trunc(minutes) + ' ' + current;
  }
};

export default memo(function UserView(props) {
  const user = useSelector(state => state.user.userdata);
  return (
    <View style={[styles.userView]}>
      <View style={{width: '85%',flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
        source={{
          uri: user.userid === props.userId ? user.profile_pic : props.profile,
        }}
        style={styles.image}
      />
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.name}>
          {user.userid === props.userId ? user.username : props.name}
        </Text>
        <Text style={styles.time}>
          {!!props.datePublication &&
            `published ${diffDateWithNow(props.datePublication)} ago`}
        </Text>
      </View>
      </View>
      <TouchableOpacity onPress={props.onClosePress}>
      <Icon2 name="closecircle" size={20} color="white"/>
      </TouchableOpacity>
      </View>
      
    </View>
  );
});

const styles = StyleSheet.create({
  barUsername: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
  userView: {
    position: 'absolute',
    top: Platform.OS === 'ios'? 55:25,
    alignItems: 'center',
    marginHorizontal:10
  },
  name: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  time: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginTop: -1
  },
});
