import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {type Habit} from './types';
import type {RootState} from '@/redux/store';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const defaultHabits: Habit[] = [
  {
    id: 'default-drink-water',
    title: 'Drink Water',
    description: 'Drink 8 glasses of water daily',
    target: 8,
    updatedAt: Date.now(),
    isDefault: true,
  },
  {
    id: 'default-meditation',
    title: 'Meditation',
    description: 'Do meditation for 10 minutes daily',
    target: 10,
    updatedAt: Date.now(),
    isDefault: true,
  },
  {
    id: 'default-exercise',
    title: 'Exercise',
    description: 'Do exercise for 30 minutes daily',
    target: 30,
    updatedAt: Date.now(),
    isDefault: true,
  },
];

const fakeHabits: Habit[] = Array.from(new Array(10).keys()).map(index => ({
  id: `habit-${index + 1}`,
  title: `Habit ${index + 1}`,
  description: `This is the description for Habit ${index + 1}.`,
  target: index ** 2,
  updatedAt: 1766005871203 - Math.floor((index / 10) * 86400000),
  isDefault: false,
}));

export const fetchHabits = createAsyncThunk('habits/fetchHabits', async () => {
  await wait(500);
  return [...defaultHabits, ...fakeHabits];
});

export const addHabit = createAsyncThunk(
  'habits/addHabit',
  async (newHabit: Pick<Habit, 'title' | 'description' | 'target'>) => {
    await wait(300);
    return {
      ...newHabit,
      target: newHabit.target ?? 0,
    };
  },
);

export const updateHabit = createAsyncThunk(
  'habits/updateHabit',
  async (
    updatedHabit: Pick<Habit, 'title' | 'description' | 'target' | 'id'>,
  ) => {
    await wait(300);
    return {
      ...updatedHabit,
      target: updatedHabit.target ?? 0,
    };
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
        isDefault: false,
      });
      state.list.sort((a, b) => b.updatedAt - a.updatedAt);
    });
    builder.addCase(updateHabit.fulfilled, (state, action) => {
      const index = state.list.findIndex(
        habit => habit.id === action.payload.id,
      );
      if (~index) {
        if (state.list[index].isDefault) {
          return;
        }
        Object.assign(state.list[index], {
          ...action.payload,
          updatedAt: Date.now(),
        });
      }
    });
    builder.addCase(deleteHabit.fulfilled, (state, action) => {
      const habitToDelete = state.list.find(h => h.id === action.payload);
      if (habitToDelete?.isDefault) {
        return;
      }
      state.list = state.list.filter(habit => habit.id !== action.payload);
    });
  },
});

export const habitsListSelector = (state: RootState) => state.habits.list;

export const habitSelector = (habitId?: string) => (state: RootState) =>
  state.habits.list.find(habit => habit.id === habitId);

export const {} = habitsSlice.actions;

export default habitsSlice.reducer;
