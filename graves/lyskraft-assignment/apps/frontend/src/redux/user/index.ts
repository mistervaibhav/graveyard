import { createSlice } from '@reduxjs/toolkit';

interface IUserState {
  id: string;
  name: string;
  email: string;
  token: string;
  store: {
    id: string;
    name: string;
    GSTIN: string;
    createdAt: string;
    updatedAt: string;
    address: {
      id: string;
      addressLine: string;
      city: string;
      state: string;
      pincode: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

const INITIAL_STATE: IUserState = {
  id: '',
  name: '',
  email: '',
  token: '',
  store: {
    id: '',
    name: '',
    GSTIN: '',
    createdAt: '',
    updatedAt: '',
    address: {
      id: '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      createdAt: '',
      updatedAt: '',
    },
  },
} as const;

const userSlice = createSlice({
  name: 'user',
  initialState: INITIAL_STATE,
  reducers: {
    setUserState(state, action) {
      state.token = action.payload.token;
      state.id = action.payload.user.id;
      state.name = action.payload.user.name;
      state.email = action.payload.user.email;
      state.store = action.payload.store;
    },
    resetUserState(state) {
      state.email = '';
      state.id = '';
      state.name = '';
      state.token = '';
      state.store = {
        id: '',
        name: '',
        GSTIN: '',
        createdAt: '',
        updatedAt: '',
        address: {
          id: '',
          addressLine: '',
          city: '',
          state: '',
          pincode: '',
          createdAt: '',
          updatedAt: '',
        },
      };
    },
  },
});

export const { setUserState, resetUserState } = userSlice.actions;

export const userReducer = userSlice.reducer;
