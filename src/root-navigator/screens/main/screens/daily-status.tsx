import {Text, View} from 'react-native';
import {type CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {BottomTabsParamList} from '@root-navigator/screens/main';
import type {RootNavigatorScreenProps} from '@root-navigator';

export type DailyStatusTabScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabsParamList, 'daily-status'>,
  RootNavigatorScreenProps<'authorized'>
>;

const DailyStatusScreen = ({navigation, route}: DailyStatusTabScreenProps) => {
  return (
    <View>
      <Text>Daily Status</Text>
    </View>
  );
};

export default DailyStatusScreen;
