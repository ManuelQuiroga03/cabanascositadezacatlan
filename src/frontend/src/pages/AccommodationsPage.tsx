import React, { useEffect, useState, useMemo } from 'react';
import { AccommodationCard } from '../components/booking/AccommodationCard';
import { accommodationsService } from '../services/accommodationsService';
import type { Accommodation, AccommodationType } from '../types';
import { RefreshCw, Search, SlidersHorizontal, Users, Home, Hotel, LayoutGrid, RotateCcw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccommodationsPageProps {
  onGoHome?: () => void;
}

export const AccommodationsPage: React.FC<AccommodationsPageProps> = ({ onGoHome }) => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<AccommodationType | 'All'>('All');
  const [capacityFilter, setCapacityFilter] = useState<'All' | '1-2' | '3-5' | '6+'>('All');
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  const fetchAccommodations = async () => {
    setLoading(true);
    try {
      const data = await accommodationsService.getAll();
      setAccommodations(data);
    } catch (err: any) {
      console.warn('Backend API connection standard fallback activated:', err);
      setAccommodations([
        {
          id: '11111111-1111-1111-1111-111111111111',
          name: 'Cabaña Vista a la Niebla',
          slug: 'cabana-vista-niebla',
          description: 'Hermosa cabaña rústica rodeada de pinos y niebla. Chimenea a leña, terraza privada y jacuzzi.',
          type: 'Cabin',
          capacity: 4,
          basePrice: 1850.00,
          amenities: ['Chimenea', 'Jacuzzi', 'Wi-Fi', 'Terraza Vista al Valle', 'Asador'],
          imageUrls: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1000&q=80'],
          isActive: true
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          name: 'Cabaña El Bosque Encantado',
          slug: 'cabana-bosque-encantado',
          description: 'Espaciosa cabaña familiar de dos pisos construida en madera de pino y piedra volcánica.',
          type: 'Cabin',
          capacity: 8,
          basePrice: 3200.00,
          amenities: ['Chimenea Principal', 'Fogatero Exterior', 'Cocina Equipada', 'Estacionamiento Privado'],
          imageUrls: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80'],
          isActive: true
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          name: 'Suite Manzanas de Oro (Hotel Boutique)',
          slug: 'suite-manzanas-oro',
          description: 'Suite romántica de lujo con acabados artesanales de Zacatlán, cama King Size y vista panorámica.',
          type: 'HotelRoom',
          capacity: 2,
          basePrice: 1450.00,
          amenities: ['Cama King Size', 'Calefacción Rústica', 'Cata de Sidra de Bienvenida', 'Room Service'],
          imageUrls: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
          isActive: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccommodations();
  }, []);

  // Filtered Accommodations calculation
  const filteredAccommodations = useMemo(() => {
    return accommodations.filter((acc) => {
      // 1. Text Search
      const matchesSearch = searchQuery.trim() === '' ||
        acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.amenities.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. Type Filter
      const matchesType = selectedType === 'All' || acc.type === selectedType;

      // 3. Capacity Filter
      let matchesCapacity = true;
      if (capacityFilter === '1-2') matchesCapacity = acc.capacity <= 2;
      else if (capacityFilter === '3-5') matchesCapacity = acc.capacity >= 3 && acc.capacity <= 5;
      else if (capacityFilter === '6+') matchesCapacity = acc.capacity >= 6;

      // 4. Max Price Filter
      const matchesPrice = acc.basePrice <= maxPrice;

      return matchesSearch && matchesType && matchesCapacity && matchesPrice;
    });
  }, [accommodations, searchQuery, selectedType, capacityFilter, maxPrice]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setCapacityFilter('All');
    setMaxPrice(5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Breadcrumb & Header */}
      <div className="border-b border-stone-muted pb-6">
        <div className="flex items-center space-x-2 text-xs font-semibold text-stone-charcoal/60 uppercase tracking-wider mb-2">
          {onGoHome && (
            <button onClick={onGoHome} className="hover:text-forest transition-colors">
              Inicio
            </button>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-stone-charcoal/40" />
          <span className="text-terracotta">Catálogo de Cabañas & Suites</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-dark">
              Catálogo de Cabañas & Suites
            </h1>
            <p className="mt-2 text-stone-charcoal/70 text-sm max-w-2xl">
              Explora nuestros 20 hospedajes rústicos y suites boutique en Zacatlán de las Manzanas. Reserva directa sin intermediarios.
            </p>
          </div>

          <div className="bg-forest/10 border border-forest/20 text-forest-dark px-4 py-2 rounded-xl text-xs font-semibold self-start md:self-auto">
            {accommodations.length} Hospedajes Disponibles
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-stone-muted space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-stone-muted">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-charcoal/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o amenidad (ej. Jacuzzi, Chimenea)..."
              className="w-full pl-9 pr-4 py-2 bg-stone-light border border-stone-muted rounded-xl text-xs focus:ring-2 focus:ring-warmGold focus:outline-none transition-shadow"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedType('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                selectedType === 'All'
                  ? 'bg-forest-dark text-warmGold shadow'
                  : 'bg-stone-light text-stone-charcoal/70 hover:bg-stone-muted'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Todos ({accommodations.length})</span>
            </button>

            <button
              onClick={() => setSelectedType('Cabin')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                selectedType === 'Cabin'
                  ? 'bg-forest-dark text-warmGold shadow'
                  : 'bg-stone-light text-stone-charcoal/70 hover:bg-stone-muted'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-warmGold" />
              <span>Cabañas</span>
            </button>

            <button
              onClick={() => setSelectedType('HotelRoom')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                selectedType === 'HotelRoom'
                  ? 'bg-forest-dark text-warmGold shadow'
                  : 'bg-stone-light text-stone-charcoal/70 hover:bg-stone-muted'
              }`}
            >
              <Hotel className="w-3.5 h-3.5 text-warmGold" />
              <span>Suites Hotel Boutique</span>
            </button>
          </div>
        </div>

        {/* Secondary Filters: Capacity & Price Range */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          {/* Capacity Selector */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Users className="w-4 h-4 text-terracotta shrink-0" />
            <span className="font-bold text-stone-charcoal/70">Capacidad:</span>
            <div className="flex items-center space-x-1">
              {(['All', '1-2', '3-5', '6+'] as const).map((cap) => (
                <button
                  key={cap}
                  onClick={() => setCapacityFilter(cap)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    capacityFilter === cap
                      ? 'bg-warmGold text-forest-dark font-bold'
                      : 'bg-stone-light text-stone-charcoal/60 hover:bg-stone-muted'
                  }`}
                >
                  {cap === 'All' ? 'Todas' : cap}
                </button>
              ))}
            </div>
          </div>

          {/* Price Slider */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="font-bold text-stone-charcoal/70">Precio Máx:</span>
            <input
              type="range"
              min={1000}
              max={5000}
              step={250}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-forest cursor-pointer"
            />
            <span className="font-serif font-bold text-forest-dark text-sm w-20 text-right">
              ${maxPrice.toLocaleString('es-MX')}
            </span>
          </div>

          {/* Reset Button */}
          {(searchQuery || selectedType !== 'All' || capacityFilter !== 'All' || maxPrice < 5000) && (
            <button
              onClick={handleResetFilters}
              className="text-stone-charcoal/60 hover:text-terracotta text-xs font-semibold flex items-center space-x-1 ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Accommodation Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <RefreshCw className="w-8 h-8 text-forest animate-spin" />
          <p className="text-sm font-medium text-stone-charcoal/70">Cargando catálogo completo de hospedajes...</p>
        </div>
      ) : filteredAccommodations.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-stone-light border border-stone-muted rounded-2xl p-12 text-center space-y-3"
        >
          <SlidersHorizontal className="w-10 h-10 text-stone-charcoal/40 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-forest-dark">No se encontraron hospedajes</h3>
          <p className="text-xs text-stone-charcoal/70 max-w-md mx-auto">
            Intenta cambiar los términos de búsqueda o ajustar los filtros de capacidad y precio.
          </p>
          <button
            onClick={handleResetFilters}
            className="bg-forest text-stone-light text-xs font-bold px-4 py-2 rounded-xl hover:bg-forest-dark transition-all"
          >
            Restablecer Filtros
          </button>
        </motion.div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredAccommodations.map((acc, index) => (
              <motion.div
                key={acc.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <AccommodationCard accommodation={acc} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
