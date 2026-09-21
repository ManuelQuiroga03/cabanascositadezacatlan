import React, { useState } from 'react';
import type { Accommodation, HoldBookingResponse } from '../../types';
import { bookingsService } from '../../services/bookingsService';
import { FormField } from '../ui/FormField';
import { DateRangePickerModal } from './DateRangePickerModal';
import { HoldCountdownTimer } from './HoldCountdownTimer';
import { Clock, Send, AlertCircle, Calendar as CalendarIcon, X, CheckCircle2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingHoldModalProps {
  accommodation: Accommodation;
  onClose: () => void;
}

interface FieldErrors {
  customerName?: string;
  customerPhone?: string;
  checkInDate?: string;
  checkOutDate?: string;
}

export const BookingHoldModal: React.FC<BookingHoldModalProps> = ({ accommodation, onClose }) => {
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active hold state (after successful POST /api/v1/Bookings/hold)
  const [activeHold, setActiveHold] = useState<HoldBookingResponse | null>(null);
  const [whatsAppLoading, setWhatsAppLoading] = useState(false);

  const validateField = (name: string, value: string, currentCheckIn = checkInDate): string | undefined => {
    const todayStr = new Date().toISOString().split('T')[0];

    switch (name) {
      case 'customerName':
        if (!value.trim()) return 'El nombre completo es obligatorio.';
        if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
        return undefined;

      case 'customerPhone': {
        const cleanPhone = value.replace(/\D/g, '');
        if (!cleanPhone) return 'El número de teléfono o WhatsApp es obligatorio.';
        if (cleanPhone.length !== 10) return `El número debe tener exactamente 10 dígitos (llevas ${cleanPhone.length}).`;
        return undefined;
      }

      case 'checkInDate':
        if (!value) return 'La fecha de llegada es obligatoria.';
        if (value < todayStr) return 'La fecha de llegada no puede ser anterior a hoy.';
        return undefined;

      case 'checkOutDate':
        if (!value) return 'La fecha de salida es obligatoria.';
        if (currentCheckIn && value <= currentCheckIn) return 'La fecha de salida debe ser posterior a la fecha de llegada.';
        return undefined;

      default:
        return undefined;
    }
  };

  const validateAllForm = (): boolean => {
    const errors: FieldErrors = {
      customerName: validateField('customerName', customerName),
      customerPhone: validateField('customerPhone', customerPhone),
      checkInDate: validateField('checkInDate', checkInDate),
      checkOutDate: validateField('checkOutDate', checkOutDate, checkInDate),
    };

    const cleanErrors: FieldErrors = {};
    if (errors.customerName) cleanErrors.customerName = errors.customerName;
    if (errors.customerPhone) cleanErrors.customerPhone = errors.customerPhone;
    if (errors.checkInDate) cleanErrors.checkInDate = errors.checkInDate;
    if (errors.checkOutDate) cleanErrors.checkOutDate = errors.checkOutDate;

    setFieldErrors(cleanErrors);
    setTouchedFields({
      customerName: true,
      customerPhone: true,
      checkInDate: true,
      checkOutDate: true,
    });

    return Object.keys(cleanErrors).length === 0;
  };

  const handleBlur = (fieldName: string, value: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, value);
    setFieldErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomerName(val);
    if (touchedFields.customerName) {
      setFieldErrors((prev) => ({ ...prev, customerName: validateField('customerName', val) }));
    }
  };

  const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setCustomerPhone(val);
    if (touchedFields.customerPhone) {
      setFieldErrors((prev) => ({ ...prev, customerPhone: validateField('customerPhone', val) }));
    }
  };

  const handleChangeCheckIn = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCheckInDate(val);
    if (touchedFields.checkInDate) {
      setFieldErrors((prev) => ({ ...prev, checkInDate: validateField('checkInDate', val) }));
    }
    if (checkOutDate && touchedFields.checkOutDate) {
      setFieldErrors((prev) => ({ ...prev, checkOutDate: validateField('checkOutDate', checkOutDate, val) }));
    }
  };

  const handleChangeCheckOut = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCheckOutDate(val);
    if (touchedFields.checkOutDate) {
      setFieldErrors((prev) => ({ ...prev, checkOutDate: validateField('checkOutDate', val, checkInDate) }));
    }
  };

  const handleHoldBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllForm()) {
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const holdResult = await bookingsService.createHold({
        accommodationId: accommodation.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.replace(/\D/g, ''),
        checkInDate,
        checkOutDate,
      });

      setActiveHold(holdResult);
    } catch (err: any) {
      setErrorMsg(err.message || 'No fue posible apartar las fechas seleccionadas.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmWhatsApp = async () => {
    if (!activeHold) return;

    setWhatsAppLoading(true);
    try {
      const confirmResult = await bookingsService.confirmWhatsApp({
        bookingId: activeHold.bookingId,
      });

      window.open(confirmResult.whatsAppRedirectUrl, '_blank');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'No fue posible generar el enlace de WhatsApp.');
    } finally {
      setWhatsAppLoading(false);
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
          className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-muted relative space-y-4"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-muted pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-forest-dark">
                {activeHold ? 'Apartado Confirmado' : `Apartado Temporal - ${accommodation.name}`}
              </h3>
              <p className="text-xs text-stone-charcoal/70 flex items-center mt-1">
                <Clock className="w-3.5 h-3.5 text-terracotta mr-1 inline" />
                {activeHold ? 'Completa la reservación en WhatsApp' : 'Se retendrá la disponibilidad por 15 minutos.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-stone-charcoal/60 hover:text-stone-charcoal rounded-lg hover:bg-stone-light transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* General Error Message */}
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeHold ? (
            /* Step 2: Active Hold Countdown & WhatsApp Action */
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3 text-emerald-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold">¡Fechas bloqueadas con éxito!</p>
                  <p className="text-xs text-emerald-700">
                    Reserva #{activeHold.bookingId.slice(0, 8)} para <strong className="font-semibold">{accommodation.name}</strong>.
                  </p>
                </div>
              </div>

              {/* 15-Minute Countdown Timer */}
              <HoldCountdownTimer
                expiresAtUtc={activeHold.expiresAtUtc}
                onExpire={() => {
                  setErrorMsg('El tiempo de apartado de 15 minutos ha expirado. Por favor vuelve a seleccionar tus fechas.');
                  setActiveHold(null);
                }}
              />

              {/* Reservation Details Summary */}
              <div className="bg-stone-light border border-stone-muted rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between border-b border-stone-muted pb-1.5">
                  <span className="text-stone-charcoal/70">Huésped:</span>
                  <span className="font-bold text-forest-dark">{activeHold.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-stone-muted pb-1.5">
                  <span className="text-stone-charcoal/70">Teléfono:</span>
                  <span className="font-bold text-forest-dark">{activeHold.customerPhone}</span>
                </div>
                <div className="flex justify-between border-b border-stone-muted pb-1.5">
                  <span className="text-stone-charcoal/70">Check-in / Check-out:</span>
                  <span className="font-bold text-forest-dark">{activeHold.checkInDate} al {activeHold.checkOutDate}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-stone-charcoal/70">Total Estimado:</span>
                  <span className="font-serif font-bold text-base text-terracotta">
                    ${activeHold.totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-stone-charcoal/70 hover:text-stone-charcoal px-3 py-2 font-medium"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmWhatsApp}
                  disabled={whatsAppLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow hover:shadow-md disabled:opacity-50"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>{whatsAppLoading ? 'Abriendo WhatsApp...' : 'Confirmar por WhatsApp'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Step 1: Booking Form */
            <form onSubmit={handleHoldBooking} noValidate className="space-y-4">
              
              {/* Name Field */}
              <FormField
                label="Nombre Completo"
                requiredField
                placeholder="Ej. María García"
                value={customerName}
                onChange={handleChangeName}
                onBlur={() => handleBlur('customerName', customerName)}
                error={fieldErrors.customerName}
                touched={touchedFields.customerName}
              />

              {/* Phone Field */}
              <FormField
                label="Teléfono / WhatsApp"
                requiredField
                type="tel"
                maxLength={10}
                rightHint="10 dígitos sin espacios"
                placeholder="Ej. 7971234567"
                value={customerPhone}
                onChange={handleChangePhone}
                onBlur={() => handleBlur('customerPhone', customerPhone)}
                error={fieldErrors.customerPhone}
                touched={touchedFields.customerPhone}
              />

              {/* Check-In & Check-Out Group */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-charcoal">Rango de Estancia</span>
                  <button
                    type="button"
                    onClick={() => setShowCalendarModal(true)}
                    className="text-[11px] text-forest font-semibold hover:underline flex items-center space-x-1"
                  >
                    <CalendarIcon className="w-3 h-3 text-terracotta" />
                    <span>Abrir Calendario Visual</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <FormField
                    label="Llegada (Check-in)"
                    type="date"
                    value={checkInDate}
                    onChange={handleChangeCheckIn}
                    onBlur={() => handleBlur('checkInDate', checkInDate)}
                    error={fieldErrors.checkInDate}
                    touched={touchedFields.checkInDate}
                  />

                  <FormField
                    label="Salida (Check-out)"
                    type="date"
                    value={checkOutDate}
                    onChange={handleChangeCheckOut}
                    onBlur={() => handleBlur('checkOutDate', checkOutDate)}
                    error={fieldErrors.checkOutDate}
                    touched={touchedFields.checkOutDate}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-stone-muted flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-stone-charcoal/70 hover:text-stone-charcoal px-3 py-2 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-warmGold hover:bg-warmGold-hover text-forest-dark font-bold text-sm px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow hover:shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Apartando...' : 'Apartar Fechas (15 min)'}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>

      {/* DatePicker Helper Modal */}
      {showCalendarModal && (
        <DateRangePickerModal
          accommodation={accommodation}
          onClose={() => setShowCalendarModal(false)}
          onSelectDates={(inDate, outDate) => {
            setCheckInDate(inDate);
            setCheckOutDate(outDate);
            setFieldErrors((prev) => ({ ...prev, checkInDate: undefined, checkOutDate: undefined }));
            setTouchedFields((prev) => ({ ...prev, checkInDate: true, checkOutDate: true }));
          }}
        />
      )}
    </AnimatePresence>
  );
};
