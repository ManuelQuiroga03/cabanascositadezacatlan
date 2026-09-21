import React from 'react';
import type { BookingDetail } from '../../types';
import { MessageSquare, User, Phone, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';

interface PendingHoldsTableProps {
  pendingHolds: BookingDetail[];
  onConfirmBooking: (bookingId: string) => void;
}

export const PendingHoldsTable: React.FC<PendingHoldsTableProps> = ({
  pendingHolds,
  onConfirmBooking,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-stone-muted/70 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-terracotta" />
          <h2 className="font-serif text-xl font-bold text-forest-dark">
            Apartados Pendientes por Confirmar ({pendingHolds.length})
          </h2>
        </div>
        <span className="text-xs text-stone-charcoal/60">Validez del Hold: 15 mins</span>
      </div>

      {pendingHolds.length === 0 ? (
        <p className="text-sm text-stone-charcoal/60 py-4 text-center italic">
          No hay apartados pendientes de confirmación en este momento.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-light text-stone-charcoal/80 border-b border-stone-muted">
                <th className="p-3">Hospedaje</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Fechas</th>
                <th className="p-3">Monto Total</th>
                <th className="p-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-muted">
              {pendingHolds.map((hold) => (
                <tr key={hold.id} className="hover:bg-stone-light/40 transition-colors">
                  <td className="p-3 font-semibold text-forest-dark">
                    {hold.accommodationName}
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-stone-charcoal flex items-center">
                      <User className="w-3.5 h-3.5 text-stone-charcoal/60 mr-1" />
                      {hold.customerName}
                    </div>
                    <div className="text-stone-charcoal/60 flex items-center text-[11px] mt-0.5">
                      <Phone className="w-3 h-3 text-stone-charcoal/50 mr-1" />
                      {hold.customerPhone}
                    </div>
                  </td>
                  <td className="p-3 text-stone-charcoal font-medium">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-forest mr-1" />
                      <span>{hold.checkInDate}</span>
                      <ArrowRight className="w-3 h-3 text-stone-charcoal/50" />
                      <span>{hold.checkOutDate}</span>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-terracotta">
                    ${hold.totalAmount.toLocaleString('es-MX')} MXN
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onConfirmBooking(hold.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow"
                    >
                      Confirmar Pago
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
