import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Accommodation } from '../../types';
import {
  X,
  Users,
  BedDouble,
  Bath,
  Home,
  Hotel,
  Star,
  Flame,
  Wifi,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Coffee,
  Tv,
  Car,
  Wind,
  ShieldCheck,
} from 'lucide-react';
import { BookingHoldModal } from './BookingHoldModal';

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
        ]
      : [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        ];

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const bedrooms = accommodation.bedrooms ?? (accommodation.capacity > 4 ? 3 : accommodation.capacity > 2 ? 2 : 1);
  const bathrooms = accommodation.bathrooms ?? (accommodation.capacity > 4 ? 2 : 1);
  const rating = accommodation.rating ?? 4.95;
  const reviewsCount = accommodation.reviewsCount ?? (accommodation.type === 'Cabin' ? 38 : 24);

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('chimenea') || lower.includes('leña')) return <Flame className="w-4 h-4 text-terracotta mr-2" />;
    if (lower.includes('jacuzzi') || lower.includes('tina')) return <Bath className="w-4 h-4 text-warmGold mr-2" />;
    if (lower.includes('wifi') || lower.includes('starlink')) return <Wifi className="w-4 h-4 text-forest mr-2" />;
    if (lower.includes('vista') || lower.includes('barranca') || lower.includes('niebla')) return <Sparkles className="w-4 h-4 text-warmGold mr-2" />;
    if (lower.includes('café') || lower.includes('desayuno')) return <Coffee className="w-4 h-4 text-amber-700 mr-2" />;
    if (lower.includes('tv') || lower.includes('netflix')) return <Tv className="w-4 h-4 text-indigo-600 mr-2" />;
    if (lower.includes('estacionamiento') || lower.includes('cochera')) return <Car className="w-4 h-4 text-stone-600 mr-2" />;
    if (lower.includes('calefacción') || lower.includes('clima')) return <Wind className="w-4 h-4 text-sky-600 mr-2" />;
    return <CheckCircle2 className="w-4 h-4 text-forest mr-2" />;
  };

  const handleNextPhoto = () => {
    setActivePhotoIdx((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window Container */}
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all my-4"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-black/80 text-white p-1.5 rounded-full backdrop-blur-md transition-all shadow-md hover:scale-105"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Gallery View Header */}
            <div className="relative h-48 sm:h-60 bg-forest-dark overflow-hidden group">
              <img
                src={photos[activePhotoIdx]}
                alt={accommodation.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              {/* Navigation Arrows for Gallery */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-md transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-md transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Category & Rating Badges */}
              <div className="absolute top-3 left-3 bg-forest-dark/85 backdrop-blur-md text-stone-light px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center space-x-1 border border-white/20 shadow-md">
                {accommodation.type === 'Cabin' ? (
                  <>
                    <Home className="w-3 h-3 text-warmGold" />
                    <span>Cabaña Rústica</span>
                  </>
                ) : (
                  <>
                    <Hotel className="w-3 h-3 text-warmGold" />
                    <span>Suite Hotel Boutique</span>
                  </>
                )}
              </div>

              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-forest-dark px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1 shadow-md border border-stone-200">
                <Star className="w-3 h-3 fill-warmGold text-warmGold" />
                <span>{rating}</span>
                <span className="text-stone-500 font-normal">({reviewsCount})</span>
              </div>

              {/* Thumbnail Bar */}
              {photos.length > 1 && (
                <div className="absolute bottom-3 left-3 flex space-x-1.5">
                  {photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`w-9 h-6 rounded overflow-hidden border transition-all ${
                        idx === activePhotoIdx ? 'border-warmGold scale-105' : 'border-white/50 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Body Content */}
            <div className="p-4 sm:p-5 space-y-4 max-h-[50vh] overflow-y-auto">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest-dark">
                  {accommodation.name}
                </h2>
                <p className="text-[11px] font-medium text-emerald-700 mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Zacatlán de las Manzanas, Puebla • Sierra Norte
                </p>
              </div>

              {/* Specs Bar */}
              <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-2.5 flex flex-wrap items-center justify-around gap-2 text-xs font-medium text-stone-charcoal">
                <div className="flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-forest" />
                  <span>Cap: {accommodation.capacity} p.</span>
                </div>
                <span className="text-stone-300 hidden sm:inline">•</span>
                <div className="flex items-center space-x-1">
                  <BedDouble className="w-3.5 h-3.5 text-forest" />
                  <span>{bedrooms} Recámaras</span>
                </div>
                <span className="text-stone-300 hidden sm:inline">•</span>
                <div className="flex items-center space-x-1">
                  <Bath className="w-3.5 h-3.5 text-forest" />
                  <span>{bathrooms} Baños</span>
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-1">
                <h3 className="font-serif text-sm font-bold text-forest-dark">Acerca de este hospedaje</h3>
                <p className="text-stone-charcoal/80 text-xs leading-relaxed font-light">
                  {accommodation.description}
                </p>
              </div>

              {/* All Amenities */}
              <div className="space-y-2">
                <h3 className="font-serif text-sm font-bold text-forest-dark">Todas las Amenidades e Instalaciones</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {accommodation.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-xs bg-stone-50 border border-stone-200/70 p-2 rounded-lg text-forest-dark font-medium"
                    >
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Trust Badges */}
              <div className="bg-forest/5 border border-forest/10 p-3 rounded-xl flex items-center space-x-2.5 text-xs text-forest-dark">
                <ShieldCheck className="w-4 h-4 text-forest flex-shrink-0" />
                <span className="text-[11px]">
                  <strong>Apartado Directo y Sin Intermediarios:</strong> Retención de disponibilidad durante 15 minutos mientras confirmas tu reservación por WhatsApp.
                </span>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-3.5 sm:p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-stone-charcoal/60 block">
                  PRECIO TOTAL POR NOCHE
                </span>
                <span className="font-serif text-xl font-bold text-forest-dark">
                  ${accommodation.basePrice.toLocaleString('es-MX')}{' '}
                  <span className="text-xs font-sans font-normal text-stone-charcoal/60">MXN</span>
                </span>
              </div>

              <div className="flex space-x-2 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="w-1/2 sm:w-auto px-3.5 py-2 rounded-xl border border-stone-300 font-semibold text-stone-charcoal hover:bg-stone-200/60 transition-all text-xs"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenBooking();
                  }}
                  className="w-1/2 sm:w-auto bg-warmGold hover:bg-warmGold-hover text-forest-dark px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center space-x-1.5 transform hover:-translate-y-0.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Apartar Fechas Ahora</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Nested Hold Modal if opened directly */}
        {showBookingModal && (
          <BookingHoldModal
            accommodation={accommodation}
            onClose={() => setShowBookingModal(false)}
          />
        )}
      </div>
    </AnimatePresence>
  );
};
