import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { RootState, AppDispatch } from '../store';
import {
  loginUser,
  signupUser,
  verifyOTP,
  fetchUserProfile,
  updateUserProfile,
  logout,
  clearError,
  initializeAuth,
} from '../store/reducers/registrationSlice';
import { SignUpData, LoginData, OTPVerificationData, User } from '../services/authService';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Select auth state from Redux store
  const {
    isAuthenticated,
    user,
    token,
    loading,
    error,
    requiresOTP,
    otp,
  } = useSelector((state: RootState) => state.registration);

  // Auth actions
  const login = useCallback(
    (credentials: LoginData) => dispatch(loginUser(credentials)),
    [dispatch]
  );

  const signup = useCallback(
    (userData: SignUpData) => dispatch(signupUser(userData)),
    [dispatch]
  );

  const verifyUserOTP = useCallback(
    (otpData: OTPVerificationData) => dispatch(verifyOTP(otpData)),
    [dispatch]
  );

  const getProfile = useCallback(
    () => dispatch(fetchUserProfile()),
    [dispatch]
  );

  const updateProfile = useCallback(
    (userData: Partial<User>) => dispatch(updateUserProfile(userData)),
    [dispatch]
  );

  const logoutUser = useCallback(
    () => dispatch(logout()),
    [dispatch]
  );

  const clearAuthError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  const initAuth = useCallback(
    () => dispatch(initializeAuth()),
    [dispatch]
  );

  return {
    // State
    isAuthenticated,
    user,
    token,
    loading,
    error,
    requiresOTP,
    otp,
    
    // Actions
    login,
    signup,
    verifyUserOTP,
    getProfile,
    updateProfile,
    logoutUser,
    clearAuthError,
    initAuth,
  };
};
