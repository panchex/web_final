'use client';

import { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Package, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
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

// Mock data
const mockInventario: ProductoInventario[] = [
  {
    id: 1,
    codigo: 'REP-001',
    nombre: 'Pantalla iPhone 12',
    descripcion: 'Pantalla LCD completa con digitalizador para iPhone 12',
    categoria: 'repuesto',
    marca: 'Apple',
    modelo: 'iPhone 12',
    stock_actual: 15,
    stock_minimo: 5,
    stock_maximo: 50,
    precio_compra: 85000,
    precio_venta: 120000,
    proveedor: 'TechParts Chile',
    ubicacion: 'Estante A-1',
    estado: 'disponible',
    fecha_ingreso: '2024-11-15',
    ultima_actualizacion: '2024-12-10'
  },
  {
    id: 2,
    codigo: 'REP-002',
    nombre: 'Batería Samsung Galaxy S21',
    descripcion: 'Batería original de reemplazo para Samsung Galaxy S21',
    categoria: 'repuesto',
    marca: 'Samsung',
    modelo: 'Galaxy S21',
    stock_actual: 3,
    stock_minimo: 10,
    stock_maximo: 30,
    precio_compra: 25000,
    precio_venta: 35000,
    proveedor: 'Samsung Parts',
    ubicacion: 'Estante B-2',
    estado: 'disponible',
    fecha_ingreso: '2024-10-20',
    ultima_actualizacion: '2024-12-08'
  },
  {
    id: 3,
    codigo: 'ACC-001',
    nombre: 'Cargador USB-C Universal',
    descripcion: 'Cargador USB-C 65W compatible con múltiples dispositivos',
    categoria: 'accesorio',
    stock_actual: 25,
    stock_minimo: 10,
    stock_maximo: 100,
    precio_compra: 8000,
    precio_venta: 15000,
    proveedor: 'ElectroSupply',
    ubicacion: 'Estante C-1',
    estado: 'disponible',
    fecha_ingreso: '2024-11-01',
    ultima_actualizacion: '2024-12-05'
  },
  {
    id: 4,
    codigo: 'HER-001',
    nombre: 'Kit Destornilladores Precisión',
    descripcion: 'Set de 32 destornilladores de precisión para electrónicos',
    categoria: 'herramienta',
    stock_actual: 8,
    stock_minimo: 3,
    stock_maximo: 15,
    precio_compra: 12000,
    precio_venta: 20000,
    proveedor: 'ToolMaster',
    ubicacion: 'Cajón H-1',
    estado: 'disponible',
    fecha_ingreso: '2024-09-15',
    ultima_actualizacion: '2024-11-20'
  },
  {
    id: 5,
    codigo: 'CON-001',
    nombre: 'Alcohol Isopropílico 99%',
    descripcion: 'Alcohol isopropílico para limpieza de componentes electrónicos',
    categoria: 'consumible',
    stock_actual: 0,
    stock_minimo: 5,
    stock_maximo: 20,
    precio_compra: 3500,
    precio_venta: 6000,
    proveedor: 'ChemClean',
    ubicacion: 'Estante D-3',
    estado: 'agotado',
    fecha_ingreso: '2024-08-10',
    ultima_actualizacion: '2024-12-01'
  },
  {
    id: 6,
    codigo: 'REP-003',
    nombre: 'Conector de Carga iPhone 13',
    descripcion: 'Flex de conector de carga Lightning para iPhone 13',
    categoria: 'repuesto',
    marca: 'Apple',
    modelo: 'iPhone 13',
    stock_actual: 12,
    stock_minimo: 8,
    stock_maximo: 40,
    precio_compra: 15000,
    precio_venta: 25000,
    proveedor: 'TechParts Chile',
    ubicacion: 'Estante A-2',
    estado: 'disponible',
    fecha_ingreso: '2024-11-25',
    ultima_actualizacion: '2024-12-12'
  }
];

export function InventarioPage() {
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



  const getStockStatus = (producto: ProductoInventario) => {
    if (producto.stock_actual === 0) {
      return { color: 'bg-red-100 text-red-700', label: 'Agotado', icon: XCircle };
    } else if (producto.stock_actual <= producto.stock_minimo) {
      return { color: 'bg-yellow-100 text-yellow-700', label: 'Stock Bajo', icon: AlertTriangle };
    } else {
      return { color: 'bg-green-100 text-green-700', label: 'Disponible', icon: CheckCircle };
    }
  };

  const getCategoryInfo = (categoria: string) => {
    switch (categoria) {
      case 'repuesto':
        return { color: 'bg-blue-100 text-blue-700', label: 'Repuesto' };
      case 'accesorio':
        return { color: 'bg-purple-100 text-purple-700', label: 'Accesorio' };
      case 'herramienta':
        return { color: 'bg-orange-100 text-orange-700', label: 'Herramienta' };
      case 'consumible':
        return { color: 'bg-green-100 text-green-700', label: 'Consumible' };
      case 'otro':
        return { color: 'bg-gray-100 text-gray-700', label: 'Otro' };
      default:
        return { color: 'bg-gray-100 text-gray-700', label: 'Sin categoría' };
    }
  };

  // Filter products
  const filteredProductos = mockInventario.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
           producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
           producto.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           producto.modelo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || producto.categoria === categoryFilter;
    const matchesStatus = !statusFilter || producto.estado === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleViewProduct = (producto: ProductoInventario) => {
    openModal('view-producto', producto);
  };

  const handleEditProduct = (producto: ProductoInventario) => {
    openModal('edit-producto', producto);
  };

  const handleDeleteProduct = (producto: ProductoInventario) => {
    openModal('delete-producto', producto);
  };

  const handleCreateProduct = () => {
    openModal('create-producto');
  };

  // Statistics
  const totalProductos = mockInventario.length;
  const productosDisponibles = mockInventario.filter(p => p.estado === 'disponible').length;
  const productosAgotados = mockInventario.filter(p => p.stock_actual === 0).length;
  const productosStockBajo = mockInventario.filter(p => p.stock_actual > 0 && p.stock_actual <= p.stock_minimo).length;

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900">{totalProductos}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">{productosDisponibles}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
              <p className="text-2xl font-bold text-yellow-600">{productosStockBajo}</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Agotados</p>
              <p className="text-2xl font-bold text-red-600">{productosAgotados}</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
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
              placeholder="Buscar por nombre, código, marca, modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <button
            onClick={handleCreateProduct}
            className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Producto</span>
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
              <span>{mockInventario.length}</span>
              <span className="text-xs">Todas</span>
            </button>
            
            <button
              onClick={() => setCategoryFilter('repuesto')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                categoryFilter === 'repuesto'
                  ? 'bg-white text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{mockInventario.filter(p => p.categoria === 'repuesto').length}</span>
              <span className="text-xs">Repuestos</span>
            </button>
            
            <button
              onClick={() => setCategoryFilter('accesorio')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                categoryFilter === 'accesorio'
                  ? 'bg-white text-purple-700 border border-purple-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>{mockInventario.filter(p => p.categoria === 'accesorio').length}</span>
              <span className="text-xs">Accesorios</span>
            </button>
            
            <button
              onClick={() => setCategoryFilter('herramienta')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                categoryFilter === 'herramienta'
                  ? 'bg-white text-orange-700 border border-orange-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>{mockInventario.filter(p => p.categoria === 'herramienta').length}</span>
              <span className="text-xs">Herramientas</span>
            </button>
            
            <button
              onClick={() => setCategoryFilter('consumible')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                categoryFilter === 'consumible'
                  ? 'bg-white text-green-700 border border-green-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{mockInventario.filter(p => p.categoria === 'consumible').length}</span>
              <span className="text-xs">Consumibles</span>
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
              onClick={() => setStatusFilter('disponible')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'disponible'
                  ? 'bg-white text-green-700 border border-green-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Disponible</span>
            </button>
            
            <button
              onClick={() => setStatusFilter('agotado')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'agotado'
                  ? 'bg-white text-red-700 border border-red-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              <XCircle className="w-3 h-3 text-red-500" />
              <span>Agotado</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Productos en Inventario ({filteredProductos.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precios
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
              {filteredProductos.map((producto) => {
                const stockStatus = getStockStatus(producto);
                const categoryInfo = getCategoryInfo(producto.categoria);
                const StockIcon = stockStatus.icon;
                
                return (
                  <tr 
                    key={producto.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleViewProduct(producto)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                            <Package className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                            <div className="text-sm text-gray-500">{producto.codigo}</div>
                            {producto.marca && (
                              <div className="text-xs text-gray-400">{producto.marca} {producto.modelo}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                        {categoryInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{producto.stock_actual} unidades</div>
                        <div className="text-xs text-gray-500">
                          Min: {producto.stock_minimo} | Max: {producto.stock_maximo}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">Venta: {formatPrice(producto.precio_venta)}</div>
                        <div className="text-xs text-gray-500">Compra: {formatPrice(producto.precio_compra)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        <StockIcon className="w-3 h-3 mr-1" />
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProduct(producto);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProduct(producto);
                          }}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Editar producto"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(producto);
                          }}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Eliminar producto"
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
        
        {filteredProductos.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || categoryFilter || statusFilter
                ? 'No se encontraron productos con los filtros aplicados.'
                : 'Comienza agregando tu primer producto al inventario.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 