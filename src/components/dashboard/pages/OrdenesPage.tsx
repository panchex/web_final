'use client';

import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Wrench,
  User
} from 'lucide-react';
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

const mockOrdenes: Orden[] = [
  {
    id: 1,
    numero: 'ORD-2024-001',
    cliente_id: 1,
    cliente_nombre: 'Juan Pérez González',
    cliente_rut: '12345678-9',
    equipo_tipo: 'Laptop',
    equipo_marca: 'HP',
    equipo_modelo: 'Pavilion 15',
    problema_reportado: 'No enciende, posible problema en fuente de poder',
    diagnostico: 'Fuente de poder dañada, requiere reemplazo',
    estado: 'completada',
    prioridad: 'media',
    fecha_ingreso: '2024-06-01',
    fecha_estimada: '2024-06-03',
    fecha_entrega: '2024-06-03',
    costo_estimado: 45000,
    costo_final: 45000,
    tecnico_asignado: 'Carlos Méndez',
    documentos: [
      {
        id: 1,
        tipo_documento: 'imagen',
        nombre_archivo: 'foto_equipo_antes.jpg',
        descripcion: 'Estado del equipo al ingreso',
        fecha_subida: '2024-06-01'
      },
      {
        id: 2,
        tipo_documento: 'factura',
        nombre_archivo: 'factura_repuesto.pdf',
        descripcion: 'Factura de compra de fuente de poder',
        fecha_subida: '2024-06-02'
      }
    ]
  },
  {
    id: 2,
    numero: 'ORD-2024-015',
    cliente_id: 1,
    cliente_nombre: 'Juan Pérez González',
    cliente_rut: '12345678-9',
    equipo_tipo: 'Smartphone',
    equipo_marca: 'Samsung',
    equipo_modelo: 'Galaxy S21',
    problema_reportado: 'Pantalla rota, táctil no responde',
    diagnostico: 'Pantalla y digitalizador dañados',
    estado: 'en_proceso',
    prioridad: 'alta',
    fecha_ingreso: '2024-06-08',
    fecha_estimada: '2024-06-12',
    costo_estimado: 85000,
    tecnico_asignado: 'Ana Silva',
    documentos: [
      {
        id: 3,
        tipo_documento: 'imagen',
        nombre_archivo: 'pantalla_rota.jpg',
        descripcion: 'Foto del daño en la pantalla',
        fecha_subida: '2024-06-08'
      }
    ]
  },
  {
    id: 3,
    numero: 'ORD-2024-003',
    cliente_id: 2,
    cliente_nombre: 'María González Silva',
    cliente_rut: '98765432-1',
    equipo_tipo: 'PC Desktop',
    equipo_marca: 'Custom',
    equipo_modelo: 'Gaming PC',
    problema_reportado: 'Lentitud general, posible virus',
    diagnostico: 'Malware detectado, disco duro fragmentado',
    estado: 'completada',
    prioridad: 'baja',
    fecha_ingreso: '2024-05-20',
    fecha_estimada: '2024-05-22',
    fecha_entrega: '2024-05-22',
    costo_estimado: 25000,
    costo_final: 25000,
    tecnico_asignado: 'Pedro Morales'
  },
  {
    id: 4,
    numero: 'ORD-2024-008',
    cliente_id: 2,
    cliente_nombre: 'María González Silva',
    cliente_rut: '98765432-1',
    equipo_tipo: 'Tablet',
    equipo_marca: 'Apple',
    equipo_modelo: 'iPad Air',
    problema_reportado: 'No carga la batería',
    estado: 'pendiente',
    prioridad: 'media',
    fecha_ingreso: '2024-06-05',
    fecha_estimada: '2024-06-10',
    costo_estimado: 55000
  },
  {
    id: 5,
    numero: 'ORD-2024-012',
    cliente_id: 3,
    cliente_nombre: 'Carlos Rodríguez López',
    cliente_rut: '11223344-5',
    equipo_tipo: 'Consola',
    equipo_marca: 'Sony',
    equipo_modelo: 'PlayStation 5',
    problema_reportado: 'No lee discos, hace ruido extraño',
    diagnostico: 'Lector de discos defectuoso',
    estado: 'completada',
    prioridad: 'media',
    fecha_ingreso: '2024-05-25',
    fecha_estimada: '2024-05-28',
    fecha_entrega: '2024-05-28',
    costo_estimado: 120000,
    costo_final: 115000,
    tecnico_asignado: 'Carlos Méndez'
  },
  {
    id: 6,
    numero: 'ORD-2024-020',
    cliente_id: 4,
    cliente_nombre: 'Ana Silva Martínez',
    cliente_rut: '55667788-9',
    equipo_tipo: 'Smart TV',
    equipo_marca: 'Samsung',
    equipo_modelo: '55" QLED',
    problema_reportado: 'Pantalla con líneas verticales',
    diagnostico: 'Panel LCD dañado',
    estado: 'en_proceso',
    prioridad: 'alta',
    fecha_ingreso: '2024-06-06',
    fecha_estimada: '2024-06-15',
    costo_estimado: 180000,
    tecnico_asignado: 'Ana Silva'
  },
  {
    id: 7,
    numero: 'ORD-2024-005',
    cliente_id: 5,
    cliente_nombre: 'Pedro Morales Castro',
    cliente_rut: '99887766-5',
    equipo_tipo: 'Impresora',
    equipo_marca: 'Canon',
    equipo_modelo: 'PIXMA G3110',
    problema_reportado: 'No imprime colores, solo negro',
    estado: 'cancelada',
    prioridad: 'baja',
    fecha_ingreso: '2024-04-10',
    fecha_estimada: '2024-04-15'
  },
  {
    id: 8,
    numero: 'ORD-2024-025',
    cliente_id: 3,
    cliente_nombre: 'Carlos Rodríguez López',
    cliente_rut: '11223344-5',
    equipo_tipo: 'Laptop',
    equipo_marca: 'Lenovo',
    equipo_modelo: 'ThinkPad X1',
    problema_reportado: 'Teclado no funciona, algunas teclas no responden',
    estado: 'pendiente',
    prioridad: 'urgente',
    fecha_ingreso: '2024-06-10',
    fecha_estimada: '2024-06-11',
    costo_estimado: 65000
  }
];

export function OrdenesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { openModal } = useDashboardStore();
  
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
  
  // Filter orders based on search term and status
  const filteredOrdenes = mockOrdenes.filter(orden => {
    const matchesSearch = orden.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
           orden.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           orden.cliente_rut.includes(searchTerm) ||
           orden.equipo_tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
           orden.equipo_marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
           orden.problema_reportado.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || orden.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleViewOrden = (orden: Orden) => {
    openModal('view-orden', orden);
  };
  
  const handleEditOrden = (orden: Orden) => {
    openModal('edit-orden', orden);
  };
  
  const handleDeleteOrden = (orden: Orden) => {
    openModal('delete-orden', orden);
  };
  
  const handleCreateOrden = () => {
    openModal('create-orden');
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Search Bar with Filters and New Order Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Search Input with New Order Button */}
        <div className="flex gap-4 items-start">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número, cliente, equipo o problema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <button
            onClick={handleCreateOrden}
            className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Orden</span>
          </button>
        </div>
        
        {/* Filter Bar */}
        <div className="mt-4 p-1 bg-gray-50 rounded-lg flex flex-wrap gap-1">
          <button
            onClick={() => setStatusFilter(null)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === null
                ? 'bg-white text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
            }`}
          >
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span>{mockOrdenes.length}</span>
            <span className="text-xs">Todas</span>
          </button>
          
          <button
            onClick={() => setStatusFilter('pendiente')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === 'pendiente'
                ? 'bg-white text-yellow-700 border border-yellow-200 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
            }`}
          >
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>{mockOrdenes.filter(o => o.estado === 'pendiente').length}</span>
            <span className="text-xs">Pendientes</span>
          </button>
          
          <button
            onClick={() => setStatusFilter('en_proceso')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === 'en_proceso'
                ? 'bg-white text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
            }`}
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>{mockOrdenes.filter(o => o.estado === 'en_proceso').length}</span>
            <span className="text-xs">En Proceso</span>
          </button>
          
          <button
            onClick={() => setStatusFilter('completada')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === 'completada'
                ? 'bg-white text-green-700 border border-green-200 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
            }`}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{mockOrdenes.filter(o => o.estado === 'completada').length}</span>
            <span className="text-xs">Completadas</span>
          </button>
          
          <button
            onClick={() => setStatusFilter('cancelada')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === 'cancelada'
                ? 'bg-white text-red-700 border border-red-200 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
            }`}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>{mockOrdenes.filter(o => o.estado === 'cancelada').length}</span>
            <span className="text-xs">Canceladas</span>
          </button>
        </div>
        
        {/* Results Info */}
        {(searchTerm || statusFilter) && (
          <div className="mt-4 text-sm text-gray-600">
            Mostrando {filteredOrdenes.length} de {mockOrdenes.length} órdenes
            {statusFilter && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                Filtro: {statusFilter === 'en_proceso' ? 'En Proceso' : 
                        statusFilter === 'pendiente' ? 'Pendientes' :
                        statusFilter === 'completada' ? 'Completadas' : 'Canceladas'}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Lista de Órdenes ({filteredOrdenes.length})
          </h2>
        </div>
        
        {filteredOrdenes.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No se encontraron órdenes
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter
                ? 'Intenta con otros términos de búsqueda o cambia el filtro'
                : 'Comienza creando tu primera orden'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Problema
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Ingreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrdenes.map((orden) => {
                  const statusInfo = getStatusInfo(orden.estado);
                  const priorityInfo = getPriorityInfo(orden.prioridad);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr 
                      key={orden.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleViewOrden(orden)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {orden.numero}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {orden.cliente_nombre}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatRUT(orden.cliente_rut)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">{orden.equipo_marca} {orden.equipo_modelo}</div>
                          <div className="text-xs text-gray-500">{orden.equipo_tipo}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={orden.problema_reportado}>
                          {orden.problema_reportado}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${priorityInfo.color}`}>
                          {priorityInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(orden.fecha_ingreso)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewOrden(orden)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Ver orden"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleEditOrden(orden)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Editar orden"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteOrden(orden)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Eliminar orden"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 