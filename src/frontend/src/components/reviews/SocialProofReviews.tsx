import React from 'react';
import { Star, CheckCircle, Quote, ThumbsUp } from 'lucide-react';
import type { Review } from '../../types';

export const SocialProofReviews: React.FC = () => {
  const reviews: Review[] = [
    {
      id: '1',
      accommodationName: 'Cabaña Vista a la Niebla',
      authorName: 'Carlos M. & Familia',
      location: 'Ciudad de México',
      rating: 5,
      comment: 'Una experiencia inolvidable. Despertar rodeados de la niebla de Zacatlán con la chimenea encendida fue mágico. La atención por WhatsApp para el apartado fue instantánea y sin complicaciones.',
      date: 'Agosto 2026',
    },
    {
      id: '2',
      accommodationName: 'Suite Manzanas de Oro',
      authorName: 'Valeria R. & Esteban G.',
      location: 'Puebla, Pue.',
      rating: 5,
      comment: 'La suite impecable, con aroma a madera fresca y pan recién horneado del restaurante. Excelente para una escapada romántica de fin de semana.',
      date: 'Septiembre 2026',
    },
    {
      id: '3',
      accommodationName: 'Cabaña El Bosque Encantado',
      authorName: 'Fernando T.',
      location: 'Querétaro, Qro.',
      rating: 5,
      comment: 'Reunimos a toda la familia (8 personas) y estuvimos muy cómodos. Las vistas a la sierra y el fogatero exterior por la noche valen cada centavo.',
      date: 'Julio 2026',
    },
  ];

  return (
    <section id="reseñas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-1.5 bg-stone-light text-forest-dark border border-stone-muted px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <ThumbsUp className="w-3.5 h-3.5 text-warmGold" />
          <span>Experiencias de nuestros huéspedes</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-dark flex items-center justify-center gap-2">
          <span>Reseñas Verificadas & Calificación 4.9</span>
          <Star className="w-6 h-6 fill-warmGold text-warmGold inline-block align-middle" />
        </h2>
        <p className="mt-2 text-stone-charcoal/70 text-sm">
          Descubre lo que opinan los huéspedes que han vivido la tranquilidad de Zacatlán de las Manzanas con nosotros.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl p-6 shadow-md border border-stone-muted/70 flex flex-col justify-between relative hover:shadow-lg transition-all"
          >
            <Quote className="absolute top-4 right-4 w-8 h-8 text-stone-muted/40" />

            <div>
              <div className="flex items-center space-x-1 text-warmGold mb-3">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warmGold text-warmGold" />
                ))}
              </div>

              <p className="text-stone-charcoal text-sm leading-relaxed italic mb-6">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-4 border-t border-stone-muted/60 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-forest-dark flex items-center">
                  <span>{rev.authorName}</span>
                  <span title="Huésped Verificado">
                    <CheckCircle className="w-3.5 h-3.5 text-forest ml-1.5 inline" />
                  </span>
                </h4>
                <p className="text-xs text-stone-charcoal/60">{rev.location} • {rev.accommodationName}</p>
              </div>
              <span className="text-[11px] text-stone-charcoal/50 font-medium">{rev.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
