import React from 'react';
import type { AccommodationType } from '../../types';
import { Filter, RefreshCw } from 'lucide-react';

interface MatrixFilterBarProps {
  filterType: 'ALL' | AccommodationType;
  onFilterChange: (type: 'ALL' | AccommodationType) => void;
  onRefresh: () => void;
  loading: boolean;
}

export const MatrixFilterBar: React.FC<MatrixFilterBarProps> = ({
  filterType,
  onFilterChange,
  onRefresh,
  loading,
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-1 bg-stone-light p-1 rounded-lg border border-stone-muted text-xs">
        <Filter className="w-3.5 h-3.5 text-stone-charcoal ml-1" />
        <button
          onClick={() => onFilterChange('ALL')}
          className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
            filterType === 'ALL' ? 'bg-forest text-stone-light shadow-sm' : 'text-stone-charcoal hover:bg-stone-muted'
          }`}
        >
          Todos (20)
        </button>
        <button
          onClick={() => onFilterChange('Cabin')}
          className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
            filterType === 'Cabin' ? 'bg-forest text-stone-light shadow-sm' : 'text-stone-charcoal hover:bg-stone-muted'
          }`}
        >
          Cabañas (8)
        </button>
        <button
          onClick={() => onFilterChange('HotelRoom')}
          className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
            filterType === 'HotelRoom' ? 'bg-forest text-stone-light shadow-sm' : 'text-stone-charcoal hover:bg-stone-muted'
          }`}
        >
          Suites (12)
        </button>
      </div>

      <button
        onClick={onRefresh}
        disabled={loading}
        className="p-2 text-stone-charcoal/70 hover:text-forest hover:bg-stone-light rounded-lg border border-stone-muted transition-all"
        title="Actualizar matriz"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-forest' : ''}`} />
      </button>
    </div>
  );
};
