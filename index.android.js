import 'react-native-gesture-handler';
import {
  GestureDetector,
  GestureHandlerRootView,
  gestureHandlerRootHOC,
  Gesture,
} from 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './src/App';
import SplashScreen from 'react-native-splash-screen';
import {useEffect} from 'react';

const GestureHandlerEnabledApp = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <GestureHandlerRootView>
      <App />
    </GestureHandlerRootView>
  );
};

AppRegistry.registerComponent('linkap', () => GestureHandlerEnabledApp);
