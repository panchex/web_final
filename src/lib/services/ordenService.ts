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

export class OrdenService {
  // Obtener estadísticas de órdenes
  static async getStats(): Promise<OrdenStats> {
    const response = await fetch(`${API_BASE}/stats`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Error al obtener estadísticas');
    }
    
    return data.data || data;
  }

  // Listar órdenes con filtros
  static async getOrdenes(
    filters: OrdenFilters = {}, 
    pagination: PaginationParams = { page: 1, per_page: 20 }
  ): Promise<OrdenResponse> {
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