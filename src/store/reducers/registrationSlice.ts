import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authService, SignUpData, LoginData, OTPVerificationData, User } from "../../services/authService";

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginData, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData: SignUpData, { rejectWithValue }) => {
    try {
      const response = await authService.signUp(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otpData: OTPVerificationData, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOTP(otpData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getProfile();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const user = await authService.updateProfile(userData);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  requiresOTP: boolean;
  otp: number | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
  requiresOTP: false,
  otp: null,
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    // Synchronous actions
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.requiresOTP = false;
      state.otp = null;
      state.error = null;
      // Clear localStorage
      authService.logout();
    },
    clearError: (state) => {
      state.error = null;
    },
    setUserData: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    // Initialize auth state from localStorage on app start
    initializeAuth: (state) => {
      const isAuth = authService.isAuthenticated();
      const token = authService.getToken();
      const user = authService.getUserFromToken();
      
      if (isAuth && token && user) {
        state.isAuthenticated = true;
        state.token = token;
        state.user = user;
      }
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.requiresOTP = action.payload.requiresOTP || false;
        state.otp = action.payload.otp || null;
        
        // Only set authenticated if no OTP required
        if (!action.payload.requiresOTP) {
          state.isAuthenticated = true;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.requiresOTP = action.payload.requiresOTP || false;
        state.otp = action.payload.otp || null;
        
        // Only set authenticated if no OTP required
        if (!action.payload.requiresOTP) {
          state.isAuthenticated = true;
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // OTP verification cases
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.requiresOTP = false;
        state.otp = null;
        // Update token and user data from OTP verification response
        if (action.payload.token) {
          state.token = action.payload.token;
        }
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Profile fetch cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Profile update cases
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setUserData, initializeAuth } = registrationSlice.actions;

export const persistConfigRegistration = { key: "registration", storage };

export const persistedRegistrationReducer = persistReducer(persistConfigRegistration, registrationSlice.reducer);

export default registrationSlice.reducer;
