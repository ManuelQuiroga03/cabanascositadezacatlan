import React, { useState } from 'react';
import { Trees, PhoneCall, Menu, X, Grid, Star, Home, ShieldCheck } from 'lucide-react';

export type NavTab = 'landing' | 'accommodations' | 'matrix' | 'reviews' | 'admin';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const whatsappPhone = "527971234567";
  const defaultMsg = encodeURIComponent("¡Hola! Quisiera información sobre disponibilidad en Una Cosita de Zacatlán.");
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${defaultMsg}`;

  // Public navigation links centered
  const publicNavItems = [
    { id: 'landing' as const, label: 'Inicio', icon: Trees },
    { id: 'accommodations' as const, label: 'Cabañas & Suites', icon: Home },
    { id: 'matrix' as const, label: 'Matriz de Ocupación', icon: Grid },
    { id: 'reviews' as const, label: 'Reseñas', icon: Star },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-forest-dark/95 backdrop-blur-md text-stone-light shadow-md border-b border-forest/30">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* FULL LEFT: Brand Logo & Title */}
          <button 
            onClick={() => onSelectTab('landing')} 
            className="flex items-center space-x-3 group text-left shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-forest-light flex items-center justify-center text-warmGold transition-transform group-hover:scale-105 shadow-sm">
              <Trees className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-stone-light block leading-none">
                Una Cosita
              </span>
              <span className="text-[11px] uppercase tracking-widest text-warmGold font-medium">
                de Zacatlán • Puebla
              </span>
            </div>
          </button>

          {/* CENTER: Public Navigation Links */}
          <div className="hidden lg:flex items-center space-x-3 text-sm font-medium mx-auto">
            {publicNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-forest text-warmGold font-semibold shadow-sm border border-forest/60' 
                      : 'text-stone-light/80 hover:text-stone-light hover:bg-forest/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-warmGold' : 'text-stone-light/70'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* FULL RIGHT: WhatsApp Direct & Discrete Admin Access Icon */}
          <div className="hidden sm:flex items-center space-x-3 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-terracotta hover:bg-terracotta-light text-stone-light px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp Directo</span>
            </a>

            {/* Discrete Admin Login Icon Button */}
            <button
              onClick={() => onSelectTab('admin')}
              title="Acceso al Panel de Administración & Recepción"
              className={`p-2.5 rounded-xl transition-all border ${
                currentTab === 'admin'
                  ? 'bg-warmGold text-forest-dark border-warmGold shadow-md'
                  : 'bg-forest/60 hover:bg-forest text-warmGold/80 hover:text-warmGold border-forest/60'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => onSelectTab('admin')}
              title="Panel Admin"
              className="p-2 text-warmGold hover:bg-forest rounded-lg sm:hidden"
            >
              <ShieldCheck className="w-6 h-6" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-stone-light hover:text-warmGold p-2 focus:outline-none"
              aria-label="Alternar menú"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-forest-dark border-b border-forest/40 px-4 pt-2 pb-6 space-y-2">
          {publicNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all ${
                  isActive ? 'bg-forest text-warmGold font-semibold' : 'text-stone-light hover:bg-forest'
                }`}
              >
                <Icon className="w-4 h-4 text-warmGold" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-terracotta hover:bg-terracotta-light text-stone-light px-4 py-2.5 rounded-lg text-xs font-semibold block transition-all"
            >
              Contactar por WhatsApp
            </a>

            <button
              onClick={() => {
                onSelectTab('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 bg-forest hover:bg-forest-light text-warmGold px-4 py-2.5 rounded-lg text-xs font-semibold transition-all border border-forest/60"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Panel de Administración</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
