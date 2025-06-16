'use client';

import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
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
  XCircle
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

const mockEquipos: Equipo[] = [
  {
    id: 1,
    codigo_interno: 'EQ-2024-001',
    tipo: 'Laptop',
    marca: 'HP',
    modelo: 'Pavilion 15-eh1xxx',
    numero_serie: 'HP-ABC123456',
    descripcion: 'Laptop para uso personal, color negro',
    estado: 'reparado',
    especificaciones_tecnicas: {
      procesador: 'AMD Ryzen 5 5500U',
      memoria_ram: '8GB DDR4',
      almacenamiento: '256GB SSD',
      pantalla: '15.6" Full HD',
      otros: ['WiFi 6', 'Bluetooth 5.0', 'USB-C']
    },
    propietario_actual: {
      cliente_id: 1,
      cliente_nombre: 'Juan Pérez González',
      cliente_rut: '12345678-9',
      fecha_inicio: '2024-06-01'
    },
    historial_ordenes: 2,
    ultima_orden: '2024-06-03',
    created_at: '2024-05-15T10:30:00Z',
    updated_at: '2024-06-03T16:45:00Z'
  },
  {
    id: 2,
    codigo_interno: 'EQ-2024-015',
    tipo: 'Smartphone',
    marca: 'Samsung',
    modelo: 'Galaxy S21 5G',
    numero_serie: 'SM-G991B123456',
    descripcion: 'Smartphone color negro, 128GB',
    estado: 'en_reparacion',
    especificaciones_tecnicas: {
      procesador: 'Exynos 2100',
      memoria_ram: '8GB',
      almacenamiento: '128GB',
      pantalla: '6.2" Dynamic AMOLED',
      otros: ['5G', 'Cámara 64MP', 'Carga rápida 25W']
    },
    propietario_actual: {
      cliente_id: 1,
      cliente_nombre: 'Juan Pérez González',
      cliente_rut: '12345678-9',
      fecha_inicio: '2024-06-08'
    },
    historial_ordenes: 1,
    ultima_orden: '2024-06-08',
    created_at: '2024-06-08T09:15:00Z',
    updated_at: '2024-06-08T14:20:00Z'
  },
  {
    id: 3,
    codigo_interno: 'EQ-2024-003',
    tipo: 'PC Desktop',
    marca: 'Custom',
    modelo: 'Gaming PC Build',
    numero_serie: 'CUSTOM-789012',
    descripcion: 'PC Gaming personalizado, RGB',
    estado: 'disponible',
    especificaciones_tecnicas: {
      procesador: 'Intel Core i7-12700K',
      memoria_ram: '32GB DDR4',
      almacenamiento: '1TB NVMe SSD + 2TB HDD',
      otros: ['RTX 3070', 'Z690 Motherboard', 'RGB Lighting']
    },
    propietario_actual: {
      cliente_id: 2,
      cliente_nombre: 'María González Silva',
      cliente_rut: '98765432-1',
      fecha_inicio: '2024-05-20'
    },
    historial_ordenes: 1,
    ultima_orden: '2024-05-22',
    created_at: '2024-05-20T11:00:00Z',
    updated_at: '2024-05-22T15:30:00Z'
  },
  {
    id: 4,
    codigo_interno: 'EQ-2024-008',
    tipo: 'Tablet',
    marca: 'Apple',
    modelo: 'iPad Air 5th Gen',
    numero_serie: 'IPAD-456789',
    descripcion: 'iPad Air color azul, 64GB WiFi',
    estado: 'en_garantia',
    especificaciones_tecnicas: {
      procesador: 'Apple M1',
      memoria_ram: '8GB',
      almacenamiento: '64GB',
      pantalla: '10.9" Liquid Retina',
      otros: ['Touch ID', 'USB-C', 'Apple Pencil compatible']
    },
    propietario_actual: {
      cliente_id: 2,
      cliente_nombre: 'María González Silva',
      cliente_rut: '98765432-1',
      fecha_inicio: '2024-06-05'
    },
    historial_ordenes: 0,
    created_at: '2024-06-05T13:45:00Z',
    updated_at: '2024-06-05T13:45:00Z'
  },
  {
    id: 5,
    codigo_interno: 'EQ-2024-012',
    tipo: 'Consola',
    marca: 'Sony',
    modelo: 'PlayStation 5',
    numero_serie: 'PS5-987654',
    descripcion: 'PlayStation 5 Standard Edition',
    estado: 'disponible',
    especificaciones_tecnicas: {
      procesador: 'AMD Zen 2',
      memoria_ram: '16GB GDDR6',
      almacenamiento: '825GB SSD',
      otros: ['4K Gaming', 'Ray Tracing', 'DualSense Controller']
    },
    propietario_actual: {
      cliente_id: 3,
      cliente_nombre: 'Carlos Rodríguez López',
      cliente_rut: '11223344-5',
      fecha_inicio: '2024-05-25'
    },
    historial_ordenes: 1,
    ultima_orden: '2024-05-28',
    created_at: '2024-05-25T16:20:00Z',
    updated_at: '2024-05-28T12:15:00Z'
  },
  {
    id: 6,
    codigo_interno: 'EQ-2024-020',
    tipo: 'Smart TV',
    marca: 'Samsung',
    modelo: 'QN55Q70A 55" QLED',
    numero_serie: 'TV-555666',
    descripcion: 'Smart TV 55 pulgadas QLED 4K',
    estado: 'en_reparacion',
    especificaciones_tecnicas: {
      pantalla: '55" QLED 4K',
      otros: ['HDR10+', 'Smart TV Tizen', 'Alexa Built-in', 'Gaming Mode']
    },
    propietario_actual: {
      cliente_id: 4,
      cliente_nombre: 'Ana Silva Martínez',
      cliente_rut: '55667788-9',
      fecha_inicio: '2024-06-06'
    },
    historial_ordenes: 1,
    ultima_orden: '2024-06-06',
    created_at: '2024-06-06T10:30:00Z',
    updated_at: '2024-06-15T14:20:00Z'
  },
  {
    id: 7,
    codigo_interno: 'EQ-2024-005',
    tipo: 'Impresora',
    marca: 'Canon',
    modelo: 'PIXMA G3110',
    numero_serie: 'CANON-111222',
    descripcion: 'Impresora multifuncional con tanque de tinta',
    estado: 'dado_baja',
    especificaciones_tecnicas: {
      otros: ['Impresión a color', 'Scanner', 'WiFi', 'Tanque de tinta']
    },
    propietario_actual: {
      cliente_id: 5,
      cliente_nombre: 'Pedro Morales Castro',
      cliente_rut: '99887766-5',
      fecha_inicio: '2024-04-10'
    },
    historial_ordenes: 1,
    ultima_orden: '2024-04-15',
    created_at: '2024-04-10T09:00:00Z',
    updated_at: '2024-04-15T11:30:00Z'
  },
  {
    id: 8,
    codigo_interno: 'EQ-2024-025',
    tipo: 'Monitor',
    marca: 'LG',
    modelo: '27GL850-B 27" Gaming',
    numero_serie: 'LG-MON789',
    descripcion: 'Monitor gaming 27" 144Hz',
    estado: 'disponible',
    especificaciones_tecnicas: {
      pantalla: '27" IPS 2560x1440',
      otros: ['144Hz', 'G-Sync Compatible', 'HDR10', 'USB Hub']
    },
    created_at: '2024-06-10T14:00:00Z',
    updated_at: '2024-06-10T14:00:00Z'
  }
];

export function EquiposPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { openModal } = useDashboardStore();
  
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
  
  // Filter equipos based on search term and status
  const filteredEquipos = mockEquipos.filter(equipo => {
    const matchesSearch = equipo.codigo_interno.toLowerCase().includes(searchTerm.toLowerCase()) ||
           equipo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
           equipo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (equipo.numero_serie && equipo.numero_serie.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (equipo.propietario_actual && equipo.propietario_actual.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !statusFilter || equipo.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleViewEquipo = (equipo: Equipo) => {
    openModal('view-equipo', equipo);
  };
  
  const handleEditEquipo = (equipo: Equipo) => {
    openModal('edit-equipo', equipo);
  };
  
  const handleDeleteEquipo = (equipo: Equipo) => {
    openModal('delete-equipo', equipo);
  };
  
  const handleCreateEquipo = () => {
    openModal('create-equipo');
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Search Bar with Filters and New Equipment Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        
        {/* Search Input with New Equipment Button */}
        <div className="flex gap-4 items-start">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por código, marca, modelo, serie o propietario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <button
            onClick={handleCreateEquipo}
            className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Equipo</span>
          </button>
        </div>
        
        {/* Status Filter Bar */}
        <div className="mt-4">
          <div className="p-1 bg-gray-50 rounded-lg flex flex-wrap gap-1">
            <button
              onClick={() => setStatusFilter(null)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === null
                  ? 'bg-white text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>{mockEquipos.length}</span>
              <span className="text-xs">Todos</span>
            </button>
            
            <button
              onClick={() => setStatusFilter('disponible')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'disponible'
                  ? 'bg-white text-green-700 border border-green-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{mockEquipos.filter(e => e.estado === 'disponible').length}</span>
              <span className="text-xs">Disponibles</span>
            </button>
            
            <button
              onClick={() => setStatusFilter('en_reparacion')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'en_reparacion'
                  ? 'bg-white text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{mockEquipos.filter(e => e.estado === 'en_reparacion').length}</span>
              <span className="text-xs">En Reparación</span>
            </button>
            
            <button
              onClick={() => setStatusFilter('reparado')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'reparado'
                  ? 'bg-white text-emerald-700 border border-emerald-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>{mockEquipos.filter(e => e.estado === 'reparado').length}</span>
              <span className="text-xs">Reparados</span>
            </button>
            
            <button
              onClick={() => setStatusFilter('en_garantia')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'en_garantia'
                  ? 'bg-white text-purple-700 border border-purple-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>{mockEquipos.filter(e => e.estado === 'en_garantia').length}</span>
              <span className="text-xs">En Garantía</span>
            </button>
          </div>
        </div>
        
        {/* Results Info */}
        {(searchTerm || statusFilter) && (
          <div className="mt-4 text-sm text-gray-600">
            Mostrando {filteredEquipos.length} de {mockEquipos.length} equipos
            {statusFilter && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                Estado: {getStatusInfo(statusFilter).label}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Equipment Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Lista de Equipos ({filteredEquipos.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propietario Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Historial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEquipos.map((equipo) => {
                const statusInfo = getStatusInfo(equipo.estado);
                const TypeIcon = getTypeIcon(equipo.tipo);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr 
                    key={equipo.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleViewEquipo(equipo)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <TypeIcon className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {equipo.codigo_interno}
                          </div>
                          <div className="text-sm text-gray-500">
                            {equipo.marca} {equipo.modelo}
                          </div>
                          {equipo.numero_serie && (
                            <div className="text-xs text-gray-400">
                              S/N: {equipo.numero_serie}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {equipo.propietario_actual ? (
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {equipo.propietario_actual.cliente_nombre}
                            </div>
                            <div className="text-sm text-gray-500">
                              {equipo.propietario_actual.cliente_rut}
                            </div>
                            <div className="text-xs text-gray-400">
                              Desde: {formatDate(equipo.propietario_actual.fecha_inicio)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Sin propietario</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Settings className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{equipo.historial_ordenes || 0} órdenes</span>
                        </div>
                        {equipo.ultima_orden && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{formatDate(equipo.ultima_orden)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(equipo.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewEquipo(equipo);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEquipo(equipo);
                          }}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                          title="Editar equipo"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEquipo(equipo);
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Eliminar equipo"
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
          
          {filteredEquipos.length === 0 && (
            <div className="text-center py-12">
              <HardDrive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron equipos</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza registrando tu primer equipo'
                }
              </p>
              {!searchTerm && !statusFilter && (
                <button
                  onClick={handleCreateEquipo}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Primer Equipo
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}