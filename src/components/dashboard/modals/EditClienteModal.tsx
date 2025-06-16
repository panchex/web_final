'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useDashboardStore } from '@/lib/stores/dashboard-store';
import { User, Phone, Mail, Save, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { clienteService, Cliente } from '@/lib/services/clienteService';
import { formatRUT, validateRUT, autoCompleteRUT, cleanRUT } from '@/lib/utils/rutUtils';
import { formatChileanPhone, validateChileanPhone } from '@/lib/utils/phoneUtils';
import toast from 'react-hot-toast';

interface ClienteForm {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  rut: string;
  telefono: string;
  email: string;
  whatsapp: boolean;
}

interface ValidationStatus {
  rut: 'valid' | 'invalid' | 'incomplete' | null;
  telefono: 'valid' | 'invalid' | null;
}

export function EditClienteModal() {
  const { activeModal, modalData, closeModal } = useDashboardStore();
  const isOpen = activeModal === 'edit-cliente' || activeModal === 'create-cliente';
  const isEditing = activeModal === 'edit-cliente';
  const cliente = modalData as Cliente | null;
  
  const [form, setForm] = useState<ClienteForm>({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    rut: '',
    telefono: '',
    email: '',
    whatsapp: false
  });
  
  const [errors, setErrors] = useState<Partial<ClienteForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({
    rut: null,
    telefono: null
  });
  
  // Helper function to auto-separate names and surnames
  const separateNames = (fullName: string) => {
    const parts = fullName.trim().split(' ').filter(part => part.length > 0);
    if (parts.length === 0) return { nombre: '', apellido: '' };
    if (parts.length === 1) return { nombre: parts[0], apellido: '' };
    
    // If 2 parts: first is name, second is surname
    // If 3+ parts: first is name, rest are surnames
    const nombre = parts[0];
    const apellido = parts.slice(1).join(' ');
    
    return { nombre, apellido };
  };
  
  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isEditing && cliente) {
        setForm({
          nombre: cliente.nombre || '',
          apellido_paterno: cliente.apellido_paterno || '',
          apellido_materno: cliente.apellido_materno || '',
          rut: cliente.rut || '',
          telefono: cliente.telefono || '',
          email: cliente.email || '',
          whatsapp: cliente.whatsapp || false
        });
        
        // Validate existing data
        if (cliente.rut) {
          setValidationStatus(prev => ({
            ...prev,
            rut: validateRUT(cliente.rut) ? 'valid' : 'invalid'
          }));
        }
        if (cliente.telefono) {
          setValidationStatus(prev => ({
            ...prev,
            telefono: validateChileanPhone(cliente.telefono) ? 'valid' : 'invalid'
          }));
        }
      } else {
        // Reset form for new client
        setForm({
          nombre: '',
          apellido_paterno: '',
          apellido_materno: '',
          rut: '',
          telefono: '',
          email: '',
          whatsapp: false
        });
        setValidationStatus({
          rut: null,
          telefono: null
        });
      }
      setErrors({});
    }
  }, [isOpen, isEditing, cliente]);
  
  const validateForm = (): boolean => {
    const newErrors: Partial<ClienteForm> = {};
    
    if (!form.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!form.apellido_paterno.trim()) {
      newErrors.apellido_paterno = 'El apellido paterno es requerido';
    }
    
    if (!form.rut.trim()) {
      newErrors.rut = 'El RUT es requerido';
    } else {
      const isValidRUT = validateRUT(form.rut);
      if (!isValidRUT) {
        newErrors.rut = 'RUT inválido';
      }
    }
    
    if (!form.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else {
      const isValidPhone = validateChileanPhone(form.telefono);
      if (!isValidPhone) {
        newErrors.telefono = 'Número de teléfono inválido';
      }
    }
    
    // Email es opcional, pero si se ingresa debe ser válido
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Formato de email inválido';
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const clienteData = {
        nombre: form.nombre.trim(),
        apellido_paterno: form.apellido_paterno.trim(),
        apellido_materno: form.apellido_materno.trim() || undefined,
        rut: form.rut.trim(), // Enviar RUT formateado como está en el form
        telefono: form.telefono.trim(),
        email: form.email.trim() || undefined,
        whatsapp: form.whatsapp
      };

      let response;
      if (isEditing && cliente?.id) {
        response = await clienteService.updateCliente(cliente.id, clienteData);
      } else {
        response = await clienteService.createCliente(clienteData);
      }

      if (response.success) {
        toast.success(isEditing ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente');
        closeModal();
        // Trigger a refresh of the clients list
        window.dispatchEvent(new CustomEvent('clienteUpdated'));
      } else {
        toast.error(response.error || 'Error al guardar el cliente');
      }
    } catch (error) {
      console.error('Error saving cliente:', error);
      toast.error('Error de conexión al guardar el cliente');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (field: keyof ClienteForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof Partial<ClienteForm>]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle RUT input with auto-formatting and validation
  const handleRutChange = (value: string) => {
    // Limpiar entrada - solo números y K
    const cleaned = value.replace(/[^0-9kK]/g, '');
    
    let formatted = cleaned;
    
    // Solo formatear con puntos y guión, NO auto-completar
    if (cleaned.length > 1) {
      // Separar cuerpo y dígito verificador
      let body = cleaned;
      let dv = '';
      
      // Si el último carácter es K o si ya tiene 8+ caracteres, separar DV
      if (cleaned.length >= 8 || /[kK]$/.test(cleaned)) {
        body = cleaned.slice(0, -1);
        dv = cleaned.slice(-1);
      }
      
      // Agregar puntos al cuerpo (cada 3 dígitos desde la derecha)
      const bodyWithDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      
      // Combinar con DV si existe
      if (dv) {
        formatted = `${bodyWithDots}-${dv}`;
      } else {
        formatted = bodyWithDots;
      }
    }
    
    // Actualizar estado
    setForm(prev => ({ ...prev, rut: formatted }));
    
    // Validar usando la misma función que validateForm
    if (formatted.trim()) {
      const isValid = validateRUT(formatted);
      if (isValid) {
        setValidationStatus(prev => ({ ...prev, rut: 'valid' }));
      } else if (formatted.includes('-')) {
        setValidationStatus(prev => ({ ...prev, rut: 'invalid' }));
      } else {
        setValidationStatus(prev => ({ ...prev, rut: 'incomplete' }));
      }
    } else {
      setValidationStatus(prev => ({ ...prev, rut: null }));
    }
    
    // Limpiar errores
    if (errors.rut) {
      setErrors(prev => ({ ...prev, rut: undefined }));
    }
  };

  // Handle phone input with auto-formatting
  const handlePhoneChange = (value: string) => {
    // Limpiar entrada - solo números y +
    const cleaned = value.replace(/[^\d+]/g, '');
    
    let formatted = cleaned;
    
    // Formatear según patrón
    if (!cleaned.startsWith('+')) {
      if (cleaned.startsWith('56') && cleaned.length >= 11) {
        formatted = `+${cleaned}`;
      } else if (cleaned.startsWith('9') && cleaned.length === 9) {
        formatted = `+56${cleaned}`;
      } else if (!cleaned.startsWith('9') && !cleaned.startsWith('56') && cleaned.length === 8) {
        formatted = `+56${cleaned}`;
      } else {
        formatted = cleaned;
      }
    }
    
    // Actualizar estado
    setForm(prev => ({ ...prev, telefono: formatted }));
    
    // Validar usando la misma función que validateForm
    if (formatted.trim()) {
      const isValid = validateChileanPhone(formatted);
      setValidationStatus(prev => ({ ...prev, telefono: isValid ? 'valid' : 'invalid' }));
    } else {
      setValidationStatus(prev => ({ ...prev, telefono: null }));
    }
    
    // Limpiar errores
    if (errors.telefono) {
      setErrors(prev => ({ ...prev, telefono: undefined }));
    }
  };
  
  // Handle auto-separation when user types in nombre field
  const handleNombreChange = (value: string) => {
    const { nombre, apellido } = separateNames(value);
    
    // If there are multiple words, auto-separate
    if (apellido && !form.apellido_paterno) {
      setForm(prev => ({ 
        ...prev, 
        nombre,
        apellido_paterno: apellido
      }));
    } else {
      setForm(prev => ({ ...prev, nombre: value }));
    }
    
    // Clear error when user starts typing
    if (errors.nombre) {
      setErrors(prev => ({ ...prev, nombre: undefined }));
    }
  };

  // Get validation icon and color
  const getValidationIcon = (status: 'valid' | 'invalid' | 'incomplete' | null) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'incomplete':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Nombre *
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => handleNombreChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.nombre ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Francisco Eduardo"
            />
            {errors.nombre && (
              <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Si escribes varios nombres, se separarán automáticamente
            </p>
          </div>
          
          {/* Apellido Paterno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellido Paterno *
            </label>
            <input
              type="text"
              value={form.apellido_paterno}
              onChange={(e) => handleInputChange('apellido_paterno', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.apellido_paterno ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="González"
            />
            {errors.apellido_paterno && (
              <p className="text-red-600 text-sm mt-1">{errors.apellido_paterno}</p>
            )}
          </div>

          {/* Apellido Materno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellido Materno
            </label>
            <input
              type="text"
              value={form.apellido_materno}
              onChange={(e) => handleInputChange('apellido_materno', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Silva (opcional)"
            />
          </div>
          
          {/* RUT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RUT *
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.rut}
                onChange={(e) => handleRutChange(e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.rut ? 'border-red-300' : 
                  validationStatus.rut === 'valid' ? 'border-green-300' :
                  validationStatus.rut === 'invalid' ? 'border-red-300' :
                  'border-gray-300'
                }`}
                placeholder="Ej: 15904181-6 (se formatea con puntos automáticamente)"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {getValidationIcon(validationStatus.rut)}
              </div>
            </div>
            {errors.rut && (
              <p className="text-red-600 text-sm mt-1">{errors.rut}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {validationStatus.rut === 'incomplete' ? 'Continúa escribiendo... (necesitas el dígito verificador)' :
               validationStatus.rut === 'valid' ? '✓ RUT válido' :
               validationStatus.rut === 'invalid' ? '✗ RUT inválido' :
               'Escribe números y dígito verificador, se formatea con puntos automáticamente'}
            </p>
          </div>
          
          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Teléfono *
            </label>
            <div className="relative">
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.telefono ? 'border-red-300' : 
                  validationStatus.telefono === 'valid' ? 'border-green-300' :
                  validationStatus.telefono === 'invalid' ? 'border-red-300' :
                  'border-gray-300'
                }`}
                placeholder="Ej: 952247018 o 56952247018"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {getValidationIcon(validationStatus.telefono)}
              </div>
            </div>
            {errors.telefono && (
              <p className="text-red-600 text-sm mt-1">{errors.telefono}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {validationStatus.telefono === 'valid' ? '✓ Número válido' :
               validationStatus.telefono === 'invalid' ? '✗ Número inválido' :
               'Se agrega +56 automáticamente al completar'}
            </p>
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="cliente@email.com (opcional)"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          {/* WhatsApp Checkbox */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="whatsapp"
                checked={form.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
              />
              <label htmlFor="whatsapp" className="flex items-center text-sm font-medium text-gray-700">
                <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                Contacto por WhatsApp
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-7">
              Marcar si el cliente prefiere ser contactado por WhatsApp
            </p>
          </div>
        </div>
        
        {/* Form Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Funciones automáticas:</strong>
          </p>
          <ul className="text-xs text-blue-600 mt-1 space-y-1">
            <li>• <strong>RUT:</strong> Se formatea automáticamente con puntos (ej: 15.904.181-6)</li>
            <li>• <strong>Teléfono:</strong> Se agrega +56 automáticamente a números chilenos</li>
            <li>• <strong>Nombres:</strong> Se separan automáticamente si escribes varios</li>
          </ul>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={closeModal}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Actualizar' : 'Crear'} Cliente</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
} 