import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {type Habit} from './types';
import type {RootState} from '@/redux/store';

// ATTENTION: RTK Slice and Thunks are only being used to implement "Last Write Wins" strategy for data persistence later.

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fakeHabits: Habit[] = Array.from(new Array(10).keys()).map(index => ({
  id: `habit-${index + 1}`,
  title: `Habit ${index + 1}`,
  description: `This is the description for Habit ${index + 1}.`,
  target: index ** 2,
  updatedAt: 1766005871203 - Math.floor((index / 10) * 86400000),
}));

export const fetchHabits = createAsyncThunk(
  'users/fetchByIdStatus',
  async () => {
    await wait(500);
    return fakeHabits;
  },
);

export const addHabit = createAsyncThunk(
  'habits/addHabit',
  async (newHabit: Pick<Habit, 'title' | 'description' | 'target'>) => {
    await wait(300);
    return newHabit;
  },
);

export const updateHabit = createAsyncThunk(
  'habits/updateHabit',
  async (
    updatedHabit: Pick<Habit, 'title' | 'description' | 'target' | 'id'>,
  ) => {
    await wait(300);
    return updatedHabit;
  },
);

export const deleteHabit = createAsyncThunk(
  'habits/deleteHabit',
  async (habitId: string) => {
    await wait(300);
    return habitId;
  },
);

interface HabitsState {
  list: Habit[];
}

const initialState: HabitsState = {
  list: [],
};

export const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchHabits.fulfilled, (state, action) => {
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
    builder.addCase(addHabit.fulfilled, (state, action) => {
      state.list.push({
        ...action.payload,
        id: `habit-${Date.now()}`,
        updatedAt: Date.now(),
      });
      state.list.sort((a, b) => b.updatedAt - a.updatedAt);
    });
    builder.addCase(updateHabit.fulfilled, (state, action) => {
      const index = state.list.findIndex(
        habit => habit.id === action.payload.id,
      );
      if (~index) {
        Object.assign(state.list[index], action.payload);
      }
    });
    builder.addCase(deleteHabit.fulfilled, (state, action) => {
      state.list = state.list.filter(habit => habit.id !== action.payload);
    });
  },
});

export const habitsListSelector = (state: RootState) => state.habits.list;

export const habitSelector = (habitId?: string) => (state: RootState) =>
  state.habits.list.find(habit => habit.id === habitId);

export const {} = habitsSlice.actions;

export default habitsSlice.reducer;
