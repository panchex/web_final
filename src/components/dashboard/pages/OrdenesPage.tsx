'use client';

import { useState, useEffect } from 'react';
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
  User,
  Filter,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useDashboardStore } from '@/lib/stores/dashboard-store';
import { OrdenService } from '@/lib/services/ordenService';
import { Orden, OrdenStats, OrdenFilters } from '@/lib/types/entities';
import toast from 'react-hot-toast';

export function OrdenesPage() {
  const { openModal } = useDashboardStore();
  
  // Estados principales
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [stats, setStats] = useState<OrdenStats>({
    total: 0,
    pendientes: 0,
    en_proceso: 0,
    completadas: 0,
    canceladas: 0,
    urgentes: 0
  });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [backendConnected, setBackendConnected] = useState(true);
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [filters, setFilters] = useState<OrdenFilters>({});
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  // Cargar estadísticas y órdenes iniciales al montar el componente
  useEffect(() => {
    loadInitialData();
  }, []);

  // Cargar datos iniciales
  const loadInitialData = async () => {
    // Cargar estadísticas (sin mostrar error si falla)
    try {
      const statsData = await OrdenService.getStats();
      setStats(statsData);
      setBackendConnected(true);
    } catch (error) {
      console.error('Error loading stats:', error);
      setBackendConnected(false);
      // Usar estadísticas mock si el backend no está disponible
      setStats({
        total: 0,
        pendientes: 0,
        en_proceso: 0,
        completadas: 0,
        canceladas: 0,
        urgentes: 0
      });
    }

    // Cargar órdenes pendientes y en proceso automáticamente
    const initialFilters = { estado: 'pendiente,en_proceso' };
    setFilters(initialFilters);
    setActiveFilter('pendiente,en_proceso');
    
    // Intentar cargar órdenes, si falla mostrar mensaje informativo
    try {
      await loadOrdenes(initialFilters, 1);
    } catch (error) {
      console.error('Error loading initial orders:', error);
      setHasSearched(true); // Para mostrar el mensaje de "no hay órdenes"
      setLoading(false);
    }
  };

  // Cargar estadísticas
  const loadStats = async () => {
    try {
      const statsData = await OrdenService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
      // No mostrar error, mantener estadísticas actuales
    }
  };

  // Cargar órdenes con filtros
  const loadOrdenes = async (newFilters: OrdenFilters = filters, page: number = currentPage) => {
    // Validar filtros obligatorios
    if (!OrdenService.validateFilters(newFilters)) {
      setOrdenes([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    try {
      const response = await OrdenService.getOrdenes(newFilters, { page, per_page: itemsPerPage });
      
      setOrdenes(response.data.ordenes);
      // Actualizar estadísticas si vienen en la respuesta
      if (response.data.stats) {
        setStats(response.data.stats);
      }
      setCurrentPage(response.data.pagination.current_page);
      setTotalPages(response.data.pagination.total_pages);
      setTotalItems(response.data.pagination.total);
      setHasSearched(true);
    } catch (error: any) {
      console.error('Error loading ordenes:', error);
      toast.error(error.message || 'Error al cargar órdenes');
      setOrdenes([]);
      setHasSearched(false);
    } finally {
      setLoading(false);
    }
  };

  // Manejar búsqueda por texto
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.length >= 3 || value === '') {
      const newFilters = { ...filters, search: value || undefined };
      setFilters(newFilters);
      setCurrentPage(1);
      loadOrdenes(newFilters, 1);
    }
  };

  // Manejar filtro por estado
  const handleFilterByEstado = (estado: string) => {
    const newActiveFilter = activeFilter === estado ? '' : estado;
    setActiveFilter(newActiveFilter);
    
    const newFilters = { 
      ...filters, 
      estado: newActiveFilter || undefined,
      search: searchTerm || undefined 
    };
    setFilters(newFilters);
    setCurrentPage(1);
    loadOrdenes(newFilters, 1);
  };

  // Limpiar filtros y volver al estado inicial
  const handleClearFilters = () => {
    setSearchTerm('');
    setActiveFilter('');
    setFilters({});
    setOrdenes([]);
    setHasSearched(false);
    setCurrentPage(1);
  };

  // Cargar filtro inicial (pendientes + en proceso)
  const handleLoadInitialFilter = () => {
    const initialFilters = { estado: 'pendiente,en_proceso' };
    setFilters(initialFilters);
    setActiveFilter('pendiente,en_proceso');
    setSearchTerm('');
    setCurrentPage(1);
    loadOrdenes(initialFilters, 1);
  };

  // Manejar paginación
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadOrdenes(filters, page);
  };

  // Funciones de formato
  const formatRUT = (rut: string) => {
    if (!rut) return '';
    const cleanRUT = rut.replace(/[.-]/g, '');
    if (cleanRUT.length === 9) {
      return `${cleanRUT.slice(0, 2)}.${cleanRUT.slice(2, 5)}.${cleanRUT.slice(5, 8)}-${cleanRUT.slice(8)}`;
    }
    return rut;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

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

  // Handlers de modales
  const handleViewOrden = (orden: any) => {
    openModal('view-orden', orden);
  };

  const handleEditOrden = (orden: any) => {
    openModal('edit-orden', orden);
  };

  const handleDeleteOrden = (orden: any) => {
    openModal('delete-orden', orden);
  };

  const handleCreateOrden = () => {
    openModal('create-orden', null);
  };

  const handleRefresh = () => {
    loadStats();
    if (hasSearched) {
      loadOrdenes();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">Órdenes de Trabajo</h1>
            {backendConnected ? (
              <div className="flex items-center space-x-1 text-green-600">
                <Wifi className="w-4 h-4" />
                <span className="text-xs font-medium">Conectado</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-orange-600">
                <WifiOff className="w-4 h-4" />
                <span className="text-xs font-medium">Modo Demo</span>
              </div>
            )}
          </div>
          <p className="text-gray-600">Gestiona las órdenes de reparación y mantenimiento</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
          <button
            onClick={handleCreateOrden}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Orden</span>
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{stats.pendientes}</div>
          <div className="text-sm text-gray-600">Pendientes</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{stats.en_proceso}</div>
          <div className="text-sm text-gray-600">En Proceso</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{stats.completadas}</div>
          <div className="text-sm text-gray-600">Completadas</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{stats.canceladas}</div>
          <div className="text-sm text-gray-600">Canceladas</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{stats.urgentes}</div>
          <div className="text-sm text-gray-600">Urgentes</div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="space-y-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por número, cliente, equipo o problema... (mínimo 3 caracteres)"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

                     {/* Filtros por Estado */}
           <div className="flex flex-wrap gap-2">
             <span className="flex items-center text-sm font-medium text-gray-700 mr-2">
               <Filter className="w-4 h-4 mr-1" />
               Filtros rápidos:
             </span>
             
             {/* Filtro combinado inicial */}
             <button
               onClick={handleLoadInitialFilter}
               className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                 activeFilter === 'pendiente,en_proceso'
                   ? 'text-blue-700 bg-blue-100 border-blue-300 border'
                   : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
               }`}
             >
               Activas ({stats.pendientes + stats.en_proceso})
             </button>

             {/* Filtros individuales */}
             {[
               { key: 'pendiente', label: 'Pendientes', count: stats.pendientes, color: 'yellow' },
               { key: 'en_proceso', label: 'En Proceso', count: stats.en_proceso, color: 'blue' },
               { key: 'completada', label: 'Completadas', count: stats.completadas, color: 'green' },
               { key: 'cancelada', label: 'Canceladas', count: stats.canceladas, color: 'red' }
             ].map((filter) => (
               <button
                 key={filter.key}
                 onClick={() => handleFilterByEstado(filter.key)}
                 className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                   activeFilter === filter.key
                     ? `text-${filter.color}-700 bg-${filter.color}-100 border-${filter.color}-300 border`
                     : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                 }`}
               >
                 {filter.label} ({filter.count})
               </button>
             ))}

             {/* Botón limpiar */}
             {(hasSearched || searchTerm) && (
               <button
                 onClick={handleClearFilters}
                 className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
               >
                 Limpiar
               </button>
             )}
           </div>

                     {/* Mensaje informativo */}
           {!hasSearched && !loading && (
             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
               <div className="flex items-start space-x-3">
                 <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                 <div className="text-sm text-blue-700">
                   <p className="font-medium mb-1">¡Bienvenido a Órdenes de Trabajo!</p>
                   <p>Las órdenes activas se cargan automáticamente. Usa la búsqueda o filtros para encontrar órdenes específicas.</p>
                 </div>
               </div>
             </div>
           )}
        </div>
      </div>

      {/* Lista de Órdenes */}
      {hasSearched && (
        <div className="bg-white rounded-lg border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Cargando órdenes...</span>
              </div>
            </div>
          ) : ordenes.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron órdenes</h3>
              <p className="text-gray-600">
                {!backendConnected 
                  ? 'Usando datos de demostración. Intenta ajustar los filtros de búsqueda.'
                  : 'Intenta ajustar los filtros de búsqueda'
                }
              </p>
              {!backendConnected && (
                <button
                  onClick={loadInitialData}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reintentar conexión
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Tabla */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orden
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Equipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prioridad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Costo
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ordenes.map((orden) => {
                      const statusInfo = getStatusInfo(orden.estado);
                      const priorityInfo = getPriorityInfo(orden.prioridad);
                      const StatusIcon = statusInfo.icon;

                      return (
                        <tr 
                          key={orden.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleViewOrden(orden)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {orden.numero_orden}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {orden.id}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {orden.cliente_nombre}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatRUT(orden.cliente_rut || '')}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {orden.equipo_marca} {orden.equipo_modelo}
                              </div>
                              <div className="text-sm text-gray-500">
                                {orden.equipo_tipo}
                              </div>
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
                            {formatDate(orden.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(orden.presupuesto_monto)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewOrden(orden);
                                }}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                title="Ver detalles"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditOrden(orden);
                                }}
                                className="text-green-600 hover:text-green-900 transition-colors"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteOrden(orden);
                                }}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                title="Eliminar"
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

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} órdenes
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 text-sm font-medium rounded ${
                              currentPage === page
                                ? 'text-white bg-blue-600'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
} 