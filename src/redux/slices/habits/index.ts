import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fakeHabits, type Habit} from './fake-data';
import type {RootState} from '@/redux/store';

// ATTENTION: RTK Slice and Thunks are only being used to implement "Last Write Wins" strategy for data persistence later.

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchHabits = createAsyncThunk(
  'users/fetchByIdStatus',
  async () => {
    console.log(1);
    await wait(500);
    console.log(2);
    return fakeHabits;
  },
);

export const addHabit = createAsyncThunk(
  'habits/addHabit',
  async (newHabit: Habit) => {
    await wait(300);
    return newHabit;
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
      state.list = action.payload;
    });
    builder.addCase(addHabit.fulfilled, (state, action) => {
      state.list.push(action.payload);
    });
    builder.addCase(deleteHabit.fulfilled, (state, action) => {
      state.list = state.list.filter(habit => habit.id !== action.payload);
    });
  },
});

export const habitsListSelector = (state: RootState) => state.habits.list;

export const {} = habitsSlice.actions;

export default habitsSlice.reducer;
