import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Button,
  Modal,
  Pressable,
} from 'react-native';
import {type CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabsParamList} from '@/root-navigator/screens/main';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {RootNavigatorScreenProps} from '@/root-navigator';
import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useMemo, useState, useCallback} from 'react';
import {
  dailyProgressListSelector,
  calculateStreak,
  getTodayProgressSelector,
  fetchDailyProgress,
} from '@/redux/slices/daily-progress';
import {habitsListSelector, fetchHabits} from '@/redux/slices/habits';
import {AppDispatch} from '@/redux/store';
import {VictoryBar, VictoryChart, VictoryAxis, VictoryTheme} from 'victory';

type ChartRange = 'daily' | 'weekly' | 'monthly';

export type DashboardTabScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabsParamList, 'dashboard'>,
  RootNavigatorScreenProps<'authorized'>
>;

const DashboardTabScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const habits = useSelector(habitsListSelector);
  const dailyProgress = useSelector(dailyProgressListSelector);
  const todayProgress = useSelector(getTodayProgressSelector);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [chartRange, setChartRange] = useState<ChartRange>('weekly');

  const today = useMemo(() => {
    const d = new Date();
    return {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate()};
  }, []);

  useEffect(() => {
    dispatch(fetchHabits());
    dispatch(fetchDailyProgress());
  }, [dispatch]);

  const completionStats = useMemo(() => {
    if (habits.length === 0) {
      return {completed: 0, total: 0, percentage: 0};
    }

    const completed = habits.filter(habit => {
      const progress = todayProgress.find(p => p.habitId === habit.id);
      if (!progress) return false;
      const target = habit.target || 1;
      return progress.progress >= target;
    }).length;

    return {
      completed,
      total: habits.length,
      percentage: Math.round((completed / habits.length) * 100),
    };
  }, [habits, todayProgress]);

  const habitStreaks = useMemo(() => {
    return habits.map(habit => ({
      habit,
      streak: calculateStreak(
        habit.id,
        habit.target || 1,
        dailyProgress,
        today,
      ),
    }));
  }, [habits, dailyProgress, today]);

  const totalStreak = useMemo(() => {
    return habitStreaks.reduce((sum, item) => sum + item.streak, 0);
  }, [habitStreaks]);

  const chartData = useMemo(() => {
    const buildDaily = () => {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayProgress = dailyProgress.filter(
          p =>
            p.date.year === date.getFullYear() &&
            p.date.month === date.getMonth() + 1 &&
            p.date.day === date.getDate(),
        );
        const completed = habits.filter(habit => {
          const progress = dayProgress.find(p => p.habitId === habit.id);
          if (!progress) return false;
          const target = habit.target || 1;
          return progress.progress >= target;
        }).length;
        days.push({
          label: date.toLocaleDateString('en-US', {weekday: 'short'}),
          percentage: habits.length > 0 ? (completed / habits.length) * 100 : 0,
        });
      }
      return days;
    };

    const buildWeekly = () => {
      const weeks = [];
      for (let i = 0; i < 4; i++) {
        const end = new Date();
        end.setDate(end.getDate() - i * 7);
        const start = new Date(end);
        start.setDate(start.getDate() - 6);
        const windowProgress = dailyProgress.filter(p => {
          const time = new Date(
            p.date.year,
            p.date.month - 1,
            p.date.day,
          ).getTime();
          return time >= start.getTime() && time <= end.getTime();
        });
        const completed = habits.filter(habit => {
          const progress = windowProgress.find(p => p.habitId === habit.id);
          if (!progress) return false;
          const target = habit.target || 1;
          return progress.progress >= target;
        }).length;
        weeks.unshift({
          label: `Wk ${4 - i}`,
          percentage: habits.length > 0 ? (completed / habits.length) * 100 : 0,
        });
      }
      return weeks;
    };

    const buildMonthly = () => {
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const windowProgress = dailyProgress.filter(p => {
          const time = new Date(
            p.date.year,
            p.date.month - 1,
            p.date.day,
          ).getTime();
          return time >= start.getTime() && time <= end.getTime();
        });
        const completed = habits.filter(habit => {
          const progress = windowProgress.find(p => p.habitId === habit.id);
          if (!progress) return false;
          const target = habit.target || 1;
          return progress.progress >= target;
        }).length;
        months.push({
          label: date.toLocaleDateString('en-US', {month: 'short'}),
          percentage: habits.length > 0 ? (completed / habits.length) * 100 : 0,
        });
      }
      return months;
    };

    if (chartRange === 'daily') return buildDaily();
    if (chartRange === 'weekly') return buildWeekly();
    return buildMonthly();
  }, [habits, dailyProgress, chartRange]);

  const handleShareProgress = useCallback(() => {
    setShareModalVisible(true);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Progress</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPercentage}>
              {completionStats.percentage}%
            </Text>
          </View>
          <View style={styles.progressDetails}>
            <Text style={styles.progressText}>
              {completionStats.completed} of {completionStats.total} habits
              completed
            </Text>
            <Text style={styles.totalStreakText}>
              Total Streak: {totalStreak} days
            </Text>
          </View>
        </View>
        <Button title="Share Progress" onPress={handleShareProgress} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Habit Streaks</Text>
        {habitStreaks.length === 0 ? (
          <Text style={styles.emptyText}>No habits yet</Text>
        ) : (
          habitStreaks.map(({habit, streak}) => (
            <View key={habit.id} style={styles.streakItem}>
              <Text style={styles.streakHabitName}>{habit.title}</Text>
              <Text style={styles.streakValue}>
                {streak} {streak === 1 ? 'day' : 'days'}
              </Text>
            </View>
          ))
        )}
      </View>

      {habits.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progress</Text>
          <View style={styles.filterRow}>
            <Button
              title="Daily"
              onPress={() => setChartRange('daily')}
              color={chartRange === 'daily' ? '#4CAF50' : undefined}
            />
            <Button
              title="Weekly"
              onPress={() => setChartRange('weekly')}
              color={chartRange === 'weekly' ? '#4CAF50' : undefined}
            />
            <Button
              title="Monthly"
              onPress={() => setChartRange('monthly')}
              color={chartRange === 'monthly' ? '#4CAF50' : undefined}
            />
          </View>
          <View style={styles.chartContainer}>
            {/* Note: Using victory (web) here. For Android/iOS native builds, I'd use victory-native instead */}
            <VictoryChart
              theme={VictoryTheme.material}
              domainPadding={20}
              height={200}>
              <VictoryAxis
                tickFormat={chartData.map(d => d.label)}
                style={{
                  tickLabels: {fontSize: 10},
                }}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={t => `${t}%`}
                style={{
                  tickLabels: {fontSize: 10},
                }}
              />
              <VictoryBar
                data={chartData}
                x="label"
                y="percentage"
                style={{
                  data: {fill: '#4CAF50'},
                }}
              />
            </VictoryChart>
          </View>
        </View>
      )}

      <Modal
        visible={shareModalVisible}
        onRequestClose={() => setShareModalVisible(false)}
        animationType="fade"
        transparent>
        <Pressable
          style={styles.modalOverlay}
          pointerEvents="box-only"
          onPress={() => setShareModalVisible(false)}
        />
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Share Progress</Text>
          <Text style={styles.shareText}>
            Today {completionStats.completed} of {completionStats.total} habits
            completed ({completionStats.percentage}%)
          </Text>
          <View style={styles.modalButtons}>
            <Button title="Close" onPress={() => setShareModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  progressDetails: {
    flex: 1,
  },
  progressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  totalStreakText: {
    fontSize: 14,
    color: '#666',
  },
  streakItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  streakHabitName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  streakValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  chartContainer: {
    marginTop: 8,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 16,
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
  modalContainer: {
    marginBottom: 16,
    marginTop: 'auto',
    marginHorizontal: 'auto',
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  shareText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default DashboardTabScreen;
