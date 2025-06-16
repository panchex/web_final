'use client';

import { 
  X, 
  Trash2, 
  AlertTriangle,
  Monitor,
  Smartphone,
  Laptop,
  Printer,
  Gamepad2,
  Tv,
  HardDrive,
  User,
  Settings,
  FileText,
  AlertCircle
} from 'lucide-react';
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
    otros?: string[];
  };
  propietario_actual?: {
    cliente_id: number;
    cliente_nombre: string;
    cliente_rut: string;
    fecha_inicio: string;
  };
  historial_ordenes?: number;
  ultima_orden?: string;
  created_at: string;
  updated_at: string;
}

export function DeleteEquipoModal() {
  const { activeModal, modalData, closeModal } = useDashboardStore();
  const isOpen = activeModal === 'delete-equipo';
  const equipo = modalData as Equipo;

  if (!isOpen || !equipo) return null;

  // Helper function to get type icon
  const getTypeIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'laptop':
        return Laptop;
      case 'smartphone':
        return Smartphone;
      case 'pc desktop':
        return Monitor;
      case 'tablet':
        return Smartphone;
      case 'consola':
        return Gamepad2;
      case 'smart tv':
        return Tv;
      case 'impresora':
        return Printer;
      case 'monitor':
        return Monitor;
      default:
        return HardDrive;
    }
  };

  // Validaciones de negocio
  const canDelete = equipo.estado !== 'en_reparacion';
  const hasActiveOrders = equipo.estado === 'en_reparacion';
  const hasOwner = !!equipo.propietario_actual;
  const hasHistory = (equipo.historial_ordenes || 0) > 0;
  
  // Mock documentos para demostración
  const documentCount = equipo.id === 1 ? 2 : equipo.id === 6 ? 1 : 0;

  const handleDelete = () => {
    if (!canDelete) return;
    
    // Aquí iría la lógica para eliminar el equipo
    console.log('Eliminando equipo:', equipo.id);
    
    // Simular éxito
    closeModal();
  };

  const TypeIcon = getTypeIcon(equipo.tipo);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Eliminar Equipo</h2>
              <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Equipment Info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <TypeIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{equipo.codigo_interno}</h3>
              <p className="text-sm text-gray-600">{equipo.marca} {equipo.modelo}</p>
              {equipo.numero_serie && (
                <p className="text-xs text-gray-500 font-mono">S/N: {equipo.numero_serie}</p>
              )}
            </div>
          </div>

          {/* Validation Messages */}
          {!canDelete && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">No se puede eliminar</h4>
                  <div className="mt-2 space-y-1">
                    {hasActiveOrders && (
                      <p className="text-sm text-red-700 flex items-center">
                        <Settings className="w-4 h-4 mr-1" />
                        El equipo tiene órdenes de trabajo activas
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-red-600 mt-2">
                    Cambia el estado del equipo antes de eliminarlo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {canDelete && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Información que se eliminará</h4>
                  <div className="mt-2 space-y-1 text-sm text-yellow-700">
                    <p>• Información básica del equipo</p>
                    <p>• Especificaciones técnicas</p>
                    {hasOwner && (
                      <p className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        Historial de propietarios
                      </p>
                    )}
                    {hasHistory && (
                      <p className="flex items-center">
                        <Settings className="w-4 h-4 mr-1" />
                        Historial de {equipo.historial_ordenes} órdenes de trabajo
                      </p>
                    )}
                    {documentCount > 0 && (
                      <p className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {documentCount} documento{documentCount > 1 ? 's' : ''} asociado{documentCount > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warning Message */}
          {canDelete && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">¿Estás seguro?</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Esta acción eliminará permanentemente el equipo <strong>{equipo.codigo_interno}</strong> y toda su información asociada.
                  </p>
                  <p className="text-xs text-red-600 mt-2">
                    Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Equipment Details Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Resumen del equipo</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600">Estado:</span>
                <span className="ml-1 font-medium">{
                  equipo.estado === 'disponible' ? 'Disponible' :
                  equipo.estado === 'en_reparacion' ? 'En Reparación' :
                  equipo.estado === 'reparado' ? 'Reparado' :
                  equipo.estado === 'en_garantia' ? 'En Garantía' :
                  'Dado de Baja'
                }</span>
              </div>
              <div>
                <span className="text-gray-600">Órdenes:</span>
                <span className="ml-1 font-medium">{equipo.historial_ordenes || 0}</span>
              </div>
              {hasOwner && (
                <div className="col-span-2">
                  <span className="text-gray-600">Propietario:</span>
                  <span className="ml-1 font-medium">{equipo.propietario_actual?.cliente_nombre}</span>
                </div>
              )}
              {documentCount > 0 && (
                <div>
                  <span className="text-gray-600">Documentos:</span>
                  <span className="ml-1 font-medium">{documentCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={!canDelete}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              canDelete
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar Equipo</span>
          </button>
        </div>
      </div>
    </div>
  );
} 