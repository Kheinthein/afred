import { AuthResponse, LoginPayload, RegisterPayload } from '@shared/types';
import { apiClient } from './apiClient';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/login', payload);
    return data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/register', payload);
    return data.data;
  },
};

