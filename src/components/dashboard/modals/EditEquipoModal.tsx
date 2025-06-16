'use client';

import { useState } from 'react';
import { X, Save, HardDrive, User, Cpu } from 'lucide-react';
import { useDashboardStore } from '@/lib/stores/dashboard-store';

interface Equipo {
  id: number;
  codigo_interno: string;
  tipo: string;
  marca: string;
  modelo: string;
  numero_serie?: string;
  descripcion?: string;
  estado: 'disponible' | 'en_reparacion' | 'reparado' | 'dado_baja' | 'en_garantia';
  especificaciones_tecnicas?: {
    procesador?: string;
    memoria_ram?: string;
    almacenamiento?: string;
    pantalla?: string;
  };
  propietario_actual?: {
    cliente_id: number;
    cliente_nombre: string;
    cliente_rut: string;
    fecha_inicio: string;
  };
}

const tiposEquipo = [
  'Laptop',
  'Smartphone', 
  'PC Desktop',
  'Tablet',
  'Consola',
  'Smart TV',
  'Impresora',
  'Monitor',
  'Router',
  'Otro'
];

const estadosEquipo = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'en_reparacion', label: 'En Reparación' },
  { value: 'reparado', label: 'Reparado' },
  { value: 'en_garantia', label: 'En Garantía' },
  { value: 'dado_baja', label: 'Dado de Baja' }
];

const mockClientes = [
  { id: 1, nombre: 'Juan Pérez González', rut: '12345678-9' },
  { id: 2, nombre: 'María González Silva', rut: '98765432-1' },
  { id: 3, nombre: 'Carlos Rodríguez López', rut: '11223344-5' },
  { id: 4, nombre: 'Ana Silva Martínez', rut: '55667788-9' },
  { id: 5, nombre: 'Pedro Morales Castro', rut: '99887766-5' }
];

export function EditEquipoModal() {
  const { activeModal, modalData, closeModal } = useDashboardStore();
  const isOpen = activeModal === 'edit-equipo' || activeModal === 'create-equipo';
  const isEditing = activeModal === 'edit-equipo';
  const equipo = modalData as Equipo;

  const [formData, setFormData] = useState({
    codigo_interno: equipo?.codigo_interno || '',
    tipo: equipo?.tipo || '',
    marca: equipo?.marca || '',
    modelo: equipo?.modelo || '',
    numero_serie: equipo?.numero_serie || '',
    descripcion: equipo?.descripcion || '',
    estado: equipo?.estado || 'disponible',
    cliente_id: equipo?.propietario_actual?.cliente_id?.toString() || '',
    procesador: equipo?.especificaciones_tecnicas?.procesador || '',
    memoria_ram: equipo?.especificaciones_tecnicas?.memoria_ram || '',
    almacenamiento: equipo?.especificaciones_tecnicas?.almacenamiento || '',
    pantalla: equipo?.especificaciones_tecnicas?.pantalla || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.tipo.trim()) {
      newErrors.tipo = 'El tipo de equipo es requerido';
    }
    if (!formData.marca.trim()) {
      newErrors.marca = 'La marca es requerida';
    }
    if (!formData.modelo.trim()) {
      newErrors.modelo = 'El modelo es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    console.log('Datos del equipo:', formData);
    alert(isEditing ? 'Equipo actualizado exitosamente' : 'Equipo registrado exitosamente');
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <HardDrive className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}
              </h2>
              <p className="text-gray-600">
                {isEditing ? 'Modifica la información del equipo' : 'Completa los datos del nuevo equipo'}
              </p>
            </div>
          </div>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <HardDrive className="w-5 h-5 mr-2 text-gray-600" />
              Información Básica
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código Interno</label>
                <input
                  type="text"
                  value={formData.codigo_interno}
                  onChange={(e) => handleInputChange('codigo_interno', e.target.value)}
                  placeholder="Se genera automáticamente si se deja vacío"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Equipo *</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.tipo ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposEquipo.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                {errors.tipo && <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
                <input
                  type="text"
                  value={formData.marca}
                  onChange={(e) => handleInputChange('marca', e.target.value)}
                  placeholder="Ej: HP, Samsung, Apple"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.marca ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.marca && <p className="text-red-500 text-xs mt-1">{errors.marca}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
                <input
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => handleInputChange('modelo', e.target.value)}
                  placeholder="Ej: Pavilion 15, Galaxy S21"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.modelo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.modelo && <p className="text-red-500 text-xs mt-1">{errors.modelo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Serie</label>
                <input
                  type="text"
                  value={formData.numero_serie}
                  onChange={(e) => handleInputChange('numero_serie', e.target.value)}
                  placeholder="Número de serie del fabricante"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {estadosEquipo.map(estado => (
                    <option key={estado.value} value={estado.value}>{estado.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                placeholder="Descripción adicional del equipo"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-gray-600" />
              Asignación de Propietario
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente Propietario</label>
              <select
                value={formData.cliente_id}
                onChange={(e) => handleInputChange('cliente_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Sin propietario asignado</option>
                {mockClientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} - {cliente.rut}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Cpu className="w-5 h-5 mr-2 text-gray-600" />
              Especificaciones Técnicas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Procesador</label>
                <input
                  type="text"
                  value={formData.procesador}
                  onChange={(e) => handleInputChange('procesador', e.target.value)}
                  placeholder="Ej: Intel Core i7, AMD Ryzen 5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Memoria RAM</label>
                <input
                  type="text"
                  value={formData.memoria_ram}
                  onChange={(e) => handleInputChange('memoria_ram', e.target.value)}
                  placeholder="Ej: 8GB DDR4, 16GB"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Almacenamiento</label>
                <input
                  type="text"
                  value={formData.almacenamiento}
                  onChange={(e) => handleInputChange('almacenamiento', e.target.value)}
                  placeholder="Ej: 256GB SSD, 1TB HDD"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pantalla</label>
                <input
                  type="text"
                  value={formData.pantalla}
                  onChange={(e) => handleInputChange('pantalla', e.target.value)}
                  placeholder="Ej: 15.6 pulgadas Full HD"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

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
              <span>{isEditing ? 'Actualizar Equipo' : 'Registrar Equipo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 