import React, { useEffect, useState } from 'react';
import type { MonthlyAvailability, Accommodation } from '../../types';
import { accommodationsService } from '../../services/accommodationsService';
import { Calendar as CalendarIcon, X, Check, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DateRangePickerModalProps {
  accommodation: Accommodation;
  onClose: () => void;
  onSelectDates: (checkIn: string, checkOut: string) => void;
}

export const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({
  accommodation,
  onClose,
  onSelectDates,
}) => {
  const [availability, setAvailability] = useState<MonthlyAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCheckIn, setSelectedCheckIn] = useState<string | null>(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState<string | null>(null);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  useEffect(() => {
    const fetchMonthly = async () => {
      setLoading(true);
      try {
        const data = await accommodationsService.getMonthlyAvailability(accommodation.id, currentMonth, currentYear);
        setAvailability(data);
      } catch (err) {
        console.warn('Fallback monthly availability:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMonthly();
  }, [accommodation.id, currentMonth, currentYear]);

  const handleDateClick = (dateStr: string, status: string) => {
    if (status !== 'Available') return;

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      setSelectedCheckIn(dateStr);
      setSelectedCheckOut(null);
    } else if (selectedCheckIn && !selectedCheckOut) {
      if (dateStr > selectedCheckIn) {
        setSelectedCheckOut(dateStr);
      } else {
        setSelectedCheckIn(dateStr);
        setSelectedCheckOut(null);
      }
    }
  };

  const handleConfirmSelection = () => {
    if (selectedCheckIn && selectedCheckOut) {
      onSelectDates(selectedCheckIn, selectedCheckOut);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-forest-dark/70 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-muted relative space-y-4"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-muted pb-3">
            <div className="flex items-center space-x-2 text-forest-dark">
              <CalendarIcon className="w-5 h-5 text-terracotta" />
              <h3 className="font-serif text-xl font-bold">Calendario de Disponibilidad</h3>
            </div>
            <button onClick={onClose} className="p-1 text-stone-charcoal/60 hover:text-stone-charcoal transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-stone-charcoal/70">
            Selecciona tus fechas de entrada (Check-in) y salida (Check-out) para <strong className="text-forest-dark">{accommodation.name}</strong>.
          </p>

          {/* Legend with Vector Icons */}
          <div className="flex items-center justify-around text-[11px] bg-stone-light p-2.5 rounded-xl border border-stone-muted font-semibold">
            <div className="flex items-center space-x-1.5 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Libre</span>
            </div>
            <div className="flex items-center space-x-1.5 text-rose-800">
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Ocupado</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Bloqueado</span>
            </div>
          </div>

          {/* Month Calendar Grid */}
          {loading ? (
            <div className="py-12 text-center text-xs text-stone-charcoal/60">Cargando fechas disponibles...</div>
          ) : (
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold text-center text-forest-dark tracking-wider">
                {new Date(currentYear, currentMonth - 1).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
              </h4>
              
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-stone-charcoal/60 mb-1">
                <span>Dom</span><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {availability?.days.map((day) => {
                  const isSelectedIn = selectedCheckIn === day.date;
                  const isSelectedOut = selectedCheckOut === day.date;
                  const isInRange = selectedCheckIn && selectedCheckOut && day.date >= selectedCheckIn && day.date <= selectedCheckOut;

                  let btnStyle = "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200 cursor-pointer";
                  if (day.status === 'Occupied' || day.status === 'Hold') {
                    btnStyle = "bg-rose-100 text-rose-500 border-rose-200 cursor-not-allowed opacity-60";
                  } else if (day.status === 'Blocked') {
                    btnStyle = "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50";
                  }

                  if (isSelectedIn || isSelectedOut) {
                    btnStyle = "bg-warmGold text-forest-dark font-bold border-warmGold shadow-md";
                  } else if (isInRange) {
                    btnStyle = "bg-warmGold/30 text-forest-dark border-warmGold/40";
                  }

                  return (
                    <button
                      key={day.date}
                      disabled={day.status !== 'Available'}
                      onClick={() => handleDateClick(day.date, day.status)}
                      className={`h-10 rounded-lg border flex flex-col items-center justify-center text-xs transition-all ${btnStyle}`}
                    >
                      <span className="font-bold">{new Date(day.date + 'T00:00:00').getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected Summary & Action */}
          <div className="pt-3 border-t border-stone-muted flex items-center justify-between">
            <div className="text-xs">
              {selectedCheckIn && (
                <div>
                  <span className="text-stone-charcoal/60">Entrada:</span> <strong className="text-forest-dark">{selectedCheckIn}</strong>
                </div>
              )}
              {selectedCheckOut && (
                <div>
                  <span className="text-stone-charcoal/60">Salida:</span> <strong className="text-forest-dark">{selectedCheckOut}</strong>
                </div>
              )}
            </div>

            <button
              onClick={handleConfirmSelection}
              disabled={!selectedCheckIn || !selectedCheckOut}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${selectedCheckIn && selectedCheckOut ? 'bg-forest text-stone-light shadow hover:bg-forest-dark' : 'bg-stone-muted text-stone-charcoal/50 cursor-not-allowed'}`}
            >
              <Check className="w-4 h-4" />
              <span>Aplicar Fechas</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
