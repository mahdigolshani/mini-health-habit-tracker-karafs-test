import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {deleteHabit, fetchHabits} from '../habits';
import type {RootState} from '@/redux/store';
import {DailyProgress, DetailedDailyProgress} from './types';

// ATTENTION: RTK Slice and Thunks are only being used to implement "Last Write Wins" strategy for data persistence later.

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
  'habits/setProgress',
  async (arg: {habitId: string; progress: number}) => {
    await wait(300);
    return arg;
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
    builder.addCase(setProgress.fulfilled, (state, action) => {
      const existing = state.list.find(
        item => item.habitId === action.payload.habitId,
      );
      if (existing) {
        existing.progress = action.payload.progress;
        existing.updatedAt = Date.now();
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

export default dailyProgressSlice.reducer;
