import React, { useState, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  BackHandler,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { StackActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mainView } from '../Assets/styles';
import Icon2 from 'react-native-vector-icons/dist/AntDesign';
const WebViewScreen = ({ route }) => {
  const Loading = () => (
    <ActivityIndicator
      style={[styles.container, styles.loading]}
      color={'red'}
      size={'large'}
    />
  );
  const uri = route.params?.url;
  const Webviewref = useRef(null);
  const navigation = useNavigation();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(uri);

  const backAction = () => {
    if (canGoBack) {
      Webviewref.current.goBack();
    } else {
      navigation.goBack();
    }
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, [canGoBack]);

  return (
    <SafeAreaView style={[mainView,{backgroundColor:'#1F2024'}]}>
      <View
        style={{
          width: '100%',
          height: 50,
          backgroundColor: '#1F2024',
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 17,
          justifyContent: 'flex-start'
        }}>
        <Icon2
          name="close"
          size={25}
          color="white"
          onPress={() => backAction()}
        />
        <View style={{marginLeft: 10 }}>
          <ScrollView horizontal={true}>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{
                color: 'white',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 16,
                marginLeft: 10,
                marginRight: 45,
                marginTop: 11
              }}>
              {currentUrl}
            </Text>
          </ScrollView>
        </View>
      </View>
      <WebView
        source={{ uri: currentUrl }}
        startInLoadingState
        renderLoading={Loading}
        ref={Webviewref}
        styles={[styles.container, { width: '100%', height: '100%' }]}
        onNavigationStateChange={navState => {
          setCanGoBack(navState.canGoBack);
          setCanGoForward(navState.canGoForward);
          setCurrentUrl(navState.url);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default WebViewScreen;
