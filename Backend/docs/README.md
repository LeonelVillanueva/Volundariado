# 📚 Documentación del Backend

Esta carpeta contiene la documentación técnica del proyecto backend.

## 📋 Documentos Disponibles

### 📊 Modelos y Base de Datos

| Archivo | Descripción |
|---------|-------------|
| **MODELOS_COMPLETOS.md** | Documentación completa de los 11 modelos del sistema |
| **FOREIGN_KEYS.md** | Guía de Foreign Keys y relaciones entre tablas |

### 🔌 API

| Archivo | Descripción |
|---------|-------------|
| **API_ENDPOINTS.md** | Documentación completa de todos los endpoints de la API |

---

## 🗄️ Modelos del Sistema

El sistema cuenta con 11 modelos:

1. **Usuarios** - Gestión de usuarios del sistema
2. **Eventos** - Eventos de voluntariado
3. **Roles** - Roles de usuario
4. **Permisos** - Permisos del sistema
5. **Rol_permisos** - Relación roles-permisos
6. **Usuarios_permisos** - Permisos específicos de usuarios
7. **Categoria_Eventos** - Categorías de eventos
8. **Centros_Educativos** - Centros educativos
9. **Carreras** - Carreras universitarias
10. **Centros_Carreras** - Relación centros-carreras
11. **Participantes_Eventos** - Participantes en eventos

---

## 🚀 Scripts Disponibles

```bash
npm run dev          # Iniciar servidor en desarrollo
npm run db:seed      # Insertar datos iniciales
npm run db:recrear   # Recrear todas las tablas
```

---

## 📂 Estructura del Proyecto

```
Backend/
├── docs/                    # 📚 Documentación
├── src/
│   ├── config/             # ⚙️ Configuraciones
│   ├── models/             # 📊 Modelos de base de datos
│   ├── controllers/        # 🎮 Controladores
│   ├── routes/             # 🛣️ Rutas
│   ├── middleware/         # 🔐 Middlewares
│   ├── scripts/            # 🔧 Scripts de utilidad
│   └── index.js            # 🚀 Servidor principal
└── package.json
```

---

## 📝 Roles del Sistema

1. **Invitado** - Visualiza eventos públicos
2. **Estudiante voluntario** - Inscripción en eventos para estudiantes
3. **Voluntario general** - Inscripción en eventos públicos
4. **Docente** - Crea eventos y valida estudiantes
5. **Organizador** - Crea eventos y gestiona inscripciones
6. **Administrador** - Control total del sistema
