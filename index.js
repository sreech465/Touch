
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('remoteMessage', remoteMessage)
});

const registerDevice = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log("=========fcm", token);
}
registerDevice()

AppRegistry.registerComponent(appName, () => App);
