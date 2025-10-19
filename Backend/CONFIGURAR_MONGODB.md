# 📘 Configurar MongoDB Atlas para Fotos de Perfil

## ✅ Paso 1: Obtener el Connection String de MongoDB Atlas

1. **Ve a tu cuenta de MongoDB Atlas:** https://cloud.mongodb.com/
2. **Haz clic en "Connect"** en tu cluster
3. **Selecciona "Connect your application"**
4. **Copia el connection string**, debería verse así:

```
mongodb+srv://leocruzhn_db_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**IMPORTANTE:** Reemplaza `<password>` con tu contraseña real: `RYfaRRbdka6rkBSO`

---

## ✅ Paso 2: Configurar el archivo `.env`

### Método 1: Usar URI completa (MÁS FÁCIL)

Agrega esta línea a tu archivo `.env`:

```env
MONGODB_URI=mongodb+srv://leocruzhn_db_user:RYfaRRbdka6rkBSO@cluster0.xxxxx.mongodb.net/db_voluntariado_archivos?retryWrites=true&w=majority
```

**⚠️ IMPORTANTE:** Reemplaza `cluster0.xxxxx.mongodb.net` con tu cluster real de MongoDB Atlas

---

### Método 2: Usar variables individuales

```env
MONGODB_USER=leocruzhn_db_user
MONGODB_PASSWORD=RYfaRRbdka6rkBSO
MONGODB_CLUSTER=cluster0.xxxxx.mongodb.net
MONGODB_DATABASE=db_voluntariado_archivos
```

**⚠️ IMPORTANTE:** Reemplaza `cluster0.xxxxx.mongodb.net` con tu cluster real

---

## 🔍 ¿Cómo encontrar mi Cluster URL?

En MongoDB Atlas:

1. Ve a tu cluster
2. Haz clic en **"Connect"**
3. Selecciona **"Connect your application"**
4. En el connection string verás algo como:

```
mongodb+srv://usuario:password@cluster0.abc123.mongodb.net/...
```

**Tu Cluster URL es:** `cluster0.abc123.mongodb.net`

---

## 🎯 Ejemplo Completo de .env

Tu archivo `.env` debería verse así:

```env
# MySQL (para datos principales)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=db_voluntariado
PORT=3000

# JWT
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=24h

# MongoDB Atlas (para fotos de perfil)
MONGODB_URI=mongodb+srv://leocruzhn_db_user:RYfaRRbdka6rkBSO@cluster0.abc123.mongodb.net/db_voluntariado_archivos?retryWrites=true&w=majority
```

**Reemplaza `cluster0.abc123.mongodb.net` con tu cluster real**

---

## 🧪 Probar la Conexión

Después de configurar el `.env`, reinicia el backend:

```bash
npm run dev
```

Deberías ver en la consola:

```
✅ MongoDB Atlas conectado exitosamente
📦 Base de datos: db_voluntariado_archivos
```

Si ves errores:
- Verifica que la contraseña sea correcta
- Verifica que el cluster URL sea correcto
- Verifica que tu IP esté permitida en MongoDB Atlas (Network Access)

---

## 🔐 Permitir tu IP en MongoDB Atlas

Si obtienes error de conexión:

1. Ve a MongoDB Atlas
2. Click en **"Network Access"** (menú izquierdo)
3. Click en **"Add IP Address"**
4. Selecciona **"Allow Access from Anywhere"** (solo para desarrollo)
5. Confirma

---

## 📝 Estructura de la Base de Datos

Se creará automáticamente la colección:

```
db_voluntariado_archivos
  └── fotos_perfil
      ├── id_usuario (INT - referencia a MySQL)
      ├── imagen_base64 (String)
      ├── mime_type (String)
      ├── tamaño_bytes (Number)
      ├── nombre_original (String)
      └── fecha_subida (Date)
```

---

## 🚀 Endpoints Disponibles

Después de configurar MongoDB:

```
POST   /api/fotos-perfil          - Subir foto
GET    /api/fotos-perfil/mi-foto  - Obtener mi foto
GET    /api/fotos-perfil/usuario/:id - Obtener foto de usuario
DELETE /api/fotos-perfil          - Eliminar mi foto
```

---

## ⚠️ Notas Importantes

1. **Las fotos se guardan en Base64** (optimizadas para acceso rápido)
2. **Tamaño máximo:** 5MB por foto
3. **Formatos permitidos:** JPEG, PNG, WebP, GIF
4. **MongoDB se usa solo para fotos**, todo lo demás sigue en MySQL
5. Si MongoDB falla, el resto del sistema seguirá funcionando

---

## 🆘 Problemas Comunes

### Error: "Authentication failed"
- Verifica la contraseña en `.env`
- Asegúrate de que no haya espacios extras

### Error: "Could not connect to any servers"
- Verifica el cluster URL
- Verifica Network Access en MongoDB Atlas

### Error: "Bad auth"
- La contraseña puede contener caracteres especiales
- En ese caso, usa la URI completa con la contraseña URL-encoded

---

**¡Listo! MongoDB Atlas está configurado para guardar fotos de perfil** 📸

