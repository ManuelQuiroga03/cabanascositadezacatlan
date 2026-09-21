import React from 'react';
import { Home, Hotel } from 'lucide-react';
import type { MatrixItem } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';

interface MatrixTableProps {
  items: MatrixItem[];
}

export const MatrixTable: React.FC<MatrixTableProps> = ({ items }) => {
  const datesHeader = items.length > 0 ? items[0].dailyStatuses.map((ds) => ds.date) : [];

  return (
    <div className="overflow-x-auto border border-stone-muted rounded-xl shadow-inner">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-forest-dark text-stone-light divide-x divide-forest">
            <th className="p-3 font-serif text-sm font-bold min-w-[220px] sticky left-0 bg-forest-dark z-10">
              Hospedaje
            </th>
            {datesHeader.map((d, i) => {
              const dateObj = new Date(d + 'T00:00:00');
              const dayName = dateObj.toLocaleDateString('es-MX', { weekday: 'short' });
              const dayNum = dateObj.getDate();
              const monthName = dateObj.toLocaleDateString('es-MX', { month: 'short' });
              return (
                <th key={i} className="p-2 text-center min-w-[50px]">
                  <div className="capitalize text-[10px] opacity-80">{dayName}</div>
                  <div className="font-bold text-sm text-warmGold">{dayNum}</div>
                  <div className="capitalize text-[9px] opacity-70">{monthName}</div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-muted bg-white">
          {items.map((item) => (
            <tr key={item.accommodationId} className="hover:bg-stone-light/60 transition-colors divide-x divide-stone-muted/50">
              <td className="p-3 sticky left-0 bg-white font-medium text-stone-charcoal shadow-sm z-10">
                <div className="font-bold text-sm text-forest-dark">{item.accommodationName}</div>
                <div className="text-[11px] text-stone-charcoal/60 flex items-center space-x-2 mt-0.5">
                  <span className="inline-flex items-center space-x-1">
                    {item.type === 'Cabin' ? (
                      <>
                        <Home className="w-3.5 h-3.5 text-forest" />
                        <span>Cabaña</span>
                      </>
                    ) : (
                      <>
                        <Hotel className="w-3.5 h-3.5 text-warmGold" />
                        <span>Suite</span>
                      </>
                    )}
                  </span>
                  <span>•</span>
                  <span>Cap: {item.capacity}p</span>
                  <span>•</span>
                  <span className="font-semibold text-terracotta">${item.basePrice.toLocaleString('es-MX')}</span>
                </div>
              </td>

              {item.dailyStatuses.map((ds, i) => (
                <td key={i} className="p-2 text-center align-middle">
                  <div className="flex justify-center">
                    <StatusBadge status={ds.status} />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
