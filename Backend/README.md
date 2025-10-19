# Backend - Sistema de Voluntariado

API REST para gestión de eventos de voluntariado desarrollada con Node.js, Express y MySQL.

## 🚀 Tecnologías

- Node.js + Express
- MySQL
- JWT (Autenticación)
- bcryptjs (Encriptación)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Crea un archivo .env (ver env.example.txt)

# Iniciar base de datos y tablas
npm run db:inicializar

# Insertar datos iniciales (roles y usuario admin)
npm run db:seed

# Iniciar servidor
npm run dev
```

## 🔑 Usuario por defecto

```
Usuario: admin
Contraseña: admin123
```

## 📚 Documentación

- [API Endpoints](./docs/API_ENDPOINTS.md)
- [Modelos de Base de Datos](./docs/MODELOS_COMPLETOS.md)
- [Foreign Keys](./docs/FOREIGN_KEYS.md)
- [Documentación completa](./docs/README.md)

## 📝 Scripts disponibles

```bash
npm run dev          # Iniciar en desarrollo (nodemon)
npm start            # Iniciar en producción
npm run db:seed      # Insertar datos iniciales
npm run db:recrear   # Recrear todas las tablas
```

## 🗄️ Base de Datos

El sistema utiliza MySQL con 11 tablas principales:

- Usuarios
- Eventos
- Roles y Permisos
- Centros Educativos y Carreras
- Categorías de Eventos
- Participantes en Eventos

Ver detalles en [docs/MODELOS_COMPLETOS.md](./docs/MODELOS_COMPLETOS.md)
