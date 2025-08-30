import { apiClient, API_ENDPOINTS } from './api';

export interface SignUpData {
  mob: string;              // Phone number
  full_name: string;    // Full name
  email: string;         // Email address
  code: string;          // Country code
}

export interface LoginData {
  phone: string;            // Phone number
}

export interface OTPVerificationData {
  otpKey: string;     // OTP key from signup/login response
  otp: string;        // OTP code as string
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  code?: string;
  status?: boolean;
  age?: number | null;
  blood_group?: string | null;
  education?: string;
  pincode?: string | null;
  thaluk?: string | null;
  district?: string | null;
  state?: string | null;
  country?: string | null;
  profile_url?: string | null;
  address?: string | null;
  gender?: string;
  date_of_birth?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendResponse<T = any> {
  success: boolean;
  message: string;
  instance: string;
  data?: T;
}

export interface LoginResponseData {
  user_id: string;
  otpKey: string; 
  otp: number;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
  requiresOTP?: boolean;
  otp?: number;
}

// Backend profile response structure
export interface BackendProfileData {
  id: string;
  name: string;
  phone: string;
  email: string;
  code: string;
  status: number | boolean;
  age: number | null;
  blood_group: string | null;
  education: string;
  pincode: string | null;
  thaluk: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  address: string | null;
  gender: string;
  date_of_birth: string | null;
  createdAt: string;
  updatedAt: string;
  profile_url?: string | null;
}

interface OTPVerificationResponse {
  user_id: string;
  key: string;        // New authenticated JWT token
  message: string;
}

// Helper function to decode JWT and extract user data
const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

const TOKEN_KEY = 'authToken';

// Authentication Service Functions
export const authService = {
  // Sign up new user
  signUp: async (userData: SignUpData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<BackendResponse<LoginResponseData>>(
        API_ENDPOINTS.SIGN_UP, 
        userData
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Sign up failed');
      }

      const { otpKey, otp, user_id } = response.data.data as LoginResponseData;
      
      // Store token in localStorage
      localStorage.setItem(TOKEN_KEY, otpKey);
      
      // Decode JWT to get user data
      const decodedToken = decodeJWT(otpKey);
      const userTokenData = decodedToken?.data || {};
      
      // Map backend user data to frontend User interface
      const user: User = {
        id: user_id,
        name: userTokenData.name || '',
        email: userTokenData.email || '',
        phone: userTokenData.phone || '',
        code: userTokenData.code || '',
        status: userTokenData.status || false,
        age: userTokenData.age,
        blood_group: userTokenData.blood_group,
        education: userTokenData.education || '',
        pincode: userTokenData.pincode,
        thaluk: userTokenData.thaluk,
        district: userTokenData.district,
        state: userTokenData.state,
        country: userTokenData.country,
        profile_url: userTokenData.profile_url,
        address: userTokenData.address,
        gender: userTokenData.gender || '',
        date_of_birth: userTokenData.date_of_birth,
        createdAt: userTokenData.createdAt,
        updatedAt: userTokenData.updatedAt,
      };
      
      return {
        user,
        token: otpKey,
        message: response.data.message,
        requiresOTP: !!otp,
        otp: otp,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Sign up failed');
    }
  },

  // Login user with phone number
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<BackendResponse<LoginResponseData>>(
        '/user/login',
        credentials
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      const { otpKey, otp, user_id } = response.data.data as LoginResponseData;
      
      // Store token in localStorage
      localStorage.setItem(TOKEN_KEY, otpKey);
      
      // Decode JWT to get user data
      const decodedToken = decodeJWT(otpKey);
      const userTokenData = decodedToken?.data || {};
      
      // Map backend user data to frontend User interface
      const user: User = {
        id: user_id,
        name: userTokenData.name || '',
        email: userTokenData.email || '',
        phone: userTokenData.phone || '',
        code: userTokenData.code || '',
        status: userTokenData.status || false,
        age: userTokenData.age,
        blood_group: userTokenData.blood_group,
        education: userTokenData.education || '',
        pincode: userTokenData.pincode,
        thaluk: userTokenData.thaluk,
        district: userTokenData.district,
        state: userTokenData.state,
        country: userTokenData.country,
        profile_url: userTokenData.profile_url,
        address: userTokenData.address,
        gender: userTokenData.gender || '',
        date_of_birth: userTokenData.date_of_birth,
        createdAt: userTokenData.createdAt,
        updatedAt: userTokenData.updatedAt,
      };
      
      return {
        user,
        token: otpKey,
        message: response.data.message,
        requiresOTP: !!otp,
        otp: otp,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  },

  // Verify OTP
  verifyOTP: async (otpData: OTPVerificationData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<BackendResponse<OTPVerificationResponse>>(
        API_ENDPOINTS.VERIFY_OTP,
        otpData
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'OTP verification failed');
      }

      // Store the new authenticated token from backend
      const authenticatedToken = response.data.data?.key;
      if (authenticatedToken) {
        localStorage.setItem(TOKEN_KEY, authenticatedToken);
        console.log('✅ Stored new authenticated token');
      }

      // Get user data from the new authenticated token
      const currentUser = authService.getUserFromToken();
      
      return {
        user: currentUser || {} as User,
        token: authenticatedToken || otpData.otpKey, // Use new token if available
        message: response.data.message,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'OTP verification failed');
    }
  },

  // Legacy signIn method for backward compatibility (redirects to login)
  signIn: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    throw new Error('Please use phone number login instead of email/password');
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    try {
      const response = await apiClient.get<BackendResponse<BackendProfileData>>(API_ENDPOINTS.USER_PROFILE);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch profile');
      }
      
      // Map backend response to frontend User interface
      const profileData = response.data.data as BackendProfileData ;
      const user: User = {
        id: profileData.id || '',
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        code: profileData.code || '',
        status: profileData.status === 1 || profileData.status === true,
        age: profileData.age,
        blood_group: profileData.blood_group,
        education: profileData.education || '',
        pincode: profileData.pincode,
        thaluk: profileData.thaluk,
        district: profileData.district,
        state: profileData.state,
        country: profileData.country,
        profile_url: profileData.profile_url,
        address: profileData.address,
        gender: profileData.gender || '',
        date_of_birth: profileData.date_of_birth,
        createdAt: profileData.createdAt,
        updatedAt: profileData.updatedAt,
      };
      
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch profile');
    }
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    try {
      // Map frontend User interface to backend expected fields
      const updateData = {
        name: userData.name,
        phone: userData.phone,
        code: userData.code,
        email: userData.email,
        age: userData.age,
        blood_group: userData.blood_group,
        education: userData.education,
        pincode: userData.pincode,
        gender: userData.gender,
        date_of_birth: userData.date_of_birth,
      };

      const response = await apiClient.post<BackendResponse<BackendProfileData>>(
        API_ENDPOINTS.UPDATE_PROFILE, 
        updateData
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update profile');
      }
      
      // Map backend response to frontend User interface
      const profileData = response.data.data as BackendProfileData;
      const user: User = {
        id: profileData.id || '',
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        code: profileData.code || '',
        status: profileData.status === 1 || profileData.status === true,
        age: profileData.age,
        blood_group: profileData.blood_group,
        education: profileData.education || '',
        pincode: profileData.pincode,
        thaluk: profileData.thaluk,
        district: profileData.district,
        state: profileData.state,
        country: profileData.country,
        profile_url: profileData.profile_url,
        address: profileData.address,
        gender: profileData.gender || '',
        date_of_birth: profileData.date_of_birth,
        createdAt: profileData.createdAt,
        updatedAt: profileData.updatedAt,
      };
      
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update profile');
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    
    // Check if token is expired
    try {
      const decodedToken = decodeJWT(token);
      const currentTime = Date.now() / 1000;
      return decodedToken?.exp > currentTime;
    } catch {
      return false;
    }
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get user data from stored token
  getUserFromToken: (): User | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    
    try {
      const decodedToken = decodeJWT(token);
      const tokenData = decodedToken?.data;
      
      // Handle different token types:
      // 1. otpKey (from signup/login) - contains full user object
      // 2. key (from OTP verification) - contains only user_id as string
      
      if (typeof tokenData === 'string') {
        // This is the authenticated token (key) with just user_id
        // We need to fetch user data from profile API
        return {
          id: tokenData,
          name: '',
          email: '',
          phone: '',
          code: '',
          status: false,
          age: null,
          blood_group: null,
          education: '',
          pincode: null,
          thaluk: null,
          district: null,
          state: null,
          country: null,
          profile_url: null,
          address: null,
          gender: '',
          date_of_birth: null,
          createdAt: '',
          updatedAt: '',
        };
      } else if (typeof tokenData === 'object' && tokenData !== null) {
        // This is the temporary token (otpKey) with full user data
        return {
          id: tokenData.id || '',
          name: tokenData.name || '',
          email: tokenData.email || '',
          phone: tokenData.phone || '',
          code: tokenData.code || '',
          status: tokenData.status || false,
          age: tokenData.age,
          blood_group: tokenData.blood_group,
          education: tokenData.education || '',
          pincode: tokenData.pincode,
          thaluk: tokenData.thaluk,
          district: tokenData.district,
          state: tokenData.state,
          country: tokenData.country,
          profile_url: tokenData.profile_url,
          address: tokenData.address,
          gender: tokenData.gender || '',
          date_of_birth: tokenData.date_of_birth,
          createdAt: tokenData.createdAt,
          updatedAt: tokenData.updatedAt,
        };
      }
      
      return null;
    } catch {
      return null;
    }
  },
};

export default authService;