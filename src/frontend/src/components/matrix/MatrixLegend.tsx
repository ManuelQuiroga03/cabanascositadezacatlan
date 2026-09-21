import React from 'react';

export const MatrixLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs bg-stone-light p-3 rounded-xl border border-stone-muted">
      <span className="font-bold text-stone-charcoal">Simbología:</span>
      <div className="flex items-center space-x-1.5">
        <span className="w-3 h-3 rounded-full bg-emerald-500" />
        <span>Disponible</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <span className="w-3 h-3 rounded-full bg-amber-500" />
        <span>Apartado Temporal (Hold 15m)</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <span className="w-3 h-3 rounded-full bg-rose-500" />
        <span>Ocupado (Confirmado)</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <span className="w-3 h-3 rounded-full bg-slate-400" />
        <span>Bloqueado (Mantenimiento)</span>
      </div>
    </div>
  );
};
