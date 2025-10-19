# 📡 API Endpoints - Documentación Completa

## 🌐 Base URL

```
http://localhost:3000
```

---

## 🔐 Autenticación

La mayoría de los endpoints requieren un token JWT en el header:

```
Authorization: Bearer <tu_token_jwt>
```

---

## 📋 Endpoints Disponibles

### 🔑 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| POST | `/api/auth/registrar` | Registrar nuevo usuario | ❌ No | - |
| POST | `/api/auth/login` | Iniciar sesión | ❌ No | - |
| GET | `/api/auth/verificar` | Verificar token | ❌ No | - |
| GET | `/api/auth/perfil` | Obtener perfil del usuario autenticado | ✅ Sí | - |
| POST | `/api/auth/cambiar-clave` | Cambiar contraseña | ✅ Sí | - |

---

### 👥 Usuarios (`/api/usuarios`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/api/usuarios` | Listar todos los usuarios | ✅ Sí | - |
| GET | `/api/usuarios/buscar?termino=` | Buscar usuarios | ✅ Sí | - |
| GET | `/api/usuarios/estadisticas` | Estadísticas de usuarios | ✅ Sí | Admin |
| GET | `/api/usuarios/:id` | Obtener usuario por ID | ✅ Sí | - |
| POST | `/api/usuarios` | Crear usuario | ✅ Sí | Admin |
| PUT | `/api/usuarios/:id` | Actualizar usuario | ✅ Sí | Admin |
| DELETE | `/api/usuarios/:id` | Eliminar usuario | ✅ Sí | Admin |
| POST | `/api/usuarios/:id/verificar` | Verificar usuario | ✅ Sí | Admin |
| PATCH | `/api/usuarios/:id/estado` | Cambiar estado | ✅ Sí | Admin |

---

### 📅 Eventos (`/api/eventos`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/api/eventos` | Listar todos los eventos | ❌ No | - |
| GET | `/api/eventos/proximos` | Eventos próximos | ❌ No | - |
| GET | `/api/eventos/inscripciones-abiertas` | Eventos con inscripciones abiertas | ❌ No | - |
| GET | `/api/eventos/buscar?termino=` | Buscar eventos | ❌ No | - |
| GET | `/api/eventos/estadisticas` | Estadísticas de eventos | ✅ Sí | Admin |
| GET | `/api/eventos/organizador/:id` | Eventos por organizador | ✅ Sí | - |
| GET | `/api/eventos/:id` | Obtener evento por ID | ❌ No | - |
| GET | `/api/eventos/:id/disponibilidad` | Verificar cupos | ❌ No | - |
| POST | `/api/eventos` | Crear evento | ✅ Sí | - |
| PUT | `/api/eventos/:id` | Actualizar evento | ✅ Sí | - |
| DELETE | `/api/eventos/:id` | Eliminar evento | ✅ Sí | - |
| PATCH | `/api/eventos/:id/estado` | Cambiar estado | ✅ Sí | Admin |

---

### 📝 Inscripciones (`/api/inscripciones`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| POST | `/api/inscripciones/eventos/:id/inscribir` | Inscribirse a evento | ✅ Sí | - |
| GET | `/api/inscripciones/eventos/:id/participantes` | Ver participantes de evento | ✅ Sí | - |
| GET | `/api/inscripciones/mis-eventos` | Mis inscripciones | ✅ Sí | - |
| PATCH | `/api/inscripciones/:id/estado` | Cambiar estado inscripción | ✅ Sí | Admin |
| POST | `/api/inscripciones/:id/asistencia` | Registrar asistencia | ✅ Sí | Admin |
| DELETE | `/api/inscripciones/:id` | Cancelar inscripción | ✅ Sí | - |

---

### 🎭 Roles (`/api/roles`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/api/roles` | Listar roles | ✅ Sí | Admin |
| GET | `/api/roles/:id` | Obtener rol por ID | ✅ Sí | Admin |
| POST | `/api/roles` | Crear rol | ✅ Sí | Admin |
| PUT | `/api/roles/:id` | Actualizar rol | ✅ Sí | Admin |
| DELETE | `/api/roles/:id` | Eliminar rol | ✅ Sí | Admin |
| GET | `/api/roles/:id/permisos` | Obtener permisos del rol | ✅ Sí | Admin |
| POST | `/api/roles/:id/permisos` | Asignar permisos al rol | ✅ Sí | Admin |

---

### 🏷️ Categorías (`/api/categorias`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/api/categorias` | Listar categorías | ❌ No | - |
| GET | `/api/categorias/:id` | Obtener categoría por ID | ❌ No | - |
| POST | `/api/categorias` | Crear categoría | ✅ Sí | Admin |
| PUT | `/api/categorias/:id` | Actualizar categoría | ✅ Sí | Admin |
| DELETE | `/api/categorias/:id` | Eliminar categoría | ✅ Sí | Admin |

---

## 📖 Ejemplos de Uso

### 1. Registrar Usuario

```http
POST /api/auth/registrar
Content-Type: application/json

{
  "nombres": "Juan Carlos",
  "apellidos": "Pérez López",
  "email_personal": "juan@gmail.com",
  "usuario_nombre": "jperez",
  "clave": "password123",
  "id_rol": 2
}
```

**Respuesta:**
```json
{
  "success": true,
  "mensaje": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "nombres": "Juan Carlos",
    "apellidos": "Pérez López",
    "usuario_nombre": "jperez",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Iniciar Sesión

```http
POST /api/auth/login
Content-Type: application/json

{
  "usuario_nombre": "jperez",
  "clave": "password123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "mensaje": "Login exitoso",
  "data": {
    "usuario": {
      "ID": 1,
      "Nombres": "Juan Carlos",
      "Apellidos": "Pérez López",
      "Email_personal": "juan@gmail.com",
      "Usuario_nombre": "jperez",
      "ID_rol": 2,
      "Estado": "Activo"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Obtener Eventos Próximos

```http
GET /api/eventos/proximos?limite=5
```

**Respuesta:**
```json
{
  "success": true,
  "cantidad": 5,
  "data": [
    {
      "ID": 1,
      "Nombre_evento": "Jornada de Limpieza",
      "Fecha_ini_evento": "2024-12-15 08:00:00",
      "Ciudad": "Tegucigalpa",
      "Cap_max": 50
    }
  ]
}
```

---

### 4. Inscribirse a un Evento

```http
POST /api/inscripciones/eventos/1/inscribir
Authorization: Bearer <token>
Content-Type: application/json

{
  "comentarios": "Tengo experiencia en limpieza",
  "apor_monetaria": 50.00
}
```

**Respuesta:**
```json
{
  "success": true,
  "mensaje": "Inscripción realizada exitosamente",
  "data": {
    "id": 1,
    "id_evento": 1,
    "id_usuario": 5
  }
}
```

---

### 5. Crear Evento

```http
POST /api/eventos
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre_evento": "Reforestación en La Tigra",
  "descrip_evento": "Jornada de siembra de árboles",
  "id_organizador": 1,
  "fecha_ini_evento": "2024-12-20 07:00:00",
  "fecha_fin_evento": "2024-12-20 14:00:00",
  "latitud": 14.2167,
  "longitud": -87.1167,
  "cap_max": 100,
  "cap_min": 20,
  "id_categoria_evento": 1,
  "ciudad": "Tegucigalpa",
  "direccion_completa": "Parque La Tigra, entrada principal"
}
```

---

## 🔒 Niveles de Acceso

### Público (Sin autenticación):
- ✅ Registro de usuarios
- ✅ Login
- ✅ Ver eventos
- ✅ Buscar eventos
- ✅ Ver categorías

### Autenticado (Con token):
- ✅ Ver usuarios
- ✅ Ver perfil
- ✅ Crear eventos
- ✅ Inscribirse a eventos
- ✅ Ver mis inscripciones

### Admin (Rol 1):
- ✅ Crear/editar/eliminar usuarios
- ✅ Gestionar roles y permisos
- ✅ Ver estadísticas
- ✅ Aprobar/rechazar eventos
- ✅ Registrar asistencia

---

## 📊 Query Parameters

### Usuarios:
```
GET /api/usuarios?estado=Activo&es_estudiante=true&id_rol=2
```

### Eventos:
```
GET /api/eventos?estado=Aprobado&ciudad=Tegucigalpa&proximos=true&inscripciones_abiertas=true
```

---

## 🚨 Códigos de Respuesta

| Código | Significado |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## 🧪 Probar la API

### Con Postman:
1. Importa la colección (próximamente)
2. Configura la variable de entorno `baseUrl` a `http://localhost:3000`
3. Prueba los endpoints

### Con cURL:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario_nombre":"admin","clave":"admin123"}'

# Obtener eventos
curl http://localhost:3000/api/eventos

# Obtener usuarios (con token)
curl http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer <tu_token>"
```

### Con JavaScript (fetch):

```javascript
// Login
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    usuario_nombre: 'jperez',
    clave: 'password123'
  })
});

const data = await response.json();
const token = data.data.token;

// Usar el token en otras peticiones
const eventos = await fetch('http://localhost:3000/api/eventos', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 📝 Formato de Respuestas

### Éxito:
```json
{
  "success": true,
  "mensaje": "Operación exitosa",
  "data": { ... },
  "cantidad": 10
}
```

### Error:
```json
{
  "success": false,
  "mensaje": "Descripción del error",
  "error": "Detalles técnicos"
}
```

---

## 🎯 Próximos Endpoints (En desarrollo)

- Centros Educativos
- Carreras
- Permisos
- Gestión de archivos
- Notificaciones

---

**¡La API está lista para usar! 🚀**

