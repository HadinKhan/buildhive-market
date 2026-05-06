import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import api from "../services/api";
import {
  authService,
  type AuthResponse,
  type LoginCredentials,
  type RegisterData,
} from "../services/authService";
import { tokenStorage } from "../utils/cookies";
import type { User as AppUser } from "../../types";

type AuthUser = AppUser & {
  fullName?: string;
  profileImage?: string | null;
  phone?: string | null;
  emailVerified?: boolean;
};

interface AuthSession {
  token: string;
  refreshToken: string | null;
  user: AuthUser;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  token: string | null;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  refreshUser: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AUTH_STORAGE_KEY = "buildhive.auth.session";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const safeLocalStorage = {
  getItem(key: string): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Ignore storage failures so auth still works in restricted browsers.
    }
  },
  removeItem(key: string): void {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore storage failures so logout still completes.
    }
  },
};

const normalizeUser = (user: unknown): AuthUser | null => {
  if (!user || typeof user !== "object") {
    return null;
  }

  const raw = user as Record<string, unknown>;
  const id = String(raw.id ?? "");
  const email = String(raw.email ?? "");

  if (!id || !email) {
    return null;
  }

  const fullName = String(raw.fullName ?? raw.full_name ?? "");
  const profileImage = (raw.profileImage ?? raw.profile_image ?? null) as
    | string
    | null;
  const phone = (raw.phone ?? null) as string | null;
  const role = String(raw.role ?? "buyer");
  const emailVerified = Boolean(
    raw.emailVerified ?? raw.email_verified ?? false,
  );

  return {
    ...(raw as AuthUser),
    id,
    email,
    fullName,
    full_name: String(raw.full_name ?? fullName),
    profileImage,
    profile_image: profileImage ?? undefined,
    phone,
    role: role as AuthUser["role"],
    emailVerified,
    email_verified: Boolean(raw.email_verified ?? emailVerified),
  };
};

const readStoredSession = (): AuthSession | null => {
  const rawSession = safeLocalStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawSession) as Partial<AuthSession>;
    const user = normalizeUser(parsed.user);

    if (!parsed.token || !user) {
      return null;
    }

    return {
      token: parsed.token,
      refreshToken: parsed.refreshToken ?? null,
      user,
    };
  } catch {
    return null;
  }
};

const persistSession = (session: AuthSession): void => {
  const payload = {
    token: session.token,
    refreshToken: session.refreshToken,
    user: session.user,
  };

  safeLocalStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));

  tokenStorage.setToken(session.token);
  if (session.refreshToken) {
    tokenStorage.setRefreshToken(session.refreshToken);
  }
  tokenStorage.setUserId(session.user.id);

  if (typeof document !== "undefined") {
    document.cookie = `user_role=${encodeURIComponent(
      session.user.role,
    )}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    document.cookie = `user_data=${encodeURIComponent(
      JSON.stringify(session.user),
    )}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  }
};

const clearSession = (): void => {
  safeLocalStorage.removeItem(AUTH_STORAGE_KEY);
  tokenStorage.clear();

  if (typeof document !== "undefined") {
    document.cookie =
      "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie =
      "user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const syncAuthState = useCallback((session: AuthSession) => {
    setUser(session.user);
    setToken(session.token);
    persistSession(session);
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        console.error("Logout error:", error);
      }
    } finally {
      clearSession();
      setUser(null);
      setToken(null);
    }
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    const currentToken = tokenStorage.getToken() || token;
    if (!currentToken) {
      throw new Error("No authentication token found");
    }

    try {
      const refreshedUser = await authService.getCurrentUser();
      const normalizedUser = normalizeUser(refreshedUser);

      if (!normalizedUser) {
        throw new Error("Invalid user profile returned from server");
      }

      const existingSession = readStoredSession();
      const refreshToken =
        existingSession?.refreshToken || tokenStorage.getRefreshToken();

      syncAuthState({
        token: currentToken,
        refreshToken,
        user: normalizedUser,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await signOut();
      }
      throw error;
    }
  }, [signOut, syncAuthState, token]);

  const initializeAuth = useCallback(async (): Promise<void> => {
    try {
      const storedSession = readStoredSession();
      const cookieToken = authService.getToken();
      const cookieUser = normalizeUser(authService.getUser());

      const tokenFromStorage = storedSession?.token || cookieToken;
      const userFromStorage = storedSession?.user || cookieUser;
      const refreshTokenFromStorage =
        storedSession?.refreshToken || tokenStorage.getRefreshToken();

      if (!tokenFromStorage || !userFromStorage) {
        clearSession();
        return;
      }

      syncAuthState({
        token: tokenFromStorage,
        refreshToken: refreshTokenFromStorage,
        user: userFromStorage,
      });

      try {
        await refreshUser();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return;
        }

        const fallbackUser = storedSession?.user || userFromStorage;
        if (fallbackUser) {
          syncAuthState({
            token: tokenFromStorage,
            refreshToken: refreshTokenFromStorage,
            user: fallbackUser,
          });
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth state:", error);
      clearSession();
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [refreshUser, syncAuthState]);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  const signIn = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      const authData: AuthResponse = await authService.login(credentials);
      const normalizedUser = normalizeUser(authData.user);

      if (!normalizedUser) {
        throw new Error("Invalid user returned from login");
      }

      syncAuthState({
        token: authData.accessToken,
        refreshToken: authData.refreshToken,
        user: normalizedUser,
      });
    },
    [syncAuthState],
  );

  const register = useCallback(
    async (data: RegisterData): Promise<void> => {
      const authData: AuthResponse = await authService.register(data);
      const normalizedUser = normalizeUser(authData.user);

      if (!normalizedUser) {
        throw new Error("Invalid user returned from registration");
      }

      syncAuthState({
        token: authData.accessToken,
        refreshToken: authData.refreshToken,
        user: normalizedUser,
      });
    },
    [syncAuthState],
  );

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user && token),
      loading,
      token,
      signIn,
      signOut,
      register,
      refreshUser,
      login: signIn,
      logout: signOut,
    }),
    [loading, refreshUser, register, signIn, signOut, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
