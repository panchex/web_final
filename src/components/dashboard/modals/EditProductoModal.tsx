'use client';

import { useState } from 'react';
import { X, Save, Package } from 'lucide-react';
import { useDashboardStore } from '@/lib/stores/dashboard-store';

interface ProductoInventario {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: 'repuesto' | 'accesorio' | 'herramienta' | 'consumible' | 'otro';
  marca?: string;
  modelo?: string;
  stock_actual: number;
  stock_minimo: number;
  stock_maximo: number;
  precio_compra: number;
  precio_venta: number;
  proveedor?: string;
  ubicacion?: string;
  estado: 'disponible' | 'agotado' | 'descontinuado' | 'reservado';
}

const categorias = [
  { value: 'repuesto', label: 'Repuesto' },
  { value: 'accesorio', label: 'Accesorio' },
  { value: 'herramienta', label: 'Herramienta' },
  { value: 'consumible', label: 'Consumible' },
  { value: 'otro', label: 'Otro' }
];

const estados = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'agotado', label: 'Agotado' },
  { value: 'descontinuado', label: 'Descontinuado' },
  { value: 'reservado', label: 'Reservado' }
];

export function EditProductoModal() {
  const { activeModal, modalData, closeModal } = useDashboardStore();
  const isOpen = activeModal === 'edit-producto' || activeModal === 'create-producto';
  const isEditing = activeModal === 'edit-producto';
  const producto = modalData as ProductoInventario;

  const [formData, setFormData] = useState({
    codigo: producto?.codigo || '',
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    categoria: producto?.categoria || 'repuesto',
    marca: producto?.marca || '',
    modelo: producto?.modelo || '',
    stock_actual: producto?.stock_actual || 0,
    stock_minimo: producto?.stock_minimo || 1,
    stock_maximo: producto?.stock_maximo || 100,
    precio_compra: producto?.precio_compra || 0,
    precio_venta: producto?.precio_venta || 0,
    proveedor: producto?.proveedor || '',
    ubicacion: producto?.ubicacion || '',
    estado: producto?.estado || 'disponible'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string | number) => {
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
    if (formData.precio_venta <= 0) {
      newErrors.precio_venta = 'El precio de venta debe ser mayor a 0';
    }
    if (formData.stock_minimo < 0) {
      newErrors.stock_minimo = 'El stock mínimo no puede ser negativo';
    }
    if (formData.stock_maximo <= formData.stock_minimo) {
      newErrors.stock_maximo = 'El stock máximo debe ser mayor al mínimo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    console.log('Datos del producto:', formData);
    alert(isEditing ? 'Producto actualizado exitosamente' : 'Producto registrado exitosamente');
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h2>
              <p className="text-gray-600">
                {isEditing ? 'Modifica la información del producto' : 'Completa los datos del nuevo producto'}
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
                  placeholder="Ej: REP-001, ACC-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  placeholder="Nombre del producto"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {estados.map(estado => (
                    <option key={estado.value} value={estado.value}>{estado.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <input
                  type="text"
                  value={formData.marca}
                  onChange={(e) => handleInputChange('marca', e.target.value)}
                  placeholder="Marca del producto"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <input
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => handleInputChange('modelo', e.target.value)}
                  placeholder="Modelo del producto"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                placeholder="Descripción detallada del producto"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Stock y Precios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Stock y Precios</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Actual</label>
                <input
                  type="number"
                  value={formData.stock_actual}
                  onChange={(e) => handleInputChange('stock_actual', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
                <input
                  type="number"
                  value={formData.stock_minimo}
                  onChange={(e) => handleInputChange('stock_minimo', parseInt(e.target.value) || 0)}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.stock_minimo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.stock_minimo && <p className="text-red-500 text-xs mt-1">{errors.stock_minimo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Máximo</label>
                <input
                  type="number"
                  value={formData.stock_maximo}
                  onChange={(e) => handleInputChange('stock_maximo', parseInt(e.target.value) || 0)}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.stock_maximo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.stock_maximo && <p className="text-red-500 text-xs mt-1">{errors.stock_maximo}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio de Compra</label>
                <input
                  type="number"
                  value={formData.precio_compra}
                  onChange={(e) => handleInputChange('precio_compra', parseInt(e.target.value) || 0)}
                  min="0"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio de Venta *</label>
                <input
                  type="number"
                  value={formData.precio_venta}
                  onChange={(e) => handleInputChange('precio_venta', parseInt(e.target.value) || 0)}
                  min="1"
                  placeholder="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.precio_venta ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.precio_venta && <p className="text-red-500 text-xs mt-1">{errors.precio_venta}</p>}
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Información Adicional</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                <input
                  type="text"
                  value={formData.proveedor}
                  onChange={(e) => handleInputChange('proveedor', e.target.value)}
                  placeholder="Nombre del proveedor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                  placeholder="Ej: Estante A-1, Cajón B-2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
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
              <span>{isEditing ? 'Actualizar Producto' : 'Registrar Producto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 