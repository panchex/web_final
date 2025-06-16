'use client';

import { 
  X, 
  Monitor,
  Smartphone,
  Laptop,
  Printer,
  Gamepad2,
  Tv,
  HardDrive,
  User,
  Calendar,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Download,
  Eye,
  Cpu,
  MemoryStick,
  Zap
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

interface Documento {
  id: number;
  tipo: string;
  nombre: string;
  descripcion?: string;
  fecha_subida: string;
  tamaño: string;
}

export function ViewEquipoModal() {
  const { activeModal, modalData, closeModal } = useDashboardStore();
  const isOpen = activeModal === 'view-equipo';
  const equipo = modalData as Equipo;

  if (!isOpen || !equipo) return null;

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to get status info
  const getStatusInfo = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return { color: 'text-green-600 bg-green-100', icon: CheckCircle, label: 'Disponible' };
      case 'en_reparacion':
        return { color: 'text-blue-600 bg-blue-100', icon: Settings, label: 'En Reparación' };
      case 'reparado':
        return { color: 'text-emerald-600 bg-emerald-100', icon: CheckCircle, label: 'Reparado' };
      case 'en_garantia':
        return { color: 'text-purple-600 bg-purple-100', icon: Clock, label: 'En Garantía' };
      case 'dado_baja':
        return { color: 'text-red-600 bg-red-100', icon: XCircle, label: 'Dado de Baja' };
      default:
        return { color: 'text-gray-600 bg-gray-100', icon: AlertCircle, label: 'Desconocido' };
    }
  };

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

  const statusInfo = getStatusInfo(equipo.estado);
  const TypeIcon = getTypeIcon(equipo.tipo);
  const StatusIcon = statusInfo.icon;

  // Mock documents for demonstration
  const documentos: Documento[] = equipo.id === 1 ? [
    {
      id: 1,
      tipo: 'imagen',
      nombre: 'estado_inicial.jpg',
      descripcion: 'Foto del estado inicial del equipo',
      fecha_subida: '2024-05-15T10:30:00Z',
      tamaño: '2.4 MB'
    },
    {
      id: 2,
      tipo: 'manual',
      nombre: 'manual_hp_pavilion.pdf',
      descripcion: 'Manual de usuario oficial',
      fecha_subida: '2024-05-15T10:35:00Z',
      tamaño: '8.7 MB'
    }
  ] : equipo.id === 6 ? [
    {
      id: 3,
      tipo: 'imagen',
      nombre: 'problema_pantalla.jpg',
      descripcion: 'Foto del problema en la pantalla',
      fecha_subida: '2024-06-06T10:30:00Z',
      tamaño: '1.8 MB'
    }
  ] : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <TypeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{equipo.codigo_interno}</h2>
              <p className="text-gray-600">{equipo.marca} {equipo.modelo}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
              <StatusIcon className="w-4 h-4 mr-1" />
              {statusInfo.label}
            </span>
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Equipment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <HardDrive className="w-5 h-5 mr-2 text-gray-600" />
                Información del Equipo
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Tipo:</span>
                  <span className="text-sm text-gray-900">{equipo.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Marca:</span>
                  <span className="text-sm text-gray-900">{equipo.marca}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Modelo:</span>
                  <span className="text-sm text-gray-900">{equipo.modelo}</span>
                </div>
                {equipo.numero_serie && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">N° Serie:</span>
                    <span className="text-sm text-gray-900 font-mono">{equipo.numero_serie}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Estado:</span>
                  <span className={`text-sm font-medium ${statusInfo.color.split(' ')[0]}`}>
                    {statusInfo.label}
                  </span>
                </div>
                {equipo.descripcion && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Descripción:</span>
                    <p className="text-sm text-gray-900 mt-1">{equipo.descripcion}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Owner Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-600" />
                Propietario Actual
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {equipo.propietario_actual ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Nombre:</span>
                      <span className="text-sm text-gray-900">{equipo.propietario_actual.cliente_nombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">RUT:</span>
                      <span className="text-sm text-gray-900 font-mono">{equipo.propietario_actual.cliente_rut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Desde:</span>
                      <span className="text-sm text-gray-900">{formatDate(equipo.propietario_actual.fecha_inicio)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Sin propietario asignado</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          {equipo.especificaciones_tecnicas && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-gray-600" />
                Especificaciones Técnicas
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {equipo.especificaciones_tecnicas.procesador && (
                    <div className="flex items-center space-x-3">
                      <Cpu className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="text-xs font-medium text-gray-600">Procesador</span>
                        <p className="text-sm text-gray-900">{equipo.especificaciones_tecnicas.procesador}</p>
                      </div>
                    </div>
                  )}
                  {equipo.especificaciones_tecnicas.memoria_ram && (
                    <div className="flex items-center space-x-3">
                      <MemoryStick className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="text-xs font-medium text-gray-600">Memoria RAM</span>
                        <p className="text-sm text-gray-900">{equipo.especificaciones_tecnicas.memoria_ram}</p>
                      </div>
                    </div>
                  )}
                  {equipo.especificaciones_tecnicas.almacenamiento && (
                    <div className="flex items-center space-x-3">
                      <HardDrive className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="text-xs font-medium text-gray-600">Almacenamiento</span>
                        <p className="text-sm text-gray-900">{equipo.especificaciones_tecnicas.almacenamiento}</p>
                      </div>
                    </div>
                  )}
                  {equipo.especificaciones_tecnicas.pantalla && (
                    <div className="flex items-center space-x-3">
                      <Monitor className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="text-xs font-medium text-gray-600">Pantalla</span>
                        <p className="text-sm text-gray-900">{equipo.especificaciones_tecnicas.pantalla}</p>
                      </div>
                    </div>
                  )}
                </div>
                {equipo.especificaciones_tecnicas.otros && equipo.especificaciones_tecnicas.otros.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-xs font-medium text-gray-600">Características adicionales</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {equipo.especificaciones_tecnicas.otros.map((caracteristica, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          {caracteristica}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Service History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-gray-600" />
                Historial de Servicio
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Órdenes totales:</span>
                  <span className="text-sm text-gray-900">{equipo.historial_ordenes || 0}</span>
                </div>
                {equipo.ultima_orden && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Último servicio:</span>
                    <span className="text-sm text-gray-900">{formatDate(equipo.ultima_orden)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Registrado:</span>
                  <span className="text-sm text-gray-900">{formatDate(equipo.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Actualizado:</span>
                  <span className="text-sm text-gray-900">{formatDate(equipo.updated_at)}</span>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                Resumen
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-blue-600">{equipo.id}</div>
                  <div className="text-xs text-blue-600">ID Equipo</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-600">
                    {Math.floor((new Date().getTime() - new Date(equipo.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-xs text-green-600">Días registrado</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-purple-600">{equipo.historial_ordenes || 0}</div>
                  <div className="text-xs text-purple-600">Servicios</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {equipo.propietario_actual ? 
                      Math.floor((new Date().getTime() - new Date(equipo.propietario_actual.fecha_inicio).getTime()) / (1000 * 60 * 60 * 24))
                      : 0
                    }
                  </div>
                  <div className="text-xs text-orange-600">Días con propietario</div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          {documentos.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-600" />
                Documentos Asociados ({documentos.length})
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documentos.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">{doc.nombre}</span>
                          </div>
                          {doc.descripcion && (
                            <p className="text-xs text-gray-600 mt-1">{doc.descripcion}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Tipo: {doc.tipo}</span>
                            <span>Tamaño: {doc.tamaño}</span>
                            <span>{formatDate(doc.fecha_subida)}</span>
                          </div>
                        </div>
                        <div className="flex space-x-1 ml-2">
                          <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}