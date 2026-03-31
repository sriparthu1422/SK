import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const savedUser = JSON.parse(localStorage.getItem('user') || 'null');

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/auth/login', credentials);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/auth/register', userData);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const updateUser = createAsyncThunk('auth/updateUser', async (userData, { getState, rejectWithValue }) => {
  try {
    const { auth: { user } } = getState();
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const { data } = await axios.put('/api/auth/profile', userData, config);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Profile update failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: savedUser, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, s => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(registerUser.pending, s => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(updateUser.pending, s => { s.loading = true; s.error = null; })
      .addCase(updateUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(updateUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export const selectUser = state => state.auth.user;
export const selectAuthLoading = state => state.auth.loading;
export const selectAuthError = state => state.auth.error;
export default authSlice.reducer;
