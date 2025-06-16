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

// Interfaces para Órdenes de Trabajo
export interface Orden {
  id: number;
  numero_orden: string;
  cliente_id: number;
  cliente_nombre?: string;
  cliente_rut?: string;
  cliente_telefono?: string;
  cliente_email?: string;
  equipo_tipo: string;
  equipo_marca: string;
  equipo_modelo: string;
  equipo_serie?: string;
  equipo_color?: string;
  equipo_accesorios?: string;
  problema_reportado: string;
  diagnostico?: string;
  estado: 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  created_at: string;
  fecha_estimada?: string;
  fecha_entrega?: string;
  presupuesto_monto?: number;
  total_final?: number;
  tecnico_asignado?: string;
  tecnico_id?: number;
  notas_internas?: string;
  updated_at: string;
  documentos_count?: number;
}

export interface OrdenDetalle extends Orden {
  cliente: {
    id: number;
    nombre: string;
    apellido_paterno?: string;
    apellido_materno?: string;
    rut: string;
    telefono?: string;
    email?: string;
    whatsapp?: boolean;
  };
  equipo: {
    tipo: string;
    marca: string;
    modelo: string;
    numero_serie?: string;
    color?: string;
    accesorios?: string;
  };
  fechas: {
    ingreso: string;
    estimada?: string;
    entrega?: string;
  };
  costos: {
    estimado?: number;
    final?: number;
    moneda: string;
  };
  tecnico: {
    id?: number;
    nombre?: string;
    especialidad?: string;
  };
  timeline: Array<{
    fecha: string;
    evento: string;
    descripcion: string;
    usuario: string;
  }>;
  documentos: DocumentoOrden[];
}

export interface DocumentoOrden {
  id: number;
  tipo_documento: string;
  nombre_archivo: string;
  descripcion: string;
  fecha_subida: string;
  tamaño: number;
  url_descarga: string;
}

export interface OrdenForm {
  cliente_id: number;
  equipo: {
    tipo: string;
    marca: string;
    modelo: string;
    numero_serie?: string;
    color?: string;
    accesorios?: string;
  };
  problema_reportado: string;
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  fecha_estimada?: string;
  presupuesto_monto?: number;
  tecnico_id?: number;
  notas_internas?: string;
}

export interface OrdenStats {
  total: number;
  pendientes: number;
  en_proceso: number;
  completadas: number;
  canceladas: number;
  urgentes: number;
}

export interface OrdenFilters {
  search?: string;
  estado?: string;
  cliente_id?: number;
  tecnico_id?: number;
  prioridad?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface OrdenResponse {
  success: boolean;
  data: {
    ordenes: Orden[];
    pagination: PaginationInfo;
    stats: OrdenStats;
  };
}

export interface OrdenDetalleResponse {
  success: boolean;
  data: OrdenDetalle;
} 