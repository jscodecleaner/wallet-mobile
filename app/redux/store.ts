import {configureStore} from '@reduxjs/toolkit';
import {getDefaultMiddleware} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: customizedMiddleware,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
