'use client';

import { useState } from 'react';
import { X, Save, Wrench } from 'lucide-react';
import { useDashboardStore } from '@/lib/stores/dashboard-store';

interface Servicio {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: 'reparacion' | 'mantenimiento' | 'instalacion' | 'diagnostico' | 'consultoria' | 'otro';
  precio_base: number;
  tiempo_estimado: number;
  dificultad: 'basica' | 'intermedia' | 'avanzada' | 'experta';
  activo: boolean;
  requiere_repuestos: boolean;
  garantia_dias: number;
}

const categorias = [
  { value: 'reparacion', label: 'Reparación' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'instalacion', label: 'Instalación' },
  { value: 'diagnostico', label: 'Diagnóstico' },
  { value: 'consultoria', label: 'Consultoría' },
  { value: 'otro', label: 'Otro' }
];

const dificultades = [
  { value: 'basica', label: 'Básica' },
  { value: 'intermedia', label: 'Intermedia' },
  { value: 'avanzada', label: 'Avanzada' },
  { value: 'experta', label: 'Experta' }
];

export function EditServicioModal() {
  const { activeModal, modalData, closeModal } = useDashboardStore();
  const isOpen = activeModal === 'edit-servicio' || activeModal === 'create-servicio';
  const isEditing = activeModal === 'edit-servicio';
  const servicio = modalData as Servicio;

  const [formData, setFormData] = useState({
    codigo: servicio?.codigo || '',
    nombre: servicio?.nombre || '',
    descripcion: servicio?.descripcion || '',
    categoria: servicio?.categoria || 'reparacion',
    precio_base: servicio?.precio_base || 0,
    tiempo_estimado: servicio?.tiempo_estimado || 60,
    dificultad: servicio?.dificultad || 'basica',
    activo: servicio?.activo ?? true,
    requiere_repuestos: servicio?.requiere_repuestos ?? false,
    garantia_dias: servicio?.garantia_dias || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    }
    if (formData.precio_base <= 0) {
      newErrors.precio_base = 'El precio base debe ser mayor a 0';
    }
    if (formData.tiempo_estimado <= 0) {
      newErrors.tiempo_estimado = 'El tiempo estimado debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    console.log('Datos del servicio:', formData);
    alert(isEditing ? 'Servicio actualizado exitosamente' : 'Servicio registrado exitosamente');
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h2>
              <p className="text-gray-600">
                {isEditing ? 'Modifica la información del servicio' : 'Completa los datos del nuevo servicio'}
              </p>
            </div>
          </div>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => handleInputChange('codigo', e.target.value)}
                  placeholder="Ej: SRV-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.categoria ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {categorias.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.categoria && <p className="text-red-500 text-xs mt-1">{errors.categoria}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Servicio *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Nombre descriptivo del servicio"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                placeholder="Descripción detallada del servicio"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Configuración del Servicio */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Configuración del Servicio</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Base *</label>
                <input
                  type="number"
                  value={formData.precio_base}
                  onChange={(e) => handleInputChange('precio_base', parseInt(e.target.value) || 0)}
                  min="1"
                  placeholder="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.precio_base ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.precio_base && <p className="text-red-500 text-xs mt-1">{errors.precio_base}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo Estimado (minutos) *</label>
                <input
                  type="number"
                  value={formData.tiempo_estimado}
                  onChange={(e) => handleInputChange('tiempo_estimado', parseInt(e.target.value) || 0)}
                  min="1"
                  placeholder="60"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.tiempo_estimado ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.tiempo_estimado && <p className="text-red-500 text-xs mt-1">{errors.tiempo_estimado}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dificultad</label>
                <select
                  value={formData.dificultad}
                  onChange={(e) => handleInputChange('dificultad', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {dificultades.map(dif => (
                    <option key={dif.value} value={dif.value}>{dif.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Garantía (días)</label>
                <input
                  type="number"
                  value={formData.garantia_dias}
                  onChange={(e) => handleInputChange('garantia_dias', parseInt(e.target.value) || 0)}
                  min="0"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Opciones Adicionales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Opciones Adicionales</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => handleInputChange('activo', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                  Servicio activo (disponible para nuevas órdenes)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requiere_repuestos"
                  checked={formData.requiere_repuestos}
                  onChange={(e) => handleInputChange('requiere_repuestos', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="requiere_repuestos" className="ml-2 block text-sm text-gray-900">
                  Requiere repuestos adicionales
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Actualizar Servicio' : 'Registrar Servicio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 