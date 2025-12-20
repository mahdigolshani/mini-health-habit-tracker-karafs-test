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
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteHabit,
  fetchHabits,
  habitsListSelector,
} from '@/redux/slices/habits';
import {privilageLevelSelector} from '@/redux/slices/user';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {type AppDispatch} from '@/redux/store';
import type {Habit} from '@/redux/slices/habits/types';
import {StackScreenProps} from '@react-navigation/stack';
import {HabitsNavigatorScreenProps, HabitsParamList} from '..';

type ListScreenProps = CompositeScreenProps<
  StackScreenProps<HabitsParamList, 'list'>,
  HabitsNavigatorScreenProps
>;

const ListScreen = ({navigation}: ListScreenProps) => {
  const habits = useSelector(habitsListSelector);
  const privilegeLevel = useSelector(privilageLevelSelector);
  const isGuest = privilegeLevel === 'guest';
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
      if (isGuest) return;
      setHabitToDeleteId(item.id);
      setDeleteModalVisible(true);
    };
    const handlePressEdit = () => {
      if (isGuest) return;
      navigation.navigate('upsert', {habitId: item.id, name: item.title});
    };
    const isDefaultHabit = item.isDefault ?? false;
    return (
      <View style={styles.habitItem}>
        <View>
          <Text style={styles.title}>
            {item.title}
            {isDefaultHabit && (
              <Text style={styles.defaultBadge}> (Default)</Text>
            )}
          </Text>
          <Text>{item.description}</Text>
        </View>
        {!isGuest && (
          <View>
            {!isDefaultHabit && (
              <>
                <Button title="Edit" onPress={handlePressEdit} />
                <Button title="Delete" onPress={handlePressDelete} />
              </>
            )}
          </View>
        )}
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
        ListHeaderComponent={
          !isGuest ? (
            <Button
              title="Add Habit"
              onPress={() => navigation.navigate('upsert')}
            />
          ) : (
            <View style={styles.guestNotice}>
              <Text style={styles.guestNoticeText}>
                Guest Mode: Read-only access
              </Text>
            </View>
          )
        }
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
  defaultBadge: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  guestNotice: {
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    marginBottom: 16,
  },
  guestNoticeText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
});

export default ListScreen;
