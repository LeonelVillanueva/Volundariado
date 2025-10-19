# Frontend - Sistema de Voluntariado

Aplicación web desarrollada con Nuxt.js 3 y Tailwind CSS.

## 🚀 Tecnologías

- Nuxt.js 3
- Vue 3
- Tailwind CSS
- Pinia (State Management)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Modo desarrollo (puerto 3001)
npm run dev

# Build para producción
npm run build
```

## 🔑 Credenciales de prueba

```
Usuario: admin
Contraseña: admin123
```

## 📱 Páginas Implementadas

- `/` - Login
- `/panel` - Panel de control

## ⚙️ Configuración

El frontend se conecta al backend en `http://localhost:3000`

Ver configuración en `composables/useApi.js`

## 📝 Notas

- El servidor corre en puerto **3001**
- SSR deshabilitado (modo SPA)
- Consume la API REST del backend
