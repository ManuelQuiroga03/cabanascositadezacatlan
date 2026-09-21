import { apiClient } from './apiClient';
import type { Accommodation, MonthlyAvailability, MatrixAvailability } from '../types';

export const accommodationsService = {
  async getAll(): Promise<Accommodation[]> {
    const response = await apiClient.get<Accommodation[]>('/accommodations');
    return response.data;
  },

  async getBySlug(slug: string): Promise<Accommodation> {
    const response = await apiClient.get<Accommodation>(`/accommodations/${slug}`);
    return response.data;
  },

  async getMonthlyAvailability(id: string, month: number, year: number): Promise<MonthlyAvailability> {
    const response = await apiClient.get<MonthlyAvailability>(`/accommodations/${id}/availability`, {
      params: { month, year },
    });
    return response.data;
  },

  async getMatrixAvailability(startDate?: string, endDate?: string): Promise<MatrixAvailability> {
    const response = await apiClient.get<MatrixAvailability>('/accommodations/matrix-availability', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};
