'use client';

import { useDashboardStore } from '@/lib/stores/dashboard-store';
import { ViewClienteModal } from './ViewClienteModal';
import { EditClienteModal } from './EditClienteModal';
import { DeleteClienteModal } from './DeleteClienteModal';
import { ViewOrdenModal } from './ViewOrdenModal';
import { EditOrdenModal } from './EditOrdenModal';
import { DeleteOrdenModal } from './DeleteOrdenModal';
import { ViewEquipoModal } from './ViewEquipoModal';
import { EditEquipoModal } from './EditEquipoModal';
import { DeleteEquipoModal } from './DeleteEquipoModal';
import { ViewProductoModal } from './ViewProductoModal';
import { EditProductoModal } from './EditProductoModal';
import { ViewServicioModal } from './ViewServicioModal';
import { EditServicioModal } from './EditServicioModal';
import { ViewDocumentoModal } from './ViewDocumentoModal';
import { EditDocumentoModal } from './EditDocumentoModal';
import { DeleteDocumentoModal } from './DeleteDocumentoModal';

// Temporary modal for order operations that aren't implemented yet
function TemporaryModal({ title, message }: { title: string; message: string }) {
  const { closeModal } = useDashboardStore();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ModalManager() {
  const { activeModal } = useDashboardStore();

  return (
    <>
      {activeModal === 'view-cliente' && <ViewClienteModal />}
      {activeModal === 'edit-cliente' && <EditClienteModal />}
      {activeModal === 'create-cliente' && <EditClienteModal />}
      {activeModal === 'delete-cliente' && <DeleteClienteModal />}
      {activeModal === 'view-orden' && <ViewOrdenModal />}
      {activeModal === 'edit-orden' && <EditOrdenModal />}
      {activeModal === 'create-orden' && <EditOrdenModal />}
      {activeModal === 'delete-orden' && <DeleteOrdenModal />}
      {activeModal === 'view-equipo' && <ViewEquipoModal />}
      {activeModal === 'edit-equipo' && <EditEquipoModal />}
      {activeModal === 'create-equipo' && <EditEquipoModal />}
      {activeModal === 'delete-equipo' && <DeleteEquipoModal />}

      {/* Modales de Inventario */}
      {activeModal === 'view-producto' && <ViewProductoModal />}
      {activeModal === 'edit-producto' && <EditProductoModal />}
      {activeModal === 'create-producto' && <EditProductoModal />}
      {activeModal === 'delete-producto' && <TemporaryModal title="Eliminar Producto" message="El modal de eliminación de productos estará disponible próximamente." />}

      {/* Modales de Servicios */}
      {activeModal === 'view-servicio' && <ViewServicioModal />}
      {activeModal === 'edit-servicio' && <EditServicioModal />}
      {activeModal === 'create-servicio' && <EditServicioModal />}
      {activeModal === 'delete-servicio' && <TemporaryModal title="Eliminar Servicio" message="El modal de eliminación de servicios estará disponible próximamente." />}

      {/* Modales de Documentos */}
      {activeModal === 'view-documento' && <ViewDocumentoModal />}
      {activeModal === 'edit-documento' && <EditDocumentoModal />}
      {activeModal === 'create-documento' && <EditDocumentoModal />}
      {activeModal === 'delete-documento' && <DeleteDocumentoModal />}
    </>
  );
} 