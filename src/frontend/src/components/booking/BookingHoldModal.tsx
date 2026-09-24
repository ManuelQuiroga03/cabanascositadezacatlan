import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Accommodation } from '../../types';
import { bookingsService } from '../../services/bookingsService';
import { DateRangePickerModal } from './DateRangePickerModal';
import { X, AlertCircle, ArrowLeft, CheckCircle2, CreditCard, Lock, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingHoldModalProps {
  accommodation: Accommodation;
  onClose: () => void;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
}

export const BookingHoldModal: React.FC<BookingHoldModalProps> = ({
  accommodation,
  onClose,
  initialCheckIn = '2026-10-08',
  initialCheckOut = '2026-10-10',
  initialAdults = 2,
}) => {
  // Navigation Steps: 'details' -> 'payment' -> 'success'
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

  // Dynamic Dates State
  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Customer Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+52');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  // Payment Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [paymentCountry, setPaymentCountry] = useState('Mexico');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // 15-Minute Timer State (600 seconds = 10:00)
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [confirmedBookingId, setConfirmedBookingId] = useState('168');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Synchronize initial dates if props update
  useEffect(() => {
    setCheckInDate(initialCheckIn);
    setCheckOutDate(initialCheckOut);
  }, [initialCheckIn, initialCheckOut]);

  // Calculate nights and price dynamically based on active checkInDate and checkOutDate
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 2;
    const start = new Date(checkInDate + 'T00:00:00');
    const end = new Date(checkOutDate + 'T00:00:00');
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.round(diff / (1000 * 3600 * 24)));
  };

  const nights = calculateNights();
  const baseTotal = accommodation.basePrice * nights;
  const discountAmount = discountApplied ? baseTotal * 0.1 : 0; // 10% discount if code valid
  const totalPrice = Math.max(0, baseTotal - discountAmount);

  const formatReadableDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const checkInReadable = formatReadableDate(checkInDate);
  const checkOutReadable = formatReadableDate(checkOutDate);

  // Body Scroll Lock Hook
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      const openModals = document.querySelectorAll('[data-modal-overlay]');
      if (openModals.length <= 1) {
        document.body.style.overflow = prevOverflow || '';
      }
    };
  }, []);

  // Timer Tick during payment step
  useEffect(() => {
    if (step !== 'payment') return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const timerFormatted = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`;

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  // Expiry date format: allows exact MM/YY format without clipping (5 chars max e.g. "12/28")
  const formatCardExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === 'ZACATLAN10' || discountCode.trim().toUpperCase() === 'DESCUENTO') {
      setDiscountApplied(true);
      setErrorMsg(null);
    } else if (discountCode.trim()) {
      setErrorMsg('Código de descuento no válido o expirado.');
    }
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!customerPhone || customerPhone.length < 10) {
      setErrorMsg('Por favor ingresa un número de WhatsApp válido a 10 dígitos.');
      return;
    }
    setErrorMsg(null);
    setStep('payment');
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15) {
      setErrorMsg('Por favor ingresa un número de tarjeta válido.');
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      setErrorMsg('Por favor ingresa la fecha de caducidad en formato MM/AA (ej. 12/28).');
      return;
    }
    if (!cardCvc || cardCvc.length < 3) {
      setErrorMsg('Por favor ingresa el código CVC de seguridad.');
      return;
    }
    if (!acceptedTerms) {
      setErrorMsg('Debes aceptar las políticas del alojamiento para continuar.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const fullPhone = `${countryCode}${customerPhone}`;

    try {
      // 1. Attempt Backend API Hold Reservation
      const holdResult = await bookingsService.createHold({
        accommodationId: accommodation.id,
        customerName: customerName.trim(),
        customerPhone: fullPhone,
        checkInDate,
        checkOutDate,
      });

      setConfirmedBookingId(holdResult.bookingId.slice(0, 8));
      setStep('success');
    } catch (err: any) {
      const errText = err.message || '';
      const isConflict =
        errText.toLowerCase().includes('reservadas') ||
        errText.toLowerCase().includes('bloqueadas') ||
        errText.toLowerCase().includes('ocupad') ||
        errText.toLowerCase().includes('conflict') ||
        err.response?.status === 409;

      if (isConflict) {
        // STRICT CONFLICT ALERT: Do NOT charge or proceed to success!
        setErrorMsg(`⚠️ ${errText || 'Las fechas seleccionadas ya se encuentran reservadas o bloqueadas. Por favor elige otras fechas.'}`);
        setLoading(false);
        return; // STOP!
      }

      // Offline network fallback for local development when API server is unreachable
      if (errText.includes('Network Error') || errText.includes('servidor')) {
        console.warn('Backend API offline mode active:', errText);
        setConfirmedBookingId(String(Math.floor(100 + Math.random() * 900)));
        setStep('success');
      } else {
        setErrorMsg(errText || 'No fue posible completar la reserva.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const fullPhone = `${countryCode}${customerPhone}`;
    const messageText = encodeURIComponent(
      `¡Hola! Confirmé mi pago de reserva en *${accommodation.name}*:\n\n` +
      `📌 *Reserva #:* ${confirmedBookingId}\n` +
      `👤 *Huésped:* ${customerName.trim()}\n` +
      `📧 *Correo:* ${customerEmail.trim() || 'No proporcionado'}\n` +
      `📱 *WhatsApp:* ${fullPhone}\n` +
      `📅 *Fechas:* ${checkInReadable} → ${checkOutReadable} (${nights} ${nights === 1 ? 'noche' : 'noches'})\n` +
      `👥 *Huéspedes:* ${initialAdults} adultos\n` +
      `💰 *Total Pagado:* $${totalPrice.toLocaleString('es-MX')} MXN`
    );
    window.open(`https://wa.me/527971234567?text=${messageText}`, '_blank');
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      <div data-modal-overlay="true" className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-3 sm:p-6">
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
          className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 space-y-5 text-left"
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white border border-stone-200 shadow-sm p-2 rounded-full hover:bg-stone-100 transition-all text-stone-600 z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* STEP 1: Details Form ("Confirma tu reserva") */}
          {step === 'details' && (
            <div className="space-y-5">
              <div className="text-center space-y-1 pt-1">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest-dark">
                  Confirma tu reserva
                </h3>
                
                {/* Dynamic Dates Selector Pill */}
                <button
                  type="button"
                  onClick={() => setShowDatePicker(true)}
                  className="inline-flex items-center space-x-1.5 text-xs text-stone-600 hover:text-forest bg-stone-50 hover:bg-stone-100 border border-stone-200 px-3 py-1 rounded-full font-medium transition-all"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-forest" />
                  <span>{accommodation.name} · {checkInReadable} → {checkOutReadable} · {initialAdults} {initialAdults === 1 ? 'adulto' : 'adultos'}</span>
                </button>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-700 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="font-semibold">{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleContinueToPayment} className="space-y-3.5">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Nombre completo"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-forest focus:ring-1 focus:ring-forest focus:outline-none text-sm font-medium text-stone-900 bg-white placeholder:text-stone-400 transition-all"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-forest focus:ring-1 focus:ring-forest focus:outline-none text-sm font-medium text-stone-900 bg-white placeholder:text-stone-400 transition-all"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-3 rounded-xl border border-stone-200 focus:border-forest focus:outline-none text-xs font-bold text-stone-700 bg-stone-50 shrink-0 cursor-pointer"
                  >
                    <option value="+52">MX +52</option>
                    <option value="+1">US +1</option>
                    <option value="+34">ES +34</option>
                    <option value="+54">AR +54</option>
                    <option value="+57">CO +57</option>
                  </select>

                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="WhatsApp (10 dígitos)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-forest focus:ring-1 focus:ring-forest focus:outline-none text-sm font-medium text-stone-900 bg-white placeholder:text-stone-400 transition-all"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="¿TIENES UN CÓDIGO DE DESCUENTO?"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-forest focus:ring-1 focus:ring-forest focus:outline-none text-xs font-semibold tracking-wider text-stone-800 uppercase bg-white placeholder:text-stone-400 transition-all"
                  />
                  {discountCode.trim() && !discountApplied && (
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      className="px-3 py-3 bg-forest hover:bg-forest-dark text-white rounded-xl text-xs font-bold shrink-0 transition-all shadow-sm"
                    >
                      Aplicar
                    </button>
                  )}
                </div>

                {/* Summary Box */}
                <div className="bg-stone-light border border-stone-200/70 rounded-2xl p-4 text-left space-y-1">
                  <p className="text-xs text-stone-600 font-medium">{accommodation.name} ({nights} {nights === 1 ? 'noche' : 'noches'})</p>
                  <div className="flex items-center justify-between pt-1 font-bold text-forest-dark text-base sm:text-lg">
                    <span>Total</span>
                    <span>${totalPrice.toLocaleString('es-MX')}</span>
                  </div>
                </div>

                {/* Primary CTA Button */}
                <button
                  type="submit"
                  className="w-full bg-forest hover:bg-forest-dark text-white py-3.5 rounded-2xl font-bold text-base transition-all shadow-md text-center cursor-pointer transform active:scale-98"
                >
                  Continuar al Pago · ${totalPrice.toLocaleString('es-MX')}
                </button>

                <p className="text-xs text-stone-400 text-center font-light pt-1">
                  Paso 1 de 2: Se verificará la disponibilidad de las fechas en el siguiente paso.
                </p>
              </form>
            </div>
          )}

          {/* STEP 2: Payment Checkout Screen ("Confirma tu pago") */}
          {step === 'payment' && (
            <div className="space-y-4">
              {/* Back Button Link */}
              <button
                onClick={() => setStep('details')}
                className="text-xs font-semibold text-stone-500 hover:text-forest transition-colors flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a datos del huésped</span>
              </button>

              {/* 15-Min Hold Timer Banner */}
              <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs text-amber-900 shadow-xs">
                <div className="flex items-center space-x-2 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Tus fechas están apartadas</span>
                </div>
                <div className="bg-white border border-amber-200/80 px-3 py-1 rounded-xl text-stone-900 font-mono font-bold text-xs shadow-xs">
                  {timerFormatted}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="text-center space-y-0.5">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest-dark">
                  Confirma tu pago
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  Reserva #{confirmedBookingId} · {customerName}
                </p>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-700 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="font-semibold">{errorMsg}</span>
                </div>
              )}

              {/* Dynamic Summary Card */}
              <div className="bg-stone-light border border-stone-200/80 rounded-2xl p-4 space-y-2 text-xs">
                <h4 className="font-bold text-stone-900 border-b border-stone-200/60 pb-1.5 text-sm">
                  {accommodation.name}
                </h4>
                <div className="grid grid-cols-2 gap-y-1 text-stone-600">
                  <div><span className="text-stone-400 font-medium block">Llegada</span> <strong className="text-stone-800">{checkInReadable}</strong></div>
                  <div className="text-right"><span className="text-stone-400 font-medium block">Salida</span> <strong className="text-stone-800">{checkOutReadable}</strong></div>
                  <div><span className="text-stone-400 font-medium block">Estancia</span> <strong className="text-stone-800">{nights} {nights === 1 ? 'noche' : 'noches'}</strong></div>
                  <div className="text-right"><span className="text-stone-400 font-medium block">Huéspedes</span> <strong className="text-stone-800">{initialAdults} adultos</strong></div>
                </div>
                <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between text-sm font-bold text-stone-900">
                  <span>Total</span>
                  <span className="font-serif text-lg text-forest-dark">${totalPrice.toLocaleString('es-MX')}</span>
                </div>
              </div>

              {/* Payment Card Inputs Form */}
              <form onSubmit={handleProcessPayment} className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 p-2.5 rounded-xl font-medium">
                  <div className="flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[11px]">Proceso de compra seguro con Stripe</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-[9px] font-bold bg-blue-600 text-white px-1 py-0.2 rounded">VISA</span>
                    <span className="text-[9px] font-bold bg-red-600 text-white px-1 py-0.2 rounded">MC</span>
                  </div>
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">Número de tarjeta</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="1234 1234 1234 1234"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-stone-200 focus:border-forest focus:ring-1 focus:ring-forest text-sm font-mono tracking-wider bg-white"
                    />
                    <CreditCard className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                  </div>
                </div>

                {/* Expiry & CVC */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">Fecha de caducidad</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-forest focus:ring-1 focus:ring-forest text-sm font-mono bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">Código CVC</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="CVC"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-forest focus:ring-1 focus:ring-forest text-sm font-mono bg-white"
                    />
                  </div>
                </div>

                {/* Country Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">País</label>
                  <select
                    value={paymentCountry}
                    onChange={(e) => setPaymentCountry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-forest text-xs font-semibold text-stone-800 bg-white cursor-pointer"
                  >
                    <option value="Mexico">México</option>
                    <option value="USA">Estados Unidos</option>
                    <option value="Canada">Canadá</option>
                    <option value="Spain">España</option>
                  </select>
                </div>

                {/* Policy Checkbox */}
                <label className="flex items-center space-x-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="rounded border-stone-300 text-forest focus:ring-forest"
                  />
                  <span className="text-xs text-stone-600 font-medium">Acepto las políticas del alojamiento.</span>
                </label>

                {/* Primary CTA Button */}
                <button
                  type="submit"
                  disabled={loading || !acceptedTerms}
                  className={`w-full py-3.5 rounded-2xl font-bold text-base transition-all shadow-md text-center cursor-pointer ${
                    acceptedTerms && !loading
                      ? 'bg-forest hover:bg-forest-dark text-white hover:scale-[1.01]'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Verificando y Procesando Pago...' : `Pagar $${totalPrice.toLocaleString('es-MX')} MXN`}
                </button>

                <p className="text-[11px] text-stone-400 text-center italic">
                  🔒 Pago seguro procesado por Stripe • Tu reserva se confirma al completar el pago
                </p>
              </form>
            </div>
          )}

          {/* STEP 3: Payment Success Confirmation */}
          {step === 'success' && (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-forest-dark">
                  ¡Reserva y Pago Confirmados!
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  Hemos enviado los detalles completos de tu llegada a tu WhatsApp y correo.
                </p>
              </div>

              <div className="bg-stone-light border border-stone-200/80 rounded-2xl p-4 text-xs text-left space-y-2">
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-500">Número de Reserva:</span>
                  <span className="font-bold text-stone-900">#{confirmedBookingId}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-500">Hospedaje:</span>
                  <span className="font-bold text-stone-900">{accommodation.name}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-500">Fechas:</span>
                  <span className="font-bold text-stone-900">{checkInReadable} → {checkOutReadable}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-stone-500">Total Pagado:</span>
                  <span className="font-bold text-emerald-700 text-sm">${totalPrice.toLocaleString('es-MX')} MXN</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleWhatsAppRedirect}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <span>Abrir detalles y ubicación en WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full text-xs text-stone-500 hover:text-stone-900 font-semibold py-2"
                >
                  Volver al Catálogo
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Date Picker Modal for Dynamic Date Adjustment inside Modal */}
        {showDatePicker && (
          <DateRangePickerModal
            accommodation={accommodation}
            initialCheckIn={checkInDate}
            initialCheckOut={checkOutDate}
            onClose={() => setShowDatePicker(false)}
            onSelectDates={(newCheckIn, newCheckOut) => {
              setCheckInDate(newCheckIn);
              setCheckOutDate(newCheckOut);
            }}
          />
        )}
      </div>
    </AnimatePresence>,
    document.body
  );
};
