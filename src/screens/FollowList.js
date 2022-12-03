import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  BackHandler
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackActions } from '@react-navigation/native';

import { useSelector } from 'react-redux';
import { Bar } from '../components/StatusBar';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { Tab, TabView } from 'react-native-elements';
import Icon2 from 'react-native-vector-icons/dist/Ionicons';

const FollowList = ({ navigation, route }) => {
  const FollowersData = useSelector(state => state.userData?.follower);
  const FollowingData = useSelector(state => state.userData?.following);
  const Name = route.params.userName;
  const TabNo = route.params.index;

  const [index, setIndex] = React.useState(0);

  const renderTabs = () => {
    return (
      <FollowTabs>
        <>{renderFollowersList()}</>
        <>{renderFollowingList()}</>
      </FollowTabs>
    );
  };
  useEffect(() => {
    setIndex(0)
  },[])

  const Tabs = {
    experts: 'Followers',
    careerPortal: 'Following',
  };

  const FollowTabs = ({ children }) => {
    const theIndex = num => {
      setIndex(num);
    };

    const tabs = [
      { tabTndex: 0, title: Tabs.experts },
      { tabTndex: 1, title: Tabs.careerPortal },
    ];


    const renderTab = ({ tabTndex, title }) => {
      return (
        <Tab.Item
          containerStyle={styles.container}
          title={title}
          titleStyle={[
            styles.title,
            {
              fontFamily:
                index === tabTndex ? 'Poppins-SemiBold' : 'Poppins-Regular',
            },
          ]}
          buttonStyle={styles.buttonStyle}
          type={'clear'}
          raised={false}
          iconRight={false}
        />
      );
    };

   

    return (
      <>
        <View style={styles.tab_container}>
          <View style={styles.tab_wrapper}>
            <Tab
              value={index}
              onChange={setIndex}
              variant={'primary'}
              indicatorStyle={styles.indicator}>
              {tabs.map(item => renderTab(item))}
            </Tab>
          </View>
        </View>
        <TabView value={index} onChange={setIndex}>
          {React.Children.map(children, child => (
            <TabView.Item>{child}</TabView.Item>
          ))}
        </TabView>
      </>
    );
  };

  const UserView = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: '#0D0D0D',
          height: heightToDp('9'),
          width: widthToDp('96'),
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 10,
          marginBottom: heightToDp('1'),
          marginHorizontal: widthToDp('2'),
        }}
        onPress={() => navigation.push('Profile', { user_id: item.userid })}
        activeOpacity={0.8}>
        <View
          style={{
            width: widthToDp('12'),
            height: heightToDp('6'),
            borderColor: '#FF5F6D',
            borderWidth: widthToDp('0'),
            borderRadius: 10,
            marginLeft: widthToDp('5'),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}>
          <Image
            style={{
              width: widthToDp('10'),
              height: heightToDp('4.8'),
              resizeMode: 'cover',
              borderRadius: 6,
            }}
            source={{
              uri: item.profile_pic,
            }}
          />
        </View>
        <View style={{ marginLeft: widthToDp('3') }}>
          <Text style={{ fontFamily: 'Poppins-Regular', color: 'white' }}>
            {item.username}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              color: 'white',
              fontSize: heightToDp('1.3'),
            }}>
            {item.first_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFollowersList = () => {
    return (
      <FlatList
        data={FollowersData}
        renderItem={UserView}
        keyExtractor={(item,index) => String(index)}
        style={{ marginTop: heightToDp('2') }}
      />
    );
  };

  const renderFollowingList = () => {
    return (
      <FlatList
        data={FollowingData}
        renderItem={UserView}
        keyExtractor={item => item.user_id}
        style={{ marginTop: heightToDp('2') }}
      />
    );
  };

  const backAction = () => {
    const popAction = StackActions.pop(1);
    navigation.dispatch(popAction);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <Bar barStyle="light-content" />
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: widthToDp('4'),
          alignItems: 'center',
          marginTop: heightToDp('2'),
          justifyContent: 'space-between',
          marginBottom: heightToDp('3'),
        }}>
        <Icon2 name="arrow-back" size={heightToDp('4')} color="white" onPress={()=> backAction()} />
        <Text
          style={{
            fontSize: heightToDp('2.8'),
            color: 'white',
            fontFamily: 'Poppins-SemiBold',
          }}>
          {Name}
        </Text>
        <Icon
          name="chevron-double-left"
          size={heightToDp('4')}
          color="black"
        />
      </View>
      {renderTabs()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tab_container: {
    backgroundColor: '#202020',
  },
  tab_wrapper: {
    width: widthToDp('100'),
  },
  title: {
    fontSize: heightToDp('1.8'),
    color: '#FF5F6D',
    textTransform: 'capitalize',
    textAlign: 'left',
    marginTop: heightToDp(0),
  },
  container: {
    backgroundColor: '#202020',
  },
  buttonStyle: {
    backgroundColor: '#202020',
    height: heightToDp('7'),
  },
  indicator: {
    backgroundColor: '#d3d3d3',
    width: widthToDp('35'),
    height: heightToDp('0.3'),
    marginLeft: widthToDp('8'),
    borderRadius: 10,
  },
});

export default FollowList;
