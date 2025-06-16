// Base types
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Cliente
export interface Cliente extends BaseEntity {
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  notas?: string;
  activo: boolean;
}

// Equipo
export interface Equipo extends BaseEntity {
  cliente_id: string;
  tipo_equipo: string;
  marca: string;
  modelo: string;
  numero_serie?: string;
  descripcion?: string;
  fecha_compra?: string;
  garantia_hasta?: string;
  estado: 'activo' | 'inactivo' | 'reparacion' | 'descartado';
  notas?: string;
  // Relación
  cliente?: Cliente;
}

// Orden de Trabajo
export interface OrdenTrabajo extends BaseEntity {
  numero_orden: string;
  cliente_id: string;
  equipo_id: string;
  fecha_ingreso: string;
  fecha_prometida?: string;
  fecha_entrega?: string;
  estado: 'pendiente' | 'en_proceso' | 'esperando_repuestos' | 'completada' | 'entregada' | 'cancelada';
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  problema_reportado: string;
  diagnostico?: string;
  solucion?: string;
  costo_mano_obra?: number;
  costo_repuestos?: number;
  costo_total?: number;
  tecnico_asignado?: string;
  notas_internas?: string;
  // Relaciones
  cliente?: Cliente;
  equipo?: Equipo;
  servicios?: ServicioOrden[];
  productos?: ProductoOrden[];
}

// Producto/Repuesto
export interface Producto extends BaseEntity {
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  precio_compra?: number;
  precio_venta?: number;
  stock_actual: number;
  stock_minimo: number;
  proveedor?: string;
  ubicacion?: string;
  activo: boolean;
}

// Servicio
export interface Servicio extends BaseEntity {
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  precio: number;
  tiempo_estimado?: number; // en minutos
  activo: boolean;
}

// Relación Servicio-Orden
export interface ServicioOrden {
  id: string;
  orden_id: string;
  servicio_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  notas?: string;
  // Relación
  servicio?: Servicio;
}

// Relación Producto-Orden
export interface ProductoOrden {
  id: string;
  orden_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  notas?: string;
  // Relación
  producto?: Producto;
}

// Visita/Seguimiento
export interface Visita extends BaseEntity {
  orden_id: string;
  fecha_visita: string;
  tipo_visita: 'diagnostico' | 'reparacion' | 'seguimiento' | 'entrega';
  descripcion: string;
  tecnico: string;
  tiempo_invertido?: number; // en minutos
  costo?: number;
  // Relación
  orden?: OrdenTrabajo;
}

// Documento
export interface Documento extends BaseEntity {
  orden_id: string;
  nombre_archivo: string;
  tipo_documento: 'presupuesto' | 'factura' | 'garantia' | 'foto' | 'manual' | 'otro';
  ruta_archivo: string;
  tamaño_archivo: number;
  descripcion?: string;
  // Relación
  orden?: OrdenTrabajo;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Form types
export interface ClienteForm {
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  notas?: string;
}

export interface EquipoForm {
  cliente_id: string;
  tipo_equipo: string;
  marca: string;
  modelo: string;
  numero_serie?: string;
  descripcion?: string;
  fecha_compra?: string;
  garantia_hasta?: string;
  notas?: string;
}

export interface OrdenTrabajoForm {
  cliente_id: string;
  equipo_id: string;
  fecha_prometida?: string;
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  problema_reportado: string;
  tecnico_asignado?: string;
  notas_internas?: string;
} 