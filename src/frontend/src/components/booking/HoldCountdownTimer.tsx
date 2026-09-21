import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface HoldCountdownTimerProps {
  expiresAtUtc: string; // ISO date string
  onExpire: () => void;
}

export const HoldCountdownTimer: React.FC<HoldCountdownTimerProps> = ({ expiresAtUtc, onExpire }) => {
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateSecondsLeft = () => {
      const expirationTime = new Date(expiresAtUtc).getTime();
      const now = new Date().getTime();
      const diff = Math.floor((expirationTime - now) / 1000);
      return diff > 0 ? diff : 0;
    };

    const initialSeconds = calculateSecondsLeft();
    setTimeLeftSeconds(initialSeconds);

    if (initialSeconds <= 0) {
      setIsExpired(true);
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      const remaining = calculateSecondsLeft();
      setTimeLeftSeconds(remaining);

      if (remaining <= 0) {
        setIsExpired(true);
        clearInterval(timer);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAtUtc, onExpire]);

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if (isExpired) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3 text-red-700 animate-pulse">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600" />
        <div>
          <p className="text-sm font-bold">Tiempo de apartado expirado</p>
          <p className="text-xs text-red-600">El apartado temporal liberó las fechas. Por favor vuelve a seleccionar tus fechas para apartar nuevamente.</p>
        </div>
      </div>
    );
  }

  const isWarning = timeLeftSeconds < 180; // less than 3 minutes

  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
      isWarning ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-forest/5 border-forest/20 text-forest-dark'
    }`}>
      <div className="flex items-center space-x-3">
        <Clock className={`w-5 h-5 animate-pulse ${isWarning ? 'text-amber-600' : 'text-forest'}`} />
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-stone-charcoal/70">
            Apartado Temporal Activo
          </p>
          <p className="text-xs text-stone-charcoal/60">
            Completa la confirmación por WhatsApp antes de que expire el tiempo.
          </p>
        </div>
      </div>
      <div className="text-right pl-4">
        <span className={`font-mono text-xl sm:text-2xl font-bold ${
          isWarning ? 'text-amber-700' : 'text-forest-dark'
        }`}>
          {formattedTime}
        </span>
      </div>
    </div>
  );
};
