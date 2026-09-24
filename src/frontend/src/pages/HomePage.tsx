import React, { useEffect, useState } from 'react';
import { HeroPlaceholder } from '../components/layout/HeroPlaceholder';
import { AccommodationCard } from '../components/booking/AccommodationCard';
import { accommodationsService } from '../services/accommodationsService';
import type { Accommodation } from '../types';
import { Coffee, UtensilsCrossed, ShieldCheck, RefreshCw, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface HomePageProps {
  onNavigateToAccommodations?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToAccommodations }) => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccommodations = async () => {
    setLoading(true);
    try {
      const data = await accommodationsService.getAll();
      setAccommodations(data);
    } catch (err: any) {
      console.warn('Backend API connection standard fallback activated:', err);
      setAccommodations([
        {
          id: '11111111-1111-1111-1111-111111111111',
          name: 'Cabaña Vista a la Niebla',
          slug: 'cabana-vista-niebla',
          description: 'Hermosa cabaña rústica rodeada de pinos y niebla. Chimenea a leña, terraza privada y jacuzzi.',
          type: 'Cabin',
          capacity: 4,
          basePrice: 1850.00,
          amenities: ['Chimenea', 'Jacuzzi', 'Wi-Fi', 'Terraza Vista al Valle', 'Asador'],
          imageUrls: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1000&q=80'],
          isActive: true
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          name: 'Cabaña El Bosque Encantado',
          slug: 'cabana-bosque-encantado',
          description: 'Espaciosa cabaña familiar de dos pisos construida en madera de pino y piedra volcánica.',
          type: 'Cabin',
          capacity: 8,
          basePrice: 3200.00,
          amenities: ['Chimenea Principal', 'Fogatero Exterior', 'Cocina Equipada', 'Estacionamiento Privado'],
          imageUrls: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80'],
          isActive: true
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          name: 'Suite Manzanas de Oro (Hotel Boutique)',
          slug: 'suite-manzanas-oro',
          description: 'Suite romántica de lujo con acabados artesanales de Zacatlán, cama King Size y vista panorámica.',
          type: 'HotelRoom',
          capacity: 2,
          basePrice: 1450.00,
          amenities: ['Cama King Size', 'Calefacción Rústica', 'Cata de Sidra de Bienvenida', 'Room Service'],
          imageUrls: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
          isActive: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccommodations();
  }, []);

  // Show top 3 featured accommodations for landing page showcase
  const featuredAccommodations = accommodations.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* Parallax Hero Header */}
      <HeroPlaceholder onExploreClick={onNavigateToAccommodations} />

      {/* Featured Showcase Section (3 Teaser Cards instead of dumping 20 cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center space-x-2 bg-terracotta/10 text-terracotta px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Colección Destacada</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-dark">
            Cabañas & Suites Destacadas
          </h2>
          <p className="mt-3 text-stone-charcoal/70 text-sm">
            Una muestra de nuestras opciones de hospedaje más aclamadas. Explora el catálogo completo para ver todas las 20 opciones con filtros avanzados.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <RefreshCw className="w-8 h-8 text-forest animate-spin" />
            <p className="text-sm font-medium text-stone-charcoal/70">Cargando destacados...</p>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredAccommodations.map((acc, index) => (
                <motion.div
                  key={acc.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="h-full"
                >
                  <AccommodationCard accommodation={acc} />
                </motion.div>
              ))}
            </div>

            {/* CTA Banner to Full Catalog Page */}
            {onNavigateToAccommodations && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-forest-dark text-stone-light rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-warmGold/30"
              >
                <div className="space-y-2 text-center md:text-left z-10">
                  <span className="text-xs uppercase tracking-widest text-warmGold font-bold">
                    Catálogo Completo Disponible
                  </span>
                  <h3 className="font-serif text-2xl sm:text-4xl font-bold">
                    ¿Buscas una capacidad específica o chimenea privada?
                  </h3>
                  <p className="text-stone-muted text-sm font-light max-w-xl">
                    Conoce nuestros 20 hospedajes con filtros por capacidad, precio y amenidades para encontrar tu lugar ideal.
                  </p>
                </div>

                <button
                  onClick={onNavigateToAccommodations}
                  className="z-10 inline-flex items-center space-x-3 bg-warmGold hover:bg-warmGold-hover text-forest-dark px-8 py-4 rounded-xl text-base font-bold shadow-xl transition-all transform hover:scale-105 shrink-0"
                >
                  <span>Ver Catálogo Completo (20 Cabañas)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </div>
        )}
      </section>

      {/* Experience Highlights Section */}
      <section id="experiencias" className="bg-forest-dark text-stone-light py-16 border-y border-forest/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-forest/40 border border-forest/50 p-6 rounded-2xl flex flex-col items-center text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-forest-light flex items-center justify-center text-warmGold">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-warmGold">Restaurante & Gastronomía</h3>
              <p className="text-sm text-stone-muted font-light leading-relaxed">
                Platillos tradicionales poblanos, pan de queso artesanal, sidra local y desayunos de montaña.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-forest/40 border border-forest/50 p-6 rounded-2xl flex flex-col items-center text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-forest-light flex items-center justify-center text-warmGold">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-warmGold">Calidez & Confort</h3>
              <p className="text-sm text-stone-muted font-light leading-relaxed">
                Cabañas equipadas con chimenea a leña, edredones térmicos y áreas para fogata bajo las estrellas.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-forest/40 border border-forest/50 p-6 rounded-2xl flex flex-col items-center text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-forest-light flex items-center justify-center text-warmGold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-warmGold">Reserva Directa Garantizada</h3>
              <p className="text-sm text-stone-muted font-light leading-relaxed">
                Trato directo con los anfitriones por WhatsApp sin intermediarios ni cargos ocultos.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Location teaser section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-muted shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 text-terracotta text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Ubicación Privilegiada</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest-dark">
              En el corazón de Zacatlán de las Manzanas
            </h3>
            <p className="text-stone-charcoal/70 text-sm max-w-xl">
              A tan solo minutos del centro histórico, el Reloj Floral Monumental y la impresionante Barranca de los Jilgueros.
            </p>
          </div>

          <a
            href="https://maps.google.com/?q=Zacatlán+Puebla"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-forest hover:bg-forest-dark text-stone-light px-6 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md shrink-0"
          >
            Ver Mapa en Google Maps
          </a>
        </div>
      </section>
    </div>
  );
};
