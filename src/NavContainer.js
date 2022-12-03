import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthScreen from './screens/Auth';

import { Voximplant } from 'react-native-voximplant';
import { APP_NAME, ACC_NAME } from './Constant';
import { addToken, addVoxData } from './Redux/reducers/authReducer';

import IntroScreen from './screens/IntroScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import VerifyCodeScreen from './screens/VerifyCodeScreen';
import ResetPass from './screens/ResetPass';
import TermsScreen from './screens/TermsScreen';
import HelpScreen from './screens/HelpScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import PersonalInfoScreen from './screens/PersonalInfoScreen';
import SettingScreen from './screens/SettingScreen';
import AboutScreen from './screens/AboutScreen';
import CreatePost from './screens/CreatePost';
import HomeScreen from './screens/HomeScreen';
import PostScreen from './screens/PostScreen';
import StoryScreen from './screens/StoryScreen';
import ReelsScreen from './screens/ReelsScreen';
import LiveScreen from './screens/LiveScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';
import PointScreen from './screens/PointScreen';
import AccountSetting from './screens/AccountSetting';
import ChatScreen from './screens/ChatScreen';
import ExploreScreen from './screens/ExploreScreen';
import AddDetailsScreen from './screens/AddDetailsScreen';
import Uploadsoftcopy from './screens/Uploadsoftcopy';
import UploadDocScreen from './screens/UploadDocScreen';

import ActivityScreen from './screens/ActivityScreen';
import CallingScreen from './screens/CallingScreen';

// import CallScreen from './screens/CallScreen'
import IncomingCallScreen from './screens/IncomingCallScreen';
import MessageScreen from './screens/MessageScreen';
import PostDetail from './screens/PostDetail';
import EcommerceIntroScreen from './screens/ecommerce/IntroScreen';
import EcommerceHomeScreen from './screens/ecommerce/HomeScreen';
import InvestmentIntroScreen from './screens/investment/IntroScreen';
import InvestmentHomeScreen from './screens/investment/HomeScreen';
import InvestmentFundsScreen from './screens/investment/FundsScreen';
import Reels from './screens/ReelsScreen/index';
import FollowList from './screens/FollowList';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
// import {
//   createNativeStackNavigator,
// } from '@react-navigation/native-stack';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { colors, fontWhite, backgroundColor } from './Assets/color';
import { widthToDp, heightToDp } from './Assets/helpers/Responsive';
import ActivityPointsScreen from './screens/ActivityPoints';
import EcommerceSubCategories from './screens/ecommerce/SubCategoriesScreen';
import NetworkScreen from './screens/Networking/NetworkScreen';
import NetworkIntroScreen from './screens/Networking/IntroScreen';
import NetworkInterestScreen from './screens/Networking/InterestScreen';
import WebViewScreen from './components/WebViewScreen';
import CommentScreen from './screens/CommentScreen';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { StackActions } from '@react-navigation/native';

// import { LoadingView } from './components/LoadingView';

// const Stack = createNativeStackNavigator();
// const AuthStack = createNativeStackNavigator();
// const AfterAuthStack = createNativeStackNavigator();
// const VerifyAuthStack = createNativeStackNavigator();
// const AuthStack = createNativeStackNavigator();


const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const AfterAuthStack = createStackNavigator();
const VerifyAuthStack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const PostTab1 = () => {
  return (
    <Tab.Navigator
      //lazy={true}
      initialRouteName="Post"
      backBehavior="history"
      screenOptions={{
        tabBarActiveTintColor: '#FF5F6D',
        tabBarInactiveTintColor: 'white',
        tabBarItemStyle: { width: widthToDp('33.33') },
        tabBarLabelStyle: { fontSize: 16, fontFamily: 'poppins-Bold' },
        tabBarIndicatorStyle: { backgroundColor: 'white' },
        tabBarStyle: {
          backgroundColor: backgroundColor.backgroundColor,
         // marginTop: heightToDp('0'),
          justifyContent:"flex-end",
          height:heightToDp('10')

        },
        //backgroundColor:'black',

        tabBarIndicatorContainerStyle: { width: 380, alignSelf: 'center' },
      }}
      swipeEnabled={false}
    >
      <Tab.Screen name="Post" component={PostScreen} />
      <Tab.Screen name="Story" component={StoryScreen} />
      {/* <Tab.Screen name="Live" component={LiveScreen} /> */}
      <Tab.Screen name="reels" component={ReelsScreen} />
    </Tab.Navigator>
  );
};

const AfterAuthScreens = ({navigation}) => {
  
  const backAction = () => {
    const popAction = StackActions.pop(1);
    navigation.dispatch(popAction);
    return true;
  };
  
  return (
    <AfterAuthStack.Navigator

      initialRouteName="Home"
      options={{ headerShown: false }}
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter
      }}
      >

      <AfterAuthStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="PersonalInfo"
        component={PersonalInfoScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="Setting"
        component={SettingScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="About"
        component={AboutScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="Help"
        component={HelpScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="TermsScreen"
        component={TermsScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="PostTab"
        component={PostTab1}
        options={{
          headerShown:false
    //       headerStyle: {
    //         backgroundColor: 'black',
    //         padding:0,margin:0,
    //         elevation: 0, // remove shadow on Android
  	// shadowOpacity: 0, // remove shadow on iOS
    // borderBottomWidth: 0 // Just in case.
    //       },
    //       title: '',
        
    //     //  headerTintColor: '#ff',
    //       headerLeft: props => (
    //         <View style={{flex:1}}>
    //         <Icon
    //           name="chevron-double-left"
    //           size={heightToDp('4')}
    //           color="#F5F5F5"
    //           onPress={() => backAction()}
    //         />
    //         </View>
    //       ),
        }}
      />
      <AfterAuthStack.Screen
        name="Point"
        component={PointScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="AccountSetting"
        component={AccountSetting}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="ExploreScreen"
        component={ExploreScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="ActivityPoints"
        component={ActivityPointsScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="AddDetails"
        component={AddDetailsScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="Uploadsoftcopy"
        component={Uploadsoftcopy}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="UploadDoc"
        component={UploadDocScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="Activity"
        component={ActivityScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="Call"
        component={CallingScreen}
        options={{ headerShown: false }}
      />
      {/* <AfterAuthStack.Screen name='Call' component={CallScreen} options={{ headerShown: false }}/> */}
      <AfterAuthStack.Screen
        name="InCall"
        component={IncomingCallScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="Message"
        component={MessageScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="Post"
        component={PostDetail}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="EcommerceIntro"
        component={EcommerceIntroScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="EcommerceHome"
        component={EcommerceHomeScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="EcommerceSubCategories"
        component={EcommerceSubCategories}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="InvestmentIntro"
        component={InvestmentIntroScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="InvestmentHome"
        component={InvestmentHomeScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="InvestmentFunds"
        component={InvestmentFundsScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="Reels"
        component={Reels}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="NetworkIntro"
        component={NetworkIntroScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="NetworkInterest"
        component={NetworkInterestScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="Network"
        component={NetworkScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="FollowList"
        component={FollowList}
        options={{
          headerShown: false,

        }}
      />
      <AfterAuthStack.Screen
        name="WebView"
        component={WebViewScreen}
        options={{ headerShown: false }}
      />
      <AfterAuthStack.Screen
        name="CommentScreen"
        component={CommentScreen}
        options={{ headerShown: false }}
      />
    </AfterAuthStack.Navigator>
  );
};

// const VerifyContanier = () => {
//   return(
//     <VerifyAuthStack.Navigator initialRouteName='VerifyCode'>
//       <VerifyAuthStack.Screen name="VerifyCode"component={VerifyCodeScreen} options={{ headerShown: false }}/>
//     </VerifyAuthStack.Navigator>
//   )
// }

const AuthContanier = () => {
  return (
    <AuthStack.Navigator initialRouteName="Intro">
      <AuthStack.Screen
        name="Intro"
        component={IntroScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Signup"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="VerifyCode"
        component={VerifyCodeScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="ResetPass"
        component={ResetPass}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="TermsScreen"
        component={TermsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AfterAuth"
        component={AfterAuthScreens}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
};

const NavContainer = () => {
  const voximplant = Voximplant.getInstance();
  const token = useSelector(state => state.user.token);
  // const loader = useSelector(state => state.loader)
  const dispatch = useDispatch();

  const connect = async m => {
    console.log('data3---------------');

    try {
      const status = await voximplant.getClientState();
      console.log('datass---------------2', status);

      if (status === Voximplant.ClientState.DISCONNECTED) {
        console.log('data1---------------');

        await voximplant.connect().then(() => {
          console.log('data1zzz---------------');

          signIn(m);
        });
      } else if (status === Voximplant.ClientState.LOGGED_IN) {
        signIn(m);
        // redirectHome();
      }
    } catch (e) {}
  };
  useEffect(() => {
    const hasToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        dispatch(addToken())
          .unwrap()
          .then(({ user }) => connect(user.userid));
      }
    };
    hasToken();
  }, []);

  const signIn = async m => {
    // var username=x.split(' ')
    console.log('gdgd-----', m);
    try {
      const fqUsername = `${'0' + m}@${APP_NAME}.${ACC_NAME}.voximplant.com`;
      const z = await voximplant.login(fqUsername, 'voxpswd0' + m);
      dispatch(addVoxData(z));

      console.log('ddgfdg', z, m);
    } catch (e) {
      console.log(e);
      Alert.alert(e.name, `Error code: ${e.code}`);
    }
  };

  // const signIn = async (x) => {
  //   var username=x.split(' ')
  //   console.log('gdgd',x,username)
  //   try {
  //     const fqUsername = `${username[0]}@${APP_NAME}.${ACC_NAME}.voximplant.com`;
  //     const z=await voximplant.login(fqUsername, username[0]+username[1]);
  //     console.log('ddgfdg',z,fqUsername)

  //   } catch (e) {
  //     console.log(e);
  //     Alert.alert(e.name, `Error code: ${e.code}`);
  //   }
  // };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
          <Stack.Screen
            name="AfterAuth"
            component={AfterAuthScreens}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthContanier}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
      {/* common loader */}
      {/* <LoadingView modalVisible={loader.loading} /> */}
    </NavigationContainer>
  );
};

export default NavContainer;

// screenOptions={({ navigation, route }) => {
//   if (route.name === 'Post' && navigation.isFocused()) {
//     setSwipeEnabled(false);
//   } else if (route.name !== 'Map' && navigation.isFocused()) {
//     setSwipeEnabled(true);
//   }
// }} swipeEnabled={(swipeEnabled)}
