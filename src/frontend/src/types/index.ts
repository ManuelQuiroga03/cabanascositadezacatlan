export type AccommodationType = 'Cabin' | 'HotelRoom';

export type BookingStatus = 'PendingHold' | 'Confirmed' | 'Cancelled' | 'Expired';

export interface Accommodation {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: AccommodationType;
  capacity: number;
  basePrice: number;
  amenities: string[];
  imageUrls: string[];
  isActive: boolean;
  bedrooms?: number;
  bathrooms?: number;
  tagline?: string;
  rating?: number;
  reviewsCount?: number;
}

export interface UpdateAccommodationRequest {
  name: string;
  description: string;
  type: AccommodationType;
  capacity: number;
  basePrice: number;
  amenities: string[];
  imageUrls: string[];
  isActive: boolean;
}

export interface HoldBookingRequest {
  accommodationId: string;
  customerName: string;
  customerPhone: string;
  checkInDate: string; // ISO format YYYY-MM-DD
  checkOutDate: string; // ISO format YYYY-MM-DD
}

export interface HoldBookingResponse {
  bookingId: string;
  accommodationId: string;
  accommodationName: string;
  customerName: string;
  customerPhone: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: BookingStatus;
  expiresAtUtc: string;
  holdTtlMinutes: number;
}

export interface ConfirmWhatsAppRequest {
  bookingId: string;
}

export interface ConfirmWhatsAppResponse {
  bookingId: string;
  status: BookingStatus;
  whatsAppRedirectUrl: string;
  message: string;
}

// --- Availability & Matrix Interfaces ---

export type DayStatus = 'Available' | 'Occupied' | 'Hold' | 'Blocked';

export interface DayAvailability {
  date: string;
  status: DayStatus;
  price: number;
}

export interface MonthlyAvailability {
  accommodationId: string;
  accommodationName: string;
  month: number;
  year: number;
  days: DayAvailability[];
}

export interface MatrixDayStatus {
  date: string;
  status: DayStatus;
}

export interface MatrixItem {
  accommodationId: string;
  accommodationName: string;
  type: AccommodationType;
  capacity: number;
  basePrice: number;
  dailyStatuses: MatrixDayStatus[];
}

export interface MatrixAvailability {
  startDate: string;
  endDate: string;
  items: MatrixItem[];
}

// --- Admin Backoffice Interfaces ---

export interface CreateManualBlockRequest {
  accommodationId: string;
  date: string;
  reason?: string;
}

export interface BlockedDate {
  id: string;
  accommodationId: string;
  date: string;
  reason: string;
}

export interface DashboardStats {
  pendingHoldsCount: number;
  confirmedBookingsCount: number;
  totalAccommodations: number;
  occupiedTodayCount: number;
  totalRevenue: number;
}

export interface BookingDetail {
  id: string;
  accommodationId: string;
  accommodationName: string;
  customerName: string;
  customerPhone: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: BookingStatus;
  expiresAtUtc: string;
  createdAtUtc: string;
}

// --- Review Interface ---

export interface Review {
  id: string;
  accommodationName: string;
  authorName: string;
  location: string;
  rating: number; // 1 - 5
  comment: string;
  date: string;
}
