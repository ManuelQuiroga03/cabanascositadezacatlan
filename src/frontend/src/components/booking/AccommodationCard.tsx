import React, { useState } from 'react';
import type { Accommodation } from '../../types';
import {
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
  Image as ImageIcon,
} from 'lucide-react';
import { BookingHoldModal } from './BookingHoldModal';
import { AccommodationDetailModal } from './AccommodationDetailModal';

interface AccommodationCardProps {
  accommodation: Accommodation;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const coverPhoto =
    accommodation.imageUrls && accommodation.imageUrls.length > 0
      ? accommodation.imageUrls[0]
      : accommodation.type === 'Cabin'
      ? 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1000&q=80'
      : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80';

  const bedrooms = accommodation.bedrooms ?? (accommodation.capacity > 4 ? 3 : accommodation.capacity > 2 ? 2 : 1);
  const bathrooms = accommodation.bathrooms ?? (accommodation.capacity > 4 ? 2 : 1);
  const tagline =
    accommodation.tagline ??
    (accommodation.type === 'Cabin'
      ? 'Vista panorámica a la sierra • 100% privada'
      : 'Suite boutique de lujo • Vista al bosque');
  const rating = accommodation.rating ?? 4.95;
  const reviewsCount = accommodation.reviewsCount ?? (accommodation.type === 'Cabin' ? 38 : 24);

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('chimenea') || lower.includes('leña')) return <Flame className="w-3.5 h-3.5 text-terracotta mr-1.5" />;
    if (lower.includes('jacuzzi') || lower.includes('tina')) return <Bath className="w-3.5 h-3.5 text-warmGold mr-1.5" />;
    if (lower.includes('wifi') || lower.includes('starlink')) return <Wifi className="w-3.5 h-3.5 text-forest mr-1.5" />;
    if (lower.includes('vista') || lower.includes('barranca')) return <Sparkles className="w-3.5 h-3.5 text-warmGold mr-1.5" />;
    return <CheckCircle2 className="w-3.5 h-3.5 text-forest mr-1.5" />;
  };

  const visibleAmenities = accommodation.amenities.slice(0, 3);
  const remainingCount = accommodation.amenities.length > 3 ? accommodation.amenities.length - 3 : 0;

  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl border border-stone-200/80 overflow-hidden flex flex-col transition-all duration-300 group">
      {/* Header Visual Container (Clicking opens Detail Modal) */}
      <div
        onClick={() => setShowDetailModal(true)}
        className="relative h-64 sm:h-72 bg-forest-dark overflow-hidden cursor-pointer"
      >
        <img
          src={coverPhoto}
          alt={accommodation.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-forest-dark/20 to-black/30" />

        {/* Top-Left Category Badge */}
        <div className="absolute top-4 left-4 bg-forest-dark/85 backdrop-blur-md text-stone-light px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 border border-white/20 shadow-md">
          {accommodation.type === 'Cabin' ? (
            <>
              <Home className="w-3.5 h-3.5 text-warmGold" />
              <span>Cabaña Rústica</span>
            </>
          ) : (
            <>
              <Hotel className="w-3.5 h-3.5 text-warmGold" />
              <span>Suite Hotel Boutique</span>
            </>
          )}
        </div>

        {/* Photo Count Pill */}
        {accommodation.imageUrls && accommodation.imageUrls.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 shadow">
            <ImageIcon className="w-3.5 h-3.5 text-warmGold" />
            <span>+{accommodation.imageUrls.length - 1} fotos</span>
          </div>
        )}

        {/* Bottom-Right Social Proof Rating Badge */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-forest-dark px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-md border border-stone-200">
          <Star className="w-3.5 h-3.5 fill-warmGold text-warmGold" />
          <span>{rating}</span>
          <span className="text-stone-500 font-normal text-[11px]">({reviewsCount})</span>
        </div>
      </div>

      {/* Main Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title (Clicking opens Detail Modal) & Tagline */}
          <h3
            onClick={() => setShowDetailModal(true)}
            className="font-serif text-2xl font-bold text-forest-dark hover:text-forest transition-colors leading-tight cursor-pointer"
          >
            {accommodation.name}
          </h3>
          <p className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            {tagline}
          </p>

          {/* Micro Specs Bar Container (Capacity, Bedrooms, Bathrooms) */}
          <div className="bg-stone-50 border border-stone-200/70 rounded-2xl p-3 flex items-center justify-around text-xs text-stone-charcoal font-medium my-4 shadow-sm">
            <div className="flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-forest" />
              <span>Hasta {accommodation.capacity} pers.</span>
            </div>
            <span className="text-stone-300 font-light">•</span>
            <div className="flex items-center space-x-1.5">
              <BedDouble className="w-4 h-4 text-forest" />
              <span>{bedrooms} recámaras</span>
            </div>
            <span className="text-stone-300 font-light">•</span>
            <div className="flex items-center space-x-1.5">
              <Bath className="w-4 h-4 text-forest" />
              <span>{bathrooms} baños</span>
            </div>
          </div>

          {/* Amenidades Destacadas (Capped at 3 + '+N más' button) */}
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase tracking-wider font-bold text-stone-charcoal/60">
              AMENIDADES DESTACADAS
            </h4>
            <div className="flex flex-wrap gap-2 items-center">
              {visibleAmenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-xs bg-stone-100/80 border border-stone-200/90 text-forest-dark px-3 py-1.5 rounded-xl font-medium shadow-2xs"
                >
                  {getAmenityIcon(amenity)}
                  {amenity}
                </span>
              ))}

              {remainingCount > 0 && (
                <button
                  onClick={() => setShowDetailModal(true)}
                  className="inline-flex items-center text-xs bg-stone-100 hover:bg-forest/10 border border-forest/20 text-forest-dark px-3 py-1.5 rounded-xl font-bold transition-all shadow-2xs hover:scale-105 cursor-pointer"
                  title="Ver todas las amenidades y fotos"
                >
                  +{remainingCount} más...
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer: Pricing & Main CTA Button */}
        <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-charcoal/50 block">
              PRECIO POR NOCHE
            </span>
            <span className="font-serif text-2xl font-bold text-forest-dark">
              ${accommodation.basePrice.toLocaleString('es-MX')}{' '}
              <span className="text-xs font-sans font-medium text-stone-charcoal/60">MXN</span>
            </span>
          </div>

          <button
            onClick={() => setShowBookingModal(true)}
            className="bg-forest-dark hover:bg-forest text-stone-light px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-1.5 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Apartar Fechas</span>
            <ChevronRight className="w-4 h-4 text-warmGold" />
          </button>
        </div>
      </div>

      {/* Accommodation Detail Modal (Photos, Full Specs & Amenities) */}
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
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};
