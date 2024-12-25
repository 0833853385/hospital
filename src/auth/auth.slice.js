import { createSlice } from '@reduxjs/toolkit';

const AuthLoginState = {
  isAuthenticated: false,
  accessToken: '',
  refreshToken: '',
  user: null,
};

export const authLoginSlice = createSlice({
  name: 'authLogin',
  initialState: AuthLoginState,
  reducers: {
    setLogin: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setLogout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = '';
      state.refreshToken = '';
      state.user = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setLogin, setLogout, setAccessToken, setRefreshToken, setUser } =
  authLoginSlice.actions;

export const loginSelector = (state) => state.auth.isAuthenticated;
export const logoutSelector = (state) => state.auth.isAuthenticated;
export const accessTokenSelector = (state) => state.auth.accessToken;
export const refreshTokenSelector = (state) => state.auth.refreshToken;
export const userSelector = (state) => state.auth.user;

export default authLoginSlice.reducer;
