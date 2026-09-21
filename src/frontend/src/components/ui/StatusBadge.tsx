import React from 'react';
import { CheckCircle, XCircle, AlertCircle, ShieldAlert } from 'lucide-react';
import type { DayStatus } from '../../types';

interface StatusBadgeProps {
  status: DayStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const boxSize = size === 'sm' ? 'w-6 h-6' : 'w-7 h-7';

  switch (status) {
    case 'Available':
      return (
        <span className={`${boxSize} rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center text-xs font-semibold`} title="Disponible">
          <CheckCircle className={`${iconSize} text-emerald-600`} />
        </span>
      );
    case 'Occupied':
      return (
        <span className={`${boxSize} rounded-md bg-rose-100 border border-rose-300 text-rose-800 flex items-center justify-center text-xs font-semibold`} title="Ocupado (Confirmado)">
          <XCircle className={`${iconSize} text-rose-600`} />
        </span>
      );
    case 'Hold':
      return (
        <span className={`${boxSize} rounded-md bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center text-xs font-semibold`} title="Apartado Temporal (Hold 15m)">
          <AlertCircle className={`${iconSize} text-amber-600 animate-pulse`} />
        </span>
      );
    case 'Blocked':
      return (
        <span className={`${boxSize} rounded-md bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center text-xs font-semibold`} title="Bloqueado por Mantenimiento">
          <ShieldAlert className={`${iconSize} text-slate-500`} />
        </span>
      );
    default:
      return null;
  }
};
