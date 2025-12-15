import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {type BottomTabsParamList} from '@/root-navigator/screens/main';
import {type RootNavigatorScreenProps} from '@/root-navigator';
import ListScreen from './screens/list';
import UpsertScreen from './screens/upsert';
import Ionicons from '@expo/vector-icons/Ionicons';

export type HabitsParamList = {
  list: undefined;
  upsert: {habitId?: string; name: string} | undefined;
};

export type HabitsNavigatorScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabsParamList, 'habits'>,
  RootNavigatorScreenProps<'authorized'>
>;

const Stack = createStackNavigator<HabitsParamList>();

const HabitsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="list"
      screenOptions={{
        headerBackImage: ({tintColor}) => (
          <Ionicons name="arrow-back-outline" size={24} color={tintColor} />
        ),
      }}>
      <Stack.Screen
        name="list"
        component={ListScreen}
        options={{headerTitle: 'Habits'}}
      />
      <Stack.Screen
        name="upsert"
        component={UpsertScreen}
        options={({route}) => ({
          headerTitle: route.params?.name ?? 'New Habit',
        })}
      />
    </Stack.Navigator>
  );
};

export default HabitsNavigator;
