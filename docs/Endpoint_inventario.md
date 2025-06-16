# API Endpoints - Sistema de Inventario

## Descripción General

Este documento describe todos los endpoints necesarios para el sistema de inventario de OmegaElectronics. El inventario gestiona productos, repuestos, accesorios, herramientas y consumibles con control de stock y precios.

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

- **Lista inicial VACÍA**: Al abrir la página de inventario, NO se debe cargar ningún dato automáticamente
- **Búsqueda obligatoria**: Los datos solo se muestran cuando el usuario:
  - Hace clic en un botón de filtro (Disponibles, Agotados, etc.)
  - Escribe en el campo de búsqueda (mínimo 3 caracteres)
  - Selecciona una categoría específica
- **Rendimiento**: Con miles de productos, cargar todo sería inviable
- **UX**: Evita sobrecarga visual y mejora la experiencia de búsqueda dirigida

---

## 📋 Endpoints de Inventario

### 1. Obtener Estadísticas de Inventario
```http
GET /inventario/stats
```

**Descripción**: Obtiene contadores por categoría y estado para los botones de filtro. **CRÍTICO en producción** para evitar cargar todos los productos.

**Parámetros de consulta opcionales:**
- `tipo_producto` (string, opcional): Estadísticas de un tipo de producto específico
- `fecha_desde` (date, opcional): Filtrar desde fecha
- `fecha_hasta` (date, opcional): Filtrar hasta fecha

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "total_productos": 1247,
    "productos_disponibles": 1089,
    "productos_agotados": 158,
    "stock_bajo": 89,
    "por_tipo_producto": {
      "Repuesto": 456,
      "Accesorio": 323,
      "Herramienta": 234,
      "Consumible": 189,
      "Otro": 45
    "por_estado": {
      "disponible": 1089,
      "agotado": 158
    "valor_total_stock": 15678900,
    "precio_promedio": 12567,
    "ultimos_30_dias": {
      "productos_agregados": 23,
      "productos_vendidos": 156,
      "restock_realizados": 45
    }
  }
}
```

### 2. Listar Productos
```http
GET /inventario
```


**Parámetros de consulta:**
- `page` (int, opcional): Número de página (default: 1)
- `limit` (int, opcional): Elementos por página (default: 20, max: 100)
- `search` (string, **requerido en producción**): Búsqueda en nombre, código, marca, modelo o descripción (mínimo 3 caracteres)
- `tipo_producto` (string, opcional): Filtrar por tipo de producto (`Repuesto`, `Accesorio`, `Herramienta`, `Consumible`, `Otro`)
- `estado` (string, opcional): Filtrar por estado (`disponible`, `agotado`)
- `marca` (string, opcional): Filtrar por marca específica
- `stock_bajo` (boolean, opcional): Solo productos con stock bajo
- `precio_min` (float, opcional): Precio mínimo
- `precio_max` (float, opcional): Precio máximo

**Validación en Producción:**
```json
// Error si no hay filtros
{
  "success": false,
  "error": {
    "code": "FILTER_REQUIRED",
    "message": "Debe proporcionar al menos un criterio de búsqueda",
  }
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "productos": [
      {
        "id": 1,
        "codigo": "REP-001",
        "nombre": "Pantalla LCD iPhone 12",
        "tipo_producto": "Repuesto",
        "marca": "Apple",
        "modelo": "A2172",
        "descripcion": "Pantalla LCD original para iPhone 12, incluye touch",
        "estado": "disponible",
        "cantidad": 15,
        "precio_compra": 45000,
        "precio_venta": 75000,
        "margen_ganancia": 66.67,
        "ubicacion": "Estante A-3",
          "id": 1,
          "nombre": "TechParts Chile",
          "contacto": "+56912345678"
        },
        "valor_total_stock": 675000,
        "created_at": "2024-05-15T10:30:00Z",
        "updated_at": "2024-06-03T16:45:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 1089,
      "total_pages": 55,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### 3. Obtener Producto Específico
```http
GET /inventario/{id}
```

**Parámetros de ruta:**
- `id` (int, requerido): ID del producto

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data":   {
    "id": 1,
    "codigo": "REP-001",
    "nombre": "Pantalla LCD iPhone 12",
    "tipo_producto": "Repuesto",
    "marca": "Apple",
    "modelo": "A2172",
    "descripcion": "Pantalla LCD original para iPhone 12, incluye touch y digitalizador",
    "estado": "disponible",
            "cantidad": 15,
    "precio_compra": 45000,
    "precio_venta": 75000,
    "margen_ganancia": 66.67,
    "ubicacion": "Estante A-3",
      "id": 1,
      "nombre": "TechParts Chile",
      "contacto": "+56912345678",
      "email": "ventas@techparts.cl"
    "valor_total_stock": 675000,
    "historial_movimientos": [
      {
        "fecha": "2024-06-01T10:00:00Z",
        "tipo": "entrada",
        "cantidad": 10,
        "usuario": "admin"
      },
      {
        "fecha": "2024-06-02T14:30:00Z",
        "tipo": "salida",
        "cantidad": 2,
        "motivo": "Venta - Orden #123",
        "usuario": "vendedor1"
      }
    ],
    "created_at": "2024-05-15T10:30:00Z",
    "updated_at": "2024-06-03T16:45:00Z"
  }
}
```

**Respuesta de error (404):**
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Producto no encontrado"
  }
}
```

### 4. Crear Producto
```http
POST /inventario
```

**Cuerpo de la petición:**
```json
{
  "codigo": "REP-002",
  "nombre": "Batería iPhone 13",
  "tipo_producto": "Repuesto",
  "marca": "Apple",
  "modelo": "A2633",
  "descripcion": "Batería original para iPhone 13, 3240mAh",
  "cantidad": 20,
  "precio_compra": 35000,
  "precio_venta": 55000,
  "ubicacion": "Estante B-1"
}
```

**Campos requeridos:**
- `codigo`: Único en el sistema
- `nombre`: Mínimo 3 caracteres
- `tipo_producto`: Enum válido
- `cantidad`: >= 0
- `precio_compra`: > 0
- `precio_venta`: > precio_compra

**Campos opcionales:**
- `marca`, `modelo`, `descripcion`

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": 26,
    "codigo": "REP-002",
    "nombre": "Batería iPhone 13",
    "tipo_producto": "Repuesto",
    "marca": "Apple",
    "modelo": "A2633",
    "descripcion": "Batería original para iPhone 13, 3240mAh",
    "estado": "disponible",
    "cantidad": 20,
    "precio_compra": 35000,
    "precio_venta": 55000,
    "margen_ganancia": 57.14,
    "ubicacion": "Estante B-1"
      "id": 1,
      "nombre": "TechParts Chile"
    "valor_total_stock": 700000,
    "created_at": "2024-06-10T15:30:00Z",
    "updated_at": "2024-06-10T15:30:00Z"
  }
}
```

**Respuesta de error (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación",
    "details": {
      "codigo": "El código ya existe",
      "precio_venta": "Debe ser mayor al precio de compra"
    }
  }
}
```

### 5. Actualizar Producto
```http
PUT /inventario/{id}
```

**Parámetros de ruta:**
- `id` (int, requerido): ID del producto

**Cuerpo de la petición:** (Mismo formato que POST)

**Respuesta exitosa (200):** (Mismo formato que POST con datos actualizados)

**Respuesta de error (404):**
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Producto no encontrado"
  }
}
```

### 6. Eliminar Producto
```http
DELETE /inventario/{id}
```

**Parámetros de ruta:**
- `id` (int, requerido): ID del producto

**⚠️ Validaciones de eliminación:**
- No se puede eliminar si tiene cantidad > 0
- No se puede eliminar si está asociado a órdenes activas
- No se puede eliminar si tiene movimientos en los últimos 30 días

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
```

**Respuesta de error (400):**
```json
{
  "success": false,
  "error": {
    "code": "CANNOT_DELETE_PRODUCT",
    "message": "No se puede eliminar el producto",
    "details": "El producto tiene cantidad disponible o está asociado a órdenes activas"
  }
}
```

### 7. Actualizar Stock
```http
PATCH /inventario/{id}/stock
```

**Parámetros de ruta:**
- `id` (int, requerido): ID del producto

**Cuerpo de la petición:**
```json
{
  "tipo": "entrada",
  "cantidad": 10,
  "precio_compra": 35000
}
```

**Tipos de movimiento:**
- `entrada`: Aumenta el stock
- `salida`: Disminuye el stock
- `ajuste`: Ajuste de inventario

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "stock_anterior": 15,
    "cantidad": 25,
    "movimiento": {
      "id": 45,
      "tipo": "entrada",
      "cantidad": 10,
      "fecha": "2024-06-10T16:00:00Z"
    }
  }
}
```

### 8. Obtener Proveedores
```http
```


**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "TechParts Chile",
      "contacto": "+56912345678",
      "email": "ventas@techparts.cl",
      "activo": true
    }
  ]
}
```

---

## 🔍 Códigos de Error Específicos

### Errores de Validación (400)
- `VALIDATION_ERROR`: Error general de validación
- `DUPLICATE_CODE`: Código de producto duplicado
- `INVALID_PRICE`: Precio de venta menor al de compra
- `INVALID_STOCK`: Stock negativo o inválido

### Errores de Negocio (400)
- `CANNOT_DELETE_PRODUCT`: No se puede eliminar producto
- `INSUFFICIENT_STOCK`: Stock insuficiente para operación
- `FILTER_REQUIRED`: Filtros requeridos en producción

### Errores de Recurso (404)
- `PRODUCT_NOT_FOUND`: Producto no encontrado
- `PROVIDER_NOT_FOUND`: Proveedor no encontrado

---

## 📊 Notas de Implementación

### Cálculos Automáticos
- **Margen de ganancia**: `((precio_venta - precio_compra) / precio_compra) * 100`
- **Valor total cantidad**: `stock_actual * precio_compra`
- **Estado automático**: `disponible` si cantidad > 0, `agotado` si stock = 0

### Validaciones de Negocio
- Stock mínimo debe ser >= 0
- Stock máximo debe ser > stock mínimo
- Precio de venta debe ser > precio de compra
- Código debe ser único en el sistema

### Optimizaciones
- Cache en estadísticas por 5 minutos
- Paginación obligatoria en producción 