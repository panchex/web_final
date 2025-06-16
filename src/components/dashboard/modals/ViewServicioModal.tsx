'use client';

import { 
  X, 
  Wrench, 
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Users
} from 'lucide-react';
import { useDashboardStore } from '@/lib/stores/dashboard-store';

interface Servicio {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: 'reparacion' | 'mantenimiento' | 'instalacion' | 'diagnostico' | 'consultoria' | 'otro';
  precio_base: number;
  duracion_estimada: number; // en minutos
  activo: boolean;
  fecha_creacion: string;
  ultima_actualizacion: string;
  popularidad?: number; // 1-5
  veces_solicitado?: number;
  tiempo_promedio?: number; // en minutos
  satisfaccion_cliente?: number; // 1-5
}

export function ViewServicioModal() {
  const { activeModal, modalData, closeModal } = useDashboardStore();
  const isOpen = activeModal === 'view-servicio';
  const servicio = modalData as Servicio | null;

  if (!isOpen || !servicio) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
    }
  };

  const getCategoryInfo = () => {
    switch (servicio.categoria) {
      case 'reparacion':
        return { 
          color: 'bg-blue-100 text-blue-700 border-blue-200', 
          label: 'Reparación',
          icon: Wrench
        };
      case 'mantenimiento':
        return { 
          color: 'bg-green-100 text-green-700 border-green-200', 
          label: 'Mantenimiento',
          icon: CheckCircle
        };
      case 'instalacion':
        return { 
          color: 'bg-purple-100 text-purple-700 border-purple-200', 
          label: 'Instalación',
          icon: AlertCircle
        };
      case 'diagnostico':
        return { 
          color: 'bg-orange-100 text-orange-700 border-orange-200', 
          label: 'Diagnóstico',
          icon: AlertCircle
        };
      case 'consultoria':
        return { 
          color: 'bg-pink-100 text-pink-700 border-pink-200', 
          label: 'Consultoría',
          icon: Users
        };
      case 'otro':
        return { 
          color: 'bg-gray-100 text-gray-700 border-gray-200', 
          label: 'Otro',
          icon: Wrench
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-700 border-gray-200', 
          label: 'Sin categoría',
          icon: Wrench
        };
    }
  };

  const getStatusInfo = () => {
    if (servicio.activo) {
      return {
        color: 'bg-green-100 text-green-700 border-green-200',
        label: 'Activo',
        icon: CheckCircle,
        textColor: 'text-green-600'
      };
    } else {
      return {
        color: 'bg-red-100 text-red-700 border-red-200',
        label: 'Inactivo',
        icon: XCircle,
        textColor: 'text-red-600'
      };
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const categoryInfo = getCategoryInfo();
  const statusInfo = getStatusInfo();
  const CategoryIcon = categoryInfo.icon;
  const StatusIcon = statusInfo.icon;

  // Calcular precio por hora
  const precioPorHora = servicio.duracion_estimada > 0 
    ? (servicio.precio_base / servicio.duracion_estimada) * 60 
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CategoryIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Detalles del Servicio</h2>
              <p className="text-sm text-gray-600">{servicio.codigo}</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Service Header */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
                  <CategoryIcon className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{servicio.nombre}</h3>
                  <p className="text-gray-600 mt-1">{servicio.descripcion}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatDuration(servicio.duracion_estimada)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatPrice(servicio.precio_base)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  <span>{statusInfo.label}</span>
                </div>
                <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border mt-2 ${categoryInfo.color}`}>
                  <span>{categoryInfo.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pricing Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-gray-600" />
                Información de Precios
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Precio Base:</span>
                  <span className="text-lg font-bold text-green-600">{formatPrice(servicio.precio_base)}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Duración Estimada:</span>
                  <span className="text-sm text-gray-900">{formatDuration(servicio.duracion_estimada)}</span>
                </div>
                
                {precioPorHora > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Precio por Hora:</span>
                    <span className="text-sm font-bold text-blue-600">{formatPrice(precioPorHora)}</span>
                  </div>
                )}
                
                {servicio.tiempo_promedio && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-gray-600">Tiempo Promedio Real:</span>
                    <span className="text-sm text-gray-900">{formatDuration(servicio.tiempo_promedio)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-gray-600" />
                Métricas de Rendimiento
              </h4>
              
              <div className="space-y-4">
                {servicio.veces_solicitado && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Veces Solicitado:</span>
                    <span className="text-lg font-bold text-blue-600">{servicio.veces_solicitado}</span>
                  </div>
                )}
                
                {servicio.popularidad && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Popularidad:</span>
                    <div className="flex items-center space-x-1">
                      {renderStars(servicio.popularidad)}
                      <span className="text-sm text-gray-600 ml-2">({servicio.popularidad}/5)</span>
                    </div>
                  </div>
                )}
                
                {servicio.satisfaccion_cliente && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-gray-600">Satisfacción Cliente:</span>
                    <div className="flex items-center space-x-1">
                      {renderStars(servicio.satisfaccion_cliente)}
                      <span className="text-sm text-gray-600 ml-2">({servicio.satisfaccion_cliente}/5)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Service Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-gray-600" />
                Información del Servicio
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Categoría:</span>
                  <span className="text-sm text-gray-900">{categoryInfo.label}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Estado:</span>
                  <span className={`text-sm font-medium ${statusInfo.textColor}`}>{statusInfo.label}</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-600">Código:</span>
                  <span className="text-sm text-gray-900 font-mono">{servicio.codigo}</span>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                Fechas Importantes
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Fecha de Creación:</span>
                  <span className="text-sm text-gray-900">{formatDate(servicio.fecha_creacion)}</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-600">Última Actualización:</span>
                  <span className="text-sm text-gray-900">{formatDate(servicio.ultima_actualizacion)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Description */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Descripción Completa</h4>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">{servicio.descripcion}</p>
            </div>
          </div>

          {/* Service Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Resumen del Servicio</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">ID:</span>
                <span className="ml-1 text-blue-900">#{servicio.id}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Código:</span>
                <span className="ml-1 text-blue-900">{servicio.codigo}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Categoría:</span>
                <span className="ml-1 text-blue-900">{categoryInfo.label}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Estado:</span>
                <span className="ml-1 text-blue-900">{statusInfo.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}