import {
  type StackScreenProps,
  createStackNavigator,
} from '@react-navigation/stack';
import BottomTabsNavigator, {type BottomTabsParamList} from './screens/main';
import {type NavigatorScreenParams} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {isLoggedInSelector} from '@/redux/slices/user';
import LoginScreen from './screens/login';

export type RootNavigatorParamList<T extends 'authorized' | 'unauthorized'> =
  T extends 'authorized'
    ? {
        main: NavigatorScreenParams<BottomTabsParamList> | undefined;
        login: never;
      }
    : {
        main: never;
        login: undefined;
      };

export type RootNavigatorScreenProps<T extends 'authorized' | 'unauthorized'> =
  StackScreenProps<RootNavigatorParamList<T>>;

function getRootStack<T extends 'authorized' | 'unauthorized'>() {
  return createStackNavigator<RootNavigatorParamList<T>>();
}

const RootStack = getRootStack();

const RootNavigator = () => {
  const isLoggedIn = useSelector(isLoggedInSelector);

  return (
    <RootStack.Navigator initialRouteName={isLoggedIn ? 'main' : 'login'}>
      {isLoggedIn ? (
        <RootStack.Screen
          options={{headerShown: false}}
          name="main"
          component={BottomTabsNavigator}
        />
      ) : (
        <RootStack.Screen name="login" component={LoginScreen} />
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;
