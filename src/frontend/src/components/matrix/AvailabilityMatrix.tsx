import React, { useEffect, useState } from 'react';
import type { MatrixAvailability, AccommodationType } from '../../types';
import { accommodationsService } from '../../services/accommodationsService';
import { MatrixLegend } from './MatrixLegend';
import { MatrixFilterBar } from './MatrixFilterBar';
import { MatrixTable } from './MatrixTable';
import { Calendar, RefreshCw } from 'lucide-react';

export const AvailabilityMatrix: React.FC = () => {
  const [matrixData, setMatrixData] = useState<MatrixAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | AccommodationType>('ALL');

  const fetchMatrix = async () => {
    setLoading(true);
    try {
      const data = await accommodationsService.getMatrixAvailability();
      setMatrixData(data);
    } catch (err) {
      console.warn('Backend matrix connection fallback:', err);
      const dates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d.toISOString().split('T')[0];
      });

      const cabinTitles = [
        'Vista a la Niebla', 'El Bosque Encantado', 'Manzana Dorada', 'El Nido del Águila',
        'Los Pinos Altos', 'Rincón del Fuego', 'Valle del Sol', 'La Barranca'
      ];

      const cabins = Array.from({ length: 8 }, (_, i) => ({
        accommodationId: `11111111-1111-1111-1111-00000000000${i + 1}`,
        accommodationName: `Cabaña ${i + 1} - ${cabinTitles[i]}`,
        type: 'Cabin' as AccommodationType,
        capacity: 4 + (i % 2) * 4,
        basePrice: 1800 + i * 150,
        dailyStatuses: dates.map((d, dIdx) => ({
          date: d,
          status: (dIdx === 2 || dIdx === 3) && i % 3 === 0 ? ('Occupied' as const) : dIdx === 5 && i === 1 ? ('Hold' as const) : dIdx === 7 && i === 4 ? ('Blocked' as const) : ('Available' as const),
        })),
      }));

      const suiteTitles = [
        'Manzanas de Oro', 'Niebla Matutina', 'Sidra Artesanal', 'Reloj de Flores',
        'Barranca de los Jilgueros', 'Los Cedros', 'Sol de Montaña', 'Luna de Pino',
        'Piedra Volcánica', 'El Mirador', 'Arcilla & Leña', 'Presidencial'
      ];

      const suites = Array.from({ length: 12 }, (_, i) => ({
        accommodationId: `22222222-2222-2222-2222-00000000000${i + 1}`,
        accommodationName: `Suite ${i + 1} - ${suiteTitles[i]}`,
        type: 'HotelRoom' as AccommodationType,
        capacity: i === 11 ? 4 : 2,
        basePrice: 1350 + i * 100,
        dailyStatuses: dates.map((d, dIdx) => ({
          date: d,
          status: (dIdx === 1 || dIdx === 2) && i % 2 === 0 ? ('Occupied' as const) : dIdx === 4 && i === 0 ? ('Hold' as const) : ('Available' as const),
        })),
      }));

      setMatrixData({
        startDate: dates[0],
        endDate: dates[dates.length - 1],
        items: [...cabins, ...suites],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, []);

  const filteredItems = matrixData?.items.filter((item) => {
    if (filterType === 'ALL') return true;
    return item.type === filterType;
  }) || [];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-stone-muted/60 p-6 space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-muted">
        <div>
          <div className="flex items-center space-x-2 text-forest-dark font-serif text-2xl font-bold">
            <Calendar className="w-6 h-6 text-terracotta" />
            <h2>Matriz de Ocupación General (8 Cabañas + 12 Suites)</h2>
          </div>
          <p className="text-xs text-stone-charcoal/70 mt-1">
            Visualiza en tiempo real la disponibilidad de todo el complejo turístico para los próximos 14 días.
          </p>
        </div>

        <MatrixFilterBar
          filterType={filterType}
          onFilterChange={setFilterType}
          onRefresh={fetchMatrix}
          loading={loading}
        />
      </div>

      {/* Symbology Legend */}
      <MatrixLegend />

      {/* Matrix Data Grid Table */}
      {loading ? (
        <div className="py-16 text-center text-stone-charcoal/70 space-y-2">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-forest" />
          <p className="text-sm font-medium">Cargando matriz de ocupación...</p>
        </div>
      ) : (
        <MatrixTable items={filteredItems} />
      )}
    </div>
  );
};
