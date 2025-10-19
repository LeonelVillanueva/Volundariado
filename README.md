# Sistema de Gestión de Voluntariado

Sistema completo para la gestión de eventos de voluntariado con backend, frontend web y aplicación móvil.

## 📂 Estructura del Proyecto

```
Proyecto/
├── Backend/         # API REST (Node.js + Express + MySQL)
├── Frontend/        # Aplicación Web (Nuxt.js 3)
├── Movil/          # Aplicación Móvil (Flutter)
└── INICIAR_TODO.bat # Inicia todo el sistema
```

## 🚀 Inicio Rápido

### Opción 1: Iniciar Todo (Recomendado)

**Ejecuta el archivo `.bat`:**
```bash
INICIAR_TODO.bat
```

Esto iniciará automáticamente:
- ✅ Backend (Puerto 3000)
- ✅ Frontend (Puerto 3001)
- ✅ Móvil (Windows)

---

### Opción 2: Iniciar Manualmente

#### Backend (Puerto 3000)
```bash
cd Backend
npm install
npm run db:seed
npm run dev
```

#### Frontend (Puerto 3001)
```bash
cd Frontend
npm install
npm run dev
```

#### Móvil
```bash
cd Movil
flutter pub get
# Crear archivo .env con: API_URL=http://localhost:3000
flutter run -d windows
```

---

## 🔑 Credenciales por defecto

```
Usuario: admin
Contraseña: admin123
```

## 📚 Documentación

- [Backend README](./Backend/README.md)
- [Frontend README](./Frontend/README.md)
- [Móvil README](./Movil/README.md)
- [Documentación Backend completa](./Backend/docs/)

## 🛠️ Tecnologías

### Backend
- Node.js + Express
- MySQL
- JWT Authentication

### Frontend
- Nuxt.js 3
- Vue 3
- Tailwind CSS

### Móvil
- Flutter
- Provider (State Management)
- Dio (HTTP Client)
