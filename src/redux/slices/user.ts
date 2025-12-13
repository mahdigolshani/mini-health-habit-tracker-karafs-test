import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '@/redux/store';

interface UserSettingsState {
  privilageLevel: 'user' | 'guest' | null;
  isLoggedIn: boolean;
}

const initialState: UserSettingsState = {
  privilageLevel: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<'user' | 'guest'>) => {
      state.isLoggedIn = true;
      state.privilageLevel = action.payload;
    },
    logout: state => {
      state.isLoggedIn = false;
      state.privilageLevel = null;
    },
  },
});

export const {login, logout} = userSlice.actions;

export const isLoggedInSelector = (state: RootState) => state.user.isLoggedIn;
export const privilageLevelSelector = (state: RootState) =>
  state.user.privilageLevel;

export default userSlice.reducer;
