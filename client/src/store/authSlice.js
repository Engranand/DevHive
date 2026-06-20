import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials)
    localStorage.setItem('token', data.token)
    // Active project bhi save karo localStorage mein
    if (data.projects?.length > 0) {
      localStorage.setItem('activeProjectId', data.projects[0]._id)
    }
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

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me')
    return data
  } catch (err) {
    localStorage.removeItem('token')
    return rejectWithValue('Session expired')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
    projects: [],
    activeProject: localStorage.getItem('activeProjectId')
      ? { _id: localStorage.getItem('activeProjectId') }
      : null,
    hasProject: false,
    authChecked: false, // ← naya field
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.projects = []
      state.activeProject = null
      state.hasProject = false
      state.authChecked = false
      localStorage.removeItem('token')
      localStorage.removeItem('activeProjectId')
    },
    clearError(state) {
      state.error = null
    },
    // Active project switch karo
    setActiveProject(state, { payload }) {
      state.activeProject = payload
      state.hasProject = true
      localStorage.setItem('activeProjectId', payload._id)
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Login ──────────────────────────────────────────
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload.user
        state.token = payload.token
        state.projects = payload.projects || []
        state.hasProject = payload.hasProject || false
        state.authChecked = true
        // Pehla project active set karo
        if (payload.projects?.length > 0) {
          state.activeProject = payload.projects[0]
        }
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })

      // ── Register ───────────────────────────────────────
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload.user
        state.token = payload.token
        state.projects = []
        state.hasProject = false  // Naya user — project banana hai
        state.activeProject = null
        state.authChecked = true
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })

      // ── CheckAuth ──────────────────────────────────────
      .addCase(checkAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuth.fulfilled, (state, { payload }) => {
        state.loading = false
        state.authChecked = true
        state.user = payload.user
        state.projects = payload.projects || []
        state.hasProject = payload.hasProject || false
        if (payload.projects?.length > 0) {
          const savedId = localStorage.getItem('activeProjectId')
          const found = payload.projects.find(p => p._id === savedId)
          state.activeProject = found || payload.projects[0]
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false
        state.authChecked = true
        state.user = null
        state.token = null
      })
  },
})

export const { logout, clearError, setActiveProject } = authSlice.actions
export default authSlice.reducer