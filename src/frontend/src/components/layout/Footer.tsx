import React from 'react';
import { MapPin, Phone, Mail, Trees, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const whatsappPhone = "527971000000";
  const defaultMsg = encodeURIComponent("¡Hola! Me gustaría más información sobre Una Cosita de Zacatlán.");
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${defaultMsg}`;

  return (
    <footer id="contacto" className="bg-forest-dark text-stone-light border-t border-forest/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-forest-light flex items-center justify-center text-warmGold">
                <Trees className="w-6 h-6" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-wide text-stone-light">
                Una Cosita de Zacatlán
              </span>
            </div>
            <p className="text-stone-muted text-sm font-light leading-relaxed max-w-md">
              Un rincón único en la sierra norte de Puebla. Ofrecemos hospedaje en cabañas rústicas y hotel boutique, gastronomía tradicional en nuestro restaurante y experiencias entre la niebla y los manzanos.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-terracotta hover:bg-terracotta-light text-stone-light px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Atención Personalizada en WhatsApp</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold text-warmGold mb-4">Contacto & Ubicación</h4>
            <ul className="space-y-3 text-sm text-stone-muted font-light">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                <span>Camino a la Barranca de los Jilgueros S/N, Zacatlán de las Manzanas, Puebla.</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-terracotta shrink-0" />
                <span>+52 797 100 0000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-terracotta shrink-0" />
                <span>contacto@unacositadezacatlan.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold text-warmGold mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm text-stone-muted">
              <li><a href="#inicio" className="hover:text-stone-light transition-colors">Inicio</a></li>
              <li><a href="#hospedajes" className="hover:text-stone-light transition-colors">Cabañas & Suites</a></li>
              <li><a href="#experiencias" className="hover:text-stone-light transition-colors">Experiencias de Montaña</a></li>
              <li><a href="#restaurante" className="hover:text-stone-light transition-colors">Restaurante Tradicional</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-forest/40 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-muted/70">
          <p>© {new Date().getFullYear()} Una Cosita de Zacatlán. Todos los derechos reservados.</p>
          <p className="mt-2 sm:mt-0">Diseñado para reservas directas sin comisiones.</p>
        </div>
      </div>
    </footer>
  );
};
