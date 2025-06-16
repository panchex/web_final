# API Endpoints - Sistema de Equipos

## Descripción General

Este documento describe todos los endpoints necesarios para el sistema de equipos de OmegaElectronics. Los equipos son entidades independientes que pueden tener múltiples propietarios a lo largo del tiempo y estar asociados a órdenes de trabajo.

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

- **Lista inicial VACÍA**: Al abrir la página de equipos, NO se debe cargar ningún dato automáticamente
- **Búsqueda obligatoria**: Los datos solo se muestran cuando el usuario:
  - Hace clic en un botón de filtro (Disponibles, En Reparación, etc.)
  - Escribe en el campo de búsqueda (mínimo 3 caracteres)
  - Selecciona un tipo específico de equipo
- **Rendimiento**: Con miles de equipos, cargar todo sería inviable
- **UX**: Evita sobrecarga visual y mejora la experiencia de búsqueda dirigida

---

## 📋 Endpoints de Equipos

### 1. Obtener Estadísticas de Equipos
```http
GET /equipos/stats
```

**Descripción**: Obtiene contadores por estado y tipo para los botones de filtro. **CRÍTICO en producción** para evitar cargar todos los equipos.

**Parámetros de consulta opcionales:**
- `cliente_id` (int, opcional): Estadísticas de equipos de un cliente específico
- `tipo` (string, opcional): Estadísticas de un tipo específico
- `fecha_desde` (date, opcional): Filtrar desde fecha
- `fecha_hasta` (date, opcional): Filtrar hasta fecha

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "total": 1847,
    "por_estado": {
      "disponible": 1245,
      "en_reparacion": 156,
      "reparado": 289,
      "en_garantia": 89,
      "dado_baja": 68
    },
    "por_tipo": {
      "Laptop": 456,
      "Smartphone": 623,
      "PC Desktop": 234,
      "Tablet": 189,
      "Consola": 145,
      "Smart TV": 98,
      "Impresora": 67,
      "Monitor": 35
    },
    "con_propietario": 1456,
    "sin_propietario": 391,
    "ultimos_30_dias": {
      "registrados": 45,
      "reparados": 123,
      "dados_baja": 8
    }
  }
}
```

### 2. Listar Equipos
```http
GET /equipos
```

**⚠️ IMPORTANTE**: En producción, este endpoint **NO debe ejecutarse sin parámetros de filtro**. Debe retornar error 400 si no se proporciona al menos uno de: `search`, `estado`, `tipo`, `cliente_id`.

**Parámetros de consulta:**
- `page` (int, opcional): Número de página (default: 1)
- `limit` (int, opcional): Elementos por página (default: 20, max: 100)
- `search` (string, **requerido en producción**): Búsqueda en código, marca, modelo, serie o propietario (mínimo 3 caracteres)
- `estado` (string, opcional): Filtrar por estado (`disponible`, `en_reparacion`, `reparado`, `en_garantia`, `dado_baja`)
- `tipo` (string, opcional): Filtrar por tipo de equipo
- `cliente_id` (int, opcional): Filtrar por propietario actual
- `marca` (string, opcional): Filtrar por marca específica
- `fecha_desde` (date, opcional): Filtrar desde fecha de registro
- `fecha_hasta` (date, opcional): Filtrar hasta fecha de registro

**Validación en Producción:**
```json
// Error si no hay filtros
{
  "success": false,
  "error": {
    "code": "FILTER_REQUIRED",
    "message": "Debe proporcionar al menos un criterio de búsqueda",
    "details": "Use 'search', 'estado', 'tipo' o 'cliente_id'"
  }
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "equipos": [
      {
        "id": 1,
        "codigo_interno": "EQ-2024-001",
        "tipo": "Laptop",
        "marca": "HP",
        "modelo": "Pavilion 15-eh1xxx",
        "numero_serie": "HP-ABC123456",
        "descripcion": "Laptop para uso personal, color negro",
        "estado": "reparado",
        "especificaciones_tecnicas": {
          "procesador": "AMD Ryzen 5 5500U",
          "memoria_ram": "8GB DDR4",
          "almacenamiento": "256GB SSD",
          "pantalla": "15.6\" Full HD",
          "otros": ["WiFi 6", "Bluetooth 5.0", "USB-C"]
        },
        "propietario_actual": {
          "cliente_id": 1,
          "cliente_nombre": "Juan Pérez González",
          "cliente_rut": "12345678-9",
          "fecha_inicio": "2024-06-01T00:00:00Z"
        },
        "historial_ordenes": 2,
        "ultima_orden": "2024-06-03T00:00:00Z",
        "created_at": "2024-05-15T10:30:00Z",
        "updated_at": "2024-06-03T16:45:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 156,
      "total_pages": 8,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### 3. Obtener Equipo Específico
```http
GET /equipos/{id}
```

**Parámetros de ruta:**
- `id` (int, requerido): ID del equipo

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "codigo_interno": "EQ-2024-001",
    "tipo": "Laptop",
    "marca": "HP",
    "modelo": "Pavilion 15-eh1xxx",
    "numero_serie": "HP-ABC123456",
    "descripcion": "Laptop para uso personal, color negro",
    "estado": "reparado",
    "especificaciones_tecnicas": {
      "procesador": "AMD Ryzen 5 5500U",
      "memoria_ram": "8GB DDR4",
      "almacenamiento": "256GB SSD",
      "pantalla": "15.6\" Full HD",
      "otros": ["WiFi 6", "Bluetooth 5.0", "USB-C"]
    },
    "propietario_actual": {
      "cliente_id": 1,
      "cliente_nombre": "Juan Pérez González",
      "cliente_rut": "12345678-9",
      "telefono": "+56912345678",
      "email": "juan.perez@email.com",
      "fecha_inicio": "2024-06-01T00:00:00Z"
    },
    "historial_propietarios": [
      {
        "cliente_id": 1,
        "cliente_nombre": "Juan Pérez González",
        "fecha_inicio": "2024-06-01T00:00:00Z",
        "fecha_fin": null,
        "motivo_cambio": null
      }
    ],
    "historial_ordenes": [
      {
        "orden_id": 1,
        "numero_orden": "ORD-2024-001",
        "problema_reportado": "No enciende, posible problema en fuente de poder",
        "diagnostico_tecnico": "Fuente de poder dañada, requiere reemplazo",
        "trabajo_realizado": "Reemplazo de fuente de poder interna",
        "fecha_orden": "2024-06-01T00:00:00Z",
        "estado_orden": "completada"
      }
    ],
    "productos_compatibles": [
      {
        "producto_id": 15,
        "codigo": "FP-HP-001",
        "nombre": "Fuente de Poder HP Pavilion 65W",
        "tipo_relacion": "repuesto",
        "es_original": true
      }
    ],
    "created_at": "2024-05-15T10:30:00Z",
    "updated_at": "2024-06-03T16:45:00Z"
  }
}
```

### 4. Crear Nuevo Equipo
```http
POST /equipos
```

**Cuerpo de la petición:**
```json
{
  "codigo_interno": "EQ-2024-046",
  "tipo": "Smartphone",
  "marca": "Samsung",
  "modelo": "Galaxy S21 5G",
  "numero_serie": "SM-G991B789012",
  "descripcion": "Smartphone color negro, 128GB",
  "estado": "disponible",
  "especificaciones_tecnicas": {
    "procesador": "Exynos 2100",
    "memoria_ram": "8GB",
    "almacenamiento": "128GB",
    "pantalla": "6.2\" Dynamic AMOLED",
    "otros": ["5G", "Cámara 64MP", "Carga rápida 25W"]
  },
  "cliente_id": 1
}
```

**Validaciones:**
- `codigo_interno`: Opcional, se genera automáticamente si no se proporciona
- `tipo`: Requerido, máximo 50 caracteres
- `marca`: Requerido, máximo 50 caracteres
- `modelo`: Requerido, máximo 50 caracteres
- `numero_serie`: Opcional, debe ser único si se proporciona
- `estado`: Opcional, valores válidos: `disponible`, `en_reparacion`, `reparado`, `en_garantia`, `dado_baja`
- `cliente_id`: Opcional, debe existir si se proporciona

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Equipo registrado exitosamente",
  "data": {
    "id": 46,
    "codigo_interno": "EQ-2024-046",
    "estado": "disponible",
    "created_at": "2024-12-15T15:30:00Z"
  }
}
```

### 5. Actualizar Equipo
```http
PUT /equipos/{id}
```

**Parámetros de ruta:**
- `id` (int, requerido): ID del equipo

**Cuerpo de la petición:** (Misma estructura que crear, todos los campos opcionales)

**Reglas de negocio:**
- Solo equipos en estado `disponible` o `en_reparacion` pueden ser editados completamente
- Equipos `dado_baja` no pueden ser editados
- Cambios de `numero_serie` requieren validación de unicidad

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Equipo actualizado exitosamente",
  "data": {
    "id": 1,
    "updated_at": "2024-12-15T16:45:00Z"
  }
}
```

### 6. Eliminar Equipo
```http
DELETE /equipos/{id}
```

**Parámetros de ruta:**
- `id` (int, requerido): ID del equipo

**Reglas de negocio:**
- Solo equipos sin órdenes activas pueden ser eliminados
- Se elimina también el historial de propietarios
- Se mantienen las relaciones con productos para auditoría
- Acción irreversible

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Equipo eliminado exitosamente",
  "data": {
    "historial_eliminado": 3,
    "relaciones_mantenidas": 5
  }
}
```

### 7. Cambiar Estado de Equipo
```http
PATCH /equipos/{id}/estado
```

**Parámetros de ruta:**
- `id` (int, requerido): ID del equipo

**Cuerpo de la petición:**
```json
{
  "estado": "reparado",
  "observaciones": "Reparación completada satisfactoriamente"
}
```

**Estados válidos y transiciones:**
- `disponible` → `en_reparacion`, `en_garantia`, `dado_baja`
- `en_reparacion` → `reparado`, `dado_baja`
- `reparado` → `disponible`, `en_garantia`
- `en_garantia` → `disponible`, `en_reparacion`
- `dado_baja` → No permite cambios

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Estado actualizado exitosamente",
  "data": {
    "estado_anterior": "en_reparacion",
    "estado_nuevo": "reparado",
    "fecha_cambio": "2024-12-18T14:30:00Z"
  }
}
```

### 8. Asignar Propietario
```http
PATCH /equipos/{id}/propietario
```

**Parámetros de ruta:**
- `id` (int, requerido): ID del equipo

**Cuerpo de la petición:**
```json
{
  "cliente_id": 3,
  "motivo_cambio": "Venta del equipo",
  "observaciones": "Transferencia por venta directa"
}
```

**Reglas de negocio:**
- Cierra automáticamente el historial del propietario anterior
- Crea nuevo registro en historial_propietarios
- Solo un propietario activo por equipo

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Propietario asignado exitosamente",
  "data": {
    "propietario_anterior": "Juan Pérez González",
    "propietario_nuevo": "Ana García Silva",
    "fecha_cambio": "2024-12-15T16:00:00Z"
  }
}
```

### 9. Obtener Historial de Propietarios
```http
GET /equipos/{id}/historial-propietarios
```

**Parámetros de ruta:**
- `id` (int, requerido): ID del equipo

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "cliente_id": 1,
      "cliente_nombre": "Juan Pérez González",
      "cliente_rut": "12345678-9",
      "fecha_inicio": "2024-06-01T00:00:00Z",
      "fecha_fin": null,
      "motivo_cambio": null,
      "duracion_dias": 167,
      "es_actual": true
    }
  ]
}
```

### 10. Obtener Productos Compatibles
```http
GET /equipos/{id}/productos-compatibles
```

**Parámetros de ruta:**
- `id` (int, requerido): ID del equipo

**Parámetros de consulta opcionales:**
- `tipo_relacion` (string, opcional): Filtrar por tipo (`repuesto`, `accesorio`, `upgrade`)
- `es_original` (boolean, opcional): Solo productos originales

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "producto_id": 15,
      "codigo": "FP-HP-001",
      "nombre": "Fuente de Poder HP Pavilion 65W",
      "descripcion": "Fuente de poder original para HP Pavilion",
      "tipo_relacion": "repuesto",
      "es_original": true,
      "precio_venta": 45000,
      "stock_disponible": 5
    }
  ]
}
```

---

## 🔍 Casos de Uso Críticos

### 1. Flujo de Carga Inicial (Producción)
```bash
# 1. Cargar estadísticas para botones de filtro
GET /equipos/stats
# Respuesta: {total: 1847, por_estado: {...}, por_tipo: {...}}

# 2. Usuario hace clic en "Disponibles" 
GET /equipos?estado=disponible&page=1&limit=20
# Carga solo equipos disponibles

# 3. Usuario busca por marca específica
GET /equipos?search=samsung&page=1&limit=20
# Búsqueda por marca
```

### 2. Flujo Completo de Registro
```bash
# 1. Registrar equipo
POST /equipos
{
  "tipo": "Smartphone",
  "marca": "Samsung",
  "modelo": "Galaxy S21",
  "cliente_id": 1
}

# 2. Asignar productos compatibles
POST /equipos/46/productos-compatibles
{
  "producto_id": 25,
  "tipo_relacion": "accesorio"
}

# 3. Cambiar estado a reparación
PATCH /equipos/46/estado
{"estado": "en_reparacion"}
```

### 3. Gestión de Propietarios
```bash
# Ver historial completo
GET /equipos/1/historial-propietarios

# Cambiar propietario
PATCH /equipos/1/propietario
{
  "cliente_id": 3,
  "motivo_cambio": "Venta"
}
```

---

## 📊 Consideraciones de Rendimiento

### 🚀 **Filtrado Obligatorio en Producción**
- **NUNCA** ejecutar `GET /equipos` sin filtros
- **Validar** en backend que existe al menos un criterio de búsqueda
- **Retornar error 400** si no hay filtros aplicados
- **Límite de búsqueda**: Mínimo 3 caracteres en campo `search`

### Índices Recomendados (CRÍTICOS)
```sql
-- Búsquedas frecuentes (OBLIGATORIOS)
CREATE INDEX idx_equipos_estado ON equipos(estado);
CREATE INDEX idx_equipos_tipo ON equipos(tipo);
CREATE INDEX idx_equipos_marca ON equipos(marca);
CREATE INDEX idx_equipos_codigo_interno ON equipos(codigo_interno);
CREATE INDEX idx_equipos_numero_serie ON equipos(numero_serie);

-- Búsqueda de texto completo (CRÍTICO para search)
CREATE INDEX idx_equipos_search ON equipos USING gin(
  to_tsvector('spanish', 
    coalesce(codigo_interno, '') || ' ' ||
    coalesce(marca, '') || ' ' ||
    coalesce(modelo, '') || ' ' ||
    coalesce(numero_serie, '') || ' ' ||
    coalesce(descripcion, '')
  )
);

-- Índices para relaciones
CREATE INDEX idx_historial_propietarios_equipo ON historial_propietarios(equipo_id, fecha_fin);
CREATE INDEX idx_historial_propietarios_cliente ON historial_propietarios(cliente_id, fecha_fin);
CREATE INDEX idx_productos_equipos_equipo ON productos_equipos(equipo_id);
```

### Cache Estratégico
- **Estadísticas (`/equipos/stats`)**: Cache 5 minutos (Redis)
- **Productos compatibles**: Cache 1 hora
- **Datos de equipo específico**: Sin cache (datos críticos)
- **Búsquedas frecuentes**: Cache 2 minutos con invalidación por cambios

---

## 🔐 Seguridad

### Validaciones de Entrada
- Sanitización de todos los inputs
- Validación de unicidad de `numero_serie`
- Validación de existencia de `cliente_id`
- Escape de caracteres especiales en especificaciones técnicas

### Permisos por Rol
- **Admin**: Acceso completo
- **Técnico**: Ver equipos, cambiar estados, no eliminar
- **Recepción**: Registrar equipos, asignar propietarios
- **Cliente**: Solo ver sus propios equipos (futuro)

### Logs de Auditoría
Registrar todas las acciones críticas:
- Cambios de estado
- Cambios de propietario
- Eliminación de equipos
- Modificaciones de especificaciones técnicas

---

## 📋 **Resumen de Cambios Críticos para Producción**

### ✅ **Obligatorio Implementar**
1. **Endpoint `/equipos/stats`** - Para cargar contadores sin datos
2. **Validación de filtros** - Error 400 si no hay criterios de búsqueda
3. **Índices de base de datos** - Especialmente para búsqueda de texto
4. **Cache de estadísticas** - Redis con TTL de 5 minutos
5. **Historial de propietarios** - Constraint de propietario único activo

### 🚫 **Prohibido en Producción**
1. **`GET /equipos`** sin parámetros de filtro
2. **Cargar todos los equipos** al abrir la página
3. **Filtrado del lado del cliente** con grandes volúmenes
4. **Búsquedas sin índices** de texto completo

### 🎯 **UX Recomendada**
- **Lista inicial vacía** con mensaje "Selecciona un filtro o busca"
- **Botones de filtro** que ejecutan búsquedas específicas
- **Búsqueda mínima** de 3 caracteres con debounce
- **Loading states** durante las consultas
- **Historial de propietarios** visible en modal de detalles

---

**Documento actualizado:** Diciembre 2024  
**Versión API:** v1.0  
**Estado:** Especificación completa con consideraciones de producción  
**Crítico:** Implementar filtrado obligatorio antes del despliegue