import { apiClient } from './apiClient';
import type {
  HoldBookingRequest,
  HoldBookingResponse,
  ConfirmWhatsAppRequest,
  ConfirmWhatsAppResponse,
} from '../types';

export const bookingsService = {
  async createHold(request: HoldBookingRequest): Promise<HoldBookingResponse> {
    const response = await apiClient.post<HoldBookingResponse>('/bookings/hold', request);
    return response.data;
  },

  async confirmWhatsApp(request: ConfirmWhatsAppRequest): Promise<ConfirmWhatsAppResponse> {
    const response = await apiClient.post<ConfirmWhatsAppResponse>('/bookings/confirm-whatsapp', request);
    return response.data;
  },
};
