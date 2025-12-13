import {View, Text} from 'react-native';
import {type CompositeScreenProps} from '@react-navigation/native';
import type {RootNavigatorScreenProps} from '@root-navigator';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {BottomTabsParamList} from '@root-navigator/screens/main';

export type HabitsTabScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabsParamList, 'habits'>,
  RootNavigatorScreenProps<'authorized'>
>;

const HabitsTabScreen = ({route, navigation}: HabitsTabScreenProps) => {
  return (
    <View style={{flex: 1}}>
      <Text>Habits</Text>
    </View>
  );
};

export default HabitsTabScreen;
