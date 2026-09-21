import React, { useState } from 'react';
import type { Accommodation } from '../../types';
import { adminService } from '../../services/adminService';
import { FormField } from '../ui/FormField';
import { Lock, PlusCircle } from 'lucide-react';

interface ManualBlockFormProps {
  accommodations: Accommodation[];
  onBlockCreated: () => void;
}

export const ManualBlockForm: React.FC<ManualBlockFormProps> = ({
  accommodations,
  onBlockCreated,
}) => {
  const [selectedAccId, setSelectedAccId] = useState('');
  const [blockDate, setBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockSuccessMsg, setBlockSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const accId = selectedAccId || (accommodations.length > 0 ? accommodations[0].id : '');
    if (!accId || !blockDate) return;

    setBlockLoading(true);
    setBlockSuccessMsg(null);
    setErrorMsg(null);

    try {
      await adminService.createBlock({
        accommodationId: accId,
        date: blockDate,
        reason: blockReason || 'Mantenimiento / Reserva telefónica',
      });
      setBlockSuccessMsg('¡Fecha bloqueada exitosamente!');
      setBlockDate('');
      setBlockReason('');
      onBlockCreated();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al crear el bloqueo manual.');
    } finally {
      setBlockLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-stone-muted/70 space-y-4">
      <div className="flex items-center space-x-2">
        <Lock className="w-5 h-5 text-terracotta" />
        <h2 className="font-serif text-xl font-bold text-forest-dark">
          Bloqueo Manual de Fecha
        </h2>
      </div>
      <p className="text-xs text-stone-charcoal/70">
        Inhabilita una cabaña o suite para mantenimiento, limpieza o reservaciones por llamada telefónica.
      </p>

      {blockSuccessMsg && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 text-xs text-emerald-800 rounded-r-lg">
          {blockSuccessMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 text-xs text-red-700 rounded-r-lg">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleCreateBlock} className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-bold text-stone-charcoal mb-1">
            Seleccionar Hospedaje <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedAccId || (accommodations.length > 0 ? accommodations[0].id : '')}
            onChange={(e) => setSelectedAccId(e.target.value)}
            required
            className="w-full text-xs p-2.5 rounded-lg border border-stone-muted focus:ring-2 focus:ring-forest outline-none bg-stone-light"
          >
            {accommodations.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.type === 'Cabin' ? 'Cabaña' : 'Suite'})
              </option>
            ))}
          </select>
        </div>

        <FormField
          label="Fecha a Bloquear"
          requiredField
          type="date"
          value={blockDate}
          onChange={(e) => setBlockDate(e.target.value)}
        />

        <FormField
          label="Motivo (Opcional)"
          placeholder="Ej. Mantenimiento de chimenea"
          value={blockReason}
          onChange={(e) => setBlockReason(e.target.value)}
        />

        <button
          type="submit"
          disabled={blockLoading}
          className="w-full bg-forest hover:bg-forest-dark text-stone-light font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{blockLoading ? 'Guardando...' : 'Aplicar Bloqueo'}</span>
        </button>
      </form>
    </div>
  );
};
