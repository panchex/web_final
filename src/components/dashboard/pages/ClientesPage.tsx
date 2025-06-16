'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  Settings,
  Copy,
  Check,
  Loader2
} from 'lucide-react';
import { useDashboardStore } from '@/lib/stores/dashboard-store';
import { clienteService, Cliente, ClienteFilters } from '@/lib/services/clienteService';
import toast from 'react-hot-toast';

export function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalClientes, setTotalClientes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const { openModal } = useDashboardStore();
  
  // Load clientes from API
  const loadClientes = async (filters: ClienteFilters = {}) => {
    try {
      setLoading(true);
      const response = await clienteService.getClientes({
        search: searchTerm || undefined,
        page: currentPage,
        per_page: 20,
        ...filters
      });
      
      if (response.success && Array.isArray(response.data)) {
        setClientes(response.data);
        setTotalClientes(response.total || response.data.length);
      } else {
        console.error('Error loading clientes:', response.error);
        toast.error('Error al cargar los clientes');
        setClientes([]);
      }
    } catch (error) {
      console.error('Error loading clientes:', error);
      toast.error('Error de conexión al cargar los clientes');
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  // Load clientes on component mount
  useEffect(() => {
    loadClientes();
  }, [currentPage]);

  // Listen for cliente updates
  useEffect(() => {
    const handleClienteUpdated = () => {
      loadClientes();
    };

    window.addEventListener('clienteUpdated', handleClienteUpdated);
    
    return () => {
      window.removeEventListener('clienteUpdated', handleClienteUpdated);
    };
  }, []);

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      loadClientes({ search: searchTerm || undefined });
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchTerm]);
  
  // Helper function to get full name
  const getFullName = (cliente: Cliente) => {
    return `${cliente.nombre} ${cliente.apellido_paterno}${cliente.apellido_materno ? ' ' + cliente.apellido_materno : ''}`.trim();
  };
  
  // Helper function to format RUT
  const formatRUT = (rut: string) => {
    // Si ya está formateado, devolverlo tal como está
    if (rut.includes('.') && rut.includes('-')) {
      return rut;
    }
    
    // Remove any existing formatting
    const cleanRUT = rut.replace(/[.-]/g, '');
    
    // Format as xx.xxx.xxx-x or x.xxx.xxx-x
    if (cleanRUT.length === 9) {
      return `${cleanRUT.slice(0, 2)}.${cleanRUT.slice(2, 5)}.${cleanRUT.slice(5, 8)}-${cleanRUT.slice(8)}`;
    } else if (cleanRUT.length === 8) {
      return `${cleanRUT.slice(0, 1)}.${cleanRUT.slice(1, 4)}.${cleanRUT.slice(4, 7)}-${cleanRUT.slice(7)}`;
    }
    
    return rut; // Return original if format is unexpected
  };
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const handleViewCliente = (cliente: Cliente) => {
    // Convert to old format for compatibility
    const clienteData = {
      ...cliente,
      nombre: getFullName(cliente),
      ultimaVisita: cliente.created_at || new Date().toISOString(),
      totalOrdenes: 0, // TODO: Get from API when available
      totalServicios: 0, // TODO: Get from API when available
      estado: 'activo' as const
    };
    openModal('view-cliente', clienteData);
  };
  
  const handleEditCliente = (cliente: Cliente) => {
    openModal('edit-cliente', cliente);
  };
  
  const handleDeleteCliente = (cliente: Cliente) => {
    const clienteData = {
      ...cliente,
      nombre: getFullName(cliente)
    };
    openModal('delete-cliente', clienteData);
  };
  
  const handleCreateCliente = () => {
    openModal('create-cliente');
  };
  
  const copyEmailToClipboard = async (email: string) => {
    try {
      // Intentar usar la API moderna de clipboard
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(null), 2000);
      } else {
        // Fallback para navegadores que no soportan clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setCopiedEmail(email);
          setTimeout(() => setCopiedEmail(null), 2000);
        } catch (err) {
          console.warn('Fallback copy failed:', err);
          // Mostrar el email en un alert como último recurso
          alert(`Email: ${email}`);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error('Error copying email:', err);
      // Mostrar el email en un alert como último recurso
      alert(`Email: ${email}`);
    }
  };

  // Calculate stats
  const activeClientes = clientes.filter(c => c.estado === 'activo').length;
  const whatsappClientes = clientes.filter(c => c.whatsapp).length;
  const clientesConOrdenes = clientes.filter(c => c.total_ordenes && c.total_ordenes > 0).length;
  
  return (
    <div className="p-6 space-y-6">
      {/* Search Bar with Stats and New Client Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Search Input with New Client Button */}
        <div className="flex gap-4 items-start">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, RUT, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
            )}
          </div>
          
          <button
            onClick={handleCreateCliente}
            className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Cliente</span>
          </button>
        </div>
        
        {/* Compact Stats */}
        {clientes.length > 0 && (
          <div className="mt-4 p-1 bg-gray-50 rounded-lg flex flex-wrap gap-1">
            <div className="flex items-center space-x-2 bg-white rounded-md px-3 py-2 shadow-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">{totalClientes}</span>
              <span className="text-xs text-gray-600">Total</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white rounded-md px-3 py-2 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">{activeClientes}</span>
              <span className="text-xs text-gray-600">Activos</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white rounded-md px-3 py-2 shadow-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">{whatsappClientes}</span>
              <span className="text-xs text-gray-600">WhatsApp</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white rounded-md px-3 py-2 shadow-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">{clientesConOrdenes}</span>
              <span className="text-xs text-gray-600">Con Órdenes</span>
            </div>
          </div>
        )}
        
        {/* Results Info */}
        {searchTerm && (
          <div className="mt-4 text-sm text-gray-600">
            {loading ? 'Buscando...' : `Mostrando ${clientes.length} de ${totalClientes} clientes`}
          </div>
        )}
      </div>
      
      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Lista de Clientes ({loading ? '...' : clientes.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-12 h-12 mx-auto text-gray-400 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Cargando clientes...
            </h3>
            <p className="text-gray-600">
              Por favor espera un momento
            </p>
          </div>
        ) : clientes.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No se encontraron clientes
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza agregando tu primer cliente'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RUT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actividad
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientes.map((cliente) => (
                  <tr 
                    key={cliente.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewCliente(cliente)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatRUT(cliente.rut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold text-xs">
                            {cliente.nombre[0]}{cliente.apellido_paterno[0]}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {getFullName(cliente)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente.telefono}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col items-center space-y-1">
                        {cliente.total_ordenes && cliente.total_ordenes > 0 ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {cliente.total_ordenes} Órdenes
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Sin órdenes</span>
                        )}
                        {cliente.total_servicios && cliente.total_servicios > 0 && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            {cliente.total_servicios} Servicios
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center space-x-2">
                        {cliente.email && (
                          <div className="relative group">
                            <button
                              onClick={() => copyEmailToClipboard(cliente.email!)}
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                              title={cliente.email}
                            >
                              {copiedEmail === cliente.email ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Mail className="w-4 h-4" />
                              )}
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {cliente.email}
                            </div>
                          </div>
                        )}
                        {cliente.whatsapp ? (
                          <button
                            onClick={() => window.open(`https://wa.me/${cliente.telefono.replace(/[^\d]/g, '')}`, '_blank')}
                            className="text-green-600 hover:text-green-700 transition-colors"
                            title="Contactar por WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-gray-300">
                            <MessageCircle className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente.created_at ? formatDate(cliente.created_at) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewCliente(cliente)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Ver cliente"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleEditCliente(cliente)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Editar cliente"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteCliente(cliente)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Eliminar cliente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 