// src/features/auth/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ipermisson } from 'interfaces';

export interface User {
  // avatar: string;
  email: string;
  id: number;
  name: string;
  permissions: Ipermisson[];
}
interface AuthState {
  authData: {
    token: string | null;
    id: number | null;
  };
}

const initialState: AuthState = {
  authData: {
    token: null,
    id: null,
  },
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.authData.token = action.payload.token;
      state.authData.id = action.payload.user.id;
    },
    clearCredentials: (state) => {
      state.authData.token = null;
      state.authData.id = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
