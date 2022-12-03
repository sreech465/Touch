import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import NavContainer from './src/NavContainer';
import { Provider } from 'react-redux';
import store from './src/Redux/Store';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  environment: __DEV__ ? 'dev' : 'prod',
  dsn: 'https://67dd223966be4bfb87d0c8a79fce8508@o1200830.ingest.sentry.io/6643998',
  sampleRate: 1,
  tracesSampleRate: 1,
});

const App = () => {
  useEffect(() => {
    setTimeout(() => SplashScreen.hide(), 1000);
  }, []);

  return (
    <Provider store={store}>
      <NavContainer />
    </Provider>
  );
};

export default Sentry.wrap(App);
