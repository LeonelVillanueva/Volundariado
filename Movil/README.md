# App Móvil - Sistema de Voluntariado

Aplicación móvil desarrollada en Flutter para iOS, Android y Web.

## 🚀 Tecnologías

- Flutter 3.0+
- Provider (State Management)
- Dio (HTTP Client)
- SharedPreferences (Storage)

## 📦 Instalación

```bash
# Instalar dependencias
flutter pub get

# Configurar archivo .env
# Crea un archivo .env en la raíz con:
# API_URL=http://localhost:3000

# Ejecutar en Windows
flutter run -d windows

# Ejecutar en Web
flutter run -d chrome

# Ejecutar en Android (requiere emulador o dispositivo)
flutter run
```

## ⚙️ Configuración

### Archivo .env

Crea un archivo `.env` en la raíz del proyecto `Movil/`:

```env
# Para Windows/Web
API_URL=http://localhost:3000

# Para Android Emulator
# API_URL=http://10.0.2.2:3000

# Para dispositivo físico
# API_URL=http://TU_IP_LOCAL:3000
```

## 🔑 Credenciales de prueba

```
Usuario: admin
Contraseña: admin123
```

## 📱 Plataformas soportadas

- ✅ Android
- ✅ iOS
- ✅ Web
- ✅ Windows Desktop

## 🛠️ Comandos útiles

```bash
# Ver dispositivos disponibles
flutter devices

# Limpiar build
flutter clean

# Verificar instalación de Flutter
flutter doctor
```
