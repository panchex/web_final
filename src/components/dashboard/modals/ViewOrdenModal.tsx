'use client';

import { 
  X, 
  User, 
  Smartphone, 
  Calendar, 
  Clock, 
  DollarSign, 
  Wrench, 
  CheckCircle, 
  AlertCircle,
  XCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Download,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDashboardStore } from '@/lib/stores/dashboard-store';

interface Orden {
  id: number;
  numero: string;
  cliente_id: number;
  cliente_nombre: string;
  cliente_rut: string;
  equipo_tipo: string;
  equipo_marca: string;
  equipo_modelo: string;
  problema_reportado: string;
  diagnostico?: string;
  estado: 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  fecha_ingreso: string;
  fecha_estimada?: string;
  fecha_entrega?: string;
  costo_estimado?: number;
  costo_final?: number;
  tecnico_asignado?: string;
  documentos?: Array<{
    id: number;
    tipo_documento: string;
    nombre_archivo: string;
    descripcion: string;
    fecha_subida: string;
  }>;
}

export function ViewOrdenModal() {
  const { activeModal, modalData, closeModal } = useDashboardStore();
  const isOpen = activeModal === 'view-orden';
  const orden = modalData as Orden;

  if (!isOpen || !orden) return null;

  // Helper function to format RUT
  const formatRUT = (rut: string) => {
    const cleanRUT = rut.replace(/[.-]/g, '');
    if (cleanRUT.length === 9) {
      return `${cleanRUT.slice(0, 2)}.${cleanRUT.slice(2, 5)}.${cleanRUT.slice(5, 8)}-${cleanRUT.slice(8)}`;
    }
    return rut;
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Helper function to get status info
  const getStatusInfo = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return { color: 'text-yellow-600 bg-yellow-100', icon: Clock, label: 'Pendiente' };
      case 'en_proceso':
        return { color: 'text-blue-600 bg-blue-100', icon: Wrench, label: 'En Proceso' };
      case 'completada':
        return { color: 'text-green-600 bg-green-100', icon: CheckCircle, label: 'Completada' };
      case 'cancelada':
        return { color: 'text-red-600 bg-red-100', icon: XCircle, label: 'Cancelada' };
      default:
        return { color: 'text-gray-600 bg-gray-100', icon: AlertCircle, label: 'Desconocido' };
    }
  };

  // Helper function to get priority info
  const getPriorityInfo = (prioridad: string) => {
    switch (prioridad) {
      case 'baja':
        return { color: 'text-gray-600 bg-gray-100', label: 'Baja' };
      case 'media':
        return { color: 'text-blue-600 bg-blue-100', label: 'Media' };
      case 'alta':
        return { color: 'text-orange-600 bg-orange-100', label: 'Alta' };
      case 'urgente':
        return { color: 'text-red-600 bg-red-100', label: 'Urgente' };
      default:
        return { color: 'text-gray-600 bg-gray-100', label: 'Sin prioridad' };
    }
  };

  const statusInfo = getStatusInfo(orden.estado);
  const priorityInfo = getPriorityInfo(orden.prioridad);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{orden.numero}</h2>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusInfo.label}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${priorityInfo.color}`}>
                  {priorityInfo.label}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Client and Equipment Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Client Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Información del Cliente
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="text-gray-900">{orden.cliente_nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">RUT</label>
                  <p className="text-gray-900">{formatRUT(orden.cliente_rut)}</p>
                </div>
              </div>
            </div>

            {/* Equipment Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Smartphone className="w-5 h-5 mr-2 text-green-600" />
                Información del Equipo
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <p className="text-gray-900">{orden.equipo_tipo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Marca y Modelo</label>
                  <p className="text-gray-900">{orden.equipo_marca} {orden.equipo_modelo}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Problem and Diagnosis */}
          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                Problema Reportado
              </h3>
              <p className="text-gray-700">{orden.problema_reportado}</p>
            </div>

            {orden.diagnostico && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Wrench className="w-5 h-5 mr-2 text-blue-600" />
                  Diagnóstico
                </h3>
                <p className="text-gray-700">{orden.diagnostico}</p>
              </div>
            )}
          </div>

          {/* Timeline and Costs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Timeline */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                Timeline
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de Ingreso</label>
                  <p className="text-gray-900">{formatDate(orden.fecha_ingreso)}</p>
                </div>
                {orden.fecha_estimada && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Fecha Estimada</label>
                    <p className="text-gray-900">{formatDate(orden.fecha_estimada)}</p>
                  </div>
                )}
                {orden.fecha_entrega && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Fecha de Entrega</label>
                    <p className="text-gray-900">{formatDate(orden.fecha_entrega)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Costs */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Costos
              </h3>
              <div className="space-y-3">
                {orden.costo_estimado && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Costo Estimado</label>
                    <p className="text-gray-900 font-semibold">{formatCurrency(orden.costo_estimado)}</p>
                  </div>
                )}
                {orden.costo_final && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Costo Final</label>
                    <p className="text-gray-900 font-semibold text-green-600">{formatCurrency(orden.costo_final)}</p>
                  </div>
                )}
                {!orden.costo_estimado && !orden.costo_final && (
                  <p className="text-gray-500 italic">Sin costos definidos</p>
                )}
              </div>
            </div>
          </div>

          {/* Technician */}
          {orden.tecnico_asignado && (
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Técnico Asignado
              </h3>
              <p className="text-gray-700 font-medium">{orden.tecnico_asignado}</p>
            </div>
          )}

          {/* Documents */}
          {orden.documentos && orden.documentos.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-600" />
                Documentos Asociados ({orden.documentos.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orden.documentos.map((doc, index) => (
                  <div key={doc.id || index} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {doc.nombre_archivo}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>Tipo: {doc.tipo_documento}</p>
                          {doc.descripcion && <p>Descripción: {doc.descripcion}</p>}
                          <p>Subido: {formatDate(doc.fecha_subida)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={() => {
                            // Simular descarga
                            toast.success('Descargando documento...');
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Descargar"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            // Simular vista previa
                            toast.success('Abriendo vista previa...');
                          }}
                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                          title="Ver"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">#{orden.id}</div>
              <div className="text-sm text-gray-600">ID Orden</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {orden.fecha_ingreso ? 
                  Math.ceil((new Date().getTime() - new Date(orden.fecha_ingreso).getTime()) / (1000 * 3600 * 24))
                  : 0
                }
              </div>
              <div className="text-sm text-gray-600">Días Transcurridos</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {orden.costo_final || orden.costo_estimado ? 
                  formatCurrency(orden.costo_final || orden.costo_estimado || 0).replace('$', '$').slice(0, -3) + 'K'
                  : '$0'
                }
              </div>
              <div className="text-sm text-gray-600">Valor</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {orden.estado === 'completada' ? '100%' : 
                 orden.estado === 'en_proceso' ? '50%' : 
                 orden.estado === 'cancelada' ? '0%' : '25%'}
              </div>
              <div className="text-sm text-gray-600">Progreso</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              closeModal();
              // Aquí se podría abrir el modal de edición
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Editar Orden
          </button>
        </div>
      </div>
    </div>
  );
} 