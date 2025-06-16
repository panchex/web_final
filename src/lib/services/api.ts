import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Cliente, 
  Equipo, 
  OrdenTrabajo, 
  Producto, 
  Servicio,
  ApiResponse,
  PaginatedResponse,
  ClienteForm,
  EquipoForm,
  OrdenTrabajoForm
} from '@/lib/types/entities';

// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.88.225:8000';

// Usar proxy local para evitar CORS en desarrollo
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // En el cliente, usar el proxy local
    return '/api/proxy';
  }
  // En el servidor, usar la URL directa
  return API_BASE_URL;
};

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: getApiUrl(),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para requests
    this.api.interceptors.request.use(
      (config) => {
        // Agregar token de autenticación si existe
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para responses
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos genéricos
  private async get<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url);
    return response.data;
  }

  private async post<T>(url: string, data?: unknown): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data);
    return response.data;
  }

  private async put<T>(url: string, data?: unknown): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data);
    return response.data;
  }

  private async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.get<{ status: string }>('/health');
      return { 
        status: response.status || 'ok', 
        timestamp: new Date().toISOString() 
      };
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Clientes
  async getClientes(page = 1, limit = 10): Promise<PaginatedResponse<Cliente>> {
    return this.get(`/clientes?page=${page}&limit=${limit}`);
  }

  async getCliente(id: string): Promise<ApiResponse<Cliente>> {
    return this.get(`/clientes/${id}`);
  }

  async createCliente(data: ClienteForm): Promise<ApiResponse<Cliente>> {
    return this.post('/clientes', data);
  }

  async updateCliente(id: string, data: Partial<ClienteForm>): Promise<ApiResponse<Cliente>> {
    return this.put(`/clientes/${id}`, data);
  }

  async deleteCliente(id: string): Promise<ApiResponse<null>> {
    return this.delete(`/clientes/${id}`);
  }

  async searchClientes(query: string): Promise<ApiResponse<Cliente[]>> {
    return this.get(`/clientes/search?q=${encodeURIComponent(query)}`);
  }

  // Equipos
  async getEquipos(page = 1, limit = 10): Promise<PaginatedResponse<Equipo>> {
    return this.get(`/equipos?page=${page}&limit=${limit}`);
  }

  async getEquipo(id: string): Promise<ApiResponse<Equipo>> {
    return this.get(`/equipos/${id}`);
  }

  async getEquiposByCliente(clienteId: string): Promise<ApiResponse<Equipo[]>> {
    return this.get(`/clientes/${clienteId}/equipos`);
  }

  async createEquipo(data: EquipoForm): Promise<ApiResponse<Equipo>> {
    return this.post('/equipos', data);
  }

  async updateEquipo(id: string, data: Partial<EquipoForm>): Promise<ApiResponse<Equipo>> {
    return this.put(`/equipos/${id}`, data);
  }

  async deleteEquipo(id: string): Promise<ApiResponse<null>> {
    return this.delete(`/equipos/${id}`);
  }

  // Órdenes de Trabajo
  async getOrdenes(page = 1, limit = 10): Promise<PaginatedResponse<OrdenTrabajo>> {
    return this.get(`/ordenes?page=${page}&limit=${limit}`);
  }

  async getOrden(id: string): Promise<ApiResponse<OrdenTrabajo>> {
    return this.get(`/ordenes/${id}`);
  }

  async createOrden(data: OrdenTrabajoForm): Promise<ApiResponse<OrdenTrabajo>> {
    return this.post('/ordenes', data);
  }

  async updateOrden(id: string, data: Partial<OrdenTrabajoForm>): Promise<ApiResponse<OrdenTrabajo>> {
    return this.put(`/ordenes/${id}`, data);
  }

  async deleteOrden(id: string): Promise<ApiResponse<null>> {
    return this.delete(`/ordenes/${id}`);
  }

  async getOrdenesByEstado(estado: string): Promise<ApiResponse<OrdenTrabajo[]>> {
    return this.get(`/ordenes/estado/${estado}`);
  }

  // Productos
  async getProductos(page = 1, limit = 10): Promise<PaginatedResponse<Producto>> {
    return this.get(`/productos?page=${page}&limit=${limit}`);
  }

  async getProducto(id: string): Promise<ApiResponse<Producto>> {
    return this.get(`/productos/${id}`);
  }

  async createProducto(data: Partial<Producto>): Promise<ApiResponse<Producto>> {
    return this.post('/productos', data);
  }

  async updateProducto(id: string, data: Partial<Producto>): Promise<ApiResponse<Producto>> {
    return this.put(`/productos/${id}`, data);
  }

  async deleteProducto(id: string): Promise<ApiResponse<null>> {
    return this.delete(`/productos/${id}`);
  }

  async searchProductos(query: string): Promise<ApiResponse<Producto[]>> {
    return this.get(`/productos/search?q=${encodeURIComponent(query)}`);
  }

  // Servicios
  async getServicios(page = 1, limit = 10): Promise<PaginatedResponse<Servicio>> {
    return this.get(`/servicios?page=${page}&limit=${limit}`);
  }

  async getServicio(id: string): Promise<ApiResponse<Servicio>> {
    return this.get(`/servicios/${id}`);
  }

  async createServicio(data: Partial<Servicio>): Promise<ApiResponse<Servicio>> {
    return this.post('/servicios', data);
  }

  async updateServicio(id: string, data: Partial<Servicio>): Promise<ApiResponse<Servicio>> {
    return this.put(`/servicios/${id}`, data);
  }

  async deleteServicio(id: string): Promise<ApiResponse<null>> {
    return this.delete(`/servicios/${id}`);
  }

  // Dashboard/Estadísticas
  async getDashboardStats(): Promise<ApiResponse<{
    total_clientes: number;
    total_equipos: number;
    ordenes_pendientes: number;
    ordenes_en_proceso: number;
    ingresos_mes: number;
    ordenes_completadas_mes: number;
  }>> {
    return this.get('/dashboard/stats');
  }

  // Reportes
  async getReporteOrdenes(fechaInicio: string, fechaFin: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.get(`/reportes/ordenes?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`);
  }

  async getReporteIngresos(fechaInicio: string, fechaFin: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.get(`/reportes/ingresos?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`);
  }
}

// Instancia singleton del servicio
export const apiService = new ApiService();

// Exportar también la clase para testing
export default ApiService; 