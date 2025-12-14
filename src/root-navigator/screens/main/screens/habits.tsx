import {
  View,
  Text,
  FlatList,
  type ListRenderItem,
  StyleSheet,
  Button,
  Modal,
  Pressable,
} from 'react-native';
import {type CompositeScreenProps} from '@react-navigation/native';
import type {RootNavigatorScreenProps} from '@/root-navigator';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {BottomTabsParamList} from '@/root-navigator/screens/main';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteHabit,
  fetchHabits,
  habitsListSelector,
} from '@/redux/slices/habits';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {type AppDispatch} from '@/redux/store';
import type {Habit} from '@/redux/slices/habits/fake-data';

export type HabitsTabScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabsParamList, 'habits'>,
  RootNavigatorScreenProps<'authorized'>
>;

const HabitsTabScreen = ({route, navigation}: HabitsTabScreenProps) => {
  const habits = useSelector(habitsListSelector);
  const [habitToDeleteId, setHabitToDeleteId] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const handleDeleteModalClose = useRef(() => {
    setDeleteModalVisible(false);
  }).current;
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchHabits());
  }, []);

  const renderItem = useRef<ListRenderItem<Habit>>(({item}) => {
    const handlePressDelete = () => {
      setHabitToDeleteId(item.id);
      setDeleteModalVisible(true);
    };
    return (
      <View style={styles.habitItem}>
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.description}</Text>
        </View>
        <View>
          <Button title="Edit" />
          <Button title="Delete" onPress={handlePressDelete} />
        </View>
      </View>
    );
  }).current;

  const habitToDelete = useMemo(
    () => habits.find(item => item.id === habitToDeleteId),
    [habits, habitToDeleteId],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!habitToDeleteId) return;
    dispatch(deleteHabit(habitToDeleteId));
    setDeleteModalVisible(false);
  }, [dispatch, habitToDeleteId]);

  return (
    <>
      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContentContainer}
      />
      <Modal
        visible={deleteModalVisible}
        onRequestClose={handleDeleteModalClose}
        animationType="fade"
        transparent>
        <Pressable
          style={styles.modalOverlay}
          pointerEvents="box-only"
          onPress={handleDeleteModalClose}
        />
        <View style={styles.modalContainer}>
          <Text>
            Are you sure you want to delete{' '}
            <Text style={styles.bolden}>{habitToDelete?.title}</Text>?
          </Text>
          <View style={styles.separator} />
          <View style={styles.buttonsRow}>
            <Button title="No" onPress={handleDeleteModalClose} />
            <Button title="Yes" onPress={handleConfirmDelete} />
          </View>
        </View>
      </Modal>
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

export default HabitsTabScreen;
