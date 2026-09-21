import React, { useState } from 'react';
import { Trees, PhoneCall, Menu, X, CalendarCheck, LayoutDashboard, Grid, Star } from 'lucide-react';

interface NavbarProps {
  currentTab: 'landing' | 'matrix' | 'reviews' | 'admin';
  onSelectTab: (tab: 'landing' | 'matrix' | 'reviews' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const whatsappPhone = "527971000000";
  const defaultMsg = encodeURIComponent("¡Hola! Quisiera información sobre disponibilidad en Una Cosita de Zacatlán.");
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${defaultMsg}`;

  const navItems = [
    { id: 'landing' as const, label: 'Inicio', icon: Trees },
    { id: 'matrix' as const, label: 'Matriz de Ocupación', icon: Grid },
    { id: 'reviews' as const, label: 'Reseñas', icon: Star },
    { id: 'admin' as const, label: 'Panel Admin', icon: LayoutDashboard },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-forest-dark/95 backdrop-blur-md text-stone-light shadow-md border-b border-forest/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <button onClick={() => onSelectTab('landing')} className="flex items-center space-x-3 group text-left">
            <div className="w-10 h-10 rounded-full bg-forest-light flex items-center justify-center text-warmGold transition-transform group-hover:scale-105">
              <Trees className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-stone-light block leading-none">
                Una Cosita
              </span>
              <span className="text-xs uppercase tracking-widest text-terracotta-light font-medium">
                de Zacatlán • Puebla
              </span>
            </div>
          </button>

          <div className="hidden lg:flex items-center space-x-2 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all ${isActive ? 'bg-forest text-warmGold font-semibold shadow-sm' : 'text-stone-light/80 hover:text-stone-light hover:bg-forest/50'}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-warmGold' : 'text-stone-light/70'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center space-x-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-terracotta hover:bg-terracotta-light text-stone-light px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp Directo</span>
            </a>

            <button
              onClick={() => onSelectTab('landing')}
              className="inline-flex items-center space-x-2 bg-warmGold hover:bg-warmGold-hover text-forest-dark px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Reservar</span>
            </button>
          </div>

          <div className="lg:hidden flex items-center">
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

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-forest-dark border-b border-forest/40 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all ${isActive ? 'bg-forest text-warmGold font-semibold' : 'text-stone-light hover:bg-forest'}`}
              >
                <Icon className="w-4 h-4 text-warmGold" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-terracotta hover:bg-terracotta-light text-stone-light px-4 py-2.5 rounded-lg text-xs font-semibold block transition-all"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
