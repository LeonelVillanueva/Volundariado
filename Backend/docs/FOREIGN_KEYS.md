# 🔗 Foreign Keys del Sistema

## ❌ Situación Actual

Las tablas se crearon SIN Foreign Keys definidas. Los modelos tienen los campos de relación pero faltan las constraints.

## ✅ Solución

He creado un script para agregar todas las Foreign Keys: `src/scripts/agregarForeignKeys.js`

---

## 📊 Relaciones del Sistema

### 1️⃣ Tabla: **Usuarios**

| Campo FK | Referencia | Acción ON DELETE | Acción ON UPDATE |
|----------|------------|------------------|------------------|
| `ID_rol` | `Roles(ID_rol)` | RESTRICT | CASCADE |
| `ID_centro_educativo` | `Centros_Educativos(ID)` | SET NULL | CASCADE |
| `ID_carrera` | `Carreras(ID)` | SET NULL | CASCADE |

**Explicación:**
- **ID_rol**: RESTRICT previene eliminar un rol si hay usuarios con ese rol
- **ID_centro_educativo**: SET NULL permite eliminar el centro, el usuario queda sin centro
- **ID_carrera**: SET NULL permite eliminar la carrera, el usuario queda sin carrera

---

### 2️⃣ Tabla: **Eventos**

| Campo FK | Referencia | Acción ON DELETE | Acción ON UPDATE |
|----------|------------|------------------|------------------|
| `ID_organizador` | `Usuarios(ID)` | SET NULL | CASCADE |
| `ID_categoria_evento` | `Categoria_Eventos(ID)` | SET NULL | CASCADE |
| `ID_centro_educativo` | `Centros_Educativos(ID)` | SET NULL | CASCADE |

**Explicación:**
- **ID_organizador**: SET NULL permite eliminar el usuario, el evento queda sin organizador
- **ID_categoria_evento**: SET NULL permite eliminar la categoría
- **ID_centro_educativo**: SET NULL permite eliminar el centro

---

### 3️⃣ Tabla: **Centros_Carreras** (Relación N:M)

| Campo FK | Referencia | Acción ON DELETE | Acción ON UPDATE |
|----------|------------|------------------|------------------|
| `ID_centro_educativo` | `Centros_Educativos(ID)` | CASCADE | CASCADE |
| `ID_carrera` | `Carreras(ID)` | CASCADE | CASCADE |

**Explicación:**
- **CASCADE**: Si se elimina un centro o carrera, se eliminan todas las relaciones

---

### 4️⃣ Tabla: **Rol_permisos** (Relación N:M)

| Campo FK | Referencia | Acción ON DELETE | Acción ON UPDATE |
|----------|------------|------------------|------------------|
| `ID_Rol` | `Roles(ID_rol)` | CASCADE | CASCADE |
| `ID_Permiso` | `Permisos(ID)` | CASCADE | CASCADE |

**Explicación:**
- **CASCADE**: Si se elimina un rol o permiso, se eliminan todas las relaciones

---

### 5️⃣ Tabla: **Usuarios_permisos** (Relación N:M)

| Campo FK | Referencia | Acción ON DELETE | Acción ON UPDATE |
|----------|------------|------------------|------------------|
| `ID_Usuario` | `Usuarios(ID)` | CASCADE | CASCADE |
| `ID_Permiso` | `Permisos(ID)` | CASCADE | CASCADE |

**Explicación:**
- **CASCADE**: Si se elimina un usuario o permiso, se eliminan todas las relaciones

---

### 6️⃣ Tabla: **Participantes_Eventos** (Inscripciones)

| Campo FK | Referencia | Acción ON DELETE | Acción ON UPDATE |
|----------|------------|------------------|------------------|
| `ID_Evento` | `Eventos(ID)` | CASCADE | CASCADE |
| `ID_Usuario` | `Usuarios(ID)` | CASCADE | CASCADE |

**Explicación:**
- **CASCADE**: Si se elimina un evento o usuario, se eliminan todas las inscripciones

---

## 🎯 Tipos de Acciones ON DELETE

### CASCADE
Elimina automáticamente todos los registros relacionados.

**Ejemplo:** Si eliminas un evento, se eliminan todas las inscripciones de participantes.

### SET NULL
Establece el campo como NULL cuando se elimina el registro relacionado.

**Ejemplo:** Si eliminas un organizador, los eventos quedan sin organizador (NULL).

### RESTRICT
Previene la eliminación si existen registros relacionados.

**Ejemplo:** No puedes eliminar un rol si hay usuarios con ese rol.

### NO ACTION (por defecto)
Similar a RESTRICT, pero se verifica al final de la transacción.

---

## 🚀 Cómo Aplicar las Foreign Keys

### Opción 1: Usar el script (RECOMENDADO)

```bash
# 1. Crear las tablas
npm run db:init

# 2. Agregar las Foreign Keys
npm run db:fk
```

### Opción 2: Manualmente en MySQL Workbench

```sql
-- Copiar y ejecutar el contenido de src/scripts/agregarForeignKeys.js
```

### Opción 3: Al crear las tablas por primera vez

Si las tablas no existen, puedes recrearlas con las FK incluidas:

```bash
# 1. Eliminar base de datos (¡CUIDADO!)
DROP DATABASE IF EXISTS db_voluntariado;

# 2. Volver a crear todo con FK incluidas
npm run db:init
npm run db:fk
```

---

## ✅ Verificar que las FK estén aplicadas

### En MySQL Workbench:

1. Abre la base de datos `db_voluntariado`
2. Clic derecho en una tabla → "Alter Table"
3. Ve a la pestaña "Foreign Keys"
4. Deberías ver las FK definidas

### Por comandos:

```sql
-- Ver FK de una tabla específica
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'db_voluntariado'
  AND REFERENCED_TABLE_NAME IS NOT NULL;
```

---

## 📊 Diagrama de Relaciones

```
Roles
  └─── (FK) Usuarios.ID_rol [RESTRICT]
         ├─── (FK) Eventos.ID_organizador [SET NULL]
         ├─── (FK) Usuarios_permisos.ID_Usuario [CASCADE]
         └─── (FK) Participantes_Eventos.ID_Usuario [CASCADE]

Centros_Educativos
  ├─── (FK) Usuarios.ID_centro_educativo [SET NULL]
  ├─── (FK) Eventos.ID_centro_educativo [SET NULL]
  └─── (FK) Centros_Carreras.ID_centro_educativo [CASCADE]

Carreras
  ├─── (FK) Usuarios.ID_carrera [SET NULL]
  └─── (FK) Centros_Carreras.ID_carrera [CASCADE]

Categoria_Eventos
  └─── (FK) Eventos.ID_categoria_evento [SET NULL]

Permisos
  ├─── (FK) Rol_permisos.ID_Permiso [CASCADE]
  └─── (FK) Usuarios_permisos.ID_Permiso [CASCADE]

Eventos
  └─── (FK) Participantes_Eventos.ID_Evento [CASCADE]
```

---

## 💡 Consejos

### 1. Orden de eliminación
Si necesitas eliminar datos, hazlo en este orden para evitar errores:

```sql
-- 1. Eliminar registros de tablas intermedias primero
DELETE FROM Participantes_Eventos;
DELETE FROM Usuarios_permisos;
DELETE FROM Rol_permisos;
DELETE FROM Centros_Carreras;

-- 2. Luego eliminar registros de tablas principales
DELETE FROM Eventos;
DELETE FROM Usuarios;
-- etc.
```

### 2. Deshabilitar temporalmente las FK

Si necesitas hacer operaciones masivas:

```sql
SET FOREIGN_KEY_CHECKS = 0;
-- Tus operaciones aquí
SET FOREIGN_KEY_CHECKS = 1;
```

### 3. Integridad referencial

Las FK garantizan que:
- ✅ No puedes insertar un usuario con un ID_rol que no existe
- ✅ No puedes eliminar un rol que tiene usuarios asignados (RESTRICT)
- ✅ Al eliminar un evento, se eliminan automáticamente las inscripciones (CASCADE)

---

## 🆘 Problemas Comunes

### Error: "Cannot add foreign key constraint"

**Causas:**
1. Los tipos de datos no coinciden exactamente
2. El campo referenciado no tiene un índice
3. Ya existen datos que violan la constraint

**Solución:**
```sql
-- Verificar tipos de datos
DESCRIBE Usuarios;
DESCRIBE Roles;

-- Verificar datos inconsistentes
SELECT * FROM Usuarios WHERE ID_rol NOT IN (SELECT ID_rol FROM Roles);
```

### Error: "Cannot delete or update a parent row"

**Causa:** Intentas eliminar un registro que tiene dependencias con RESTRICT.

**Solución:**
1. Elimina primero los registros dependientes
2. O cambia la FK a CASCADE o SET NULL

---

## 📝 Resumen

✅ **Script creado:** `src/scripts/agregarForeignKeys.js`  
✅ **Comando:** `npm run db:fk`  
✅ **Total de FK:** 12 relaciones entre tablas  
✅ **Integridad:** Datos consistentes garantizados  

---

**¡Las Foreign Keys aseguran la integridad referencial de tu base de datos! 🔐**

