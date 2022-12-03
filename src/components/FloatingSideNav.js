import React, { useRef } from 'react';
import { Animated, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon2 from 'react-native-vector-icons/dist/Ionicons';
import Icon4 from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Icon5 from 'react-native-vector-icons/dist/Ionicons';
import Icon6 from 'react-native-vector-icons/dist/Feather';
import Icon7 from 'react-native-vector-icons/dist/MaterialIcons';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';

const FloatingSideNav = ({ navigation, userId, hideOption, height = 0 }) => {
  const sideNavRef = useRef(false);
  const animatedHeight = new Animated.Value(0);
  const animatedOpacity = new Animated.Value(0);

  const animatedStyles = {
    height: animatedHeight,
    opacity: animatedOpacity,
  };

  const startHideAnimation = () => {
    Animated.parallel(
      [
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }),

        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
      ],
      { stopTogether: false },
    ).start(() => {});
  };

  const startShowAnimation = () => {
    Animated.parallel(
      [
        Animated.spring(animatedHeight, {
          toValue: 400,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0.5,
          duration: 400,
          useNativeDriver: false,
        }),
      ],
      { stopTogether: false },
    ).start(() => {});
  };

  const renderFloatingButton = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 100,
          right: 10,
          width: widthToDp('10'),
          height: widthToDp('10'),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: 22,
          opacity: 0.45,
        }}
        onPress={() => {
          if (sideNavRef.current) {
            sideNavRef.current = false;
            startHideAnimation();
          } else {
            sideNavRef.current = true;
            startShowAnimation();
          }
        }}>
        <Icon4 name="record-circle-outline" size={28} color="red" />
      </TouchableOpacity>
    );
  };

  const renderFloatingSideNav = () => {
    return (
      <Animated.View
        style={[
          {
            width: '10%',
            alignItems: 'center',
            position: 'absolute',
            justifyContent: 'space-around',
            backgroundColor: '#696969',
            borderRadius: 22,
            right: 10,
          },
          animatedStyles,
        ]}>
        <TouchableOpacity onPress={() => navigation.navigate('Reels')}>
          <Icon6 name="video" size={26} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PostTab')}>
          <Image
            style={styles.Image}
            source={require('../Assets/assets/Group_8609.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('InvestmentIntro')}>
          <Image
            style={styles.Image}
            source={require('../Assets/assets/ic_assessment_24px.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('EcommerceIntro')}>
          <Image
            style={styles.Image}
            source={require('../Assets/assets/ic_store_24px.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Message')}>
          <Icon2 name="chatbox-ellipses-sharp" size={26} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
          <Image
            style={styles.Image}
            source={require('../Assets/assets/ic_settings_24px.png')}
            onPress={() => navigation.navigate('Setting')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Image
            style={styles.Image}
            source={require('../Assets/assets/Group_8610.png')}
            onPress={() => navigation.navigate('Search')}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <>
      {renderFloatingButton()}
      {renderFloatingSideNav()}
    </>
  );
};

const styles = StyleSheet.create({
  Image: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginTop: heightToDp('0.5'),
  },
});

export default React.memo(FloatingSideNav);
