-- =====================================================
-- COLUMNAS ADICIONALES MÍNIMAS REQUERIDAS
-- =====================================================
-- Solo los campos que realmente faltan para que funcionen los endpoints

-- =====================================================
-- 1. TABLA PRODUCTOS - Agregar campos faltantes
-- =====================================================
-- categoria = tipo_producto (ya existe en la DB)
ALTER TABLE productos ADD COLUMN IF NOT EXISTS marca VARCHAR(50);
ALTER TABLE productos ADD COLUMN IF NOT EXISTS modelo VARCHAR(50);

-- =====================================================
-- 2. TABLA INVENTARIO - Agregar estado y renombrar cantidad
-- =====================================================
ALTER TABLE inventario ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'disponible';

-- Mantener nombre original "cantidad" para consistencia con DB
-- Los endpoints usarán "cantidad" en lugar de "stock_actual"

-- =====================================================
-- 3. TABLA ORDENES_TRABAJO - Agregar campos faltantes
-- =====================================================
ALTER TABLE ordenes_trabajo ADD COLUMN IF NOT EXISTS fecha_estimada TIMESTAMP;
ALTER TABLE ordenes_trabajo ADD COLUMN IF NOT EXISTS fecha_entrega TIMESTAMP;
ALTER TABLE ordenes_trabajo ADD COLUMN IF NOT EXISTS notas_internas TEXT;

-- =====================================================
-- 4. CONSTRAINTS BÁSICOS
-- =====================================================
-- Validar tipos de producto válidos (categoria = tipo_producto)
ALTER TABLE productos ADD CONSTRAINT IF NOT EXISTS chk_tipo_producto 
    CHECK (tipo_producto IN ('Repuesto', 'Accesorio', 'Herramienta', 'Consumible', 'Otro'));

-- Validar estado de inventario
ALTER TABLE inventario ADD CONSTRAINT IF NOT EXISTS chk_estado_inventario 
    CHECK (estado IN ('disponible', 'agotado'));

-- Validar que cantidad no sea negativa
ALTER TABLE inventario ADD CONSTRAINT IF NOT EXISTS chk_cantidad_positiva 
    CHECK (cantidad >= 0);

-- =====================================================
-- 5. ÍNDICES BÁSICOS PARA RENDIMIENTO
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_productos_tipo ON productos(tipo_producto);
CREATE INDEX IF NOT EXISTS idx_productos_marca ON productos(marca);
CREATE INDEX IF NOT EXISTS idx_inventario_estado ON inventario(estado);

-- =====================================================
-- 6. TRIGGER PARA ACTUALIZAR ESTADO AUTOMÁTICAMENTE
-- =====================================================
-- Actualizar estado de inventario basado en stock
CREATE OR REPLACE FUNCTION actualizar_estado_inventario()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar estado basado en cantidad
    IF NEW.cantidad = 0 THEN
        NEW.estado = 'agotado';
    ELSIF NEW.cantidad > 0 THEN
        NEW.estado = 'disponible';
    END IF;
    
    -- Actualizar timestamp
    NEW.updated_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS trigger_actualizar_estado_inventario
    BEFORE UPDATE ON inventario
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_estado_inventario();

-- =====================================================
-- RESUMEN DE CAMBIOS MÍNIMOS
-- =====================================================
/*
CAMPOS AGREGADOS:

productos:
- marca (VARCHAR) - Marca del producto  
- modelo (VARCHAR) - Modelo específico
- tipo_producto ya existe (endpoints usan "categoria")

inventario:
- estado (VARCHAR) - 'disponible' o 'agotado'
- cantidad (mantiene nombre original)

ordenes_trabajo:
- fecha_estimada (TIMESTAMP) - Fecha estimada de entrega
- fecha_entrega (TIMESTAMP) - Fecha real de entrega
- notas_internas (TEXT) - Notas para uso interno

NOMBRES CORREGIDOS EN ENDPOINTS:
- Ahora usan nombres exactos de la DB
- tipo_producto (no categoria)
- cantidad (no stock_actual)
- numero_orden (no numero)
- created_at (no fecha_ingreso)
- presupuesto_monto (no costo_estimado)
- total_final (no costo_final)

CONSTRAINTS:
- Validación de tipos de producto válidos
- Validación de estado de inventario
- Stock no negativo

TRIGGER:
- Actualización automática de estado basado en stock
*/ 