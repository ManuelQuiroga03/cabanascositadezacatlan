import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Accommodation } from '../../types';
import {
  X,
  Users,
  BedDouble,
  Bath,
  Flame,
  Wifi,
  Sparkles,
  CheckCircle2,
  Coffee,
  Tv,
  Car,
  ShieldCheck,
  Grid,
  Ban,
  UtensilsCrossed,
  Shirt,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { BookingHoldModal } from './BookingHoldModal';
import { DateRangePickerModal } from './DateRangePickerModal';

interface AccommodationDetailModalProps {
  accommodation: Accommodation;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const AccommodationDetailModal: React.FC<AccommodationDetailModalProps> = ({
  accommodation,
  onClose,
  onOpenBooking,
}) => {
  const photos =
    accommodation.imageUrls && accommodation.imageUrls.length > 0
      ? accommodation.imageUrls
      : accommodation.type === 'Cabin'
      ? [
          'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
        ]
      : [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        ];

  const [showFullGallery, setShowFullGallery] = useState(false);
  const [lightboxPhotoIdx, setLightboxPhotoIdx] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Date state for reservation calculation
  const [checkIn, setCheckIn] = useState('2026-10-08');
  const [checkOut, setCheckOut] = useState('2026-10-10');

  // Guest Counters State for Widget
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  const bedrooms = accommodation.bedrooms ?? (accommodation.capacity > 4 ? 2 : 1);
  const bedsCount = accommodation.bedsCount ?? (accommodation.capacity > 4 ? 4 : accommodation.capacity > 2 ? 2 : 1);
  const bathrooms = accommodation.bathrooms ?? (accommodation.capacity > 4 ? 2 : 1);
  const allowPets = accommodation.allowPets ?? false;

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 2;
    const start = new Date(checkIn + 'T00:00:00');
    const end = new Date(checkOut + 'T00:00:00');
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.round(diff / (1000 * 3600 * 24)));
  };

  const numNights = calculateNights();
  const subtotal = accommodation.basePrice * numNights;

  const openLightboxAt = (idx: number) => {
    setLightboxPhotoIdx(idx);
    setShowFullGallery(true);
  };

  const handleNextPhoto = () => {
    setLightboxPhotoIdx((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setLightboxPhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const formatReadableDate = (dateStr: string) => {
    if (!dateStr) return 'Añadir';
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  // Icon mapping for amenities grid
  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('fogatero') || lower.includes('fogata') || lower.includes('chimenea') || lower.includes('leña')) {
      return <Flame className="w-4 h-4 text-amber-600 shrink-0" />;
    }
    if (lower.includes('asador') || lower.includes('parrilla')) {
      return <UtensilsCrossed className="w-4 h-4 text-stone-700 shrink-0" />;
    }
    if (lower.includes('wifi') || lower.includes('starlink')) {
      return <Wifi className="w-4 h-4 text-forest shrink-0" />;
    }
    if (lower.includes('tv') || lower.includes('smart') || lower.includes('netflix')) {
      return <Tv className="w-4 h-4 text-stone-700 shrink-0" />;
    }
    if (lower.includes('estacionamiento') || lower.includes('cochera')) {
      return <Car className="w-4 h-4 text-stone-700 shrink-0" />;
    }
    if (lower.includes('agua caliente') || lower.includes('regadera')) {
      return <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />;
    }
    if (lower.includes('shampoo') || lower.includes('jabón')) {
      return <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />;
    }
    if (lower.includes('toallas') || lower.includes('ropa de cama') || lower.includes('patio')) {
      return <Shirt className="w-4 h-4 text-stone-700 shrink-0" />;
    }
    if (lower.includes('café') || lower.includes('cafetera') || lower.includes('frigobar') || lower.includes('minibar')) {
      return <Coffee className="w-4 h-4 text-amber-700 shrink-0" />;
    }
    if (lower.includes('vista') || lower.includes('barranca')) {
      return <Sparkles className="w-4 h-4 text-warmGold shrink-0" />;
    }
    return <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />;
  };

  const standardAmenitiesList = [
    'Fogatero',
    'Asador',
    'WiFi',
    'Smart TV',
    'Estacionamiento',
    'Agua caliente',
    'Shampoo',
    'Toallas',
    'Patio',
    'Servicios básicos',
    'Ropa de cama',
    'Frigobar',
    'Café / cafetera'
  ];

  const displayAmenities = accommodation.amenities && accommodation.amenities.length >= 6
    ? accommodation.amenities
    : standardAmenitiesList;

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
      <div data-modal-overlay="true" className="fixed inset-0 z-[80] overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Outer Container */}
        <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all my-4 p-6 sm:p-8 space-y-6"
          >
            {/* Top Close Button (Hidden when Lightbox gallery or DatePicker is open) */}
            {!showFullGallery && !showDatePicker && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-30 bg-stone-100 hover:bg-stone-200 text-stone-700 p-2 rounded-full transition-all shadow"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Photo Mosaic Grid Header (1 Big Left Photo + 4 Small Right Photos) */}
            <div className="relative rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-2 h-72 sm:h-96 bg-stone-900">
              {/* Left Main Big Photo */}
              <div 
                onClick={() => openLightboxAt(0)}
                className="md:col-span-2 h-full relative overflow-hidden group cursor-pointer"
              >
                <img
                  src={photos[0]}
                  alt={accommodation.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Right 2x2 Small Photos Grid */}
              <div className="hidden md:grid grid-cols-2 gap-2 h-full">
                {photos.slice(1, 5).map((photo, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => openLightboxAt(idx + 1)}
                    className="h-full overflow-hidden relative group cursor-pointer"
                  >
                    <img
                      src={photo}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>

              {/* Floating "Mostrar todas las fotos" Button (Hidden when Lightbox gallery or DatePicker is active) */}
              {!showFullGallery && !showDatePicker && (
                <button
                  onClick={() => openLightboxAt(0)}
                  className="absolute bottom-4 right-4 z-10 bg-white/90 hover:bg-white text-stone-900 px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center space-x-2 backdrop-blur-md transition-all hover:scale-105"
                >
                  <Grid className="w-4 h-4 text-stone-700" />
                  <span>Mostrar todas las fotos</span>
                </button>
              )}
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
              
              {/* LEFT COLUMN: Accommodation Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Title */}
                <div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                    {accommodation.name}
                  </h2>

                  {/* Horizontal Specs Bar */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-600 mt-3 pt-2 border-t border-stone-100">
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-4 h-4 text-stone-500" />
                      <span>{accommodation.capacity} huéspedes</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <BedDouble className="w-4 h-4 text-stone-500" />
                      <span>{bedrooms} rec · {bedsCount} camas</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <Bath className="w-4 h-4 text-stone-500" />
                      <span>{bathrooms}.0 baño</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {allowPets ? (
                        <span className="text-emerald-700 font-bold">🐾 Mascotas permitidas</span>
                      ) : (
                        <div className="flex items-center space-x-1 text-stone-500">
                          <Ban className="w-4 h-4 text-stone-400" />
                          <span>Sin mascotas</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2-Column Amenities Icon Matrix */}
                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <h3 className="font-serif text-lg font-bold text-stone-900">Lo que ofrece este lugar</h3>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs text-stone-800 font-medium">
                    {displayAmenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center space-x-2.5">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full Description */}
                <div className="space-y-2 pt-4 border-t border-stone-100">
                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-light">
                    {accommodation.description}
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: Booking Widget Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-200 space-y-6 sticky top-6">
                  
                  {/* Price Header */}
                  <div className="flex items-baseline justify-between border-b border-stone-100 pb-4">
                    <div>
                      <span className="font-bold text-2xl text-stone-900 font-serif">
                        ${accommodation.basePrice.toLocaleString('es-MX')}
                      </span>{' '}
                      <span className="text-stone-500 text-xs font-normal">/ noche</span>
                    </div>
                  </div>

                  {/* Dates Box Container - Interactive Click Opens DateRangePickerModal */}
                  <div 
                    onClick={() => setShowDatePicker(true)}
                    className="border border-stone-300 hover:border-stone-800 rounded-2xl overflow-hidden grid grid-cols-2 text-left cursor-pointer transition-colors group shadow-sm"
                  >
                    <div className="p-3 border-r border-stone-300 bg-stone-50/50 group-hover:bg-stone-100/60">
                      <span className="text-[10px] uppercase font-bold text-stone-500 block tracking-wider">
                        LLEGADA
                      </span>
                      <span className="text-xs font-bold text-stone-800">
                        {formatReadableDate(checkIn)}
                      </span>
                    </div>
                    <div className="p-3 bg-stone-50/50 group-hover:bg-stone-100/60">
                      <span className="text-[10px] uppercase font-bold text-stone-500 block tracking-wider">
                        SALIDA
                      </span>
                      <span className="text-xs font-bold text-stone-800">
                        {formatReadableDate(checkOut)}
                      </span>
                    </div>
                  </div>

                  {/* Guests Selectors */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[11px] uppercase font-bold text-stone-500 tracking-wider block">
                      HUÉSPEDES
                    </span>

                    {/* Adultos */}
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-stone-800">Adultos</p>
                        <p className="text-[10px] text-stone-400">13+ años</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:border-stone-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-stone-800 w-4 text-center">{adults}</span>
                        <button
                          onClick={() => setAdults(Math.min(accommodation.capacity, adults + 1))}
                          className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:border-stone-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Niños */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div>
                        <p className="font-bold text-stone-800">Niños</p>
                        <p className="text-[10px] text-stone-400">3–12 años</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:border-stone-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-stone-800 w-4 text-center">{children}</span>
                        <button
                          onClick={() => setChildren(children + 1)}
                          className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:border-stone-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Infantes */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div>
                        <p className="font-bold text-stone-800">Infantes</p>
                        <p className="text-[10px] text-stone-400">menores de 3</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setInfants(Math.max(0, infants - 1))}
                          className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:border-stone-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-stone-800 w-4 text-center">{infants}</span>
                        <button
                          onClick={() => setInfants(infants + 1)}
                          className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:border-stone-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Mascotas */}
                    {allowPets && (
                      <div className="flex items-center justify-between text-xs pt-1">
                        <div>
                          <p className="font-bold text-stone-800">Mascotas</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setPets(Math.max(0, pets - 1))}
                            className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:border-stone-900"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-stone-800 w-4 text-center">{pets}</span>
                          <button
                            onClick={() => setPets(pets + 1)}
                            className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:border-stone-900"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price Calculation Breakdown */}
                  <div className="space-y-2 pt-4 border-t border-stone-100 text-xs">
                    <div className="flex justify-between text-stone-600">
                      <span>${accommodation.basePrice.toLocaleString('es-MX')} × {numNights} {numNights === 1 ? 'noche' : 'noches'}</span>
                      <span>${subtotal.toLocaleString('es-MX')}</span>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                      <span>Total</span>
                      <span>${subtotal.toLocaleString('es-MX')}</span>
                    </div>
                  </div>

                  {/* Primary CTA Button */}
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBooking();
                    }}
                    className="w-full bg-forest hover:bg-forest-dark text-white py-3.5 rounded-2xl font-bold text-base transition-all shadow-lg text-center cursor-pointer transform active:scale-98"
                  >
                    Reservar
                  </button>

                  <p className="text-[11px] text-stone-400 text-center italic">
                    No se te cobrará hasta confirmar
                  </p>

                  <div className="flex items-center space-x-2 text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Apartado sin comisiones directas por WhatsApp</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>

        {/* Full Gallery Lightbox Screen (Matching Image 1) */}
        {showFullGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-70 bg-black/95 flex flex-col justify-between p-4 sm:p-6 select-none"
          >
            {/* Top Bar (Close button on right) */}
            <div className="flex items-center justify-between text-white z-20">
              <div>
                <h3 className="font-serif text-lg font-bold">{accommodation.name}</h3>
                <p className="text-xs text-stone-400">Galería de fotos ({photos.length} fotos)</p>
              </div>

              <button
                onClick={() => setShowFullGallery(false)}
                className="bg-white/10 hover:bg-white/30 text-white p-2.5 rounded-full transition-all backdrop-blur-md"
                aria-label="Cerrar galería"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Centered Photo Container with Left/Right Nav Arrows */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              {/* Floating Left Arrow */}
              {photos.length > 1 && (
                <button
                  onClick={handlePrevPhoto}
                  aria-label="Foto anterior"
                  className="absolute left-2 sm:left-6 z-20 bg-white/15 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all hover:scale-110 shadow-xl"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Large Centered Image */}
              <motion.img
                key={lightboxPhotoIdx}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                src={photos[lightboxPhotoIdx]}
                alt={`${accommodation.name} - Foto ${lightboxPhotoIdx + 1}`}
                className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl"
              />

              {/* Floating Right Arrow */}
              {photos.length > 1 && (
                <button
                  onClick={handleNextPhoto}
                  aria-label="Siguiente foto"
                  className="absolute right-2 sm:right-6 z-20 bg-white/15 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all hover:scale-110 shadow-xl"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Bar: Index Pill Counter & Thumbnails */}
            <div className="flex flex-col items-center space-y-3 z-20">
              {/* Counter Pill (e.g. 1 / 5) */}
              <div className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                {lightboxPhotoIdx + 1} / {photos.length}
              </div>

              {/* Horizontal Thumbnail Strip */}
              <div className="flex items-center space-x-2 max-w-full overflow-x-auto pb-1 px-4">
                {photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightboxPhotoIdx(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      idx === lightboxPhotoIdx ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Date Range Picker Modal */}
        {showDatePicker && (
          <DateRangePickerModal
            accommodation={accommodation}
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            onClose={() => setShowDatePicker(false)}
            onSelectDates={(newCheckIn, newCheckOut) => {
              setCheckIn(newCheckIn);
              setCheckOut(newCheckOut);
            }}
          />
        )}

        {/* Nested Hold Modal if opened */}
        {showBookingModal && (
          <BookingHoldModal
            accommodation={accommodation}
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            initialAdults={adults}
            onClose={() => setShowBookingModal(false)}
          />
        )}
      </div>
    </AnimatePresence>,
    document.body
  );
};
