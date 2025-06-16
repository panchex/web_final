'use client';

import { 
  X, 
  Package, 
  Calendar,
  MapPin,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Truck
} from 'lucide-react';
import { useDashboardStore } from '@/lib/stores/dashboard-store';

interface ProductoInventario {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: 'repuesto' | 'accesorio' | 'herramienta' | 'consumible' | 'otro';
  marca?: string;
  modelo?: string;
  stock_actual: number;
  stock_minimo: number;
  stock_maximo: number;
  precio_compra: number;
  precio_venta: number;
  proveedor?: string;
  ubicacion?: string;
  estado: 'disponible' | 'agotado' | 'descontinuado' | 'reservado';
  fecha_ingreso: string;
  ultima_actualizacion: string;
}

export function ViewProductoModal() {
  const { activeModal, modalData, closeModal } = useDashboardStore();
  const isOpen = activeModal === 'view-producto';
  const producto = modalData as ProductoInventario | null;

  if (!isOpen || !producto) return null;

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

  const getStockStatus = () => {
    if (producto.stock_actual === 0) {
      return { 
        color: 'bg-red-100 text-red-700 border-red-200', 
        label: 'Agotado', 
        icon: XCircle,
        textColor: 'text-red-600'
      };
    } else if (producto.stock_actual <= producto.stock_minimo) {
      return { 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200', 
        label: 'Stock Bajo', 
        icon: AlertTriangle,
        textColor: 'text-yellow-600'
      };
    } else {
      return { 
        color: 'bg-green-100 text-green-700 border-green-200', 
        label: 'Disponible', 
        icon: CheckCircle,
        textColor: 'text-green-600'
      };
    }
  };

  const getCategoryInfo = () => {
    switch (producto.categoria) {
      case 'repuesto':
        return { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Repuesto' };
      case 'accesorio':
        return { color: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Accesorio' };
      case 'herramienta':
        return { color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Herramienta' };
      case 'consumible':
        return { color: 'bg-green-100 text-green-700 border-green-200', label: 'Consumible' };
      case 'otro':
        return { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Otro' };
      default:
        return { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Sin categoría' };
    }
  };

  const stockStatus = getStockStatus();
  const categoryInfo = getCategoryInfo();
  const StockIcon = stockStatus.icon;
  
  // Calcular margen de ganancia
  const margenGanancia = ((producto.precio_venta - producto.precio_compra) / producto.precio_compra * 100);
  
  // Calcular valor total del stock
  const valorTotalStock = producto.stock_actual * producto.precio_compra;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Detalles del Producto</h2>
              <p className="text-sm text-gray-600">{producto.codigo}</p>
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
          {/* Product Header */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{producto.nombre}</h3>
                  <p className="text-gray-600 mt-1">{producto.descripcion}</p>
                  {producto.marca && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm font-medium text-gray-700">Marca:</span>
                      <span className="text-sm text-gray-600">{producto.marca}</span>
                      {producto.modelo && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{producto.modelo}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${stockStatus.color}`}>
                  <StockIcon className="w-4 h-4" />
                  <span>{stockStatus.label}</span>
                </div>
                <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border mt-2 ${categoryInfo.color}`}>
                  <span>{categoryInfo.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-gray-600" />
                Información de Stock
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Stock Actual:</span>
                  <span className={`text-lg font-bold ${stockStatus.textColor}`}>
                    {producto.stock_actual} unidades
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Stock Mínimo:</span>
                  <span className="text-sm text-gray-900">{producto.stock_minimo} unidades</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Stock Máximo:</span>
                  <span className="text-sm text-gray-900">{producto.stock_maximo} unidades</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-600">Valor Total Stock:</span>
                  <span className="text-sm font-bold text-gray-900">{formatPrice(valorTotalStock)}</span>
                </div>

                {/* Stock Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Mín: {producto.stock_minimo}</span>
                    <span>Actual: {producto.stock_actual}</span>
                    <span>Máx: {producto.stock_maximo}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        producto.stock_actual <= producto.stock_minimo 
                          ? 'bg-red-500' 
                          : producto.stock_actual <= (producto.stock_maximo * 0.3)
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                      style={{ 
                        width: `${Math.min((producto.stock_actual / producto.stock_maximo) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-gray-600" />
                Información de Precios
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Precio de Compra:</span>
                  <span className="text-sm text-gray-900">{formatPrice(producto.precio_compra)}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Precio de Venta:</span>
                  <span className="text-lg font-bold text-green-600">{formatPrice(producto.precio_venta)}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Margen de Ganancia:</span>
                  <div className="flex items-center space-x-1">
                    {margenGanancia > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-bold ${margenGanancia > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {margenGanancia.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-600">Ganancia por Unidad:</span>
                  <span className="text-sm font-bold text-green-600">
                    {formatPrice(producto.precio_venta - producto.precio_compra)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Location & Supplier */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-600" />
                Ubicación y Proveedor
              </h4>
              
              <div className="space-y-3">
                {producto.ubicacion && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Ubicación:</span>
                    <span className="text-sm text-gray-900">{producto.ubicacion}</span>
                  </div>
                )}
                
                {producto.proveedor && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Proveedor:</span>
                    <div className="flex items-center space-x-1">
                      <Truck className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{producto.proveedor}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Estado:</span>
                  <span className="text-sm text-gray-900 capitalize">{producto.estado}</span>
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
                  <span className="text-sm font-medium text-gray-600">Fecha de Ingreso:</span>
                  <span className="text-sm text-gray-900">{formatDate(producto.fecha_ingreso)}</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-600">Última Actualización:</span>
                  <span className="text-sm text-gray-900">{formatDate(producto.ultima_actualizacion)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Resumen del Producto</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">ID:</span>
                <span className="ml-1 text-blue-900">#{producto.id}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Código:</span>
                <span className="ml-1 text-blue-900">{producto.codigo}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Categoría:</span>
                <span className="ml-1 text-blue-900">{categoryInfo.label}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Estado:</span>
                <span className="ml-1 text-blue-900">{stockStatus.label}</span>
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