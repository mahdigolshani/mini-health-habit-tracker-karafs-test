import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {deleteHabit, fetchHabits} from '../habits';
import type {RootState} from '@/redux/store';
import {DailyProgress, DetailedDailyProgress} from './types';
import type {Habit} from '../habits/types';

const fakeProgress: DailyProgress[] = Array.from(new Array(30).keys()).map(
  index => {
    const date = new Date();

    return {
      id: `progress-${index + 1}`,
      habitId: `habit-${(index + 1) % 10}`,
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      },
      progress: index ** 2 - index,
      updatedAt: 1766005871203 - Math.floor((index / 10) * 86400000),
    };
  },
);

export const fetchDailyProgress = createAsyncThunk(
  'dailyProgress/fetchDailyProgress',
  async (_, thunkApi) => {
    const habits = await thunkApi.dispatch(fetchHabits()).unwrap();
    await wait(500);
    const result: DetailedDailyProgress[] = fakeProgress.map(progress => {
      const habit = habits.find(habit => habit.id === progress.habitId);
      return {
        ...progress,
        title: habit ? habit.title : 'Unknown Habit',
        description: habit ? habit.description : undefined,
        target: habit ? habit.target : 0,
        habitUpdatedAt: habit ? habit.updatedAt : 0,
      };
    });
    return result;
  },
);

export const setProgress = createAsyncThunk(
  'dailyProgress/setProgress',
  async (
    arg: {
      habitId: string;
      progress: number;
      date?: {year: number; month: number; day: number};
    },
    thunkApi,
  ) => {
    await wait(300);
    const today = new Date();
    const date = arg.date ?? {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };

    const state = thunkApi.getState() as RootState;
    const habit = state.habits.list.find(h => h.id === arg.habitId);

    return {
      ...arg,
      date,
      habitInfo: habit
        ? {
            title: habit.title,
            description: habit.description,
            target: habit.target,
            habitUpdatedAt: habit.updatedAt,
          }
        : undefined,
    };
  },
);

export const updateProgress = createAsyncThunk(
  'habits/updateProgress',
  async (updatedProgress: Pick<DailyProgress, 'progress' | 'id'>) => {
    await wait(300);
    return updatedProgress;
  },
);

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface HabitsState {
  list: DetailedDailyProgress[];
}

const initialState: HabitsState = {
  list: [],
};

export const dailyProgressSlice = createSlice({
  name: 'dailyProgress',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDailyProgress.fulfilled, (state, action) => {
      state.list.sort((a, b) => b.updatedAt - a.updatedAt);

      const map = new Map();

      [...state.list, ...action.payload].forEach(item => {
        const existing = map.get(item.id);

        if (
          !existing ||
          new Date(item.updatedAt) > new Date(existing.updatedAt)
        ) {
          map.set(item.id, item);
        }
      });
      state.list = Array.from(map.values()).sort(
        (a, b) => b.updatedAt - a.updatedAt,
      );
    });
    builder.addCase(fetchHabits.fulfilled, (state, action) => {
      const habitsMap = new Map<string, Habit>();
      action.payload.forEach(habit => {
        habitsMap.set(habit.id, habit);
      });

      state.list.forEach(progress => {
        const habit = habitsMap.get(progress.habitId);
        if (habit) {
          progress.title = habit.title;
          progress.description = habit.description;
          progress.target = habit.target;
          progress.habitUpdatedAt = habit.updatedAt;
        }
      });
    });
    builder.addCase(setProgress.fulfilled, (state, action) => {
      const {habitId, progress, date, habitInfo} = action.payload;
      const existing = state.list.find(
        item =>
          item.habitId === habitId &&
          item.date.year === date.year &&
          item.date.month === date.month &&
          item.date.day === date.day,
      );

      const habitData =
        habitInfo ?? state.list.find(h => h.habitId === habitId);

      if (existing) {
        existing.progress = progress;
        existing.updatedAt = Date.now();
        if (habitData) {
          existing.title = habitData.title ?? existing.title;
          existing.description = habitData.description ?? existing.description;
          existing.target = habitData.target ?? existing.target;
          existing.habitUpdatedAt =
            habitData.habitUpdatedAt ?? existing.habitUpdatedAt;
        }
      } else {
        state.list.push({
          id: `progress-${habitId}-${date.year}-${date.month}-${
            date.day
          }-${Date.now()}`,
          habitId,
          date,
          progress,
          updatedAt: Date.now(),
          title: habitData?.title ?? 'Unknown Habit',
          description: habitData?.description,
          target: habitData?.target ?? 0,
          habitUpdatedAt: habitData?.habitUpdatedAt ?? Date.now(),
        });
      }
    });
    builder.addCase(updateProgress.fulfilled, (state, action) => {
      const index = state.list.findIndex(item => item.id === action.payload.id);
      if (~index) {
        Object.assign(state.list[index], action.payload);
      }
    });
    builder.addCase(deleteHabit.fulfilled, (state, action) => {
      state.list = state.list.filter(
        progress => progress.habitId !== action.payload,
      );
    });
  },
});

export const {} = dailyProgressSlice.actions;

export const dailyProgressListSelector = (state: RootState) =>
  state.dailyProgress.list;

const isSameDay = (
  date1: {year: number; month: number; day: number},
  date2: {year: number; month: number; day: number},
): boolean => {
  return (
    date1.year === date2.year &&
    date1.month === date2.month &&
    date1.day === date2.day
  );
};

const getPreviousDay = (date: {
  year: number;
  month: number;
  day: number;
}): {year: number; month: number; day: number} => {
  const d = new Date(date.year, date.month - 1, date.day);
  d.setDate(d.getDate() - 1);
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
  };
};

export const calculateStreak = (
  habitId: string,
  target: number,
  progressList: DetailedDailyProgress[],
  referenceDate?: {year: number; month: number; day: number},
): number => {
  const today =
    referenceDate ??
    (() => {
      const d = new Date();
      return {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate()};
    })();

  const habitProgress = progressList
    .filter(p => p.habitId === habitId)
    .sort((a, b) => {
      const dateA = new Date(a.date.year, a.date.month - 1, a.date.day);
      const dateB = new Date(b.date.year, b.date.month - 1, b.date.day);
      return dateB.getTime() - dateA.getTime();
    });

  if (habitProgress.length === 0) {
    return 0;
  }

  const dailyProgressMap = new Map<string, DetailedDailyProgress>();
  habitProgress.forEach(p => {
    const dateKey = `${p.date.year}-${p.date.month}-${p.date.day}`;
    const existing = dailyProgressMap.get(dateKey);
    if (!existing || p.updatedAt > existing.updatedAt) {
      dailyProgressMap.set(dateKey, p);
    }
  });

  let streak = 0;
  let currentDate = {...today};

  while (true) {
    const dateKey = `${currentDate.year}-${currentDate.month}-${currentDate.day}`;
    const progress = dailyProgressMap.get(dateKey);

    if (!progress) {
      break;
    }

    if (progress.progress >= target) {
      streak++;
      currentDate = getPreviousDay(currentDate);
    } else {
      break;
    }
  }

  return streak;
};

export const getTodayProgressSelector = (state: RootState) => {
  const today = new Date();
  const todayDate = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  };

  return state.dailyProgress.list.filter(p => isSameDay(p.date, todayDate));
};

export const getHabitProgressOnDateSelector =
  (habitId: string, date: {year: number; month: number; day: number}) =>
  (state: RootState) => {
    const entries = state.dailyProgress.list.filter(
      p => p.habitId === habitId && isSameDay(p.date, date),
    );
    if (entries.length === 0) {
      return null;
    }
    return entries.reduce((latest, current) =>
      current.updatedAt > latest.updatedAt ? current : latest,
    );
  };

export default dailyProgressSlice.reducer;
