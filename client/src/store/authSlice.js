import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials)
    localStorage.setItem('token', data.token)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData)
    localStorage.setItem('token', data.token)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload.user
        state.token = payload.token
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload.user
        state.token = payload.token
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer