import { WritingStyleDTO } from '@shared/types';
import { apiClient } from './apiClient';

export const styleService = {
  async list(): Promise<WritingStyleDTO[]> {
    const { data } = await apiClient.get<{ success: boolean; data: { styles: WritingStyleDTO[] } }>('/styles');
    return data.data.styles;
  },
};

