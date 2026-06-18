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
  accessToken?: string;
  refreshToken?: string;
  accountStatus?: string;
  requiresAdminApproval?: boolean;
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
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);

    this.clearAuthData();
    
    return response.data.data;
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    
    if (response.data.success && response.data.data.accessToken) {
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
    await api.put('/auth/change-password', {
      currentPassword: oldPassword,
      newPassword: newPassword,
    });
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<string> {
    const response = await api.post<ApiResponse<{
      accountStatus?: string;
      requiresAdminApproval?: boolean;
    }>>('/auth/verify-email', { token });

    return response.data.message || "Email verified successfully.";
  }

  /**
   * Resend email verification
   */
  async resendVerification(email: string): Promise<string> {
    const response = await api.post<ApiResponse<any>>('/auth/resend-verification', { email });
    return response.data.message || "Verification email sent successfully";
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/refresh');
    
    if (response.data.success && response.data.data.accessToken) {
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
    if (!authData.accessToken) {
      return;
    }

    tokenStorage.setToken(authData.accessToken);
    tokenStorage.setUserId(authData.user.id);
    
    // Store role, refresh token, and user data in cookies
    document.cookie = `user_role=${encodeURIComponent(authData.user.role)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    if (authData.refreshToken) {
      document.cookie = `refresh_token=${encodeURIComponent(authData.refreshToken)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    }
    document.cookie = `user_data=${encodeURIComponent(JSON.stringify(authData.user))}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  }

  /**
   * Clear authentication data from cookies
   */
  private clearAuthData(): void {
    tokenStorage.clear();
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    document.cookie = 'user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!tokenStorage.getToken();
  }

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    return tokenStorage.getToken();
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
          return JSON.parse(decodeURIComponent(value));
        }
      }
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
