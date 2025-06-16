# Documentación de Implementación de Endpoints de Clientes

## Resumen de Implementación

Se han implementado los endpoints para la gestión de clientes según los requerimientos especificados. La implementación incluye:

1. Modelo SQLAlchemy para la tabla `clientes`
2. Esquemas Pydantic para validación y serialización
3. Endpoints CRUD completos con validaciones
4. Manejo de errores y respuestas estandarizadas

## Rutas de API Implementadas

Base URL: `http://192.168.88.225:8000/api/v1`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/clientes/` | Listar todos los clientes con búsqueda y paginación |
| GET | `/clientes/{cliente_id}` | Obtener detalles de un cliente específico |
| POST | `/clientes/` | Crear un nuevo cliente |
| PUT | `/clientes/{cliente_id}` | Actualizar un cliente existente |
| DELETE | `/clientes/{cliente_id}` | Eliminar un cliente (soft delete) |

## Ejemplos de Uso

### 1. Crear un Cliente

**Endpoint:** `POST /api/v1/clientes/`

**Request:**
```json
{
  "rut": "12345678-9",
  "nombre": "Juan",
  "apellido_paterno": "Pérez",
  "apellido_materno": "González",
  "telefono": "+56912345678",
  "email": "juan.perez@example.com",
  "whatsapp": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "rut": "12345678-9",
    "nombre": "Juan",
    "apellido_paterno": "Pérez",
    "apellido_materno": "González",
    "telefono": "+56912345678",
    "email": "juan.perez@example.com",
    "whatsapp": true,
    "estado": "activo",
    "ultima_visita": null,
    "total_ordenes": 0,
    "total_servicios": 0
  }
}
```

### 2. Crear un Segundo Cliente

**Endpoint:** `POST /api/v1/clientes/`

**Request:**
```json
{
  "rut": "98765432-1",
  "nombre": "María",
  "apellido_paterno": "Rodríguez",
  "apellido_materno": "López",
  "telefono": "+56987654321",
  "email": "maria.rodriguez@example.com",
  "whatsapp": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "rut": "98765432-1",
    "nombre": "María",
    "apellido_paterno": "Rodríguez",
    "apellido_materno": "López",
    "telefono": "+56987654321",
    "email": "maria.rodriguez@example.com",
    "whatsapp": false,
    "estado": "activo",
    "ultima_visita": null,
    "total_ordenes": 0,
    "total_servicios": 0
  }
}
```

### 3. Crear un Tercer Cliente

**Endpoint:** `POST /api/v1/clientes/`

**Request:**
```json
{
  "rut": "11222333-4",
  "nombre": "Carlos",
  "apellido_paterno": "Gómez",
  "apellido_materno": "Soto",
  "telefono": "+56911223344",
  "email": "carlos.gomez@example.com",
  "whatsapp": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "rut": "11222333-4",
    "nombre": "Carlos",
    "apellido_paterno": "Gómez",
    "apellido_materno": "Soto",
    "telefono": "+56911223344",
    "email": "carlos.gomez@example.com",
    "whatsapp": true,
    "estado": "activo",
    "ultima_visita": null,
    "total_ordenes": 0,
    "total_servicios": 0
  }
}
```

### 4. Listar Clientes

**Endpoint:** `GET /api/v1/clientes/?search=&page=1&limit=50`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "rut": "12345678-9",
      "nombre": "Juan",
      "apellido_paterno": "Pérez",
      "apellido_materno": "González",
      "telefono": "+56912345678",
      "email": "juan.perez@example.com",
      "whatsapp": true,
      "estado": "activo",
      "ultima_visita": "2025-06-15",
      "total_ordenes": 1,
      "total_servicios": 1
    },
    {
      "id": 2,
      "rut": "98765432-1",
      "nombre": "María",
      "apellido_paterno": "Rodríguez",
      "apellido_materno": "López",
      "telefono": "+56987654321",
      "email": "maria.rodriguez@example.com",
      "whatsapp": false,
      "estado": "activo",
      "ultima_visita": null,
      "total_ordenes": 2,
      "total_servicios": 2
    },
    {
      "id": 3,
      "rut": "11222333-4",
      "nombre": "Carlos",
      "apellido_paterno": "Gómez",
      "apellido_materno": "Soto",
      "telefono": "+56911223344",
      "email": "carlos.gomez@example.com",
      "whatsapp": true,
      "estado": "activo",
      "ultima_visita": "2025-06-10",
      "total_ordenes": 0,
      "total_servicios": 0
    }
  ]
}
```

### 5. Obtener un Cliente Específico

**Endpoint:** `GET /api/v1/clientes/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "rut": "12345678-9",
    "nombre": "Juan",
    "apellido_paterno": "Pérez",
    "apellido_materno": "González",
    "telefono": "+56912345678",
    "email": "juan.perez@example.com",
    "whatsapp": true,
    "estado": "activo",
    "ultima_visita": "2025-06-15",
    "total_ordenes": 1,
    "total_servicios": 1
  }
}
```

### 6. Actualizar un Cliente

**Endpoint:** `PUT /api/v1/clientes/2`

**Request:**
```json
{
  "telefono": "+56999887766",
  "whatsapp": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "rut": "98765432-1",
    "nombre": "María",
    "apellido_paterno": "Rodríguez",
    "apellido_materno": "López",
    "telefono": "+56999887766",
    "email": "maria.rodriguez@example.com",
    "whatsapp": true,
    "estado": "activo",
    "ultima_visita": null,
    "total_ordenes": 2,
    "total_servicios": 2
  }
}
```

### 7. Eliminar un Cliente

**Endpoint:** `DELETE /api/v1/clientes/3`

**Response:**
```json
{
  "success": true,
  "message": "Cliente eliminado exitosamente"
}
```

## Estructura de Archivos Implementados

```
/root/CascadeProjects/
├── main.py                  # Archivo principal con la aplicación FastAPI
├── database.py              # Configuración de conexión a la base de datos
├── models/
│   └── cliente.py           # Modelo SQLAlchemy para la tabla clientes
├── schemas/
│   └── cliente.py           # Esquemas Pydantic para validación y serialización
└── routes/
    └── cliente.py           # Implementación de endpoints CRUD
```

## Validaciones Implementadas

1. **RUT**: Formato XXXXXXXX-X, único en la base de datos
2. **Email**: Formato válido, único en la base de datos (opcional)
3. **Teléfono**: Debe comenzar con "+" y tener al menos 8 caracteres
4. **Nombres y apellidos**: Longitud mínima de 2 caracteres

## Manejo de Errores

- **400 Bad Request**: Errores de validación (formato inválido)
- **404 Not Found**: Cliente no encontrado
- **409 Conflict**: Conflicto de unicidad (RUT o email duplicado)

## Campos Calculados

- **total_ordenes**: Número de órdenes asociadas al cliente
- **total_servicios**: Número de servicios asociados al cliente
- **ultima_visita**: Fecha de la última visita del cliente

## Notas Adicionales

- Se implementó soft delete para mantener la integridad referencial
- Se valida que no se puedan eliminar clientes con órdenes activas
- Los endpoints siguen el formato de respuesta estandarizado con campos `success` y `data`/`error`
