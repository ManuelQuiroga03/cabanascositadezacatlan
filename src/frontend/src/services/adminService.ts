import { apiClient } from './apiClient';
import type {
  CreateManualBlockRequest,
  BlockedDate,
  DashboardStats,
  BookingDetail,
  Accommodation,
  UpdateAccommodationRequest,
} from '../types';

export const adminService = {
  async createBlock(request: CreateManualBlockRequest): Promise<BlockedDate> {
    const response = await apiClient.post<BlockedDate>('/admin/blocks', request);
    return response.data;
  },

  async deleteBlock(id: string): Promise<void> {
    await apiClient.delete(`/admin/blocks/${id}`);
  },

  async confirmBooking(bookingId: string): Promise<BookingDetail> {
    const response = await apiClient.patch<BookingDetail>(`/admin/bookings/${bookingId}/confirm`);
    return response.data;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>('/admin/dashboard-stats');
    return response.data;
  },

  async getPendingHolds(): Promise<BookingDetail[]> {
    const response = await apiClient.get<BookingDetail[]>('/admin/pending-holds');
    return response.data;
  },

  async updateAccommodation(id: string, request: UpdateAccommodationRequest): Promise<Accommodation> {
    const response = await apiClient.put<Accommodation>(`/admin/accommodations/${id}`, request);
    return response.data;
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<{ imageUrl: string }>('/admin/upload-image', formData, {
      headers: {
        'Content-Type': undefined,
      },
    });
    return response.data.imageUrl;
  },
};
