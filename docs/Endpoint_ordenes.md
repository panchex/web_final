# API Endpoints - Sistema de Órdenes de Trabajo

## Descripción General

Este documento describe todos los endpoints necesarios para el sistema de órdenes de trabajo de OmegaElectronics. Los endpoints están diseñados para soportar un flujo completo de gestión de órdenes con documentos asociados.

## Base URL
```
http://192.168.88.225:8000/api/v1
```

## Autenticación
Todos los endpoints requieren autenticación JWT:
```
Authorization: Bearer <token>
```

---

## ⚠️ **IMPORTANTE: Comportamiento en Producción vs Desarrollo**

### 🚀 **Filtrado del Lado del Servidor (Producción)**
En el entorno de **producción**, es **CRÍTICO** que todos los filtros se procesen en el servidor:

- **Lista inicial VACÍA**: Al abrir la página de órdenes, NO se debe cargar ningún dato automáticamente
- **Búsqueda obligatoria**: Los datos solo se muestran cuando el usuario:
  - Hace clic en un botón de filtro (Pendientes, En Proceso, etc.)
  - Escribe en el campo de búsqueda (mínimo 3 caracteres)
  - Selecciona un cliente específico
- **Rendimiento**: Con miles de órdenes, cargar todo sería inviable
- **UX**: Evita sobrecarga visual y mejora la experiencia de búsqueda dirigida

### 🛠️ **Implementación Recomendada Frontend**
```javascript
// Estado inicial - lista vacía
const [ordenes, setOrdenes] = useState([]);
const [loading, setLoading] = useState(false);
const [hasSearched, setHasSearched] = useState(false);

// Solo buscar cuando hay criterios específicos
const fetchOrdenes = async (filters) => {
  if (!filters.search && !filters.estado && !filters.cliente_id) {
    return; // No buscar sin criterios
  }
  
  setLoading(true);
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/v1/ordenes?${params}`);
  const data = await response.json();
  setOrdenes(data.ordenes);
  setHasSearched(true);
  setLoading(false);
};
```

### 📊 **Estadísticas Dinámicas**
Las estadísticas (contadores de estados) deben obtenerse mediante endpoint separado:
```http
GET /ordenes/stats
```

---

## 📋 Endpoints de Órdenes

### 1. Obtener Estadísticas de Órdenes
```http
GET /ordenes/stats
```

**Descripción**: Obtiene contadores por estado para los botones de filtro. **CRÍTICO en producción** para evitar cargar todas las órdenes.

**Parámetros de consulta opcionales:**
- `cliente_id` (int, opcional): Estadísticas de un cliente específico
- `tecnico_id` (int, opcional): Estadísticas de un técnico específico
- `fecha_desde` (date, opcional): Filtrar desde fecha
- `fecha_hasta` (date, opcional): Filtrar hasta fecha

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "total": 1247,
    "pendientes": 89,
    "en_proceso": 156,
    "completadas": 967,
    "canceladas": 35,
    "urgentes": 23,
    "por_tecnico": [
      {
        "tecnico_id": 1,
        "tecnico_nombre": "Carlos Mendoza",
        "asignadas": 45,
        "completadas": 38
      }
    ],
    "ultimas_24h": {
      "nuevas": 12,
      "completadas": 8,
      "canceladas": 1
    }
  }
}
```

### 2. Listar Órdenes
```http
GET /ordenes
```

**⚠️ IMPORTANTE**: En producción, este endpoint **NO debe ejecutarse sin parámetros de filtro**. Debe retornar error 400 si no se proporciona al menos uno de: `search`, `estado`, `cliente_id`, `tecnico_id`.

**Parámetros de consulta:**
- `page` (int, opcional): Número de página (default: 1)
- `limit` (int, opcional): Elementos por página (default: 20, max: 100)
- `search` (string, **requerido en producción**): Búsqueda en número, cliente, equipo o problema (mínimo 3 caracteres)
- `estado` (string, opcional): Filtrar por estado (`pendiente`, `en_proceso`, `completada`, `cancelada`)
- `prioridad` (string, opcional): Filtrar por prioridad (`baja`, `media`, `alta`, `urgente`)
- `cliente_id` (int, opcional): Filtrar por cliente específico
- `tecnico_id` (int, opcional): Filtrar por técnico asignado
- `fecha_desde` (date, opcional): Filtrar desde fecha (YYYY-MM-DD)
- `fecha_hasta` (date, opcional): Filtrar hasta fecha (YYYY-MM-DD)

**Validación en Producción:**
```json
// Error si no hay filtros
{
  "success": false,
  "error": {
    "code": "FILTER_REQUIRED",
    "message": "Debe proporcionar al menos un criterio de búsqueda",
    "details": "Use 'search', 'estado', 'cliente_id' o 'tecnico_id'"
  }
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "ordenes": [
      {
        "id": 1,
        "numero_orden": "ORD-2024-001",
        "cliente_id": 1,
        "cliente_nombre": "Juan Pérez González",
        "cliente_rut": "12345678-9",
        "cliente_telefono": "+56912345678",
        "cliente_email": "juan.perez@email.com",
        "equipo_tipo": "Smartphone",
        "equipo_marca": "Samsung",
        "equipo_modelo": "Galaxy S21",
        "equipo_serie": "SM-G991B123456",
        "problema_reportado": "Pantalla rota, no responde al tacto",
        "diagnostico": "Reemplazo de pantalla y digitalizador necesario",
        "estado": "en_proceso",
        "prioridad": "alta",
        "created_at": "2024-12-15T10:30:00Z",
        "fecha_estimada": "2024-12-18T16:00:00Z",
        "fecha_entrega": null,
        "presupuesto_monto": 85000,
        "total_final": null,
        "tecnico_asignado": "Carlos Mendoza",
        "tecnico_id": 2,
        "notas_internas": "Cliente requiere urgencia por trabajo",
        "created_at": "2024-12-15T10:30:00Z",
        "updated_at": "2024-12-15T14:20:00Z",
        "documentos_count": 3
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 45,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    },
    "stats": {
      "total": 45,
      "pendientes": 12,
      "en_proceso": 18,
      "completadas": 13,
      "canceladas": 2,
      "urgentes": 5
    }
  }
}
```

### 3. Obtener Orden Específica
```http
GET /ordenes/{id}
```

**Parámetros de ruta:**
- `id` (int, requerido): ID de la orden

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "numero_orden": "ORD-2024-001",
    "cliente": {
      "id": 1,
      "nombre": "Juan",
      "apellido_paterno": "Pérez",
      "apellido_materno": "González",
      "rut": "12345678-9",
      "telefono": "+56912345678",
      "email": "juan.perez@email.com",
      "whatsapp": true
    },
    "equipo": {
      "tipo": "Smartphone",
      "marca": "Samsung",
      "modelo": "Galaxy S21",
      "numero_serie": "SM-G991B123456",
      "color": "Negro",
      "accesorios": "Cargador, funda"
    },
    "problema_reportado": "Pantalla rota, no responde al tacto",
    "diagnostico": "Reemplazo de pantalla y digitalizador necesario",
    "estado": "en_proceso",
    "prioridad": "alta",
    "fechas": {
      "ingreso": "2024-12-15T10:30:00Z",
      "estimada": "2024-12-18T16:00:00Z",
      "entrega": null
    },
    "costos": {
      "estimado": 85000,
      "final": null,
      "moneda": "CLP"
    },
    "tecnico": {
      "id": 2,
      "nombre": "Carlos Mendoza",
      "especialidad": "Reparación móviles"
    },
    "timeline": [
      {
        "fecha": "2024-12-15T10:30:00Z",
        "evento": "Orden creada",
        "descripcion": "Orden ingresada al sistema",
        "usuario": "Recepción"
      },
      {
        "fecha": "2024-12-15T14:20:00Z",
        "evento": "Diagnóstico completado",
        "descripcion": "Pantalla y digitalizador dañados",
        "usuario": "Carlos Mendoza"
      }
    ],
    "documentos": [
      {
        "id": 1,
        "tipo_documento": "imagen",
        "nombre_archivo": "estado_inicial_samsung.jpg",
        "descripcion": "Foto del estado inicial del equipo",
        "fecha_subida": "2024-12-15T10:35:00Z",
        "tamaño": 1843200,
        "url_descarga": "/api/v1/documentos/1/download"
      }
    ],
    "notas_internas": "Cliente requiere urgencia por trabajo",
    "created_at": "2024-12-15T10:30:00Z",
    "updated_at": "2024-12-15T14:20:00Z"
  }
}
```

### 4. Crear Nueva Orden
```http
POST /ordenes
```

**Cuerpo de la petición:**
```json
{
  "cliente_id": 1,
  "equipo": {
    "tipo": "Smartphone",
    "marca": "Samsung",
    "modelo": "Galaxy S21",
    "numero_serie": "SM-G991B123456",
    "color": "Negro",
    "accesorios": "Cargador, funda"
  },
  "problema_reportado": "Pantalla rota, no responde al tacto",
  "prioridad": "alta",
  "fecha_estimada": "2024-12-18",
  "presupuesto_monto": 85000,
  "tecnico_id": 2,
  "notas_internas": "Cliente requiere urgencia por trabajo"
}
```

**Validaciones:**
- `cliente_id`: Requerido, debe existir
- `equipo.tipo`: Requerido, máximo 50 caracteres
- `equipo.marca`: Requerido, máximo 50 caracteres
- `equipo.modelo`: Requerido, máximo 100 caracteres
- `problema_reportado`: Requerido, mínimo 10 caracteres
- `prioridad`: Opcional, valores válidos: `baja`, `media`, `alta`, `urgente`
- `fecha_estimada`: Opcional, debe ser fecha futura
- `presupuesto_monto`: Opcional, debe ser positivo

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Orden creada exitosamente",
  "data": {
    "id": 46,
    "numero_orden": "ORD-2024-046",
    "estado": "pendiente",
    "created_at": "2024-12-15T15:30:00Z"
  }
}
```

### 5. Actualizar Orden
```http
PUT /ordenes/{id}
```

**Parámetros de ruta:**
- `id` (int, requerido): ID de la orden

**Cuerpo de la petición:** (Misma estructura que crear, todos los campos opcionales)

**Reglas de negocio:**
- Solo órdenes en estado `pendiente` o `en_proceso` pueden ser editadas completamente
- Órdenes `completadas` solo permiten actualizar `notas_internas`
- Órdenes `canceladas` no pueden ser editadas

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Orden actualizada exitosamente",
  "data": {
    "id": 1,
    "updated_at": "2024-12-15T16:45:00Z"
  }
}
```

### 6. Eliminar Orden
```http
DELETE /ordenes/{id}
```

**Parámetros de ruta:**
- `id` (int, requerido): ID de la orden

**Reglas de negocio:**
- Solo órdenes en estado `pendiente` pueden ser eliminadas
- Se eliminan también todos los documentos asociados
- Acción irreversible

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Orden eliminada exitosamente",
  "data": {
    "documentos_eliminados": 3
  }
}
```

### 7. Cambiar Estado de Orden
```http
PATCH /ordenes/{id}/estado
```

**Parámetros de ruta:**
- `id` (int, requerido): ID de la orden

**Cuerpo de la petición:**
```json
{
  "estado": "completada",
  "notas": "Reparación completada satisfactoriamente",
  "total_final": 85000
}
```

**Estados válidos y transiciones:**
- `pendiente` → `en_proceso`, `cancelada`
- `en_proceso` → `completada`, `cancelada`
- `completada` → No permite cambios
- `cancelada` → No permite cambios

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Estado actualizado exitosamente",
  "data": {
    "estado_anterior": "en_proceso",
    "estado_nuevo": "completada",
    "fecha_cambio": "2024-12-18T14:30:00Z"
  }
}
```

### 8. Asignar Técnico
```http
PATCH /ordenes/{id}/tecnico
```

**Parámetros de ruta:**
- `id` (int, requerido): ID de la orden

**Cuerpo de la petición:**
```json
{
  "tecnico_id": 3,
  "notas": "Reasignado por especialización en Samsung"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Técnico asignado exitosamente",
  "data": {
    "tecnico_anterior": "Carlos Mendoza",
    "tecnico_nuevo": "Ana García",
    "fecha_asignacion": "2024-12-15T16:00:00Z"
  }
}
```

---

## 📄 Endpoints de Documentos

### 9. Subir Documento a Orden
```http
POST /ordenes/{orden_id}/documentos
```

**Parámetros de ruta:**
- `orden_id` (int, requerido): ID de la orden

**Cuerpo de la petición (multipart/form-data):**
- `archivo` (file, requerido): Archivo a subir
- `tipo_documento` (string, requerido): Tipo del documento
- `descripcion` (string, opcional): Descripción del documento

**Tipos de documento válidos:**
- `imagen`: Fotos del equipo
- `factura`: Facturas de repuestos
- `garantia`: Certificados de garantía
- `manual`: Manuales técnicos
- `presupuesto`: Presupuestos de reparación
- `otro`: Otros documentos

**Validaciones:**
- Tamaño máximo: 10MB
- Tipos permitidos: PDF, JPG, JPEG, PNG, DOC, DOCX
- Nombre único por orden

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Documento subido exitosamente",
  "data": {
    "id": 15,
    "nombre_archivo": "factura_repuestos_samsung.pdf",
    "tipo_documento": "factura",
    "tamaño": 245760,
    "url_descarga": "/api/v1/documentos/15/download",
    "fecha_subida": "2024-12-15T17:00:00Z"
  }
}
```

### 10. Listar Documentos de Orden
```http
GET /ordenes/{orden_id}/documentos
```

**Parámetros de ruta:**
- `orden_id` (int, requerido): ID de la orden

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tipo_documento": "imagen",
      "nombre_archivo": "estado_inicial_samsung.jpg",
      "descripcion": "Foto del estado inicial del equipo",
      "tamaño": 1843200,
      "fecha_subida": "2024-12-15T10:35:00Z",
      "url_descarga": "/api/v1/documentos/1/download"
    },
    {
      "id": 15,
      "tipo_documento": "factura",
      "nombre_archivo": "factura_repuestos_samsung.pdf",
      "descripcion": "Factura de repuestos para reparación",
      "tamaño": 245760,
      "fecha_subida": "2024-12-15T17:00:00Z",
      "url_descarga": "/api/v1/documentos/15/download"
    }
  ]
}
```

### 11. Eliminar Documento
```http
DELETE /ordenes/{orden_id}/documentos/{documento_id}
```

**Parámetros de ruta:**
- `orden_id` (int, requerido): ID de la orden
- `documento_id` (int, requerido): ID del documento

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Documento eliminado exitosamente"
}
```

### 12. Descargar Documento
```http
GET /documentos/{id}/download
```

**Parámetros de ruta:**
- `id` (int, requerido): ID del documento

**Respuesta exitosa (200):**
- Content-Type: Según el tipo de archivo
- Content-Disposition: attachment; filename="nombre_archivo.ext"
- Cuerpo: Contenido binario del archivo

---

## 🔍 Casos de Uso Críticos

### 1. Flujo de Carga Inicial (Producción)
```bash
# 1. Cargar estadísticas para botones de filtro
GET /ordenes/stats
# Respuesta: {total: 1247, pendientes: 89, en_proceso: 156, ...}

# 2. Usuario hace clic en "Pendientes" 
GET /ordenes?estado=pendiente&page=1&limit=20
# Carga solo órdenes pendientes

# 3. Usuario busca por cliente específico
GET /ordenes?search=juan&page=1&limit=20
# Búsqueda por nombre de cliente
```

### 2. Flujo Completo de Orden
```bash
# 1. Crear orden
POST /ordenes
{
  "cliente_id": 1,
  "equipo": {...},
  "problema_reportado": "...",
  "prioridad": "alta"
}

# 2. Subir foto inicial
POST /ordenes/46/documentos
FormData: archivo=foto.jpg, tipo_documento=imagen

# 3. Asignar técnico
PATCH /ordenes/46/tecnico
{"tecnico_id": 2}

# 4. Cambiar a en proceso
PATCH /ordenes/46/estado
{"estado": "en_proceso"}

# 5. Subir factura de repuestos
POST /ordenes/46/documentos
FormData: archivo=factura.pdf, tipo_documento=factura

# 6. Completar orden
PATCH /ordenes/46/estado
{"estado": "completada", "total_final": 85000}
```

### 3. Búsqueda Avanzada (Producción)
```bash
# ❌ PROHIBIDO en producción - sin filtros
GET /ordenes
# Error 400: FILTER_REQUIRED

# ✅ CORRECTO - con filtros específicos
GET /ordenes?estado=pendiente&prioridad=alta&search=samsung

# ✅ CORRECTO - órdenes de un cliente específico
GET /ordenes?cliente_id=1&limit=50

# ✅ CORRECTO - órdenes por rango de fechas
GET /ordenes?fecha_desde=2024-12-01&fecha_hasta=2024-12-31&estado=completada
```

### 4. Gestión de Documentos
```bash
# Ver todos los documentos de una orden
GET /ordenes/1/documentos

# Descargar documento específico
GET /documentos/15/download

# Eliminar documento
DELETE /ordenes/1/documentos/15
```

---

## ⚠️ Códigos de Error

### Errores Comunes
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: Token JWT inválido o expirado
- `403 Forbidden`: Sin permisos para la acción
- `404 Not Found`: Recurso no encontrado
- `409 Conflict`: Conflicto de estado (ej: eliminar orden completada)
- `422 Unprocessable Entity`: Validación fallida
- `500 Internal Server Error`: Error del servidor

### Estructura de Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos proporcionados no son válidos",
    "details": {
      "cliente_id": ["El cliente especificado no existe"],
      "problema_reportado": ["Debe tener al menos 10 caracteres"]
    }
  }
}
```

---

## 📊 Consideraciones de Rendimiento

### 🚀 **Filtrado Obligatorio en Producción**
- **NUNCA** ejecutar `GET /ordenes` sin filtros
- **Validar** en backend que existe al menos un criterio de búsqueda
- **Retornar error 400** si no hay filtros aplicados
- **Límite de búsqueda**: Mínimo 3 caracteres en campo `search`

### Paginación
- Límite máximo: 100 elementos por página
- Límite por defecto: 20 elementos
- Incluir siempre metadatos de paginación
- **Usar OFFSET/LIMIT** con índices apropiados

### Índices Recomendados (CRÍTICOS)
```sql
-- Búsquedas frecuentes (OBLIGATORIOS)
CREATE INDEX idx_ordenes_estado ON ordenes(estado);
CREATE INDEX idx_ordenes_cliente_id ON ordenes(cliente_id);
CREATE INDEX idx_ordenes_tecnico_id ON ordenes(tecnico_id);
CREATE INDEX idx_ordenes_fecha_ingreso ON ordenes(fecha_ingreso);
CREATE INDEX idx_ordenes_numero ON ordenes(numero);
CREATE INDEX idx_ordenes_prioridad ON ordenes(prioridad);

-- Búsqueda de texto completo (CRÍTICO para search)
CREATE INDEX idx_ordenes_search ON ordenes USING gin(
  to_tsvector('spanish', 
    coalesce(numero, '') || ' ' ||
    coalesce(problema_reportado, '') || ' ' ||
    coalesce(diagnostico, '')
  )
);

-- Índices compuestos para filtros combinados
CREATE INDEX idx_ordenes_estado_fecha ON ordenes(estado, fecha_ingreso);
CREATE INDEX idx_ordenes_cliente_estado ON ordenes(cliente_id, estado);
```

### Cache Estratégico
- **Estadísticas (`/ordenes/stats`)**: Cache 5 minutos (Redis)
- **Lista de técnicos**: Cache 1 hora
- **Datos de orden específica**: Sin cache (datos críticos)
- **Búsquedas frecuentes**: Cache 2 minutos con invalidación por cambios

### Optimizaciones de Consulta
```sql
-- Ejemplo de consulta optimizada con filtros
SELECT o.*, c.nombre as cliente_nombre, c.rut as cliente_rut
FROM ordenes o
JOIN clientes c ON o.cliente_id = c.id
WHERE o.estado = $1 
  AND o.fecha_ingreso >= $2
  AND to_tsvector('spanish', o.problema_reportado) @@ plainto_tsquery('spanish', $3)
ORDER BY o.fecha_ingreso DESC
LIMIT $4 OFFSET $5;
```

---

## 🔐 Seguridad

### Validaciones de Entrada
- Sanitización de todos los inputs
- Validación de tipos de archivo
- Límites de tamaño estrictos
- Escape de caracteres especiales

### Permisos por Rol
- **Admin**: Acceso completo
- **Técnico**: Solo órdenes asignadas
- **Recepción**: Crear/ver órdenes, no eliminar
- **Cliente**: Solo ver sus propias órdenes (futuro)

### Logs de Auditoría
Registrar todas las acciones críticas:
- Cambios de estado
- Asignación de técnicos
- Eliminación de órdenes/documentos
- Acceso a documentos sensibles

---

## 📋 **Resumen de Cambios Críticos para Producción**

### ✅ **Obligatorio Implementar**
1. **Endpoint `/ordenes/stats`** - Para cargar contadores sin datos
2. **Validación de filtros** - Error 400 si no hay criterios de búsqueda
3. **Índices de base de datos** - Especialmente para búsqueda de texto
4. **Cache de estadísticas** - Redis con TTL de 5 minutos
5. **Límite de búsqueda** - Mínimo 3 caracteres

### 🚫 **Prohibido en Producción**
1. **`GET /ordenes`** sin parámetros de filtro
2. **Cargar todas las órdenes** al abrir la página
3. **Filtrado del lado del cliente** con grandes volúmenes
4. **Búsquedas sin índices** de texto completo

### 🎯 **UX Recomendada**
- **Lista inicial vacía** con mensaje "Selecciona un filtro o busca"
- **Botones de filtro** que ejecutan búsquedas específicas
- **Búsqueda mínima** de 3 caracteres con debounce
- **Loading states** durante las consultas
- **Paginación** visible y funcional

---

**Documento actualizado:** Diciembre 2024  
**Versión API:** v1.1  
**Estado:** Especificación completa con consideraciones de producción  
**Crítico:** Implementar filtrado obligatorio antes del despliegue 