'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useDashboardStore } from '@/lib/stores/dashboard-store';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { clienteService, Cliente } from '@/lib/services/clienteService';
import toast from 'react-hot-toast';

interface ClienteData {
  id?: number;
  rut: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  telefono: string;
  email?: string;
  whatsapp: boolean;
  created_at?: string;
  updated_at?: string;
  totalOrdenes?: number;
  total_ordenes?: number;
  total_servicios?: number;
}

export function DeleteClienteModal() {
  const { activeModal, modalData, closeModal } = useDashboardStore();
  const isOpen = activeModal === 'delete-cliente';
  const cliente = modalData as ClienteData | null;
  const [isDeleting, setIsDeleting] = useState(false);
  
  if (!isOpen || !cliente) return null;

  // Get display name (handle both old and new format)
  const displayName = cliente.nombre || `${cliente.nombre} ${cliente.apellido_paterno}${cliente.apellido_materno ? ' ' + cliente.apellido_materno : ''}`;
  
  const handleDelete = async () => {
    if (!cliente.id) {
      toast.error('Error: ID de cliente no válido');
      return;
    }

    setIsDeleting(true);
    
    try {
      const response = await clienteService.deleteCliente(cliente.id);
      
      if (response.success) {
        toast.success(`Cliente ${displayName} eliminado correctamente`);
        closeModal();
        // Trigger a refresh of the clients list
        window.dispatchEvent(new CustomEvent('clienteUpdated'));
      } else {
        // Manejar diferentes tipos de errores
        const errorMessage = response.error || 'Error al eliminar el cliente';
        
        if (errorMessage.includes('órdenes') || errorMessage.includes('servicios') || errorMessage.includes('dependencias')) {
          toast.error(`No se puede eliminar: ${errorMessage}`, {
            duration: 5000,
            icon: '⚠️'
          });
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error deleting cliente:', error);
      toast.error('Error de conexión al eliminar el cliente');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Eliminar Cliente"
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
            ¿Estás seguro de eliminar este cliente?
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-700">
              <p className="font-medium">{displayName}</p>
              <p className="text-gray-600">RUT: {cliente.rut}</p>
              {cliente.email && <p className="text-gray-600">Email: {cliente.email}</p>}
              <p className="text-gray-600">Teléfono: {cliente.telefono}</p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-medium mb-1">Esta acción no se puede deshacer</p>
                <ul className="space-y-1 text-xs">
                  <li>• Se eliminará toda la información del cliente</li>
                  <li>• Se perderá el historial de órdenes asociadas</li>
                  <li>• Los equipos registrados quedarán sin propietario</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Client Stats */}
        {(cliente.totalOrdenes && cliente.totalOrdenes > 0) || (cliente.total_ordenes && cliente.total_ordenes > 0) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium">
                  Este cliente tiene {cliente.totalOrdenes || cliente.total_ordenes || 0} órdenes 
                  {cliente.total_servicios && cliente.total_servicios > 0 && ` y ${cliente.total_servicios} servicios`} registrados
                </p>
                <p className="text-xs mt-1">
                  La eliminación puede fallar si existen dependencias activas
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
                <span>Eliminar Cliente</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
} 