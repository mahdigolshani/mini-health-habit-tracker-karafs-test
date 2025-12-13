import {Text, View} from 'react-native';
import {type CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabsParamList} from '@root-navigator/screens/main';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {RootNavigatorScreenProps} from '@root-navigator';

export type DashboardTabScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabsParamList, 'dashboard'>,
  RootNavigatorScreenProps<'authorized'>
>;

const DashboardTabScreen = ({route, navigation}: DashboardTabScreenProps) => {
  return (
    <View>
      <Text>Dashboard</Text>
    </View>
  );
};

export default DashboardTabScreen;
