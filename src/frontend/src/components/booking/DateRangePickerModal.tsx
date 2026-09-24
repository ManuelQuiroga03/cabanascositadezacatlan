import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Accommodation } from '../../types';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DateRangePickerModalProps {
  accommodation: Accommodation;
  initialCheckIn?: string;
  initialCheckOut?: string;
  onClose: () => void;
  onSelectDates: (checkIn: string, checkOut: string) => void;
}

export const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({
  accommodation,
  initialCheckIn,
  initialCheckOut,
  onClose,
  onSelectDates,
}) => {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedCheckIn, setSelectedCheckIn] = useState<string | null>(initialCheckIn || null);
  const [selectedCheckOut, setSelectedCheckOut] = useState<string | null>(initialCheckOut || null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Month 1 date object
  const month1Date = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  // Month 2 date object (next month)
  const month2Date = new Date(today.getFullYear(), today.getMonth() + monthOffset + 1, 1);

  const formatMonthTitle = (d: Date) => {
    const monthStr = d.toLocaleDateString('es-MX', { month: 'long' });
    const capitalized = monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
    return `${capitalized} ${d.getFullYear()}`;
  };

  const formatDateStr = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const calculateNights = () => {
    if (!selectedCheckIn || !selectedCheckOut) return 0;
    const start = new Date(selectedCheckIn + 'T00:00:00');
    const end = new Date(selectedCheckOut + 'T00:00:00');
    const diffTime = end.getTime() - start.getTime();
    return Math.max(0, Math.round(diffTime / (1000 * 3600 * 24)));
  };

  const nights = calculateNights();

  const handleDayClick = (dateStr: string, isPast: boolean) => {
    if (isPast) return;

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

  const handleClear = () => {
    setSelectedCheckIn(null);
    setSelectedCheckOut(null);
  };

  const handleApply = () => {
    if (selectedCheckIn && selectedCheckOut) {
      onSelectDates(selectedCheckIn, selectedCheckOut);
      onClose();
    }
  };

  const renderMonthGrid = (dateObj: Date) => {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    
    // First day index (0 = Sun, 1 = Mon, ..., 6 = Sat)
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Days in this month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysArray = [];
    // Padding for days of previous month
    for (let i = 0; i < firstDayIndex; i++) {
      daysArray.push(null);
    }
    // Days of current month
    for (let d = 1; d <= daysInMonth; d++) {
      daysArray.push(d);
    }

    return (
      <div className="space-y-3">
        <h4 className="font-bold text-center text-sm text-stone-900">
          {formatMonthTitle(dateObj)}
        </h4>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-stone-400 pb-1">
          <span>Do</span>
          <span>Lu</span>
          <span>Ma</span>
          <span>Mi</span>
          <span>Ju</span>
          <span>Vi</span>
          <span>Sá</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-1 gap-x-1">
          {daysArray.map((dayNum, idx) => {
            if (dayNum === null) {
              return <div key={`empty-${idx}`} className="h-9 w-9" />;
            }

            const dateStr = formatDateStr(year, month, dayNum);
            const currentDayDate = new Date(year, month, dayNum);
            const isPast = currentDayDate < today;

            const isCheckIn = selectedCheckIn === dateStr;
            const isCheckOut = selectedCheckOut === dateStr;
            const isInRange =
              selectedCheckIn &&
              selectedCheckOut &&
              dateStr > selectedCheckIn &&
              dateStr < selectedCheckOut;

            let cellStyle = 'hover:bg-stone-100 text-stone-800 font-medium';
            if (isPast) {
              cellStyle = 'text-stone-300 line-through cursor-not-allowed';
            } else if (isCheckIn || isCheckOut) {
              cellStyle = 'bg-stone-900 text-white font-bold shadow-md scale-105';
            } else if (isInRange) {
              cellStyle = 'bg-stone-200 text-stone-900 font-semibold';
            }

            return (
              <button
                key={dateStr}
                disabled={isPast}
                onClick={() => handleDayClick(dateStr, isPast)}
                className={`h-9 w-9 mx-auto rounded-full flex items-center justify-center text-xs transition-all ${cellStyle}`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const formatReadableDate = (dateStr: string | null) => {
    if (!dateStr) return 'Añadir fecha';
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  };

  React.useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      const openModals = document.querySelectorAll('[data-modal-overlay]');
      if (openModals.length <= 1) {
        document.body.style.overflow = prevOverflow || '';
      }
    };
  }, []);

  return createPortal(
    <AnimatePresence>
      <div data-modal-overlay="true" className="fixed inset-0 z-[90] overflow-y-auto flex items-center justify-center p-3 sm:p-6">
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl z-10 space-y-6 text-left"
        >
          {/* Top Header */}
          <div className="flex items-start justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 flex items-center space-x-2">
                <CalendarIcon className="w-6 h-6 text-forest" />
                <span>Elige tus fechas</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                {nights > 0
                  ? `${nights} ${nights === 1 ? 'noche' : 'noches'} en ${accommodation.name}`
                  : 'Selecciona las fechas de tu estancia en Zacatlán'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 p-2 rounded-full transition-all shadow"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Month Navigation Control Arrows Header */}
          <div className="relative">
            <div className="flex items-center justify-between absolute top-0 left-0 right-0 z-10 px-1 pointer-events-none">
              <button
                disabled={monthOffset <= 0}
                onClick={() => setMonthOffset((prev) => Math.max(0, prev - 1))}
                className={`p-2 rounded-full bg-white shadow-md border border-stone-200 pointer-events-auto transition-all ${
                  monthOffset <= 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 text-stone-800'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setMonthOffset((prev) => prev + 1)}
                className="p-2 rounded-full bg-white shadow-md border border-stone-200 pointer-events-auto transition-all hover:scale-110 text-stone-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 2 Months Side-by-Side Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2 px-2">
              {renderMonthGrid(month1Date)}
              {renderMonthGrid(month2Date)}
            </div>
          </div>

          {/* Footer Bar (Selected Summary, Clear, Apply) */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left Range Pill Summary */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 font-medium text-stone-700">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Entrada</span>
                <span>{formatReadableDate(selectedCheckIn)}</span>
              </div>
              <span className="text-stone-300 font-bold">—</span>
              <div className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 font-medium text-stone-700">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Salida</span>
                <span>{formatReadableDate(selectedCheckOut)}</span>
              </div>
            </div>

            {/* Right Buttons: Borrar & Aplicar */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <button
                onClick={handleClear}
                className="text-xs font-semibold text-stone-600 underline hover:text-stone-900 px-3 py-2 transition-colors"
              >
                Borrar fechas
              </button>

              <button
                onClick={handleApply}
                disabled={!selectedCheckIn || !selectedCheckOut}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
                  selectedCheckIn && selectedCheckOut
                    ? 'bg-forest hover:bg-forest-dark text-white cursor-pointer hover:scale-105'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                Aplicar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
