# Documentación de Implementación de Endpoints de Órdenes de Trabajo

## Resumen de Implementación

Se han implementado los endpoints para la gestión de órdenes de trabajo según los requerimientos especificados. La implementación incluye:

1. Modelos SQLAlchemy para las tablas `ordenes_trabajo`, `equipos`, `orden_equipos` y `documentos`
2. Esquemas Pydantic para validación y serialización
3. Endpoints CRUD completos con validaciones
4. Manejo de errores y respuestas estandarizadas
5. Filtrado obligatorio en producción para evitar carga excesiva

## Rutas de API Implementadas

Base URL: `http://192.168.88.225:8000/api/v1`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/ordenes/stats` | Obtener estadísticas de órdenes por estado |
| GET | `/ordenes/` | Listar órdenes con filtros obligatorios |
| GET | `/ordenes/{orden_id}` | Obtener detalles de una orden específica |
| POST | `/ordenes/` | Crear una nueva orden |
| PUT | `/ordenes/{orden_id}` | Actualizar una orden existente |
| PATCH | `/ordenes/{orden_id}/estado` | Cambiar el estado de una orden |
| POST | `/ordenes/{orden_id}/documentos` | Subir documentos asociados a una orden |
| DELETE | `/ordenes/{orden_id}` | Eliminar una orden (soft delete) |

## ⚠️ Comportamiento en Producción vs Desarrollo

### Filtrado del Lado del Servidor (Producción)
En el entorno de **producción**, es **CRÍTICO** que todos los filtros se procesen en el servidor:

- **Lista inicial VACÍA**: Al abrir la página de órdenes, NO se debe cargar ningún dato automáticamente
- **Búsqueda obligatoria**: Los datos solo se muestran cuando el usuario:
  - Hace clic en un botón de filtro (Pendientes, En Proceso, etc.)
  - Escribe en el campo de búsqueda (mínimo 3 caracteres)
  - Selecciona un cliente específico
- **Rendimiento**: Con miles de órdenes, cargar todo sería inviable

### Implementación Recomendada Frontend
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
  setOrdenes(data.data.ordenes);
  setHasSearched(true);
  setLoading(false);
};
```

## Ejemplos de Uso

### 1. Obtener Estadísticas de Órdenes

**Endpoint:** `GET /api/v1/ordenes/stats`

**Response:**
```json
{
  "total": 45,
  "pendientes": 12,
  "en_proceso": 18,
  "completadas": 13,
  "canceladas": 2,
  "urgentes": 5
}
```

### 2. Listar Órdenes (con filtro obligatorio)

**Endpoint:** `GET /api/v1/ordenes/?estado=pendiente&page=1&limit=20`

**Response:**
```json
{
  "success": true,
  "data": {
    "ordenes": [
      {
        "id": 1,
        "numero_orden": "OT-20250616-0001",
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
        "estado": "pendiente",
        "prioridad": "alta",
        "created_at": "2025-06-16T10:30:00Z",
        "fecha_estimada": "2025-06-18T16:00:00Z",
        "fecha_entrega": null,
        "presupuesto_monto": 85000,
        "total_final": null,
        "tecnico_asignado": "Carlos Mendoza",
        "tecnico_id": null,
        "notas_internas": "Cliente requiere urgencia por trabajo",
        "updated_at": "2025-06-16T14:20:00Z",
        "documentos_count": 3
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 12,
      "total_pages": 1,
      "has_next": false,
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

### 3. Error al Listar sin Filtros

**Endpoint:** `GET /api/v1/ordenes/`

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "FILTER_REQUIRED",
    "message": "Debe proporcionar al menos un criterio de búsqueda",
    "details": "Use 'search', 'estado', 'cliente_id' o 'tecnico_id'"
  }
}
```

### 4. Obtener Detalle de una Orden

**Endpoint:** `GET /api/v1/ordenes/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "numero_orden": "OT-20250616-0001",
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
    "estado": "pendiente",
    "prioridad": "alta",
    "fechas": {
      "ingreso": "2025-06-16T10:30:00Z",
      "estimada": "2025-06-18T16:00:00Z",
      "entrega": null
    },
    "costos": {
      "estimado": 85000,
      "final": null,
      "moneda": "CLP"
    },
    "tecnico": {
      "id": null,
      "nombre": "Carlos Mendoza",
      "especialidad": null
    },
    "timeline": [
      {
        "fecha": "2025-06-16T10:30:00Z",
        "evento": "Orden creada",
        "descripcion": "Orden ingresada al sistema",
        "usuario": "Recepción"
      }
    ],
    "documentos": [
      {
        "id": 1,
        "tipo_documento": "imagen",
        "nombre_archivo": "estado_inicial_samsung.jpg",
        "descripcion": "Foto del estado inicial del equipo",
        "fecha_subida": "2025-06-16T10:35:00Z",
        "tamaño": 1843200,
        "url_descarga": "/api/v1/documentos/1/download"
      }
    ],
    "notas_internas": "Cliente requiere urgencia por trabajo",
    "created_at": "2025-06-16T10:30:00Z",
    "updated_at": "2025-06-16T10:30:00Z"
  }
}
```

### 5. Crear una Nueva Orden

**Endpoint:** `POST /api/v1/ordenes/`

**Request:**
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
  "fecha_estimada": "2025-06-18",
  "presupuesto_monto": 85000,
  "tecnico_id": 2,
  "notas_internas": "Cliente requiere urgencia por trabajo"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 46,
    "numero_orden": "OT-20250616-0002",
    "cliente_id": 1,
    "equipo_id": 23,
    "estado": "pendiente",
    "created_at": "2025-06-16T15:30:00Z"
  },
  "message": "Orden de trabajo creada exitosamente"
}
```

### 6. Actualizar una Orden

**Endpoint:** `PUT /api/v1/ordenes/1`

**Request:**
```json
{
  "diagnostico": "Pantalla completamente dañada, requiere reemplazo completo",
  "presupuesto_monto": 95000,
  "notas_internas": "Cliente informado del costo adicional"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "updated_at": "2025-06-16T16:45:00Z"
  },
  "message": "Orden actualizada exitosamente"
}
```

### 7. Cambiar Estado de una Orden

**Endpoint:** `PATCH /api/v1/ordenes/1/estado`

**Request:**
```json
{
  "estado": "en_proceso",
  "notas": "Iniciando reparación"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "estado": "en_proceso",
    "updated_at": "2025-06-16T17:30:00Z"
  },
  "message": "Estado de la orden actualizado exitosamente"
}
```

### 8. Eliminar una Orden

**Endpoint:** `DELETE /api/v1/ordenes/46`

**Response:**
```json
{
  "success": true,
  "message": "Orden eliminada exitosamente",
  "data": {
    "documentos_eliminados": 0
  }
}
```

## Estructura de Archivos Implementados

```
/root/CascadeProjects/
├── main.py                  # Archivo principal con la aplicación FastAPI
├── database.py              # Configuración de conexión a la base de datos
├── models/
│   ├── cliente.py           # Modelo SQLAlchemy para la tabla clientes
│   └── orden.py             # Modelos para órdenes, equipos y documentos
├── schemas/
│   ├── cliente.py           # Esquemas Pydantic para clientes
│   └── orden.py             # Esquemas para órdenes, equipos y documentos
└── routes/
    ├── cliente.py           # Endpoints de clientes
    └── orden.py             # Endpoints de órdenes de trabajo
```

## Validaciones Implementadas

1. **Filtros obligatorios**: En producción, se requiere al menos un filtro para listar órdenes
2. **Problema reportado**: Mínimo 10 caracteres
3. **Prioridad**: Valores permitidos: `baja`, `media`, `alta`, `urgente`
4. **Estados**: Valores permitidos: `pendiente`, `en_proceso`, `completada`, `cancelada`
5. **Transiciones de estado**: Solo se permiten ciertas transiciones entre estados
6. **Fecha estimada**: Debe ser una fecha futura
7. **Montos**: Deben ser valores positivos

## Reglas de Negocio

1. **Transiciones de estado permitidas**:
   - `pendiente` → `en_proceso`, `cancelada`
   - `en_proceso` → `completada`, `cancelada`
   - `completada` → No permite cambios
   - `cancelada` → No permite cambios

2. **Edición según estado**:
   - Solo órdenes en estado `pendiente` o `en_proceso` pueden ser editadas completamente
   - Órdenes `completadas` solo permiten actualizar `notas_internas`
   - Órdenes `canceladas` no pueden ser editadas

3. **Eliminación de órdenes**:
   - Solo órdenes en estado `pendiente` pueden ser eliminadas
   - Se eliminan también todos los documentos asociados

## Manejo de Errores

- **400 Bad Request**: Errores de validación o filtros faltantes
- **404 Not Found**: Orden no encontrada
- **409 Conflict**: Conflicto de estado (transición no permitida)
- **500 Internal Server Error**: Errores inesperados

## Notas Adicionales

- Se implementó la validación de filtros obligatorios en producción para evitar sobrecarga
- El formato de número de orden es `OT-YYYYMMDD-XXXX` (ej: OT-20250616-0001)
- Se simula el timeline de eventos usando notas internas
- Los documentos se almacenan en el sistema de archivos en la carpeta `/uploads/ordenes/`
- Los endpoints siguen el formato de respuesta estandarizado con campos `success` y `data`/`error`
