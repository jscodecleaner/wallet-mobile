import {Okta} from '@okta/okta-react-native';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

interface UserState {
  authenticated: boolean;
  token: Okta.AuthenticationResponse;
}

const initialState: UserState = {
  authenticated: false,
  token: {
    resolve_type: '',
    access_token: '',
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    Login: (state, action: PayloadAction<Okta.AuthenticationResponse>) => {
      state.authenticated = true;
      state.token = {...action.payload};
    },
    LogOut: state => {
      state.authenticated = false;
      state.token = {
        resolve_type: '',
        access_token: '',
      };
    },
  },
});

export const {Login, LogOut} = userSlice.actions;

export const hasAuth = (state: RootState) => state.user.authenticated;

export default userSlice.reducer;
