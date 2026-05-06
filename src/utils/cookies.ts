/**
 * Cookie utility for secure token storage
 * Provides methods to get, set, and remove cookies with proper security settings
 */

interface CookieOptions {
  days?: number;
  path?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

interface TokenStorage {
  setToken: (token: string) => void;
  getToken: () => string | null;
  removeToken: () => void;
  setUserId: (userId: string) => void;
  getUserId: () => string | null;
  removeUserId: () => void;
  setRefreshToken: (token: string) => void;
  getRefreshToken: () => string | null;
  removeRefreshToken: () => void;
  clear: () => void;
}

/**
 * Set a cookie with the given name and value
 * @param name - Cookie name
 * @param value - Cookie value
 * @param options - Cookie options (expiration, path, security)
 */
export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  try {
    const {
      days = 7, // Default to 7 days
      path = '/',
      secure = window.location.protocol === 'https:',
      sameSite = 'lax'
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    }

    cookieString += `; path=${path}`;

    if (secure) {
      cookieString += '; secure';
    }

    cookieString += `; SameSite=${sameSite}`;

    document.cookie = cookieString;
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
};

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  try {
    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(
          cookie.substring(nameEQ.length, cookie.length)
        );
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting cookie:', error);
    return null;
  }
};

/**
 * Remove a cookie by name
 * @param name - Cookie name
 * @param path - Cookie path (must match the path used when setting)
 */
export const removeCookie = (name: string, path: string = '/'): void => {
  try {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
  } catch (error) {
    console.error('Error removing cookie:', error);
  }
};

/**
 * Check if cookies are available
 * @returns true if cookies can be set and retrieved
 */
export const areCookiesAvailable = (): boolean => {
  try {
    const testKey = '__cookie_test__';
    setCookie(testKey, 'test', { days: 1 });
    const value = getCookie(testKey);
    removeCookie(testKey);
    return value === 'test';
  } catch {
    return false;
  }
};

/**
 * Token-specific storage methods
 */
export const tokenStorage: TokenStorage = {
  /**
   * Store authentication token in cookie
   * @param token - JWT token
   */
  setToken: (token: string): void => {
    setCookie('auth_token', token, {
      days: 7,
      path: '/',
      sameSite: 'lax'
    });
  },

  /**
   * Get authentication token from cookie
   * @returns Token string or null
   */
  getToken: (): string | null => {
    return getCookie('auth_token');
  },

  /**
   * Remove authentication token
   */
  removeToken: (): void => {
    removeCookie('auth_token', '/');
  },

  /**
   * Store user ID in cookie
   * @param userId - User ID
   */
  setUserId: (userId: string): void => {
    setCookie('user_id', userId, {
      days: 7,
      path: '/',
      sameSite: 'lax'
    });
  },

  /**
   * Get user ID from cookie
   * @returns User ID or null
   */
  getUserId: (): string | null => {
    return getCookie('user_id');
  },

  /**
   * Remove user ID
   */
  removeUserId: (): void => {
    removeCookie('user_id', '/');
  },

  /**
   * Clear all auth-related cookies
   */
  clear: (): void => {
    removeCookie('auth_token', '/');
    removeCookie('user_id', '/');
    removeCookie('user_role', '/');
    removeCookie('refresh_token', '/');
  },

  setRefreshToken: (token: string): void => {
    setCookie('refresh_token', token, { days: 7, path: '/', sameSite: 'lax' });
  },

  getRefreshToken: (): string | null => {
    return getCookie('refresh_token');
  },

  removeRefreshToken: (): void => {
    removeCookie('refresh_token', '/');
  },
};
