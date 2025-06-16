'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Image as ImageIcon,
  Receipt,
  Shield,
  Calculator,
  File,
  AlertCircle,
  Check
} from 'lucide-react';
import { useDashboardStore } from '@/lib/stores/dashboard-store';
import toast from 'react-hot-toast';

interface DocumentoForm {
  nombre: string;
  categoria: 'manual' | 'factura' | 'garantia' | 'presupuesto' | 'imagen' | 'otro';
  descripcion: string;
  entidad_tipo: string;
  entidad_id: string;
  archivo?: File;
}

interface Documento {
  id?: number;
  nombre: string;
  tipo: string;
  tamaño: string;
  fecha_subida: string;
  categoria: 'manual' | 'factura' | 'garantia' | 'presupuesto' | 'imagen' | 'otro';
  entidad_tipo?: string;
  entidad_id?: number;
  descripcion?: string;
}

// Mock data para entidades relacionadas
const mockEntidades = [
  { tipo: 'cliente', id: 1, nombre: 'Juan Pérez González' },
  { tipo: 'cliente', id: 2, nombre: 'María González Silva' },
  { tipo: 'orden', id: 1, nombre: 'Orden #ORD-001 - Reparación Laptop HP' },
  { tipo: 'orden', id: 2, nombre: 'Orden #ORD-002 - Mantenimiento iPhone' },
  { tipo: 'equipo', id: 1, nombre: 'Laptop HP Pavilion 15-eh1xxx' },
  { tipo: 'equipo', id: 2, nombre: 'iPhone 12 Pro Max' }
];

export function EditDocumentoModal() {
  const { activeModal, modalData, closeModal } = useDashboardStore();
  const isOpen = activeModal === 'edit-documento' || activeModal === 'create-documento';
  const isEditing = activeModal === 'edit-documento';
  const documento = modalData as Documento | null;

  const [form, setForm] = useState<DocumentoForm>({
    nombre: '',
    categoria: 'otro',
    descripcion: '',
    entidad_tipo: '',
    entidad_id: ''
  });

  const [errors, setErrors] = useState<Partial<DocumentoForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEditing && documento) {
        setForm({
          nombre: documento.nombre,
          categoria: documento.categoria,
          descripcion: documento.descripcion || '',
          entidad_tipo: documento.entidad_tipo || '',
          entidad_id: documento.entidad_id?.toString() || ''
        });
      } else {
        setForm({
          nombre: '',
          categoria: 'otro',
          descripcion: '',
          entidad_tipo: '',
          entidad_id: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, isEditing, documento]);

  if (!isOpen) return null;

  const getCategoryInfo = (categoria: string) => {
    switch (categoria) {
      case 'manual':
        return { icon: FileText, label: 'Manual', color: 'text-blue-600' };
      case 'factura':
        return { icon: Receipt, label: 'Factura', color: 'text-green-600' };
      case 'garantia':
        return { icon: Shield, label: 'Garantía', color: 'text-purple-600' };
      case 'presupuesto':
        return { icon: Calculator, label: 'Presupuesto', color: 'text-orange-600' };
      case 'imagen':
        return { icon: ImageIcon, label: 'Imagen', color: 'text-pink-600' };
      case 'otro':
        return { icon: File, label: 'Otro', color: 'text-gray-600' };
      default:
        return { icon: File, label: 'Otro', color: 'text-gray-600' };
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<DocumentoForm> = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!form.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    }

    if (!isEditing && !form.archivo) {
      newErrors.archivo = 'Debe seleccionar un archivo';
    }

    if (form.entidad_tipo && !form.entidad_id) {
      newErrors.entidad_id = 'Debe seleccionar una entidad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof DocumentoForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileSelect = (file: File) => {
    setForm(prev => ({ 
      ...prev, 
      archivo: file,
      nombre: prev.nombre || file.name.split('.')[0]
    }));
    
    if (errors.archivo) {
      setErrors(prev => ({ ...prev, archivo: undefined }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const action = isEditing ? 'actualizado' : 'subido';
      toast.success(`Documento ${action} correctamente`);
      closeModal();
    } catch {
      toast.error('Error al procesar el documento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEntidades = mockEntidades.filter(e => 
    !form.entidad_tipo || e.tipo === form.entidad_tipo
  );

  const categoryInfo = getCategoryInfo(form.categoria);
  const CategoryIcon = categoryInfo.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CategoryIcon className={`w-6 h-6 ${categoryInfo.color}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Editar Documento' : 'Subir Documento'}
              </h2>
              <p className="text-sm text-gray-600">
                {isEditing ? 'Modifica la información del documento' : 'Sube un nuevo documento al sistema'}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload (only for create) */}
          {!isEditing && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Archivo *
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : form.archivo 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {form.archivo ? (
                  <div className="space-y-2">
                    <Check className="w-8 h-8 text-green-600 mx-auto" />
                    <p className="text-sm font-medium text-green-700">
                      {form.archivo.name}
                    </p>
                    <p className="text-xs text-green-600">
                      {(form.archivo.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, archivo: undefined }))}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Cambiar archivo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">
                      Arrastra un archivo aquí o{' '}
                      <label className="text-blue-600 hover:text-blue-800 cursor-pointer">
                        selecciona uno
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(file);
                          }}
                          accept="image/*,.pdf,.doc,.docx,.txt"
                        />
                      </label>
                    </p>
                    <p className="text-xs text-gray-500">
                      Formatos soportados: PDF, DOC, DOCX, TXT, imágenes
                    </p>
                  </div>
                )}
              </div>
              {errors.archivo && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.archivo}
                </p>
              )}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nombre del Documento *
              </label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Ej: Manual de usuario HP Pavilion"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.nombre ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.nombre && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.nombre}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Categoría *
              </label>
              <select
                value={form.categoria}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.categoria ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="manual">Manual</option>
                <option value="factura">Factura</option>
                <option value="garantia">Garantía</option>
                <option value="presupuesto">Presupuesto</option>
                <option value="imagen">Imagen</option>
                <option value="otro">Otro</option>
              </select>
              {errors.categoria && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.categoria}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              placeholder="Descripción opcional del documento..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          {/* Related Entity */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Relacionar con (Opcional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Entidad
                </label>
                <select
                  value={form.entidad_tipo}
                  onChange={(e) => {
                    handleInputChange('entidad_tipo', e.target.value);
                    handleInputChange('entidad_id', '');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Sin relación</option>
                  <option value="cliente">Cliente</option>
                  <option value="orden">Orden de Trabajo</option>
                  <option value="equipo">Equipo</option>
                </select>
              </div>

              {form.entidad_tipo && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Seleccionar {form.entidad_tipo === 'cliente' ? 'Cliente' : 
                                form.entidad_tipo === 'orden' ? 'Orden' : 'Equipo'}
                  </label>
                  <select
                    value={form.entidad_id}
                    onChange={(e) => handleInputChange('entidad_id', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.entidad_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar...</option>
                    {filteredEntidades.map((entidad) => (
                      <option key={`${entidad.tipo}-${entidad.id}`} value={entidad.id}>
                        {entidad.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.entidad_id && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.entidad_id}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>{isEditing ? 'Actualizar' : 'Subir'} Documento</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 