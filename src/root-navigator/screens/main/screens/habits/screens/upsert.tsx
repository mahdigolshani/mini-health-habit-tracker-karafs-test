import {CompositeScreenProps} from '@react-navigation/native';
import {
  type HabitsNavigatorScreenProps,
  type HabitsParamList,
} from '@/root-navigator/screens/main/screens/habits';
import {type StackScreenProps} from '@react-navigation/stack';

export type UpsertScreenProps = CompositeScreenProps<
  StackScreenProps<HabitsParamList, 'upsert'>,
  HabitsNavigatorScreenProps
>;

const UpsertScreen = () => {
  return <></>;
};

export default UpsertScreen;
