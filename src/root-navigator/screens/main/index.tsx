import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View} from 'react-native';
import type {StackScreenProps} from '@react-navigation/stack';
import type {RootNavigatorParamList} from '@/root-navigator';
import DashboardTabScreen from './screens/dashboard';
import DailyStatusScreen from './screens/daily-status';
import HabitsNavigator from './screens/habits';

export type BottomTabsParamList = {
  'daily-status': {deleteMode?: 'device' | 'room' | undefined} | undefined;
  dashboard: {type?: 'automation' | 'scene'; deleteMode?: boolean} | undefined;
  habits: {deleteMode?: boolean} | undefined;
};

export type BottomTabsNavigatorScreenProps = StackScreenProps<
  RootNavigatorParamList<'authorized'>,
  'main'
>;

const BottomTabs = createBottomTabNavigator<BottomTabsParamList>();

const BottomTabsNavigatorScreen = () => {
  return (
    <View style={{flex: 1}}>
      <BottomTabs.Navigator
        detachInactiveScreens
        backBehavior="history"
        initialRouteName="habits">
        <BottomTabs.Screen
          name="dashboard"
          component={DashboardTabScreen}
          options={{
            title: 'Dashboard',
          }}
        />
        <BottomTabs.Screen
          name="daily-status"
          component={DailyStatusScreen}
          options={{
            title: 'Daily Status',
          }}
        />
        <BottomTabs.Screen
          name="habits"
          component={HabitsNavigator}
          options={{
            title: 'Habits',
            headerShown: false,
          }}
        />
      </BottomTabs.Navigator>
    </View>
  );
};

export default BottomTabsNavigatorScreen;
