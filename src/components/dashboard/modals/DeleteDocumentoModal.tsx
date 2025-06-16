'use client';

import { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Trash2, 
  FileText,
  Image as ImageIcon,
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
}

export function DeleteDocumentoModal() {
  const { activeModal, modalData, closeModal } = useDashboardStore();
  const isOpen = activeModal === 'delete-documento';
  const documento = modalData as Documento | null;
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !documento) return null;

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

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Documento "${documento.nombre}" eliminado correctamente`);
      closeModal();
    } catch {
      toast.error('Error al eliminar el documento');
    } finally {
      setIsDeleting(false);
    }
  };

  const categoryInfo = getCategoryInfo(documento.categoria);
  const CategoryIcon = categoryInfo.icon;

  // Validaciones de negocio
  const isImportantDocument = documento.categoria === 'factura' || documento.categoria === 'garantia';
  const hasRelations = documento.entidad_tipo && documento.entidad_id;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Eliminar Documento</h2>
              <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
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
        <div className="p-6 space-y-4">
          {/* Document Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-white rounded-lg border">
                <CategoryIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {documento.nombre}
                </h3>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${categoryInfo.color}`}>
                      <CategoryIcon className="w-3 h-3" />
                      <span>{categoryInfo.label}</span>
                    </div>
                    <span className="text-xs text-gray-500 uppercase">{documento.tipo}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Tamaño: {documento.tamaño}</span>
                    <span>Subido: {formatDate(documento.fecha_subida)}</span>
                  </div>
                  {documento.descripcion && (
                    <p className="text-xs text-gray-600 mt-1">{documento.descripcion}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Relations Warning */}
          {hasRelations && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium mb-1">Documento relacionado</p>
                  <p className="text-xs">
                    Este documento está asociado con {documento.entidad_tipo} ID: {documento.entidad_id}. 
                    Al eliminarlo, se perderá esta relación.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Important Document Warning */}
          {isImportantDocument && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">Documento importante</p>
                  <p className="text-xs">
                    {documento.categoria === 'factura' 
                      ? 'Las facturas son documentos fiscales importantes. Asegúrate de tener una copia de respaldo.'
                      : 'Los documentos de garantía son importantes para reclamaciones futuras.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* General Warning */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">¿Estás seguro?</p>
                <ul className="space-y-1 text-xs">
                  <li>• El archivo se eliminará permanentemente del servidor</li>
                  <li>• No podrás recuperar este documento después</li>
                  <li>• Se perderán todas las referencias a este archivo</li>
                  {hasRelations && <li>• Se eliminará la relación con {documento.entidad_tipo}</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Document Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Detalles del documento</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600">ID:</span>
                <span className="ml-1 font-medium font-mono">#{documento.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Tipo:</span>
                <span className="ml-1 font-medium uppercase">{documento.tipo}</span>
              </div>
              <div>
                <span className="text-gray-600">Tamaño:</span>
                <span className="ml-1 font-medium">{documento.tamaño}</span>
              </div>
              <div>
                <span className="text-gray-600">Fecha:</span>
                <span className="ml-1 font-medium">{formatDate(documento.fecha_subida)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Eliminar Documento</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 