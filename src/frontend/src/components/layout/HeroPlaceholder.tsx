import React from 'react';
import { CloudFog, Flame, Sparkles, ArrowRight, UtensilsCrossed } from 'lucide-react';

export const HeroPlaceholder: React.FC = () => {
  return (
    <section id="inicio" className="relative bg-forest-dark text-stone-light overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-forest-dark via-forest-dark/90 to-forest/60 z-10" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#DAA520_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-2 bg-forest/80 border border-warmGold/40 text-warmGold px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
          <CloudFog className="w-4 h-4 text-warmGold" />
          <span>Entre la Niebla y las Manzanas • Zacatlán, Puebla</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-tight text-stone-light">
          El refugio perfecto para desconectar en el <span className="text-warmGold underline decoration-terracotta decoration-wavy">bosque de la sierra</span>.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-stone-muted max-w-2xl font-light leading-relaxed">
          Cabañas rústicas con chimenea, suites de hotel boutique y restaurante tradicional con el sabor autóctono de Zacatlán de las Manzanas.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-stone-light font-medium">
          <div className="flex items-center space-x-2 bg-forest/40 px-3 py-1.5 rounded-lg border border-forest/50">
            <Flame className="w-4 h-4 text-terracotta" />
            <span>Chimeneas a leña</span>
          </div>
          <div className="flex items-center space-x-2 bg-forest/40 px-3 py-1.5 rounded-lg border border-forest/50">
            <Sparkles className="w-4 h-4 text-warmGold" />
            <span>Vistas a la barranca y niebla</span>
          </div>
          <div className="flex items-center space-x-2 bg-forest/40 px-3 py-1.5 rounded-lg border border-forest/50">
            <UtensilsCrossed className="w-4 h-4 text-warmGold" />
            <span>Gastronomía artesanal</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#hospedajes"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-warmGold hover:bg-warmGold-hover text-forest-dark px-8 py-4 rounded-xl text-base font-bold shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <span>Explorar Cabañas & Suites</span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#contacto"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-forest/80 hover:bg-forest text-stone-light border border-stone-muted/30 px-8 py-4 rounded-xl text-base font-semibold transition-all"
          >
            Ubicación & Contacto
          </a>
        </div>
      </div>
    </section>
  );
};
