# 🚀 Guía Rápida: Configurar MongoDB Atlas

## ✅ Lo que ya tienes:
- Usuario: `leocruzhn_db_user`
- Contraseña: `RYfaRRbdka6rkBSO`
- Cuenta de MongoDB Atlas creada

---

## 📝 Paso 1: Obtener tu Connection String

1. **Ve a MongoDB Atlas:** https://cloud.mongodb.com/
2. **Inicia sesión** con tu cuenta
3. **Haz clic en "Database"** (menú izquierdo)
4. **Busca tu cluster** (probablemente se llama "Cluster0")
5. **Haz clic en "Connect"**
6. **Selecciona "Connect your application"**
7. **Copia el connection string** que se ve algo así:

```
mongodb+srv://leocruzhn_db_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

📝 **Anota el nombre de tu cluster** (la parte que dice `cluster0.xxxxx.mongodb.net`)

---

## 🔧 Paso 2: Configurar tu archivo `.env`

### Opción A: URI Completa (MÁS FÁCIL ✅)

Abre `Backend/.env` y agrega estas líneas:

```env
# MongoDB Atlas (reemplaza cluster0.xxxxx.mongodb.net con tu cluster real)
MONGODB_URI=mongodb+srv://leocruzhn_db_user:RYfaRRbdka6rkBSO@cluster0.xxxxx.mongodb.net/db_voluntariado_archivos?retryWrites=true&w=majority
```

### Opción B: Variables Separadas

```env
MONGODB_USER=leocruzhn_db_user
MONGODB_PASSWORD=RYfaRRbdka6rkBSO
MONGODB_CLUSTER=cluster0.xxxxx.mongodb.net
MONGODB_DATABASE=db_voluntariado_archivos
```

**⚠️ IMPORTANTE:** Reemplaza `cluster0.xxxxx.mongodb.net` con el cluster que copiaste en el Paso 1

---

## 🌐 Paso 3: Permitir acceso desde cualquier IP

Para que funcione desde tu computadora:

1. En MongoDB Atlas, ve a **"Network Access"** (menú izquierdo)
2. Haz clic en **"Add IP Address"**
3. Selecciona **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Haz clic en **"Confirm"**

---

## 🧪 Paso 4: Probar la Conexión

1. **Asegúrate de guardar** tu archivo `.env`
2. **Reinicia el backend:**

```bash
cd Backend
npm run dev
```

3. **Busca en la consola estos mensajes:**

```
✅ MongoDB Atlas conectado exitosamente
📦 Base de datos: db_voluntariado_archivos
```

✅ **Si ves eso, ¡funciona!**

❌ **Si ves errores:**
- Verifica que copiaste bien el cluster URL
- Verifica que tu IP esté permitida en Network Access
- Verifica que la contraseña no tenga espacios extras

---

## 📸 Paso 5: Probar Subir Foto

1. **Inicia el frontend:**
```bash
cd Frontend
npm run dev
```

2. **Ve a:** `http://localhost:3001`
3. **Inicia sesión** (admin / admin123)
4. **Haz clic en "Mi Perfil"**
5. **Haz clic en el botón de cámara** sobre tu foto
6. **Selecciona una imagen** (máximo 5MB)
7. **¡Listo!** La foto se guarda en MongoDB

---

## 🎯 Ejemplo Completo de .env

Tu archivo `Backend/.env` debería verse así:

```env
# MySQL (datos principales)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=db_voluntariado
PORT=3000

# JWT
JWT_SECRET=tu_clave_secreta_12345
JWT_EXPIRES_IN=24h

# MongoDB Atlas (fotos de perfil)
# Reemplaza "cluster0.abc123" con tu cluster real
MONGODB_URI=mongodb+srv://leocruzhn_db_user:RYfaRRbdka6rkBSO@cluster0.abc123.mongodb.net/db_voluntariado_archivos?retryWrites=true&w=majority
```

---

## 🔍 ¿Cómo saber si mi cluster URL es correcto?

Tu cluster URL está en el connection string entre `@` y `/`:

```
mongodb+srv://usuario:password@AQUI_ESTA_TU_CLUSTER/database
                               ^^^^^^^^^^^^^^^^^^^^
```

Ejemplo real:
- `cluster0.abc123.mongodb.net`
- `cluster0.mongodb.net`
- `voluntariado-cluster.abc123.mongodb.net`

---

## 🆘 Problemas Comunes

### Error: "Authentication failed"
- La contraseña es incorrecta
- Hay espacios extras en el `.env`
- El usuario no tiene permisos

**Solución:** Ve a MongoDB Atlas → Database Access → Verifica que `leocruzhn_db_user` exista

---

### Error: "Could not connect to any servers"
- El cluster URL es incorrecto
- Tu IP no está permitida

**Solución:** Verifica Network Access y permite "0.0.0.0/0"

---

### Error: "Connection timed out"
- Firewall bloqueando
- IP no permitida

**Solución:** Network Access → Add IP → Allow from Anywhere

---

## ✨ Funcionalidades Implementadas

✅ **Subir foto de perfil** (hasta 5MB)
✅ **Actualizar foto** (reemplaza la anterior)
✅ **Ver foto** (carga automáticamente)
✅ **Formatos:** JPEG, PNG, WebP, GIF
✅ **Almacenamiento:** MongoDB Atlas (nube)
✅ **Compresión:** Base64 optimizado

---

## 📊 ¿Qué se guarda en MongoDB?

```javascript
{
  id_usuario: 1,  // ID del usuario en MySQL
  imagen_base64: "iVBORw0KGgoAAAANS...", // Imagen
  mime_type: "image/jpeg",
  tamaño_bytes: 245678,
  nombre_original: "mi_foto.jpg",
  fecha_subida: "2025-10-19T...",
  fecha_actualizacion: "2025-10-19T..."
}
```

---

## 💡 Notas Importantes

1. **MongoDB se usa SOLO para fotos**, todo lo demás está en MySQL
2. **Si MongoDB falla**, el resto del sistema sigue funcionando
3. **Tier gratuito de Atlas:** 512MB (suficiente para ~1000 fotos)
4. **Las fotos se guardan en Base64** para acceso rápido
5. **Una foto por usuario** (se actualiza, no se duplica)

---

## 🎉 ¡Listo!

Una vez configurado, puedes:
- Subir tu foto de perfil
- Cambiarla cuando quieras
- Ver las fotos de otros usuarios
- Todo se guarda en la nube (MongoDB Atlas)

**¿Tienes dudas? Revisa el archivo `Backend/CONFIGURAR_MONGODB.md` para más detalles técnicos.**

