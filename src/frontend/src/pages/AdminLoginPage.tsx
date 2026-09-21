import React, { useState } from 'react';
import { authService } from '../services/authService';
import { FormField } from '../components/ui/FormField';
import { ShieldCheck, AlertCircle, LogIn } from 'lucide-react';

interface AdminLoginPageProps {
  onSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg('Por favor ingresa tu usuario y contraseña.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await authService.login(username.trim(), password);
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Credenciales de administrador inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-stone-muted space-y-6">
        
        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-forest/10 rounded-2xl flex items-center justify-center mx-auto text-forest-dark border border-forest/20">
            <ShieldCheck className="w-8 h-8 text-warmGold" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest-dark">Acceso Restringido</h2>
          <p className="text-xs text-stone-charcoal/70">
            Recepción y Administración - Una Cosita de Zacatlán
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-xl text-xs text-red-700 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Usuario de Administrador"
            requiredField
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <FormField
            label="Contraseña de Seguridad"
            requiredField
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest-dark hover:bg-forest text-warmGold font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow hover:shadow-lg disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Verificando Credenciales...' : 'Iniciar Sesión'}</span>
            </button>
          </div>
        </form>

        <div className="text-center border-t border-stone-muted pt-4">
          <p className="text-[11px] text-stone-charcoal/50">
            Protegido con firmas criptográficas JWT. Sesiones inactivas expiran automáticamente.
          </p>
        </div>
      </div>
    </div>
  );
};
