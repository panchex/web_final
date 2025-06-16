const API_BASE_URL = '/api';

export interface Cliente {
  id?: number;
  rut: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  telefono: string;
  email?: string;
  whatsapp: boolean;
  direccion?: string;
  preferencia_contacto?: string;
  consentimiento_mensajes?: boolean;
  estado?: string;
  ultima_visita?: string;
  total_ordenes?: number;
  total_servicios?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ClienteResponse {
  success: boolean;
  data?: Cliente | Cliente[];
  error?: string;
  total?: number;
  page?: number;
  per_page?: number;
}

export interface ClienteFilters {
  search?: string;
  page?: number;
  per_page?: number;
}

class ClienteService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getClientes(filters: ClienteFilters = {}): Promise<ClienteResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    
    const queryString = params.toString();
    const endpoint = `/clientes${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ClienteResponse>(endpoint);
  }

  async getCliente(id: number): Promise<ClienteResponse> {
    return this.request<ClienteResponse>(`/clientes/${id}`);
  }

  async createCliente(cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>): Promise<ClienteResponse> {
    return this.request<ClienteResponse>('/clientes', {
      method: 'POST',
      body: JSON.stringify(cliente),
    });
  }

  async updateCliente(id: number, cliente: Partial<Omit<Cliente, 'id' | 'created_at' | 'updated_at'>>): Promise<ClienteResponse> {
    return this.request<ClienteResponse>(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cliente),
    });
  }

  async deleteCliente(id: number): Promise<ClienteResponse> {
    return this.request<ClienteResponse>(`/clientes/${id}`, {
      method: 'DELETE',
    });
  }
}

export const clienteService = new ClienteService(); 