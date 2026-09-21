import React, { useState } from 'react';
import type { Accommodation } from '../../types';
import { EditAccommodationModal } from './EditAccommodationModal';
import { StatusBadge } from '../ui/StatusBadge';
import { Edit3, Home, Users, DollarSign, Image as ImageIcon } from 'lucide-react';

interface AccommodationAdminListProps {
  accommodations: Accommodation[];
  onRefresh: () => void;
}

export const AccommodationAdminList: React.FC<AccommodationAdminListProps> = ({
  accommodations,
  onRefresh,
}) => {
  const [editingAcc, setEditingAcc] = useState<Accommodation | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-stone-muted/60 p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-muted">
        <div>
          <div className="flex items-center space-x-2 text-forest-dark font-serif text-2xl font-bold">
            <Home className="w-6 h-6 text-terracotta" />
            <h2>Catálogo de Hospedajes (8 Cabañas + 12 Suites)</h2>
          </div>
          <p className="text-xs text-stone-charcoal/70 mt-1">
            Administra precios por noche, descripciones, estado activo/inactivo y fotos de portada para cada unidad.
          </p>
        </div>
        <span className="text-xs font-bold bg-forest/10 text-forest-dark px-3 py-1.5 rounded-xl border border-forest/20">
          {accommodations.length} Unidades Registradas
        </span>
      </div>

      {/* Grid of Accommodations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accommodations.map((acc) => {
          const coverPhoto =
            acc.imageUrls && acc.imageUrls.length > 0
              ? acc.imageUrls[0]
              : acc.type === 'Cabin'
              ? 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80'
              : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';

          return (
            <div
              key={acc.id}
              className="bg-stone-light rounded-2xl border border-stone-muted p-4 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Thumbnail Image */}
                <div className="relative aspect-video rounded-xl overflow-hidden border border-stone-muted bg-stone-muted">
                  <img src={coverPhoto} alt={acc.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2">
                    <StatusBadge status={acc.isActive ? 'Available' : 'Blocked'} />
                  </span>
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1 backdrop-blur-xs">
                    <ImageIcon className="w-3 h-3" />
                    <span>{acc.imageUrls?.length || 1} fotos</span>
                  </span>
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-serif font-bold text-lg text-forest-dark line-clamp-1">{acc.name}</h3>
                  <p className="text-xs text-stone-charcoal/70 line-clamp-2 mt-1">{acc.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-charcoal/80 pt-1 border-t border-stone-muted">
                  <span className="flex items-center space-x-1 font-semibold">
                    <Users className="w-3.5 h-3.5 text-terracotta" />
                    <span>Cap. {acc.capacity} pers.</span>
                  </span>
                  <span className="font-serif font-bold text-forest text-base flex items-center">
                    <DollarSign className="w-4 h-4 text-warmGold -mr-0.5" />
                    <span>{acc.basePrice.toLocaleString('es-MX')}</span>
                    <span className="text-[10px] text-stone-charcoal/60 font-sans ml-1">/ noche</span>
                  </span>
                </div>
              </div>

              {/* Edit Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => setEditingAcc(acc)}
                  className="w-full bg-white hover:bg-stone-light text-forest-dark border border-stone-muted hover:border-forest font-bold text-xs py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-terracotta" />
                  <span>Editar Hospedaje & Fotos</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal Helper */}
      {editingAcc && (
        <EditAccommodationModal
          accommodation={editingAcc}
          onClose={() => setEditingAcc(null)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
};
