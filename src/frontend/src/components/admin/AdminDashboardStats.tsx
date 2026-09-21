import React from 'react';
import type { DashboardStats } from '../../types';
import { Clock, Home, CheckCircle2, DollarSign } from 'lucide-react';

interface AdminDashboardStatsProps {
  stats: DashboardStats | null;
}

export const AdminDashboardStats: React.FC<AdminDashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <div className="bg-white rounded-2xl p-6 shadow-md border border-stone-muted/70 flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs uppercase font-bold text-stone-charcoal/60">Holds Pendientes</p>
          <p className="font-serif text-3xl font-bold text-forest-dark">{stats?.pendingHoldsCount ?? 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-stone-muted/70 flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <Home className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs uppercase font-bold text-stone-charcoal/60">Ocupadas Hoy</p>
          <p className="font-serif text-3xl font-bold text-forest-dark">
            {stats?.occupiedTodayCount ?? 0} <span className="text-xs text-stone-charcoal/50 font-normal">/ {stats?.totalAccommodations ?? 20}</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-stone-muted/70 flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs uppercase font-bold text-stone-charcoal/60">Reservas Confirmadas</p>
          <p className="font-serif text-3xl font-bold text-forest-dark">{stats?.confirmedBookingsCount ?? 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-stone-muted/70 flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs uppercase font-bold text-stone-charcoal/60">Ingreso Estimado</p>
          <p className="font-serif text-2xl font-bold text-forest-dark">
            ${stats?.totalRevenue.toLocaleString('es-MX') ?? '0'} <span className="text-xs font-normal text-stone-charcoal/60">MXN</span>
          </p>
        </div>
      </div>
    </div>
  );
};
