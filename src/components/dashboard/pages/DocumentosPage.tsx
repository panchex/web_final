'use client';

import { useState } from 'react';
import { Search, FileText, Download, Eye, Trash2, Upload } from 'lucide-react';
import { useDashboardStore } from '@/lib/stores/dashboard-store';

interface Documento {
  id: number;
  nombre: string;
  tipo: string;
  tamaño: string;
  fecha_subida: string;
  categoria: 'manual' | 'factura' | 'garantia' | 'presupuesto' | 'imagen' | 'otro';
  entidad_tipo?: string;
  entidad_id?: number;
  descripcion?: string;
}

// Mock data
const mockDocumentos: Documento[] = [
  {
    id: 1,
    nombre: 'Manual_Samsung_Galaxy_S21.pdf',
    tipo: 'PDF',
    tamaño: '2.4 MB',
    fecha_subida: '2024-12-15',
    categoria: 'manual',
    entidad_tipo: 'orden',
    entidad_id: 1,
    descripcion: 'Manual de usuario Samsung Galaxy S21'
  },
  {
    id: 2,
    nombre: 'Factura_Repuestos_001.pdf',
    tipo: 'PDF',
    tamaño: '156 KB',
    fecha_subida: '2024-12-14',
    categoria: 'factura',
    entidad_tipo: 'orden',
    entidad_id: 2,
    descripcion: 'Factura de repuestos para reparación'
  },
  {
    id: 3,
    nombre: 'Estado_iPhone_12.jpg',
    tipo: 'JPG',
    tamaño: '1.8 MB',
    fecha_subida: '2024-12-13',
    categoria: 'imagen',
    entidad_tipo: 'orden',
    entidad_id: 3,
    descripcion: 'Foto del estado inicial del equipo'
  },
  {
    id: 4,
    nombre: 'Presupuesto_Reparacion_TV.pdf',
    tipo: 'PDF',
    tamaño: '89 KB',
    fecha_subida: '2024-12-12',
    categoria: 'presupuesto',
    entidad_tipo: 'orden',
    entidad_id: 4,
    descripcion: 'Presupuesto para reparación de TV Samsung'
  },
  {
    id: 5,
    nombre: 'Garantia_Lenovo_ThinkPad.pdf',
    tipo: 'PDF',
    tamaño: '245 KB',
    fecha_subida: '2024-12-11',
    categoria: 'garantia',
    entidad_tipo: 'cliente',
    entidad_id: 1,
    descripcion: 'Certificado de garantía extendida'
  }
];

export function DocumentosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const { openModal } = useDashboardStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCategoryInfo = (categoria: string) => {
    switch (categoria) {
      case 'manual':
        return { color: 'bg-blue-100 text-blue-700', label: 'Manual' };
      case 'factura':
        return { color: 'bg-green-100 text-green-700', label: 'Factura' };
      case 'garantia':
        return { color: 'bg-purple-100 text-purple-700', label: 'Garantía' };
      case 'presupuesto':
        return { color: 'bg-orange-100 text-orange-700', label: 'Presupuesto' };
      case 'imagen':
        return { color: 'bg-pink-100 text-pink-700', label: 'Imagen' };
      case 'otro':
        return { color: 'bg-gray-100 text-gray-700', label: 'Otro' };
      default:
        return { color: 'bg-gray-100 text-gray-700', label: 'Sin categoría' };
    }
  };

  // Filter documents based on search term and category
  const filteredDocumentos = mockDocumentos.filter(doc => {
    const matchesSearch = doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           doc.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           doc.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || doc.categoria === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleViewDocument = (documento: Documento) => {
    openModal('view-documento', documento);
  };

  const handleDownloadDocument = (documento: Documento) => {
    // Simular descarga
    console.log('Descargar documento:', documento.nombre);
  };

  const handleDeleteDocument = (documento: Documento) => {
    openModal('delete-documento', documento);
  };

  const handleUploadDocument = () => {
    openModal('create-documento');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Search Bar with Filters and Upload Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Search Input with Upload Button */}
        <div className="flex gap-4 items-start">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, descripción o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <button
            onClick={handleUploadDocument}
            className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            <span>Subir Documento</span>
          </button>
        </div>
        
        {/* Category Filter Bar */}
        <div className="mt-4 p-1 bg-gray-50 rounded-lg flex flex-wrap gap-1">
          <button
            onClick={() => setCategoryFilter(null)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              categoryFilter === null
                ? 'bg-white text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
            }`}
          >
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span>{mockDocumentos.length}</span>
            <span className="text-xs">Todos</span>
          </button>
          
          <button
            onClick={() => setCategoryFilter('manual')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              categoryFilter === 'manual'
                ? 'bg-white text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
            }`}
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>{mockDocumentos.filter(d => d.categoria === 'manual').length}</span>
            <span className="text-xs">Manuales</span>
          </button>
          
          <button
            onClick={() => setCategoryFilter('factura')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              categoryFilter === 'factura'
                ? 'bg-white text-green-700 border border-green-200 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
            }`}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{mockDocumentos.filter(d => d.categoria === 'factura').length}</span>
            <span className="text-xs">Facturas</span>
          </button>
          
          <button
            onClick={() => setCategoryFilter('imagen')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              categoryFilter === 'imagen'
                ? 'bg-white text-pink-700 border border-pink-200 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
            }`}
          >
            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
            <span>{mockDocumentos.filter(d => d.categoria === 'imagen').length}</span>
            <span className="text-xs">Imágenes</span>
          </button>
          
          <button
            onClick={() => setCategoryFilter('garantia')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              categoryFilter === 'garantia'
                ? 'bg-white text-purple-700 border border-purple-200 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
            }`}
          >
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>{mockDocumentos.filter(d => d.categoria === 'garantia').length}</span>
            <span className="text-xs">Garantías</span>
          </button>
        </div>
        
        {/* Results Info */}
        {(searchTerm || categoryFilter) && (
          <div className="mt-4 text-sm text-gray-600">
            Mostrando {filteredDocumentos.length} de {mockDocumentos.length} documentos
            {categoryFilter && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                Filtro: {getCategoryInfo(categoryFilter).label}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Documents Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Lista de Documentos ({filteredDocumentos.length})
          </h2>
        </div>
        
        {filteredDocumentos.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">
              <FileText className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No se encontraron documentos
            </h3>
            <p className="text-gray-600">
              {searchTerm || categoryFilter
                ? 'Intenta con otros términos de búsqueda o cambia el filtro'
                : 'Comienza subiendo tu primer documento'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo/Tamaño
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Subida
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Relacionado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocumentos.map((documento) => {
                  const categoryInfo = getCategoryInfo(documento.categoria);
                  
                  return (
                    <tr 
                      key={documento.id} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleViewDocument(documento)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {documento.nombre}
                            </div>
                            {documento.descripcion && (
                              <div className="text-xs text-gray-500 truncate">
                                {documento.descripcion}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${categoryInfo.color}`}>
                          {categoryInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">{documento.tipo}</div>
                          <div className="text-xs text-gray-500">{documento.tamaño}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(documento.fecha_subida)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {documento.entidad_tipo && (
                          <div className="text-sm text-gray-900">
                            <div className="capitalize">{documento.entidad_tipo}</div>
                            <div className="text-xs text-gray-500">ID: {documento.entidad_id}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDocument(documento);
                            }}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Ver documento"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadDocument(documento);
                            }}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Descargar documento"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDocument(documento);
                            }}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Eliminar documento"
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