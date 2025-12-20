import {
  Text,
  View,
  StyleSheet,
  Button,
  FlatList,
  Modal,
  Pressable,
  ListRenderItem,
  TextInput,
} from 'react-native';
import {type CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {BottomTabsParamList} from '@/root-navigator/screens/main';
import type {RootNavigatorScreenProps} from '@/root-navigator';
import {useDispatch, useSelector} from 'react-redux';
import {
  dailyProgressListSelector,
  calculateStreak,
  setProgress,
  fetchDailyProgress,
} from '@/redux/slices/daily-progress';
import {fetchHabits, habitsListSelector} from '@/redux/slices/habits';
import {AppDispatch} from '@/redux/store';
import {useEffect, useState, useMemo, useCallback} from 'react';
import {Habit} from '@/redux/slices/habits/types';

export type DailyStatusTabScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabsParamList, 'daily-status'>,
  RootNavigatorScreenProps<'authorized'>
>;

const DailyStatusScreen = ({}: DailyStatusTabScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const habits = useSelector(habitsListSelector);
  const dailyProgress = useSelector(dailyProgressListSelector);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [progressInput, setProgressInput] = useState('');

  const today = useMemo(() => {
    const d = new Date();
    return {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate()};
  }, []);

  useEffect(() => {
    dispatch(fetchHabits());
    dispatch(fetchDailyProgress());
  }, [dispatch]);

  const selectedHabit = useMemo(
    () => habits.find(h => h.id === selectedHabitId),
    [habits, selectedHabitId],
  );

  const getTodayProgress = useCallback(
    (habitId: string) => {
      return dailyProgress.find(
        p =>
          p.habitId === habitId &&
          p.date.year === today.year &&
          p.date.month === today.month &&
          p.date.day === today.day,
      );
    },
    [dailyProgress, today],
  );

  const handleSetProgress = useCallback(
    async (habitId: string, progress: number) => {
      await dispatch(setProgress({habitId, progress, date: today})).unwrap();
      setProgressModalVisible(false);
      setProgressInput('');
      setSelectedHabitId(null);
    },
    [dispatch, today],
  );

  const handleMarkDone = useCallback(
    (habit: Habit) => {
      const target = habit.target || 1;
      handleSetProgress(habit.id, target);
    },
    [handleSetProgress],
  );

  const handleMarkNotDone = useCallback(
    (habitId: string) => {
      handleSetProgress(habitId, 0);
    },
    [handleSetProgress],
  );

  const handleOpenProgressModal = useCallback(
    (habit: Habit) => {
      setSelectedHabitId(habit.id);
      const entries = dailyProgress.filter(
        p =>
          p.habitId === habit.id &&
          p.date.year === today.year &&
          p.date.month === today.month &&
          p.date.day === today.day,
      );
      const latestEntry =
        entries.length > 0
          ? entries.reduce((latest, current) =>
              current.updatedAt > latest.updatedAt ? current : latest,
            )
          : null;
      setProgressInput(latestEntry?.progress.toString() || '');
      setProgressModalVisible(true);
    },
    [getTodayProgress, dailyProgress, today],
  );

  const renderItem = useCallback<ListRenderItem<Habit>>(
    ({item}) => {
      const todayProgress = getTodayProgress(item.id);
      const currentProgress = todayProgress?.progress ?? 0;
      const target = item.target || 1;
      const isCompleted = currentProgress >= target;
      const streak = calculateStreak(item.id, target, dailyProgress, today);

      return (
        <View style={styles.habitItem}>
          <View style={styles.habitInfo}>
            <Text style={styles.title}>{item.title}</Text>
            {item.description && (
              <Text style={styles.description}>{item.description}</Text>
            )}
            <Text style={styles.streakText}>
              Streak: {streak} {streak === 1 ? 'day' : 'days'}
            </Text>
            {item.target > 0 && (
              <Text style={styles.progressText}>
                Progress: {currentProgress} / {target}
              </Text>
            )}
          </View>
          <View style={styles.actionsContainer}>
            {isCompleted ? (
              <View style={styles.statusContainer}>
                <Text style={styles.completedText}>✓ Done</Text>
                <Button
                  title="Not Done"
                  onPress={() => handleMarkNotDone(item.id)}
                />
              </View>
            ) : (
              <View style={styles.statusContainer}>
                <Text style={styles.notCompletedText}>✗ Not Done</Text>
                <Button title="Done" onPress={() => handleMarkDone(item)} />
              </View>
            )}
            {item.target > 0 && (
              <Button
                title="Set Progress"
                onPress={() => handleOpenProgressModal(item)}
              />
            )}
          </View>
        </View>
      );
    },
    [
      getTodayProgress,
      dailyProgress,
      today,
      handleMarkDone,
      handleMarkNotDone,
      handleOpenProgressModal,
    ],
  );

  const handleProgressSubmit = useCallback(() => {
    if (!selectedHabit) return;
    const progress = parseInt(progressInput) || 0;
    handleSetProgress(selectedHabit.id, progress);
  }, [selectedHabit, progressInput, handleSetProgress]);

  return (
    <>
      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No habits found</Text>
            <Text style={styles.emptySubtext}>
              Add habits from the Habits tab
            </Text>
          </View>
        }
      />
      <Modal
        visible={progressModalVisible}
        onRequestClose={() => {
          setProgressModalVisible(false);
          setSelectedHabitId(null);
        }}
        animationType="fade"
        transparent>
        <Pressable
          style={styles.modalOverlay}
          pointerEvents="box-only"
          onPress={() => {
            setProgressModalVisible(false);
            setSelectedHabitId(null);
          }}
        />
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Set Progress: {selectedHabit?.title}
          </Text>
          {selectedHabit && selectedHabit.target > 0 && (
            <Text style={styles.modalSubtitle}>
              Target: {selectedHabit.target}
            </Text>
          )}
          <TextInput
            style={styles.progressInput}
            placeholder="Enter progress amount"
            value={progressInput}
            onChangeText={setProgressInput}
            keyboardType="numeric"
            placeholderTextColor="grey"
          />
          <View style={styles.modalButtons}>
            <Button
              title="Cancel"
              onPress={() => {
                setProgressModalVisible(false);
                setSelectedHabitId(null);
              }}
            />
            <Button title="Save" onPress={handleProgressSubmit} />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  habitItem: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  habitInfo: {
    marginBottom: 12,
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  notCompletedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f44336',
  },
  listContentContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    margin: 'auto',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    backgroundColor: '#00000050',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  progressInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});

export default DailyStatusScreen;
