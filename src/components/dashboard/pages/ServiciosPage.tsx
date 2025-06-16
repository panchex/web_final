'use client';

import { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Wrench, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { useDashboardStore } from '@/lib/stores/dashboard-store';

interface Servicio {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: 'reparacion' | 'mantenimiento' | 'instalacion' | 'diagnostico' | 'consultoria' | 'otro';
  precio_base: number;
  tiempo_estimado: number; // en minutos
  dificultad: 'basica' | 'intermedia' | 'avanzada' | 'experta';
  activo: boolean;
  requiere_repuestos: boolean;
  garantia_dias: number;
  veces_realizado: number;
  fecha_creacion: string;
  ultima_actualizacion: string;
}

// Mock data
const mockServicios: Servicio[] = [
  {
    id: 1,
    codigo: 'SRV-001',
    nombre: 'Cambio de Pantalla Smartphone',
    descripcion: 'Reemplazo completo de pantalla LCD/OLED incluyendo digitalizador',
    categoria: 'reparacion',
    precio_base: 45000,
    tiempo_estimado: 60,
    dificultad: 'intermedia',
    activo: true,
    requiere_repuestos: true,
    garantia_dias: 90,
    veces_realizado: 156,
    fecha_creacion: '2024-01-15',
    ultima_actualizacion: '2024-11-20'
  },
  {
    id: 2,
    codigo: 'SRV-002',
    nombre: 'Diagnóstico General',
    descripcion: 'Evaluación completa del estado del equipo y detección de fallas',
    categoria: 'diagnostico',
    precio_base: 15000,
    tiempo_estimado: 30,
    dificultad: 'basica',
    activo: true,
    requiere_repuestos: false,
    garantia_dias: 0,
    veces_realizado: 324,
    fecha_creacion: '2024-01-10',
    ultima_actualizacion: '2024-12-01'
  },
  {
    id: 3,
    codigo: 'SRV-003',
    nombre: 'Limpieza Profunda Laptop',
    descripcion: 'Limpieza interna completa, cambio de pasta térmica y optimización',
    categoria: 'mantenimiento',
    precio_base: 25000,
    tiempo_estimado: 90,
    dificultad: 'intermedia',
    activo: true,
    requiere_repuestos: false,
    garantia_dias: 30,
    veces_realizado: 89,
    fecha_creacion: '2024-02-01',
    ultima_actualizacion: '2024-11-15'
  },
  {
    id: 4,
    codigo: 'SRV-004',
    nombre: 'Recuperación de Datos',
    descripcion: 'Recuperación de archivos desde dispositivos de almacenamiento dañados',
    categoria: 'reparacion',
    precio_base: 80000,
    tiempo_estimado: 240,
    dificultad: 'experta',
    activo: true,
    requiere_repuestos: false,
    garantia_dias: 0,
    veces_realizado: 23,
    fecha_creacion: '2024-03-10',
    ultima_actualizacion: '2024-10-05'
  },
  {
    id: 5,
    codigo: 'SRV-005',
    nombre: 'Instalación Sistema Operativo',
    descripcion: 'Instalación limpia de sistema operativo con drivers y software básico',
    categoria: 'instalacion',
    precio_base: 20000,
    tiempo_estimado: 120,
    dificultad: 'basica',
    activo: true,
    requiere_repuestos: false,
    garantia_dias: 15,
    veces_realizado: 67,
    fecha_creacion: '2024-01-20',
    ultima_actualizacion: '2024-11-30'
  },
  {
    id: 6,
    codigo: 'SRV-006',
    nombre: 'Reparación Placa Madre',
    descripcion: 'Diagnóstico y reparación de componentes en placa madre',
    categoria: 'reparacion',
    precio_base: 120000,
    tiempo_estimado: 300,
    dificultad: 'experta',
    activo: false,
    requiere_repuestos: true,
    garantia_dias: 180,
    veces_realizado: 8,
    fecha_creacion: '2024-04-15',
    ultima_actualizacion: '2024-09-20'
  },
  {
    id: 7,
    codigo: 'SRV-007',
    nombre: 'Consultoría Técnica',
    descripcion: 'Asesoramiento técnico especializado por hora',
    categoria: 'consultoria',
    precio_base: 35000,
    tiempo_estimado: 60,
    dificultad: 'avanzada',
    activo: true,
    requiere_repuestos: false,
    garantia_dias: 0,
    veces_realizado: 45,
    fecha_creacion: '2024-05-01',
    ultima_actualizacion: '2024-12-10'
  }
];

export function ServiciosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { openModal } = useDashboardStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  const getDifficultyInfo = (dificultad: string) => {
    switch (dificultad) {
      case 'basica':
        return { color: 'bg-green-100 text-green-700', label: 'Básica' };
      case 'intermedia':
        return { color: 'bg-yellow-100 text-yellow-700', label: 'Intermedia' };
      case 'avanzada':
        return { color: 'bg-orange-100 text-orange-700', label: 'Avanzada' };
      case 'experta':
        return { color: 'bg-red-100 text-red-700', label: 'Experta' };
      default:
        return { color: 'bg-gray-100 text-gray-700', label: 'Sin definir' };
    }
  };

  const getCategoryInfo = (categoria: string) => {
    switch (categoria) {
      case 'reparacion':
        return { color: 'bg-blue-100 text-blue-700', label: 'Reparación' };
      case 'mantenimiento':
        return { color: 'bg-green-100 text-green-700', label: 'Mantenimiento' };
      case 'instalacion':
        return { color: 'bg-purple-100 text-purple-700', label: 'Instalación' };
      case 'diagnostico':
        return { color: 'bg-orange-100 text-orange-700', label: 'Diagnóstico' };
      case 'consultoria':
        return { color: 'bg-pink-100 text-pink-700', label: 'Consultoría' };
      case 'otro':
        return { color: 'bg-gray-100 text-gray-700', label: 'Otro' };
      default:
        return { color: 'bg-gray-100 text-gray-700', label: 'Sin categoría' };
    }
  };

  // Filter services
  const filteredServicios = mockServicios.filter(servicio => {
    const matchesSearch = servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           servicio.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
           servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || servicio.categoria === categoryFilter;
    const matchesStatus = !statusFilter || 
      (statusFilter === 'activo' && servicio.activo) ||
      (statusFilter === 'inactivo' && !servicio.activo);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleViewService = (servicio: Servicio) => {
    openModal('view-servicio', servicio);
  };

  const handleEditService = (servicio: Servicio) => {
    openModal('edit-servicio', servicio);
  };

  const handleDeleteService = (servicio: Servicio) => {
    openModal('delete-servicio', servicio);
  };

  const handleCreateService = () => {
    openModal('create-servicio');
  };

  // Statistics
  const totalServicios = mockServicios.length;
  const serviciosActivos = mockServicios.filter(s => s.activo).length;
  const totalRealizados = mockServicios.reduce((sum, s) => sum + s.veces_realizado, 0);
  const ingresoEstimado = mockServicios.reduce((sum, s) => sum + (s.precio_base * s.veces_realizado), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Servicios</p>
              <p className="text-2xl font-bold text-gray-900">{totalServicios}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Servicios Activos</p>
              <p className="text-2xl font-bold text-green-600">{serviciosActivos}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Servicios Realizados</p>
              <p className="text-2xl font-bold text-purple-600">{totalRealizados}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Generados</p>
              <p className="text-2xl font-bold text-orange-600">{formatPrice(ingresoEstimado)}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex gap-4 items-start mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, código o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <button
            onClick={handleCreateService}
            className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Servicio</span>
          </button>
        </div>
        
        {/* Filter Bars */}
        <div className="space-y-3">
          {/* Category Filter */}
          <div className="p-1 bg-gray-50 rounded-lg flex flex-wrap gap-1">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                categoryFilter === null
                  ? 'bg-white text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>{mockServicios.length}</span>
              <span className="text-xs">Todas</span>
            </button>
            
            <button
              onClick={() => setCategoryFilter('reparacion')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                categoryFilter === 'reparacion'
                  ? 'bg-white text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{mockServicios.filter(s => s.categoria === 'reparacion').length}</span>
              <span className="text-xs">Reparación</span>
            </button>
            
            <button
              onClick={() => setCategoryFilter('mantenimiento')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                categoryFilter === 'mantenimiento'
                  ? 'bg-white text-green-700 border border-green-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{mockServicios.filter(s => s.categoria === 'mantenimiento').length}</span>
              <span className="text-xs">Mantenimiento</span>
            </button>
            
            <button
              onClick={() => setCategoryFilter('diagnostico')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                categoryFilter === 'diagnostico'
                  ? 'bg-white text-orange-700 border border-orange-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>{mockServicios.filter(s => s.categoria === 'diagnostico').length}</span>
              <span className="text-xs">Diagnóstico</span>
            </button>
            
            <button
              onClick={() => setCategoryFilter('instalacion')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                categoryFilter === 'instalacion'
                  ? 'bg-white text-purple-700 border border-purple-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>{mockServicios.filter(s => s.categoria === 'instalacion').length}</span>
              <span className="text-xs">Instalación</span>
            </button>
          </div>

          {/* Status Filter */}
          <div className="p-1 bg-gray-50 rounded-lg flex flex-wrap gap-1">
            <button
              onClick={() => setStatusFilter(null)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === null
                  ? 'bg-white text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <span>Todos los Estados</span>
            </button>
            
            <button
              onClick={() => setStatusFilter('activo')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'activo'
                  ? 'bg-white text-green-700 border border-green-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Activos</span>
            </button>
            
            <button
              onClick={() => setStatusFilter('inactivo')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'inactivo'
                  ? 'bg-white text-red-700 border border-red-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Inactivos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Catálogo de Servicios ({filteredServicios.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiempo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dificultad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Realizados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServicios.map((servicio) => {
                const difficultyInfo = getDifficultyInfo(servicio.dificultad);
                const categoryInfo = getCategoryInfo(servicio.categoria);
                
                return (
                  <tr 
                    key={servicio.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleViewService(servicio)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                          <Wrench className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{servicio.nombre}</div>
                          <div className="text-sm text-gray-500">{servicio.codigo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                        {categoryInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatPrice(servicio.precio_base)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatTime(servicio.tiempo_estimado)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyInfo.color}`}>
                        {difficultyInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{servicio.veces_realizado}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        servicio.activo 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {servicio.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewService(servicio);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditService(servicio);
                          }}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Editar servicio"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteService(servicio);
                          }}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Eliminar servicio"
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
        
        {filteredServicios.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay servicios</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || categoryFilter || statusFilter
                ? 'No se encontraron servicios con los filtros aplicados.'
                : 'Comienza agregando tu primer servicio al catálogo.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 