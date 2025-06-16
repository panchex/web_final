# Web Final - Sistema de Gestión de Órdenes de Trabajo

## 📋 Descripción del Proyecto

Sistema completo de gestión de órdenes de trabajo para taller de reparación de equipos electrónicos. Desarrollado con Next.js 15, React 19, TypeScript y Tailwind CSS.

## ✅ Estado de Implementación

### 🎨 Layout Dashboard - **COMPLETO**
- ✅ Sidebar navegacional con todas las secciones
- ✅ TopBar con búsqueda y notificaciones
- ✅ Layout responsivo y moderno
- ✅ Componentes UI reutilizables
- ✅ Sistema de estado con Zustand

### 👥 Clientes - **IMPLEMENTADO CON ENDPOINTS**
- ✅ CRUD completo de clientes
- ✅ Conexión con backend FastAPI
- ✅ Validación de RUT chileno
- ✅ Paginación y filtros
- ✅ Formularios con React Hook Form + Zod
- ✅ API Routes funcionando: `/api/clientes`

### 📋 Órdenes de Trabajo - **EN PROCESO DE IMPLEMENTAR ENDPOINTS**
- ✅ Interfaz UI completa (mock data)
- ✅ Componentes de visualización
- ✅ Estados y prioridades
- ⚠️ **PENDIENTE**: Conexión con endpoints del backend
- ⚠️ **PENDIENTE**: API Routes `/api/ordenes`
- ⚠️ **PENDIENTE**: Implementación de filtros obligatorios

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + Zod
- **State**: Zustand
- **HTTP**: Axios + TanStack Query
- **Icons**: Lucide React
- **Backend**: FastAPI (Python) - `http://192.168.88.225:8000`

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/                 # API Routes (Next.js)
│   │   ├── clientes/        # ✅ Endpoints de clientes
│   │   └── proxy/           # Health check
│   ├── dashboard/           # Páginas del dashboard
│   └── globals.css          # Estilos globales
├── components/
│   ├── dashboard/
│   │   ├── pages/           # Páginas principales
│   │   ├── modals/          # Modales y formularios
│   │   └── layout/          # Componentes de layout
│   └── ui/                  # Componentes base
├── hooks/                   # Custom hooks
├── lib/
│   ├── stores/              # Estado global (Zustand)
│   ├── services/            # Servicios API
│   ├── types/               # Tipos TypeScript
│   └── utils/               # Utilidades
└── docs/                    # Documentación
    └── imp/                 # Documentos de implementación
```

## 🔗 Endpoints Backend

### Clientes (Implementado)
- `GET /api/v1/clientes` - Listar clientes
- `POST /api/v1/clientes` - Crear cliente
- `GET /api/v1/clientes/{id}` - Obtener cliente
- `PUT /api/v1/clientes/{id}` - Actualizar cliente
- `DELETE /api/v1/clientes/{id}` - Eliminar cliente

### Órdenes (Por implementar)
- `GET /api/v1/ordenes/stats` - Estadísticas
- `GET /api/v1/ordenes` - Listar órdenes (filtros obligatorios)
- `POST /api/v1/ordenes` - Crear orden
- `GET /api/v1/ordenes/{id}` - Detalle orden
- `PUT /api/v1/ordenes/{id}` - Actualizar orden
- `PATCH /api/v1/ordenes/{id}/estado` - Cambiar estado
- `DELETE /api/v1/ordenes/{id}` - Eliminar orden

## 🎯 Próximos Pasos

1. **Implementar API Routes para órdenes** (`/api/ordenes`)
2. **Conectar OrdenesPage con endpoints reales**
3. **Implementar filtros obligatorios en producción**
4. **Agregar validaciones de transición de estados**
5. **Implementar subida de documentos**

## 📝 Notas Importantes

- **Filtros obligatorios**: En producción, las órdenes requieren filtros para evitar sobrecarga
- **Estados permitidos**: `pendiente`, `en_proceso`, `completada`, `cancelada`
- **Prioridades**: `baja`, `media`, `alta`, `urgente`
- **Backend URL**: `http://192.168.88.225:8000/api/v1`

## 👨‍💻 Desarrollador

**Pancho Werner** - pancho.werner@gmail.com

---

*Proyecto en desarrollo activo - Branch actual: `ordenes-endpoint`*
