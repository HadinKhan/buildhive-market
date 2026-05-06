import api from './api';
import { tokenStorage } from '../utils/cookies';

// =============================================
// API Response Types
// =============================================
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

// =============================================
// Authentication Types
// =============================================
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: 'buyer' | 'contractor' | 'supplier';
  termsAccepted?: boolean;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    phone: string | null;
    role: string;
    emailVerified: boolean;
    profileImage: string | null;
  };
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

// =============================================
// Authentication Service
// =============================================
class AuthService {
  private redirectToSignIn(): void {
    if (typeof window === "undefined") {
      return;
    }

    const target = `${window.location.origin}/signin`;
    if (window.location.pathname + window.location.search + window.location.hash !== new URL(target).pathname) {
      window.location.replace(target);
    }
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    console.log('🔵 [AuthService] Registering user with data:', data);
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    console.log('🟢 [AuthService] Registration response:', response.data);
    
    if (response.data.success && response.data.data.accessToken) {
      console.log('✅ [AuthService] Storing auth data from registration');
      // Store authentication data
      this.storeAuthData(response.data.data);
    }
    
    return response.data.data;
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🔵 [AuthService] Logging in with email:', credentials.email);
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    console.log('🟢 [AuthService] Login response:', response.data);
    
    if (response.data.success && response.data.data.accessToken) {
      console.log('✅ [AuthService] Storing auth data from login');
      // Store authentication data
      this.storeAuthData(response.data.data);
    }
    
    return response.data.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
      this.redirectToSignIn();
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<any> {
    const response = await api.get<ApiResponse<any>>('/auth/me');
    return response.data.data;
  }

  /**
   * Forgot password - Send reset email
   */
  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    await api.post('/auth/forgot-password', data);
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordData): Promise<void> {
    await api.post('/auth/reset-password', data);
  }

  /**
   * Change password (authenticated user)
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    console.log('🔐 [AuthService] Changing password with payload:', {
      currentPassword: oldPassword ? '***' : undefined,
      newPassword: newPassword ? '***' : undefined,
    });
    await api.put('/auth/change-password', {
      currentPassword: oldPassword,
      newPassword: newPassword,
    });
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    await api.get(`/auth/verify-email?token=${token}`);
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse> {
    console.log('🔄 [AuthService] Refreshing token...');
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/refresh');
    console.log('🟢 [AuthService] Token refresh response:', response.data);
    
    if (response.data.success && response.data.data.accessToken) {
      console.log('✅ [AuthService] Storing refreshed auth data');
      this.storeAuthData(response.data.data);
    }
    
    return response.data.data;
  }

  // =============================================
  // Helper Methods
  // =============================================

  /**
   * Store authentication data in cookies
   */
  private storeAuthData(authData: AuthResponse): void {
    console.log('💾 [AuthService] Storing auth data:', {
      userId: authData.user.id,
      email: authData.user.email,
      role: authData.user.role,
      hasAccessToken: !!authData.accessToken,
      hasRefreshToken: !!authData.refreshToken
    });
    
    tokenStorage.setToken(authData.accessToken);
    tokenStorage.setUserId(authData.user.id);
    
    // Store role, refresh token, and user data in cookies
    document.cookie = `user_role=${encodeURIComponent(authData.user.role)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    document.cookie = `refresh_token=${encodeURIComponent(authData.refreshToken)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    document.cookie = `user_data=${encodeURIComponent(JSON.stringify(authData.user))}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    
    console.log('✅ [AuthService] Auth data stored successfully');
  }

  /**
   * Clear authentication data from cookies
   */
  private clearAuthData(): void {
    console.log('🗑️ [AuthService] Clearing auth data');
    tokenStorage.clear();
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    document.cookie = 'user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    console.log('✅ [AuthService] Auth data cleared');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const hasToken = !!tokenStorage.getToken();
    console.log('🔐 [AuthService] isAuthenticated:', hasToken);
    return hasToken;
  }

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    const token = tokenStorage.getToken();
    console.log('🎫 [AuthService] getToken:', token ? `${token.substring(0, 20)}...` : 'null');
    return token;
  }

  /**
   * Get stored user ID
   */
  getUserId(): string | null {
    return tokenStorage.getUserId();
  }

  /**
   * Get stored user role
   */
  getUserRole(): string | null {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'user_role') {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  /**
   * Get stored user data
   */
  getUser(): any | null {
    try {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'user_data') {
          const user = JSON.parse(decodeURIComponent(value));
          console.log('👤 [AuthService] getUser:', user);
          return user;
        }
      }
      console.log('👤 [AuthService] getUser: null (no cookie found)');
      return null;
    } catch (error) {
      console.error('❌ [AuthService] getUser error:', error);
      // Invalid JSON in cookie, clear and return null
      document.cookie = 'user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      return null;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
