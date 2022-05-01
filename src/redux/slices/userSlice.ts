import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { LoginData } from '../../types/interface';

interface UserState {
  authenticated: boolean;
  mfaActived: boolean;
}

const initialState: UserState = {
  authenticated: false,
  mfaActived: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    Login: (state, action: PayloadAction<LoginData>) => {
      state.authenticated = true;
    },
    Logout: state => {
      state.authenticated = false;
      state.mfaActived = false;
    },
    
  },
});

export const {Login, LogOut} = userSlice.actions;

export default userSlice.reducer;
