'use client';

import { Modal } from '@/components/ui/Modal';
import { useDashboardStore } from '@/lib/stores/dashboard-store';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  ClipboardList,
  Clock,
  MessageCircle,
  Settings,
  Wrench,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface Orden {
  id: number;
  numero: string;
  equipo: string;
  problema: string;
  estado: 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';
  fecha_ingreso: string;
  fecha_entrega?: string;
  total: number;
}

interface Servicio {
  id: number;
  tipo: string;
  descripcion: string;
  estado: 'activo' | 'pausado' | 'completado';
  fecha_inicio: string;
  proximo_mantenimiento?: string;
}

interface ClienteData {
  id: number;
  nombre: string;
  rut: string;
  telefono: string;
  email?: string;
  whatsapp?: boolean;
  ultimaVisita: string;
  totalOrdenes: number;
  totalServicios?: number;
  estado: 'activo' | 'inactivo';
}

// Mock data para órdenes y servicios por cliente
const getClienteOrdenes = (clienteId: number): Orden[] => {
  const ordenesMock: Record<number, Orden[]> = {
    1: [
      {
        id: 1,
        numero: 'ORD-2024-001',
        equipo: 'Laptop HP Pavilion',
        problema: 'No enciende, posible problema en fuente',
        estado: 'completada',
        fecha_ingreso: '2024-06-01',
        fecha_entrega: '2024-06-03',
        total: 45000
      },
      {
        id: 2,
        numero: 'ORD-2024-015',
        equipo: 'Smartphone Samsung Galaxy',
        problema: 'Pantalla rota',
        estado: 'en_proceso',
        fecha_ingreso: '2024-06-08',
        total: 35000
      }
    ],
    2: [
      {
        id: 3,
        numero: 'ORD-2024-003',
        equipo: 'PC Desktop',
        problema: 'Lentitud general, posible virus',
        estado: 'completada',
        fecha_ingreso: '2024-05-20',
        fecha_entrega: '2024-05-22',
        total: 25000
      },
      {
        id: 4,
        numero: 'ORD-2024-008',
        equipo: 'Tablet iPad',
        problema: 'No carga la batería',
        estado: 'pendiente',
        fecha_ingreso: '2024-06-05',
        total: 55000
      }
    ],
    3: [
      {
        id: 5,
        numero: 'ORD-2024-012',
        equipo: 'Consola PlayStation',
        problema: 'No lee discos',
        estado: 'completada',
        fecha_ingreso: '2024-05-25',
        fecha_entrega: '2024-05-28',
        total: 40000
      }
    ],
    4: [
      {
        id: 6,
        numero: 'ORD-2024-020',
        equipo: 'Smart TV Samsung',
        problema: 'Pantalla con líneas',
        estado: 'en_proceso',
        fecha_ingreso: '2024-06-06',
        total: 120000
      }
    ],
    5: [
      {
        id: 7,
        numero: 'ORD-2024-005',
        equipo: 'Impresora Canon',
        problema: 'No imprime colores',
        estado: 'cancelada',
        fecha_ingreso: '2024-04-10',
        total: 0
      }
    ]
  };
  
  return ordenesMock[clienteId] || [];
};

const getClienteServicios = (clienteId: number): Servicio[] => {
  const serviciosMock: Record<number, Servicio[]> = {
    1: [
      {
        id: 1,
        tipo: 'Mantenimiento Preventivo',
        descripcion: 'Limpieza y mantenimiento mensual de equipos',
        estado: 'activo',
        fecha_inicio: '2024-01-15',
        proximo_mantenimiento: '2024-07-15'
      },
      {
        id: 2,
        tipo: 'Soporte Técnico',
        descripcion: 'Soporte remoto para problemas menores',
        estado: 'activo',
        fecha_inicio: '2024-03-01'
      }
    ],
    2: [
      {
        id: 3,
        tipo: 'Respaldo de Datos',
        descripcion: 'Respaldo automático semanal',
        estado: 'activo',
        fecha_inicio: '2024-02-10',
        proximo_mantenimiento: '2024-07-10'
      }
    ],
    3: [
      {
        id: 4,
        tipo: 'Garantía Extendida',
        descripcion: 'Garantía extendida por 12 meses',
        estado: 'activo',
        fecha_inicio: '2024-05-25'
      }
    ],
    5: [
      {
        id: 5,
        tipo: 'Consultoría IT',
        descripcion: 'Asesoría en compra de equipos',
        estado: 'completado',
        fecha_inicio: '2024-01-30'
      },
      {
        id: 6,
        tipo: 'Instalación de Software',
        descripcion: 'Instalación y configuración de programas',
        estado: 'completado',
        fecha_inicio: '2024-02-15'
      }
    ]
  };
  
  return serviciosMock[clienteId] || [];
};

export function ViewClienteModal() {
  const { activeModal, modalData, closeModal } = useDashboardStore();
  const isOpen = activeModal === 'view-cliente';
  const cliente = modalData as ClienteData | null;
  
  if (!isOpen || !cliente) return null;
  
  const ordenes = getClienteOrdenes(cliente.id);
  const servicios = getClienteServicios(cliente.id);
  
  const getOrdenStatusInfo = (estado: string) => {
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
  
  const getServicioStatusInfo = (estado: string) => {
    switch (estado) {
      case 'activo':
        return { color: 'text-green-600 bg-green-100', icon: CheckCircle, label: 'Activo' };
      case 'pausado':
        return { color: 'text-yellow-600 bg-yellow-100', icon: Clock, label: 'Pausado' };
      case 'completado':
        return { color: 'text-blue-600 bg-blue-100', icon: CheckCircle, label: 'Completado' };
      default:
        return { color: 'text-gray-600 bg-gray-100', icon: AlertCircle, label: 'Desconocido' };
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Detalles del Cliente"
      size="xl"
    >
      <div className="space-y-6">
        {/* Client Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">
                {cliente.nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {cliente.nombre}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  cliente.estado === 'activo' 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {cliente.estado}
                </span>
                
                {cliente.whatsapp && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    WhatsApp
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Contact Info - Right Side */}
          <div className="text-left space-y-2">
            <div className="text-sm">
              <span className="font-medium text-gray-900">RUT:</span>
              <span className="ml-2 text-gray-600">{cliente.rut}</span>
            </div>
            
            <div className="text-sm">
              <span className="font-medium text-gray-900">Teléfono:</span>
              <div className="inline-flex items-center ml-2">
                <span className="text-gray-600">{cliente.telefono}</span>
                {cliente.whatsapp && (
                  <button
                    onClick={() => window.open(`https://wa.me/${cliente.telefono.replace(/[^\d]/g, '')}`, '_blank')}
                    className="ml-2 text-green-600 hover:text-green-700 transition-colors"
                    title="Contactar por WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {cliente.email ? (
              <div className="text-sm">
                <span className="font-medium text-gray-900">Email:</span>
                <span className="ml-2 text-gray-600">{cliente.email}</span>
              </div>
            ) : (
              <div className="text-sm">
                <span className="font-medium text-gray-500">Email:</span>
                <span className="ml-2 text-gray-400">No proporcionado</span>
              </div>
            )}
            
            <div className="text-sm">
              <span className="font-medium text-gray-900">Última visita:</span>
              <span className="ml-2 text-gray-600">{cliente.ultimaVisita}</span>
            </div>
          </div>
        </div>
        
        {/* Estadísticas Minimalistas */}
        <div className="grid grid-cols-4 gap-4 py-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{ordenes.length}</div>
            <div className="text-xs text-gray-600">Órdenes</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{servicios.length}</div>
            <div className="text-xs text-gray-600">Servicios</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {ordenes.filter(o => o.estado === 'completada').length}
            </div>
            <div className="text-xs text-gray-600">Completadas</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {servicios.filter(s => s.estado === 'activo').length}
            </div>
            <div className="text-xs text-gray-600">Activos</div>
          </div>
        </div>
        
        {/* Órdenes y Servicios en 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Órdenes de Trabajo */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
              Órdenes de Trabajo ({ordenes.length})
            </h4>
            
            {ordenes.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 text-center">
                  No hay órdenes registradas
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {ordenes.map((orden) => {
                  const statusInfo = getOrdenStatusInfo(orden.estado);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div key={orden.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h5 className="font-medium text-gray-900 text-sm">{orden.numero}</h5>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Equipo:</strong> {orden.equipo}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Problema:</strong> {orden.problema}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Servicios Contratados */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
              Servicios Contratados ({servicios.length})
            </h4>
            
            {servicios.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 text-center">
                  No hay servicios contratados
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {servicios.map((servicio) => {
                  const statusInfo = getServicioStatusInfo(servicio.estado);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div key={servicio.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h5 className="font-medium text-gray-900 text-sm">{servicio.tipo}</h5>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{servicio.descripcion}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          
          <button
            onClick={() => {
              closeModal();
              // TODO: Open edit modal
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Editar Cliente
          </button>
        </div>
      </div>
    </Modal>
  );
} 