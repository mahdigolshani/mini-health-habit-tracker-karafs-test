import {
  Text,
  View,
  StyleSheet,
  Button,
  FlatList,
  Modal,
  Pressable,
  ListRenderItem,
} from 'react-native';
import {type CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {BottomTabsParamList} from '@/root-navigator/screens/main';
import type {RootNavigatorScreenProps} from '@/root-navigator';
import {useDispatch, useSelector} from 'react-redux';
import {dailyProgressListSelector} from '@/redux/slices/daily-progress';
import {fetchHabits, habitsListSelector} from '@/redux/slices/habits';
import {AppDispatch} from '@/redux/store';
import {useEffect, useRef} from 'react';
import {Habit} from '@/redux/slices/habits/types';
import {DetailedDailyProgress} from '@/redux/slices/daily-progress/types';

export type DailyStatusTabScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabsParamList, 'daily-status'>,
  RootNavigatorScreenProps<'authorized'>
>;

const DailyStatusScreen = ({navigation, route}: DailyStatusTabScreenProps) => {
  const dailyProgress = useSelector(dailyProgressListSelector);

  const renderItem = useRef<ListRenderItem<DetailedDailyProgress>>(({item}) => {
    return (
      <View style={styles.habitItem}>
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.description}</Text>
        </View>
        <View></View>
      </View>
    );
  }).current;

  return (
    <>
      <FlatList
        data={[]}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContentContainer}
      />
    </>
  );
};

const styles = StyleSheet.create({
  habitItem: {
    padding: 12,
    backgroundColor: 'grey',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listContentContainer: {
    rowGap: 16,
    padding: 16,
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
  },
  modalContainer: {
    width: 360,
    backgroundColor: 'white',
    margin: 'auto',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'space-between',
    rowGap: 16,
  },
  modalOverlay: {
    backgroundColor: '#00000030',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bolden: {
    fontWeight: '600',
  },
  buttonsRow: {
    flexDirection: 'row-reverse',
    columnGap: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#00000020',
  },
});

export default DailyStatusScreen;
