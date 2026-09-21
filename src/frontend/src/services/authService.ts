import { apiClient } from './apiClient';

export interface LoginResponse {
  token: string;
  username: string;
  expiresAtUtc: string;
  message: string;
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('zacatlan_admin_token', response.data.token);
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('zacatlan_admin_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('zacatlan_admin_token');
  }
};
