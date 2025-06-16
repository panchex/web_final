import { 
  Orden, 
  OrdenDetalle, 
  OrdenForm, 
  OrdenStats, 
  OrdenFilters, 
  OrdenResponse, 
  OrdenDetalleResponse
} from '@/lib/types/entities';

interface PaginationParams {
  page: number;
  per_page: number;
}

const API_BASE = '/api/ordenes';

// Mock data para cuando el backend no esté disponible
const MOCK_STATS: OrdenStats = {
  total: 8,
  pendientes: 2,
  en_proceso: 3,
  completadas: 2,
  canceladas: 1,
  urgentes: 1
};

const MOCK_ORDENES: Orden[] = [
  {
    id: 1,
    numero_orden: 'OT-2024-001',
    cliente_id: 1,
    cliente_nombre: 'Juan Pérez González',
    cliente_rut: '12345678-9',
    cliente_telefono: '+56912345678',
    cliente_email: 'juan.perez@email.com',
    equipo_tipo: 'Laptop',
    equipo_marca: 'HP',
    equipo_modelo: 'Pavilion 15',
    equipo_serie: 'HP123456',
    problema_reportado: 'No enciende, posible problema en fuente de poder',
    diagnostico: 'Fuente de poder dañada',
    estado: 'pendiente',
    prioridad: 'media',
    created_at: '2024-01-15T10:30:00Z',
    fecha_estimada: '2024-01-20T00:00:00Z',
    presupuesto_monto: 45000,
    tecnico_asignado: 'Carlos Méndez',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    numero_orden: 'OT-2024-002',
    cliente_id: 2,
    cliente_nombre: 'María González Silva',
    cliente_rut: '98765432-1',
    cliente_telefono: '+56987654321',
    cliente_email: 'maria.gonzalez@email.com',
    equipo_tipo: 'Smartphone',
    equipo_marca: 'Samsung',
    equipo_modelo: 'Galaxy S21',
    problema_reportado: 'Pantalla rota, táctil no responde',
    diagnostico: 'Pantalla y digitalizador dañados',
    estado: 'en_proceso',
    prioridad: 'alta',
    created_at: '2024-01-16T14:20:00Z',
    fecha_estimada: '2024-01-22T00:00:00Z',
    presupuesto_monto: 85000,
    tecnico_asignado: 'Ana Silva',
    updated_at: '2024-01-16T14:20:00Z'
  },
  {
    id: 3,
    numero_orden: 'OT-2024-003',
    cliente_id: 3,
    cliente_nombre: 'Carlos Rodríguez López',
    cliente_rut: '11223344-5',
    cliente_telefono: '+56911223344',
    cliente_email: 'carlos.rodriguez@email.com',
    equipo_tipo: 'PC Desktop',
    equipo_marca: 'Custom',
    equipo_modelo: 'Gaming PC',
    problema_reportado: 'Lentitud general, posible virus',
    diagnostico: 'Malware detectado, disco fragmentado',
    estado: 'completada',
    prioridad: 'baja',
    created_at: '2024-01-10T09:15:00Z',
    fecha_estimada: '2024-01-15T00:00:00Z',
    fecha_entrega: '2024-01-14T16:30:00Z',
    presupuesto_monto: 25000,
    total_final: 25000,
    tecnico_asignado: 'Pedro Morales',
    updated_at: '2024-01-14T16:30:00Z'
  },
  {
    id: 4,
    numero_orden: 'OT-2024-004',
    cliente_id: 4,
    cliente_nombre: 'Ana Silva Martínez',
    cliente_rut: '55667788-9',
    cliente_telefono: '+56955667788',
    cliente_email: 'ana.silva@email.com',
    equipo_tipo: 'Tablet',
    equipo_marca: 'Apple',
    equipo_modelo: 'iPad Air',
    problema_reportado: 'No carga la batería',
    estado: 'en_proceso',
    prioridad: 'media',
    created_at: '2024-01-17T11:45:00Z',
    fecha_estimada: '2024-01-25T00:00:00Z',
    presupuesto_monto: 55000,
    tecnico_asignado: 'Carlos Méndez',
    updated_at: '2024-01-17T11:45:00Z'
  },
  {
    id: 5,
    numero_orden: 'OT-2024-005',
    cliente_id: 5,
    cliente_nombre: 'Pedro Morales Castro',
    cliente_rut: '99887766-5',
    cliente_telefono: '+56999887766',
    equipo_tipo: 'Impresora',
    equipo_marca: 'Canon',
    equipo_modelo: 'PIXMA G3110',
    problema_reportado: 'No imprime colores, solo negro',
    estado: 'cancelada',
    prioridad: 'baja',
    created_at: '2024-01-12T13:20:00Z',
    updated_at: '2024-01-12T13:20:00Z'
  }
];

export class OrdenService {
  // Obtener estadísticas de órdenes
  static async getStats(): Promise<OrdenStats> {
    try {
      const response = await fetch(`${API_BASE}/stats`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || 'Error al obtener estadísticas');
      }
      
      return data.data || data;
    } catch (error) {
      console.warn('Backend no disponible, usando datos mock');
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_STATS;
    }
  }

  // Listar órdenes con filtros
  static async getOrdenes(
    filters: OrdenFilters = {}, 
    pagination: PaginationParams = { page: 1, per_page: 20 }
  ): Promise<OrdenResponse> {
    try {
      const params = new URLSearchParams();
      
      // Agregar filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
      
      // Agregar paginación
      params.append('page', pagination.page.toString());
      params.append('per_page', pagination.per_page.toString());
      
      const response = await fetch(`${API_BASE}?${params.toString()}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || 'Error al obtener órdenes');
      }
      
      return data;
    } catch (error) {
      console.warn('Backend no disponible, usando datos mock');
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filtrar datos mock según los filtros
      let filteredOrdenes = [...MOCK_ORDENES];
      
      if (filters.estado) {
        const estados = filters.estado.split(',');
        filteredOrdenes = filteredOrdenes.filter(orden => 
          estados.includes(orden.estado)
        );
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredOrdenes = filteredOrdenes.filter(orden =>
          orden.numero_orden.toLowerCase().includes(searchTerm) ||
          orden.cliente_nombre?.toLowerCase().includes(searchTerm) ||
          orden.equipo_marca.toLowerCase().includes(searchTerm) ||
          orden.equipo_modelo.toLowerCase().includes(searchTerm) ||
          orden.problema_reportado.toLowerCase().includes(searchTerm)
        );
      }
      
      return {
        success: true,
        data: {
          ordenes: filteredOrdenes,
          pagination: {
            current_page: pagination.page,
            per_page: pagination.per_page,
            total: filteredOrdenes.length,
            total_pages: Math.ceil(filteredOrdenes.length / pagination.per_page),
            has_next: false,
            has_prev: false
          },
          stats: MOCK_STATS
        }
      };
    }
  }

  // Obtener detalle de una orden
  static async getOrden(id: number): Promise<OrdenDetalle> {
    const response = await fetch(`${API_BASE}/${id}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Error al obtener la orden');
    }
    
    return data.data;
  }

  // Crear nueva orden
  static async createOrden(ordenData: OrdenForm): Promise<Orden> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ordenData),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Error al crear la orden');
    }
    
    return data.data;
  }

  // Actualizar orden completa
  static async updateOrden(id: number, ordenData: Partial<OrdenForm>): Promise<Orden> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ordenData),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Error al actualizar la orden');
    }
    
    return data.data;
  }

  // Cambiar estado de una orden
  static async cambiarEstado(
    id: number, 
    estado: 'pendiente' | 'en_proceso' | 'completada' | 'cancelada',
    notas?: string
  ): Promise<Orden> {
    const response = await fetch(`${API_BASE}/${id}?action=estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado, notas }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Error al cambiar el estado');
    }
    
    return data.data;
  }

  // Eliminar orden
  static async deleteOrden(id: number): Promise<{ documentos_eliminados: number }> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Error al eliminar la orden');
    }
    
    return data.data;
  }

  // Subir documentos a una orden
  static async uploadDocumentos(id: number, formData: FormData): Promise<any> {
    const response = await fetch(`${API_BASE}/${id}/documentos`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Error al subir documentos');
    }
    
    return data.data;
  }

  // Validar filtros obligatorios
  static validateFilters(filters: OrdenFilters): boolean {
    return !!(
      filters.search || 
      filters.estado || 
      filters.cliente_id || 
      filters.tecnico_id
    );
  }

  // Validar si es filtro de múltiples estados
  static isMultipleStatesFilter(estado: string): boolean {
    return estado.includes(',');
  }

  // Formatear número de orden
  static formatNumeroOrden(numero: string): string {
    return numero.startsWith('OT-') ? numero : `OT-${numero}`;
  }

  // Obtener color de estado
  static getEstadoColor(estado: string): string {
    const colors = {
      'pendiente': 'text-yellow-600 bg-yellow-100',
      'en_proceso': 'text-blue-600 bg-blue-100',
      'completada': 'text-green-600 bg-green-100',
      'cancelada': 'text-red-600 bg-red-100'
    };
    return colors[estado as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  }

  // Obtener color de prioridad
  static getPrioridadColor(prioridad: string): string {
    const colors = {
      'baja': 'text-gray-600 bg-gray-100',
      'media': 'text-blue-600 bg-blue-100',
      'alta': 'text-orange-600 bg-orange-100',
      'urgente': 'text-red-600 bg-red-100'
    };
    return colors[prioridad as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  }
} 