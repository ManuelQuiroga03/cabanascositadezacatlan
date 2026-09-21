import React, { useState } from 'react';
import type { Accommodation, AccommodationType } from '../../types';
import { adminService } from '../../services/adminService';
import { FormField } from '../ui/FormField';
import { X, Image as ImageIcon, Plus, Trash2, Save, AlertCircle, Star, Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditAccommodationModalProps {
  accommodation: Accommodation;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditAccommodationModal: React.FC<EditAccommodationModalProps> = ({
  accommodation,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState(accommodation.name);
  const [description, setDescription] = useState(accommodation.description);
  const [type, setType] = useState<AccommodationType>(accommodation.type);
  const [capacity, setCapacity] = useState(accommodation.capacity);
  const [basePrice, setBasePrice] = useState(accommodation.basePrice);
  const [amenitiesStr, setAmenitiesStr] = useState((accommodation.amenities || []).join(', '));
  const [isActive, setIsActive] = useState(accommodation.isActive);

  // Image URLs management
  const [imageUrls, setImageUrls] = useState<string[]>(
    accommodation.imageUrls && accommodation.imageUrls.length > 0
      ? [...accommodation.imageUrls]
      : [
          'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
        ]
  );
  const [newUrl, setNewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMsg(null);
      const uploadedUrl = await adminService.uploadImage(file);
      if (uploadedUrl) {
        setImageUrls((prev) => [...prev, uploadedUrl]);
      }
    } catch (err: any) {
      console.error('Error al subir imagen a Cloudinary:', err);
      setErrorMsg('Error al subir la imagen a Cloudinary. Verifique el archivo.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!newUrl.trim()) return;
    setImageUrls([...imageUrls, newUrl.trim()]);
    setNewUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSetCoverPhoto = (index: number) => {
    if (index === 0) return;
    const selected = imageUrls[index];
    const remaining = imageUrls.filter((_, i) => i !== index);
    setImageUrls([selected, ...remaining]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('El nombre del hospedaje es obligatorio.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const amenitiesList = amenitiesStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await adminService.updateAccommodation(accommodation.id, {
        name: name.trim(),
        description: description.trim(),
        type,
        capacity: Number(capacity),
        basePrice: Number(basePrice),
        amenities: amenitiesList,
        imageUrls,
        isActive,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar los cambios del hospedaje.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-forest-dark/70 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-stone-muted max-h-[90vh] overflow-y-auto space-y-6"
        >
          
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-stone-muted pb-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-forest-dark flex items-center space-x-2">
                <span>Editar Hospedaje</span>
              </h3>
              <p className="text-xs text-stone-charcoal/70 mt-1">
                Modifica los detalles, precios y galería de imágenes de <strong className="text-forest-dark">{accommodation.name}</strong>.
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 text-stone-charcoal/60 hover:text-stone-charcoal hover:bg-stone-light rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-xl text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Main Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Nombre del Hospedaje"
                requiredField
                placeholder="Ej. Cabaña Vista a la Niebla"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-charcoal">Tipo de Hospedaje</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AccommodationType)}
                  className="w-full px-3.5 py-2.5 bg-stone-light border border-stone-muted rounded-xl text-xs focus:ring-2 focus:ring-warmGold focus:outline-none"
                >
                  <option value="Cabin">Cabaña Rústica</option>
                  <option value="HotelRoom">Suite Hotel Boutique</option>
                </select>
              </div>

              <FormField
                label="Capacidad (Huéspedes)"
                type="number"
                requiredField
                min={1}
                max={20}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
              />

              <FormField
                label="Precio Base por Noche ($ MXN)"
                type="number"
                requiredField
                min={100}
                step={50}
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-charcoal">Descripción Detallada</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe los encantos, vista panorámica, detalles en madera o piedra volcánica..."
                className="w-full px-3.5 py-2.5 bg-stone-light border border-stone-muted rounded-xl text-xs focus:ring-2 focus:ring-warmGold focus:outline-none"
              />
            </div>

            {/* Amenities String */}
            <FormField
              label="Amenidades (separadas por coma)"
              placeholder="Chimenea, Jacuzzi, Wi-Fi, Terraza Vista al Valle, Asador"
              value={amenitiesStr}
              onChange={(e) => setAmenitiesStr(e.target.value)}
              rightHint="Ej. Chimenea, Jacuzzi"
            />

            {/* Image Gallery Manager */}
            <div className="space-y-3 bg-stone-light p-4 rounded-2xl border border-stone-muted">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-terracotta" />
                  <h4 className="font-bold text-xs text-forest-dark uppercase tracking-wider">
                    Galería de Imágenes & Portada ({imageUrls.length})
                  </h4>
                </div>
                <span className="text-[11px] text-stone-charcoal/60">
                  La primera imagen será la foto de portada.
                </span>
              </div>

              {/* Supabase Storage File Upload Button & URL Input */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <label className="bg-forest hover:bg-forest-dark text-stone-light text-xs font-bold px-3.5 py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow flex-shrink-0">
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-warmGold" />
                  ) : (
                    <Upload className="w-4 h-4 text-warmGold" />
                  )}
                  <span>{isUploading ? 'Subiendo a Nube...' : 'Subir Foto a Supabase'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>

                <div className="flex-1 flex items-center space-x-2">
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="O pegar URL pública de imagen..."
                    className="flex-1 px-3 py-2 bg-white border border-stone-muted rounded-xl text-xs focus:ring-2 focus:ring-warmGold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="bg-stone-200 hover:bg-stone-300 text-forest-dark text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir</span>
                  </button>
                </div>
              </div>

              {/* Image Preview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-stone-muted bg-white aspect-video shadow-sm">
                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                    
                    {/* Cover Badge */}
                    {index === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-warmGold text-forest-dark text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center space-x-1 shadow">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Portada</span>
                      </span>
                    )}

                    {/* Actions overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetCoverPhoto(index)}
                          title="Establecer como portada"
                          className="p-1.5 bg-warmGold text-forest-dark rounded-lg hover:scale-110 transition-transform"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        title="Eliminar imagen"
                        className="p-1.5 bg-red-600 text-white rounded-lg hover:scale-110 transition-transform"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Status Toggle */}
            <div className="flex items-center space-x-3 bg-stone-light p-3.5 rounded-xl border border-stone-muted">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-forest rounded accent-forest cursor-pointer"
              />
              <label htmlFor="isActive" className="text-xs font-bold text-stone-charcoal cursor-pointer">
                Hospedaje Activo (Visible para clientes en el catálogo)
              </label>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-stone-muted flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-stone-charcoal/70 hover:text-stone-charcoal px-4 py-2.5 font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-warmGold hover:bg-warmGold-hover text-forest-dark font-bold text-xs px-6 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow hover:shadow-md disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
