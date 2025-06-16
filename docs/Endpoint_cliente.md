# Endpoints del Sistema de Clientes - OmegaElectronics

## Resumen
Endpoints necesarios para la página de clientes implementada en el frontend React.

## Base URL
```
http://192.168.88.225:8000/api/v1
```

---

## 1. LISTAR CLIENTES

### `GET /clientes`

**Descripción**: Lista de clientes con búsqueda y contadores básicos.

**Query Parameters**:
```typescript
{
  search?: string;         // Búsqueda por nombre, RUT, email, teléfono
  page?: number;           // Página (default: 1)
  limit?: number;          // Límite por página (default: 50)
}
```

**Response 200**:
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
      "telefono": "+56987654321",
      "email": "juan.perez@email.com",
      "whatsapp": true,
      "estado": "activo",
      "ultima_visita": "2024-06-10",
      "total_ordenes": 5,
      "total_servicios": 2
    }
  ]
}
```

---

## 2. VER CLIENTE

### `GET /clientes/{id}`

**Descripción**: Detalles de un cliente específico.

**Path Parameters**:
- `id` (integer): ID del cliente

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "rut": "12345678-9",
    "nombre": "Juan",
    "apellido_paterno": "Pérez",
    "apellido_materno": "González",
    "telefono": "+56987654321",
    "email": "juan.perez@email.com",
    "whatsapp": true,
    "estado": "activo",
    "ultima_visita": "2024-06-10",
    "total_ordenes": 5,
    "total_servicios": 2
  }
}
```

**Response 404**:
```json
{
  "success": false,
  "error": "Cliente no encontrado"
}
```

---

## 3. CREAR CLIENTE

### `POST /clientes`

**Descripción**: Crea un nuevo cliente.

**Request Body**:
```json
{
  "rut": "12345678-9",
  "nombre": "Juan",
  "apellido_paterno": "Pérez",
  "apellido_materno": "González",
  "telefono": "+56987654321",
  "email": "juan.perez@email.com",
  "whatsapp": true
}
```

**Campos Requeridos**:
- `rut`: Único en el sistema
- `nombre`: Mínimo 2 caracteres
- `apellido_paterno`: Mínimo 2 caracteres
- `telefono`: Formato válido

**Campos Opcionales**:
- `apellido_materno`
- `email`: Único si se proporciona
- `whatsapp`: Default false

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": 26,
    "rut": "12345678-9",
    "nombre": "Juan",
    "apellido_paterno": "Pérez",
    "apellido_materno": "González",
    "telefono": "+56987654321",
    "email": "juan.perez@email.com",
    "whatsapp": true,
    "estado": "activo",
    "ultima_visita": null,
    "total_ordenes": 0,
    "total_servicios": 0
  }
}
```

**Response 400**:
```json
{
  "success": false,
  "error": "Error de validación",
  "details": {
    "rut": "RUT ya existe",
    "email": "Email ya existe"
  }
}
```

---

## 4. EDITAR CLIENTE

### `PUT /clientes/{id}`

**Descripción**: Actualiza un cliente existente.

**Path Parameters**:
- `id` (integer): ID del cliente

**Request Body**: (Mismo formato que POST)

**Response 200**: (Mismo formato que POST con datos actualizados)

**Response 404**:
```json
{
  "success": false,
  "error": "Cliente no encontrado"
}
```

---

## 5. ELIMINAR CLIENTE

### `DELETE /clientes/{id}`

**Descripción**: Elimina un cliente (soft delete).

**Path Parameters**:
- `id` (integer): ID del cliente

**Response 200**:
```json
{
  "success": true,
  "message": "Cliente eliminado exitosamente"
}
```

**Response 404**:
```json
{
  "success": false,
  "error": "Cliente no encontrado"
}
```

**Response 409**:
```json
{
  "success": false,
  "error": "No se puede eliminar cliente con órdenes activas"
}
```

---

## Campos de Base de Datos

### Tabla `clientes`
```sql
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    rut VARCHAR(12) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE,
    whatsapp BOOLEAN DEFAULT FALSE,
    estado VARCHAR(20) DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE
);
```

### Contadores Calculados
- `total_ordenes`: COUNT de órdenes del cliente
- `total_servicios`: COUNT de servicios del cliente  
- `ultima_visita`: MAX fecha de última orden

---

## Validaciones

### RUT
- Formato: 12345678-9
- Único en el sistema
- Validar dígito verificador

### Email
- Formato válido
- Único si se proporciona
- Opcional

### Teléfono
- Formato: +56XXXXXXXXX
- Requerido

---

## Casos de Prueba

1. **Listar clientes** → Lista con contadores
2. **Buscar "Juan"** → Clientes que coincidan
3. **Ver cliente ID 1** → Detalles completos
4. **Crear cliente válido** → Cliente creado
5. **Crear con RUT duplicado** → Error 400
6. **Editar cliente existente** → Cliente actualizado
7. **Eliminar cliente sin órdenes** → Cliente eliminado
8. **Eliminar cliente con órdenes** → Error 409

---

**Estado**: ✅ Listo para implementación  
**Funcionalidad**: Solo página de clientes actual  
**Sin incluir**: Órdenes detalladas, servicios detallados, historiales 