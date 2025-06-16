'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useDashboardStore } from '@/lib/stores/dashboard-store';
import { AlertTriangle, Trash2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrdenData {
  id: number;
  numero: string;
  cliente_nombre: string;
  equipo_tipo: string;
  equipo_marca: string;
  equipo_modelo: string;
  estado: string;
  documentos?: any[];
}

export function DeleteOrdenModal() {
  const { activeModal, modalData, closeModal } = useDashboardStore();
  const isOpen = activeModal === 'delete-orden';
  const orden = modalData as OrdenData | null;
  const [isDeleting, setIsDeleting] = useState(false);
  
  if (!isOpen || !orden) return null;
  
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Orden ${orden.numero} eliminada correctamente`);
      closeModal();
    } catch {
      toast.error('Error al eliminar la orden');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const canDelete = orden.estado === 'pendiente';
  const hasDocuments = orden.documentos && orden.documentos.length > 0;
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Eliminar Orden"
      size="md"
    >
      <div className="space-y-6">
        {/* Warning Icon */}
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        {/* Warning Message */}
        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            ¿Estás seguro de eliminar esta orden?
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-700">
              <p className="font-medium">{orden.numero}</p>
              <p className="text-gray-600">Cliente: {orden.cliente_nombre}</p>
              <p className="text-gray-600">Equipo: {orden.equipo_marca} {orden.equipo_modelo}</p>
              <p className="text-gray-600">Estado: {orden.estado}</p>
            </div>
          </div>
          
          {!canDelete && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">No se puede eliminar esta orden</p>
                  <p>Solo las órdenes en estado "Pendiente" pueden ser eliminadas.</p>
                  <p className="mt-2">Para órdenes en proceso o completadas, considera cambiar el estado a "Cancelada".</p>
                </div>
              </div>
            </div>
          )}
          
          {canDelete && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">Esta acción no se puede deshacer</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Se eliminará toda la información de la orden</li>
                    <li>• Se perderá el historial de cambios</li>
                    <li>• Los productos asociados volverán al inventario</li>
                    {hasDocuments && <li>• Se eliminarán todos los documentos asociados</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Documents Warning */}
        {hasDocuments && canDelete && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-yellow-600" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium">
                  Esta orden tiene {orden.documentos?.length} documento(s) asociado(s)
                </p>
                <p className="text-xs mt-1">
                  Los archivos se eliminarán permanentemente del servidor
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={closeModal}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Eliminando...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar Orden</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
} 