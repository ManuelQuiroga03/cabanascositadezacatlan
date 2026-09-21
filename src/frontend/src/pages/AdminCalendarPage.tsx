import React, { useEffect, useState } from 'react';
import type { DashboardStats, BookingDetail, Accommodation } from '../types';
import { adminService } from '../services/adminService';
import { accommodationsService } from '../services/accommodationsService';
import { authService } from '../services/authService';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminDashboardStats } from '../components/admin/AdminDashboardStats';
import { PendingHoldsTable } from '../components/admin/PendingHoldsTable';
import { ManualBlockForm } from '../components/admin/ManualBlockForm';
import { AvailabilityMatrix } from '../components/matrix/AvailabilityMatrix';
import { AccommodationAdminList } from '../components/admin/AccommodationAdminList';
import { LayoutDashboard, RefreshCw, LogOut, ShieldCheck } from 'lucide-react';

export const AdminCalendarPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingHolds, setPendingHolds] = useState<BookingDetail[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    if (!authService.isAuthenticated()) return;
    setLoading(true);
    try {
      const [statsRes, holdsRes, accRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getPendingHolds(),
        accommodationsService.getAll(),
      ]);
      setStats(statsRes);
      setPendingHolds(holdsRes);
      setAccommodations(accRes);
    } catch (err: any) {
      console.warn('Admin fallback / unauthenticated state activated:', err);
      if (!authService.isAuthenticated()) {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLoginPage onSuccess={() => setIsAuthenticated(true)} />;
  }

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await adminService.confirmBooking(bookingId);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error al confirmar reserva');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-muted">
        <div>
          <div className="flex items-center space-x-2 text-forest-dark font-serif text-3xl font-bold">
            <LayoutDashboard className="w-8 h-8 text-terracotta" />
            <h1>Panel de Administración & Recepción</h1>
          </div>
          <p className="text-sm text-stone-charcoal/70 mt-1 flex items-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600 inline mr-1" />
            Sesión activa como Administrador. Gestión en tiempo real de hospedajes, apartados temporales y bloqueos.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="inline-flex items-center space-x-2 bg-stone-light hover:bg-stone-muted text-forest-dark border border-stone-muted px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Modularized Admin Dashboard Stats */}
      <AdminDashboardStats stats={stats} />

      {/* Accommodation Catalog Admin Manager */}
      <AccommodationAdminList
        accommodations={accommodations}
        onRefresh={fetchAdminData}
      />

      {/* Full 20-unit Occupancy Matrix */}
      <AvailabilityMatrix />

      {/* Pending Holds Table & Manual Block Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <div className="lg:col-span-2">
          <PendingHoldsTable
            pendingHolds={pendingHolds}
            onConfirmBooking={handleConfirmBooking}
          />
        </div>

        <div>
          <ManualBlockForm
            accommodations={accommodations}
            onBlockCreated={fetchAdminData}
          />
        </div>
      </div>
    </div>
  );
};
