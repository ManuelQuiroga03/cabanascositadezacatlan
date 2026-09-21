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
import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  Home,
  Ban,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type AdminTab = 'dashboard' | 'matrix' | 'holds' | 'accommodations' | 'blocks';

export const AdminCalendarPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingHolds, setPendingHolds] = useState<BookingDetail[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Admin View State
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Nav item definitions
  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Tablero General',
      icon: LayoutDashboard,
      badge: null,
      description: 'Métricas de ventas y e-resumen'
    },
    {
      id: 'matrix' as AdminTab,
      label: 'Matriz de Ocupación',
      icon: CalendarDays,
      badge: `${accommodations.length || 20} Hosp.`,
      description: 'Calendario 20 unidades'
    },
    {
      id: 'holds' as AdminTab,
      label: 'Apartados Pendientes',
      icon: Clock,
      badge: pendingHolds.length > 0 ? `${pendingHolds.length}` : null,
      badgeColor: 'bg-amber-500 text-white',
      description: 'Holds temporales (15 min)'
    },
    {
      id: 'accommodations' as AdminTab,
      label: 'Catálogo & Fotos',
      icon: Home,
      badge: null,
      description: 'Precios, detalles e imágenes'
    },
    {
      id: 'blocks' as AdminTab,
      label: 'Bloqueos de Fecha',
      icon: Ban,
      badge: null,
      description: 'Fechas inhabilitadas'
    },
  ];

  return (
    <div className="min-h-screen bg-stone-light/40 flex flex-col md:flex-row">

      {/* Mobile Top Header */}
      <div className="md:hidden bg-forest-dark text-stone-light p-4 flex items-center justify-between border-b border-forest/40">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-warmGold text-forest-dark flex items-center justify-center font-bold font-serif text-sm">
            CZ
          </div>
          <span className="font-serif font-bold text-base text-warmGold">Panel Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-stone-light hover:bg-forest rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-forest-dark text-stone-light flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-forest/30 shadow-2xl
        md:static md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Logo & Header */}
          <div className="pb-4 border-b border-forest/40">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-warmGold text-forest-dark flex items-center justify-center font-bold font-serif text-lg shadow-md">
                CZ
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-stone-light leading-tight">
                  Una Cosita
                </h2>
                <p className="text-[11px] uppercase tracking-wider text-warmGold font-semibold">
                  Zacatlán • Recepción
                </p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-1.5 bg-forest/60 px-3 py-1.5 rounded-lg border border-forest/40 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sesión Activa Administrador</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-muted/60 px-3 mb-2">
              Módulos del Sistema
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between group
                    ${isActive
                      ? 'bg-warmGold text-forest-dark font-bold shadow-lg'
                      : 'hover:bg-forest/60 text-stone-muted hover:text-stone-light'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-forest-dark' : 'text-warmGold'}`} />
                    <div className="truncate">
                      <p className="text-xs font-semibold leading-tight">{item.label}</p>
                      <p className={`text-[10px] ${isActive ? 'text-forest-dark/80 font-normal' : 'text-stone-muted/70 font-light'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${item.badgeColor || (isActive ? 'bg-forest-dark text-warmGold' : 'bg-forest text-warmGold')}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-6 border-t border-forest/40 bg-forest-dark/80 space-y-2">
          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-forest/60 hover:bg-forest text-stone-light py-2.5 px-4 rounded-xl text-xs font-semibold transition-all border border-forest/50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar Datos</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border border-red-800/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Overlay backdrop for mobile sidebar */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-8 space-y-8">
        
        {/* Active Tab Top Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-muted/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-stone-charcoal/60 text-xs font-bold uppercase tracking-wider mb-1">
              <span>Panel Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-charcoal/40" />
              <span className="text-forest-dark">{navItems.find(n => n.id === activeTab)?.label}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-dark">
              {navItems.find(n => n.id === activeTab)?.label}
            </h1>
          </div>

          {/* Quick Info Badge */}
          <div className="flex items-center space-x-3 text-xs bg-stone-light px-3.5 py-2 rounded-xl border border-stone-muted text-stone-charcoal/80">
            <Sparkles className="w-4 h-4 text-warmGold shrink-0" />
            <span>Datos sincronizados con Supabase Cloud</span>
          </div>
        </div>

        {/* Dynamic Tab Content Views */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {/* VIEW 1: Dashboard General */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <AdminDashboardStats stats={stats} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

                <div className="pt-4">
                  <AccommodationAdminList
                    accommodations={accommodations}
                    onRefresh={fetchAdminData}
                  />
                </div>
              </div>
            )}

            {/* VIEW 2: Matriz de Ocupación */}
            {activeTab === 'matrix' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-muted/70">
                <AvailabilityMatrix />
              </div>
            )}

            {/* VIEW 3: Apartados Pendientes */}
            {activeTab === 'holds' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-muted/70">
                <PendingHoldsTable
                  pendingHolds={pendingHolds}
                  onConfirmBooking={handleConfirmBooking}
                />
              </div>
            )}

            {/* VIEW 4: Catálogo de Hospedajes */}
            {activeTab === 'accommodations' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-muted/70">
                <AccommodationAdminList
                  accommodations={accommodations}
                  onRefresh={fetchAdminData}
                />
              </div>
            )}

            {/* VIEW 5: Bloqueos de Fechas */}
            {activeTab === 'blocks' && (
              <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-sm border border-stone-muted/70">
                <ManualBlockForm
                  accommodations={accommodations}
                  onBlockCreated={fetchAdminData}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
