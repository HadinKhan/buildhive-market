import api from "./api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface UserSettings {
  notifications: Record<string, boolean>;
  privacy: Record<string, boolean>;
  preferences: Record<string, string | boolean>;
  security: Record<string, boolean>;
}

export const settingsService = {
  async getSettings(): Promise<Partial<UserSettings>> {
    const response = await api.get<ApiResponse<Partial<UserSettings>>>("/settings");
    return response.data.data || {};
  },

  async updateSettings(settings: Partial<UserSettings>): Promise<Partial<UserSettings>> {
    const response = await api.put<ApiResponse<Partial<UserSettings>>>("/settings", settings);
    return response.data.data || settings;
  },
};
