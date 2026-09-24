import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CloudFog, Flame, Sparkles, ArrowRight, UtensilsCrossed } from 'lucide-react';

interface HeroPlaceholderProps {
  onExploreClick?: () => void;
}

export const HeroPlaceholder: React.FC<HeroPlaceholderProps> = ({ onExploreClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax Scroll Effect like Apple
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Background image translates down smoothly on scroll
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section 
      ref={containerRef}
      id="inicio" 
      className="relative bg-forest-dark text-stone-light overflow-hidden min-h-[calc(100vh-5rem)] flex items-center justify-center"
    >
      {/* Parallax Background Image with high visibility and Apple smooth movement */}
      <motion.div 
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <img
          src="/images/hero-bg-zacatlan.jpg"
          alt="Zacatlán de las Manzanas Collage Histórico"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-105 opacity-75"
        />
      </motion.div>

      {/* Atmospheric Forest Green Fade Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/85 via-forest-dark/40 to-forest-dark z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0F2419_95%)] opacity-70 z-10" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#DAA520_1px,transparent_1px)] [background-size:28px_28px] z-10" />

      {/* Hero Content Layer with High Legibility & Shadowing */}
      <motion.div 
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center"
      >
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 bg-forest-dark/80 border border-warmGold/40 text-warmGold px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-md shadow-2xl"
        >
          <CloudFog className="w-4 h-4 text-warmGold animate-pulse" />
          <span>Entre la Niebla y las Manzanas • Zacatlán, Puebla</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-tight text-stone-light drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
        >
          El refugio perfecto para desconectar en el <span className="text-warmGold underline decoration-terracotta decoration-wavy">bosque de la sierra</span>.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-stone-light max-w-2xl font-light leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
        >
          Cabañas rústicas con chimenea, suites de hotel boutique y restaurante tradicional con el sabor autóctono de Zacatlán de las Manzanas.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-stone-light font-medium"
        >
          <div className="flex items-center space-x-2 bg-forest-dark/80 backdrop-blur-md px-4 py-2 rounded-xl border border-warmGold/20 shadow-lg">
            <Flame className="w-4 h-4 text-terracotta" />
            <span>Chimeneas de leña</span>
          </div>
          <div className="flex items-center space-x-2 bg-forest-dark/80 backdrop-blur-md px-4 py-2 rounded-xl border border-warmGold/20 shadow-lg">
            <Sparkles className="w-4 h-4 text-warmGold" />
            <span>Vistas a la barranca y niebla</span>
          </div>
          <div className="flex items-center space-x-2 bg-forest-dark/80 backdrop-blur-md px-4 py-2 rounded-xl border border-warmGold/20 shadow-lg">
            <UtensilsCrossed className="w-4 h-4 text-warmGold" />
            <span>Gastronomía artesanal</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          {onExploreClick ? (
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-warmGold hover:bg-warmGold-hover text-forest-dark px-8 py-4 rounded-xl text-base font-bold shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Explorar Cabañas & Suites</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <a
              href="#hospedajes"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-warmGold hover:bg-warmGold-hover text-forest-dark px-8 py-4 rounded-xl text-base font-bold shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explorar Cabañas & Suites</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          )}

          <a
            href="#experiencias"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-forest-dark/80 hover:bg-forest text-stone-light border border-warmGold/30 px-8 py-4 rounded-xl text-base font-semibold backdrop-blur-md shadow-xl transition-all"
          >
            Nuestra Experiencia
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};
