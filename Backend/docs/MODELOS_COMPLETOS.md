# 📊 Modelos Completos del Sistema

Se han creado **11 modelos** para gestionar todas las tablas del sistema de voluntariado.

## ✅ Lista de Modelos Creados

| # | Modelo | Archivo | Tabla | Campos |
|---|--------|---------|-------|--------|
| 1 | **Usuario** | `Usuario.js` | `Usuarios` | 20 campos |
| 2 | **Evento** | `Evento.js` | `Eventos` | 25 campos |
| 3 | **CategoriaEvento** | `CategoriaEvento.js` | `Categoria_Eventos` | 5 campos |
| 4 | **CentroEducativo** | `CentroEducativo.js` | `Centros_Educativos` | 8 campos |
| 5 | **Carrera** | `Carrera.js` | `Carreras` | 4 campos |
| 6 | **CentroCarrera** | `CentroCarrera.js` | `Centros_Carreras` | 5 campos |
| 7 | **Rol** | `Rol.js` | `Roles` | 5 campos |
| 8 | **Permiso** | `Permiso.js` | `Permisos` | 7 campos |
| 9 | **RolPermiso** | `RolPermiso.js` | `Rol_permisos` | 5 campos |
| 10 | **UsuarioPermiso** | `UsuarioPermiso.js` | `Usuarios_permisos` | 5 campos |
| 11 | **ParticipanteEvento** | `ParticipanteEvento.js` | `Participantes_Eventos` | 10 campos |

---

## 📋 Detalles de Cada Modelo

### 1️⃣ Usuario
**Archivo:** `Usuario.js`  
**Tabla:** `Usuarios`  
**Propósito:** Gestión de usuarios del sistema

**Campos:**
- ID, Nombres, Apellidos
- Email_personal, Email_academico, Telefono
- Fecha_nacimiento, Es_estudiante
- ID_centro_educativo, Num_cuenta, ID_carrera
- Estado, Url_foto_perfil, Esta_verificado
- Horas_voluntariado_acumuladas
- Usuario_nombre, Clave, ID_rol
- created_at, updated_at

**Métodos:** 15+ (crear, obtenerTodos, obtenerPorId, actualizar, eliminar, buscar, estadísticas, etc.)

---

### 2️⃣ Evento
**Archivo:** `Evento.js`  
**Tabla:** `Eventos`  
**Propósito:** Gestión de eventos de voluntariado

**Campos:**
- ID, Nombre_evento, Descrip_evento
- ID_organizador, Fecha_ini_evento, Fecha_fin_evento
- Ubicacion_link, Latitud, Longitud
- Cap_max, Cap_min, ID_categoria_evento
- Estado, Notas_extra_estado, Enlaces_referencia
- Solo_estudiantes, ID_centro_educativo
- Fecha_ini_inscripciones, Fecha_fin_inscripciones
- Aport_monetaria, Direccion_completa, Ciudad
- Beneficiario, Org_colaborativa
- created_at, updated_at

**Métodos:** 15+ (crear, obtenerTodos, obtenerProximos, obtenerConInscripcionesAbiertas, cambiarEstado, verificarDisponibilidad, etc.)

---

### 3️⃣ CategoriaEvento
**Archivo:** `CategoriaEvento.js`  
**Tabla:** `Categoria_Eventos`  
**Propósito:** Categorización de eventos

**Campos:**
- ID, Nombre, Estado
- created_at, updated_at

**Métodos:** CRUD completo (crear, obtenerTodos, obtenerPorId, actualizar, eliminar, cambiarEstado)

---

### 4️⃣ CentroEducativo
**Archivo:** `CentroEducativo.js`  
**Tabla:** `Centros_Educativos`  
**Propósito:** Gestión de centros educativos

**Campos:**
- ID, Nombre, Direccion, Ciudad
- Telefono, Email
- created_at, updated_at

**Métodos:** CRUD completo + buscar

---

### 5️⃣ Carrera
**Archivo:** `Carrera.js`  
**Tabla:** `Carreras`  
**Propósito:** Gestión de carreras académicas

**Campos:**
- ID, Nombre
- created_at, updated_at

**Métodos:** CRUD completo + buscar

---

### 6️⃣ CentroCarrera
**Archivo:** `CentroCarrera.js`  
**Tabla:** `Centros_Carreras`  
**Propósito:** Relación entre centros educativos y carreras

**Campos:**
- ID, ID_centro_educativo, ID_carrera
- created_at, updated_at

**Métodos Especiales:**
- `obtenerCarrerasPorCentro(id_centro)`
- `obtenerCentrosPorCarrera(id_carrera)`
- `eliminarPorCentroYCarrera(id_centro, id_carrera)`

---

### 7️⃣ Rol
**Archivo:** `Rol.js`  
**Tabla:** `Roles`  
**Propósito:** Gestión de roles del sistema

**Campos:**
- ID_rol, Nombre, Estado
- created_at, updated_at

**Métodos:** CRUD completo + cambiarEstado

---

### 8️⃣ Permiso
**Archivo:** `Permiso.js`  
**Tabla:** `Permisos`  
**Propósito:** Gestión de permisos del sistema

**Campos:**
- ID, Nombre, Seccion, Accion, Estado
- created_at, updated_at

**Métodos Especiales:**
- `obtenerPorSeccion(seccion)`
- Filtros por sección, acción y estado

---

### 9️⃣ RolPermiso
**Archivo:** `RolPermiso.js`  
**Tabla:** `Rol_permisos`  
**Propósito:** Relación entre roles y permisos

**Campos:**
- ID, ID_Rol, ID_Permiso
- created_at, updated_at

**Métodos Especiales:**
- `obtenerPermisosPorRol(id_rol)`
- `obtenerRolesPorPermiso(id_permiso)`
- `asignarPermisosARol(id_rol, ids_permisos)`

---

### 🔟 UsuarioPermiso
**Archivo:** `UsuarioPermiso.js`  
**Tabla:** `Usuarios_permisos`  
**Propósito:** Permisos específicos por usuario

**Campos:**
- ID, ID_Usuario, ID_Permiso
- created_at, updated_at

**Métodos Especiales:**
- `obtenerPermisosPorUsuario(id_usuario)`
- `obtenerPermisosCompletosUsuario(id_usuario)` - Incluye permisos del rol + permisos específicos
- `asignarPermisosAUsuario(id_usuario, ids_permisos)`

---

### 1️⃣1️⃣ ParticipanteEvento
**Archivo:** `ParticipanteEvento.js`  
**Tabla:** `Participantes_Eventos`  
**Propósito:** Inscripción de usuarios a eventos

**Campos:**
- ID, ID_Evento, ID_Usuario
- Fecha_registro, Estado_inscripcion
- Asistencia, Apor_monetaria, Comentarios
- created_at, updated_at

**Métodos Especiales:**
- `obtenerParticipantesPorEvento(id_evento, filtros)`
- `obtenerEventosPorUsuario(id_usuario, filtros)`
- `cambiarEstadoInscripcion(id, nuevo_estado)`
- `registrarAsistencia(id, asistio)`
- `contarParticipantes(id_evento, filtros)`

---

## 🎯 Características Comunes

Todos los modelos incluyen:

✅ **Campos automáticos:**
- `created_at` - Fecha de creación
- `updated_at` - Fecha de última actualización

✅ **Métodos CRUD básicos:**
- `inicializar()` - Crear tabla si no existe
- `crear(datos)` - Crear nuevo registro
- `obtenerTodos(filtros)` - Obtener todos los registros
- `obtenerPorId(id)` - Obtener por ID
- `actualizar(id, datos)` - Actualizar registro
- `eliminar(id)` - Eliminar registro

✅ **Seguridad:**
- Prepared statements (prevención SQL injection)
- Validación de campos
- Manejo de errores

✅ **Optimización:**
- Índices en campos frecuentemente consultados
- Unique keys en relaciones
- ENGINE=InnoDB para transacciones

---

## 🚀 Uso

### Inicializar todas las tablas:

```bash
npm run db:init
```

### En el código:

```javascript
const Usuario = require('./src/models/Usuario');
const Evento = require('./src/models/Evento');
const ParticipanteEvento = require('./src/models/ParticipanteEvento');

// Usar los modelos
const usuarios = await Usuario.obtenerTodos();
const eventos = await Evento.obtenerProximos(10);
const participantes = await ParticipanteEvento.obtenerParticipantesPorEvento(1);
```

---

## 📊 Relaciones Entre Tablas

```
Usuarios
├── ID_rol → Roles
├── ID_centro_educativo → Centros_Educativos
├── ID_carrera → Carreras
└── Inscripciones → Participantes_Eventos

Eventos
├── ID_organizador → Usuarios
├── ID_categoria_evento → Categoria_Eventos
├── ID_centro_educativo → Centros_Educativos
└── Inscripciones → Participantes_Eventos

Roles
└── Permisos → Rol_permisos → Permisos

Centros_Educativos
└── Carreras → Centros_Carreras → Carreras

Participantes_Eventos
├── ID_Usuario → Usuarios
└── ID_Evento → Eventos
```

---

## 📝 Notas Importantes

1. **Orden de creación:** Las tablas se crean en orden de dependencias
2. **Tablas intermedias:** Tienen unique constraints para evitar duplicados
3. **Estados:** Muchas tablas usan el campo `Estado` para soft delete
4. **Fecha_registro:** En Participantes_Eventos usa `DEFAULT (CURRENT_DATE)`
5. **IDs especiales:** Rol usa `ID_rol` en lugar de `ID`

---

## 🆘 Problemas Comunes

### Error: Table doesn't exist
```bash
# Solución: Ejecutar inicialización
npm run db:init
```

### Error: Duplicate entry
```bash
# Las tablas intermedias tienen unique constraints
# Verifica que no estés insertando relaciones duplicadas
```

### Error: Foreign key constraint
```bash
# Asegúrate de que los IDs referenciados existan
# Ejemplo: Un evento necesita que exista el usuario organizador
```

---

## 📖 Documentación Adicional

- [Modelo Usuario](./MODELO_USUARIO.md)
- [Modelo Eventos](./MODELO_EVENTOS.md)
- [Cómo Probar](./COMO_PROBAR.md)

---

**¡Todos los modelos están listos para usar! 🎉**

