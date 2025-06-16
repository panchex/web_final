'use client';

import { 
  X, 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  ExternalLink,
  Image as ImageIcon,
  FileImage,
  Receipt,
  Shield,
  Calculator,
  File
} from 'lucide-react';
import { useDashboardStore } from '@/lib/stores/dashboard-store';
import toast from 'react-hot-toast';

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
  ruta?: string;
  mime_type?: string;
}

export function ViewDocumentoModal() {
  const { activeModal, modalData, closeModal } = useDashboardStore();
  const isOpen = activeModal === 'view-documento';
  const documento = modalData as Documento | null;

  if (!isOpen || !documento) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryInfo = (categoria: string) => {
    switch (categoria) {
      case 'manual':
        return { 
          color: 'bg-blue-100 text-blue-700 border-blue-200', 
          label: 'Manual',
          icon: FileText
        };
      case 'factura':
        return { 
          color: 'bg-green-100 text-green-700 border-green-200', 
          label: 'Factura',
          icon: Receipt
        };
      case 'garantia':
        return { 
          color: 'bg-purple-100 text-purple-700 border-purple-200', 
          label: 'Garantía',
          icon: Shield
        };
      case 'presupuesto':
        return { 
          color: 'bg-orange-100 text-orange-700 border-orange-200', 
          label: 'Presupuesto',
          icon: Calculator
        };
      case 'imagen':
        return { 
          color: 'bg-pink-100 text-pink-700 border-pink-200', 
          label: 'Imagen',
          icon: ImageIcon
        };
      case 'otro':
        return { 
          color: 'bg-gray-100 text-gray-700 border-gray-200', 
          label: 'Otro',
          icon: File
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-700 border-gray-200', 
          label: 'Sin categoría',
          icon: File
        };
    }
  };

  const getFileTypeIcon = (tipo: string, categoria: string) => {
    if (categoria === 'imagen') return ImageIcon;
    
    const extension = tipo.toLowerCase();
    if (extension.includes('pdf')) return FileText;
    if (extension.includes('image')) return FileImage;
    if (extension.includes('doc')) return FileText;
    return File;
  };

  const handleDownload = () => {
    // Simular descarga
    toast.success(`Descargando ${documento.nombre}...`);
    console.log('Descargar documento:', documento.id);
  };

  const handlePreview = () => {
    // Simular previsualización
    if (documento.categoria === 'imagen') {
      toast.success('Abriendo previsualización de imagen...');
    } else {
      toast.success('Abriendo documento en nueva ventana...');
    }
    console.log('Previsualizar documento:', documento.id);
  };

  const categoryInfo = getCategoryInfo(documento.categoria);
  const CategoryIcon = categoryInfo.icon;
  const FileIcon = getFileTypeIcon(documento.tipo, documento.categoria);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Detalles del Documento</h2>
              <p className="text-sm text-gray-600">{documento.nombre}</p>
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
          {/* Document Preview/Icon */}
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            {documento.categoria === 'imagen' ? (
              <div className="space-y-4">
                <div className="w-24 h-24 mx-auto bg-pink-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-pink-600" />
                </div>
                <p className="text-sm text-gray-600">Previsualización de imagen</p>
                <button
                  onClick={handlePreview}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Imagen</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileIcon className="w-12 h-12 text-gray-600" />
                </div>
                <p className="text-sm text-gray-600">Archivo {documento.tipo.toUpperCase()}</p>
                <button
                  onClick={handlePreview}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir Documento</span>
                </button>
              </div>
            )}
          </div>

          {/* Document Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Nombre:</span>
                  <span className="text-sm text-gray-900 font-medium">{documento.nombre}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Categoría:</span>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${categoryInfo.color}`}>
                    <CategoryIcon className="w-3 h-3" />
                    <span>{categoryInfo.label}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Tipo:</span>
                  <span className="text-sm text-gray-900 uppercase">{documento.tipo}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Tamaño:</span>
                  <span className="text-sm text-gray-900">{documento.tamaño}</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-600">Fecha de subida:</span>
                  <div className="flex items-center space-x-1 text-sm text-gray-900">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{formatDate(documento.fecha_subida)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información Adicional</h3>
              
              <div className="space-y-3">
                {documento.descripcion && (
                  <div className="py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600 block mb-1">Descripción:</span>
                    <p className="text-sm text-gray-900">{documento.descripcion}</p>
                  </div>
                )}
                
                {documento.entidad_tipo && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Relacionado con:</span>
                    <div className="text-sm text-gray-900">
                      <div className="capitalize font-medium">{documento.entidad_tipo}</div>
                      <div className="text-xs text-gray-500">ID: {documento.entidad_id}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">ID del documento:</span>
                  <span className="text-sm text-gray-900 font-mono">#{documento.id}</span>
                </div>
                
                {documento.ruta && (
                  <div className="py-2">
                    <span className="text-sm font-medium text-gray-600 block mb-1">Ubicación:</span>
                    <code className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded break-all">
                      {documento.ruta}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description (if long) */}
          {documento.descripcion && documento.descripcion.length > 100 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Descripción Completa</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{documento.descripcion}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Documento #{documento.id} • Subido el {formatDate(documento.fecha_subida)}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descargar</span>
            </button>
            
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 