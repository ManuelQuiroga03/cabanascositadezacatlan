import React, { useState } from 'react';
import type { Accommodation } from '../../types';
import {
  Users,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { BookingHoldModal } from './BookingHoldModal';
import { AccommodationDetailModal } from './AccommodationDetailModal';

interface AccommodationCardProps {
  accommodation: Accommodation;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const photos =
    accommodation.imageUrls && accommodation.imageUrls.length > 0
      ? accommodation.imageUrls
      : accommodation.type === 'Cabin'
      ? [
          'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=80',
        ]
      : [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
        ];

  const bedrooms = accommodation.bedrooms ?? (accommodation.capacity > 4 ? 2 : 1);
  const bedsCount = accommodation.bedsCount ?? (accommodation.capacity > 4 ? 4 : accommodation.capacity > 2 ? 2 : 1);
  const totalNights = 2; // Default preview calculation for 2 nights
  const totalPrice = accommodation.basePrice * totalNights;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-stone-200/80 overflow-hidden flex flex-col justify-between transition-all duration-300 group cursor-pointer h-full">
      {/* Header Visual Image Container with Dots & Hover Arrows */}
      <div
        onClick={() => setShowDetailModal(true)}
        className="relative h-64 sm:h-72 bg-stone-900 overflow-hidden shrink-0"
      >
        <img
          src={photos[activePhotoIdx]}
          alt={accommodation.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Top-Left Floating Capacity Pill Badge (ej: 👥 2 / 👥 5) */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-stone-900 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 shadow-md">
          <Users className="w-3.5 h-3.5 text-indigo-600" />
          <span>{accommodation.capacity}</span>
        </div>

        {/* Top-Right Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          aria-label="Guardar en favoritos"
          className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 p-2 rounded-full backdrop-blur-md transition-all text-white hover:scale-110"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>

        {/* Hover Navigation Arrows */}
        {photos.length > 1 && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrevPhoto}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-900 p-1.5 rounded-full shadow-md transition-transform hover:scale-110"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextPhoto}
              aria-label="Siguiente foto"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-900 p-1.5 rounded-full shadow-md transition-transform hover:scale-110"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom Dot Carousel Indicators */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 z-10">
            {photos.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === activePhotoIdx ? 'bg-white w-2.5' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content Body */}
      <div 
        onClick={() => setShowDetailModal(true)}
        className="p-5 flex-1 flex flex-col justify-between space-y-4"
      >
        <div>
          {/* Title with fixed height container & line-clamp-2 for uniform card height */}
          <div className="h-14 flex items-center">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-snug group-hover:text-forest transition-colors line-clamp-2">
              {accommodation.name}
            </h3>
          </div>

          {/* Compact Subtitle Specs (ej. 2 huéspedes · 1 rec · 1 camas) */}
          <p className="text-xs text-stone-500 font-medium mt-1">
            {accommodation.capacity} huéspedes · {bedrooms} rec · {bedsCount} camas
          </p>
        </div>

        {/* Pricing Line (ej. $1,300 / noche · $2,600 total) */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div className="text-sm font-semibold text-stone-900">
            <span className="font-bold text-base text-stone-900">
              ${accommodation.basePrice.toLocaleString('es-MX')}
            </span>{' '}
            <span className="text-stone-500 font-normal text-xs">/ noche</span>
            <span className="text-stone-400 mx-1.5">•</span>
            <span className="text-stone-500 text-xs font-normal">
              ${totalPrice.toLocaleString('es-MX')} total
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowBookingModal(true);
            }}
            className="bg-forest hover:bg-forest-dark text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm"
          >
            Reservar
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <AccommodationDetailModal
          accommodation={accommodation}
          onClose={() => setShowDetailModal(false)}
          onOpenBooking={() => setShowBookingModal(true)}
        />
      )}

      {/* Booking Hold Modal */}
      {showBookingModal && (
        <BookingHoldModal
          accommodation={accommodation}
          initialCheckIn="2026-10-08"
          initialCheckOut="2026-10-10"
          initialAdults={accommodation.capacity > 2 ? 2 : 1}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};
