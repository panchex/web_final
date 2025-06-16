'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useDashboardStore } from '@/lib/stores/dashboard-store';
import { 
  User, 
  Smartphone, 
  FileText, 
  Upload, 
  X, 
  Calendar,
  DollarSign,
  AlertCircle,
  Plus,
  Trash2,
  Download,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

interface OrdenForm {
  cliente_id: number | '';
  equipo_tipo: string;
  equipo_marca: string;
  equipo_modelo: string;
  equipo_serie: string;
  problema_reportado: string;
  diagnostico: string;
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  fecha_estimada: string;
  costo_estimado: number | '';
  tecnico_asignado: string;
  notas_internas: string;
}

interface Documento {
  id?: number;
  tipo_documento: string;
  nombre_archivo: string;
  descripcion: string;
  archivo?: File;
  ruta?: string;
  fecha_subida?: string;
}

interface Cliente {
  id: number;
  nombre: string;
  rut: string;
}

interface OrdenData {
  id?: number;
  numero?: string;
  cliente_id: number;
  cliente_nombre?: string;
  equipo_tipo: string;
  equipo_marca: string;
  equipo_modelo: string;
  equipo_serie?: string;
  problema_reportado: string;
  diagnostico?: string;
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  fecha_estimada?: string;
  costo_estimado?: number;
  tecnico_asignado?: string;
  notas_internas?: string;
  documentos?: Documento[];
}

// Mock data para clientes
const mockClientes: Cliente[] = [
  { id: 1, nombre: 'Juan Pérez González', rut: '12.345.678-9' },
  { id: 2, nombre: 'María González Silva', rut: '98.765.432-1' },
  { id: 3, nombre: 'Carlos Rodríguez López', rut: '11.223.344-5' },
  { id: 4, nombre: 'Ana Silva Martínez', rut: '55.667.788-9' },
  { id: 5, nombre: 'Pedro Morales Castro', rut: '99.887.766-5' }
];

// Mock data para técnicos
const mockTecnicos = [
  'Carlos Méndez',
  'Ana Silva', 
  'Pedro Morales',
  'Luis González',
  'María Rodríguez'
];

export function EditOrdenModal() {
  const { activeModal, modalData, closeModal } = useDashboardStore();
  const isOpen = activeModal === 'edit-orden' || activeModal === 'create-orden';
  const isEditing = activeModal === 'edit-orden';
  const orden = modalData as OrdenData | null;
  
  const [form, setForm] = useState<OrdenForm>({
    cliente_id: '',
    equipo_tipo: '',
    equipo_marca: '',
    equipo_modelo: '',
    equipo_serie: '',
    problema_reportado: '',
    diagnostico: '',
    prioridad: 'media',
    fecha_estimada: '',
    costo_estimado: '',
    tecnico_asignado: '',
    notas_internas: ''
  });
  
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [errors, setErrors] = useState<Partial<OrdenForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isEditing && orden) {
        setForm({
          cliente_id: orden.cliente_id,
          equipo_tipo: orden.equipo_tipo || '',
          equipo_marca: orden.equipo_marca || '',
          equipo_modelo: orden.equipo_modelo || '',
          equipo_serie: orden.equipo_serie || '',
          problema_reportado: orden.problema_reportado || '',
          diagnostico: orden.diagnostico || '',
          prioridad: orden.prioridad || 'media',
          fecha_estimada: orden.fecha_estimada || '',
          costo_estimado: orden.costo_estimado || '',
          tecnico_asignado: orden.tecnico_asignado || '',
          notas_internas: orden.notas_internas || ''
        });
        setDocumentos(orden.documentos || []);
      } else {
        // Reset form for new order
        setForm({
          cliente_id: '',
          equipo_tipo: '',
          equipo_marca: '',
          equipo_modelo: '',
          equipo_serie: '',
          problema_reportado: '',
          diagnostico: '',
          prioridad: 'media',
          fecha_estimada: '',
          costo_estimado: '',
          tecnico_asignado: '',
          notas_internas: ''
        });
        setDocumentos([]);
      }
      setErrors({});
    }
  }, [isOpen, isEditing, orden]);
  
  const validateForm = (): boolean => {
    const newErrors: Partial<OrdenForm> = {};
    
    if (!form.cliente_id) {
      newErrors.cliente_id = 'Debe seleccionar un cliente';
    }
    
    if (!form.equipo_tipo.trim()) {
      newErrors.equipo_tipo = 'El tipo de equipo es requerido';
    }
    
    if (!form.equipo_marca.trim()) {
      newErrors.equipo_marca = 'La marca es requerida';
    }
    
    if (!form.equipo_modelo.trim()) {
      newErrors.equipo_modelo = 'El modelo es requerido';
    }
    
    if (!form.problema_reportado.trim()) {
      newErrors.problema_reportado = 'La descripción del problema es requerida';
    } else if (form.problema_reportado.trim().length < 10) {
      newErrors.problema_reportado = 'La descripción debe tener al menos 10 caracteres';
    }
    
    if (form.fecha_estimada && new Date(form.fecha_estimada) < new Date()) {
      newErrors.fecha_estimada = 'La fecha estimada no puede ser anterior a hoy';
    }
    
    if (form.costo_estimado && Number(form.costo_estimado) < 0) {
      newErrors.costo_estimado = 'El costo no puede ser negativo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isEditing) {
        toast.success('Orden actualizada correctamente');
      } else {
        toast.success('Orden creada correctamente');
      }
      
      closeModal();
    } catch {
      toast.error('Error al guardar la orden');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (field: keyof OrdenForm, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  
  // Document management functions
  const handleAddDocument = () => {
    const newDoc: Documento = {
      tipo_documento: 'imagen',
      nombre_archivo: '',
      descripcion: ''
    };
    setDocumentos(prev => [...prev, newDoc]);
  };
  
  const handleDocumentChange = (index: number, field: keyof Documento, value: string | File) => {
    setDocumentos(prev => prev.map((doc, i) => 
      i === index ? { ...doc, [field]: value } : doc
    ));
  };
  
  const handleFileUpload = (index: number, file: File) => {
    setDocumentos(prev => prev.map((doc, i) => 
      i === index ? { 
        ...doc, 
        archivo: file,
        nombre_archivo: file.name
      } : doc
    ));
  };
  
  const handleRemoveDocument = (index: number) => {
    setDocumentos(prev => prev.filter((_, i) => i !== index));
  };
  
  const getClienteNombre = (clienteId: number) => {
    const cliente = mockClientes.find(c => c.id === clienteId);
    return cliente ? `${cliente.nombre} (${cliente.rut})` : '';
  };
  
  if (!isOpen) return null;
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={isEditing ? 'Editar Orden' : 'Nueva Orden'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Selection */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Cliente
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Cliente *
            </label>
            <select
              value={form.cliente_id}
              onChange={(e) => handleInputChange('cliente_id', Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.cliente_id ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isEditing} // No permitir cambiar cliente en edición
            >
              <option value="">Seleccione un cliente...</option>
              {mockClientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre} - {cliente.rut}
                </option>
              ))}
            </select>
            {errors.cliente_id && (
              <p className="text-red-500 text-sm mt-1">{errors.cliente_id}</p>
            )}
          </div>
        </div>
        
        {/* Equipment Information */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Smartphone className="w-5 h-5 mr-2 text-green-600" />
            Información del Equipo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Equipo *
              </label>
              <select
                value={form.equipo_tipo}
                onChange={(e) => handleInputChange('equipo_tipo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.equipo_tipo ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccione tipo...</option>
                <option value="Laptop">Laptop</option>
                <option value="Smartphone">Smartphone</option>
                <option value="PC Desktop">PC Desktop</option>
                <option value="Tablet">Tablet</option>
                <option value="Consola">Consola</option>
                <option value="Smart TV">Smart TV</option>
                <option value="Impresora">Impresora</option>
                <option value="Monitor">Monitor</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.equipo_tipo && (
                <p className="text-red-500 text-sm mt-1">{errors.equipo_tipo}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca *
              </label>
              <input
                type="text"
                value={form.equipo_marca}
                onChange={(e) => handleInputChange('equipo_marca', e.target.value)}
                placeholder="Ej: Samsung, Apple, HP..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.equipo_marca ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.equipo_marca && (
                <p className="text-red-500 text-sm mt-1">{errors.equipo_marca}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo *
              </label>
              <input
                type="text"
                value={form.equipo_modelo}
                onChange={(e) => handleInputChange('equipo_modelo', e.target.value)}
                placeholder="Ej: Galaxy S21, MacBook Pro..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.equipo_modelo ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.equipo_modelo && (
                <p className="text-red-500 text-sm mt-1">{errors.equipo_modelo}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Serie
              </label>
              <input
                type="text"
                value={form.equipo_serie}
                onChange={(e) => handleInputChange('equipo_serie', e.target.value)}
                placeholder="Opcional"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
        
        {/* Problem and Diagnosis */}
        <div className="bg-red-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
            Problema y Diagnóstico
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problema Reportado *
              </label>
              <textarea
                value={form.problema_reportado}
                onChange={(e) => handleInputChange('problema_reportado', e.target.value)}
                placeholder="Describa detalladamente el problema reportado por el cliente..."
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${
                  errors.problema_reportado ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.problema_reportado && (
                <p className="text-red-500 text-sm mt-1">{errors.problema_reportado}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnóstico Técnico
              </label>
              <textarea
                value={form.diagnostico}
                onChange={(e) => handleInputChange('diagnostico', e.target.value)}
                placeholder="Diagnóstico técnico del problema (opcional al crear, requerido para completar)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>
          </div>
        </div>
        
        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Priority and Dates */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Prioridad y Fechas
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  value={form.prioridad}
                  onChange={(e) => handleInputChange('prioridad', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Estimada de Entrega
                </label>
                <input
                  type="date"
                  value={form.fecha_estimada}
                  onChange={(e) => handleInputChange('fecha_estimada', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.fecha_estimada ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_estimada && (
                  <p className="text-red-500 text-sm mt-1">{errors.fecha_estimada}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Cost and Technician */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-yellow-600" />
              Costo y Técnico
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Costo Estimado (CLP)
                </label>
                <input
                  type="number"
                  value={form.costo_estimado}
                  onChange={(e) => handleInputChange('costo_estimado', Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.costo_estimado ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.costo_estimado && (
                  <p className="text-red-500 text-sm mt-1">{errors.costo_estimado}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Técnico Asignado
                </label>
                <select
                  value={form.tecnico_asignado}
                  onChange={(e) => handleInputChange('tecnico_asignado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Sin asignar</option>
                  {mockTecnicos.map(tecnico => (
                    <option key={tecnico} value={tecnico}>
                      {tecnico}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Documents Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-gray-600" />
              Documentos Asociados
            </h3>
            <button
              type="button"
              onClick={handleAddDocument}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Documento</span>
            </button>
          </div>
          
          {documentos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No hay documentos asociados</p>
              <p className="text-sm">Haz clic en "Agregar Documento" para subir archivos</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documentos.map((doc, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Documento
                      </label>
                      <select
                        value={doc.tipo_documento}
                        onChange={(e) => handleDocumentChange(index, 'tipo_documento', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      >
                        <option value="imagen">Imagen</option>
                        <option value="factura">Factura</option>
                        <option value="garantia">Garantía</option>
                        <option value="manual">Manual</option>
                        <option value="presupuesto">Presupuesto</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Archivo
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(index, file);
                          }}
                          accept="image/*,.pdf,.doc,.docx"
                          className="hidden"
                          id={`file-${index}`}
                        />
                        <label
                          htmlFor={`file-${index}`}
                          className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-sm"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Subir</span>
                        </label>
                        {doc.nombre_archivo && (
                          <span className="text-sm text-gray-600 truncate">
                            {doc.nombre_archivo}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(index)}
                        className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <input
                      type="text"
                      value={doc.descripcion}
                      onChange={(e) => handleDocumentChange(index, 'descripcion', e.target.value)}
                      placeholder="Descripción del documento (opcional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Internal Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas Internas
          </label>
          <textarea
            value={form.notas_internas}
            onChange={(e) => handleInputChange('notas_internas', e.target.value)}
            placeholder="Notas internas para el equipo técnico (no visibles para el cliente)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={closeModal}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isEditing ? 'Actualizando...' : 'Creando...'}</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>{isEditing ? 'Actualizar Orden' : 'Crear Orden'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
} 