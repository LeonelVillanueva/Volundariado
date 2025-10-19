const FotoPerfil = require('../models/FotoPerfil');
const mongoConnection = require('../config/mongodb');
const Usuario = require('../models/Usuario');

/**
 * Controller para gestionar fotos de perfil en MongoDB
 */

/**
 * Subir o actualizar foto de perfil
 */
exports.subirFoto = async (req, res) => {
  try {
    // Verificar conexión a MongoDB
    if (!mongoConnection.estaConectado()) {
      await mongoConnection.conectar();
    }

    const { imagen_base64, mime_type, nombre_original } = req.body;
    const id_usuario = req.usuario.id;

    // Validar campos requeridos
    if (!imagen_base64) {
      return res.status(400).json({
        success: false,
        mensaje: 'La imagen en Base64 es requerida'
      });
    }

    // Validar formato de imagen
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (mime_type && !tiposPermitidos.includes(mime_type)) {
      return res.status(400).json({
        success: false,
        mensaje: 'Tipo de imagen no permitido. Use: JPEG, PNG, WebP o GIF'
      });
    }

    // Calcular tamaño en bytes (aproximado desde Base64)
    const tamaño_bytes = Math.round((imagen_base64.length * 3) / 4);

    // Validar tamaño máximo (5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (tamaño_bytes > MAX_SIZE) {
      return res.status(400).json({
        success: false,
        mensaje: `La imagen es demasiado grande. Máximo: 5MB. Tu imagen: ${Math.round(tamaño_bytes / 1024 / 1024)}MB`
      });
    }

    // Limpiar Base64 (remover prefijo data:image si existe)
    let imagenLimpia = imagen_base64;
    if (imagen_base64.includes('base64,')) {
      imagenLimpia = imagen_base64.split('base64,')[1];
    }

    // Guardar o actualizar foto en MongoDB
    const foto = await FotoPerfil.guardarFoto(id_usuario, {
      imagen_base64: imagenLimpia,
      mime_type: mime_type || 'image/jpeg',
      tamaño_bytes,
      nombre_original: nombre_original || 'foto_perfil'
    });

    // Actualizar referencia en MySQL
    const referenciaMongoDB = `mongodb://foto_usuario_${id_usuario}`;
    await Usuario.actualizar(id_usuario, {
      Url_foto_perfil: referenciaMongoDB
    });

    res.json({
      success: true,
      mensaje: 'Foto de perfil guardada exitosamente',
      data: {
        ...foto.obtenerInfo(),
        referencia_mysql: referenciaMongoDB
      }
    });

  } catch (error) {
    console.error('Error al subir foto:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al guardar foto de perfil',
      error: error.message
    });
  }
};

/**
 * Obtener foto de perfil del usuario autenticado
 */
exports.obtenerMiFoto = async (req, res) => {
  try {
    // Verificar conexión a MongoDB
    if (!mongoConnection.estaConectado()) {
      await mongoConnection.conectar();
    }

    const id_usuario = req.usuario.id;

    const foto = await FotoPerfil.obtenerPorUsuario(id_usuario);

    if (!foto) {
      return res.status(404).json({
        success: false,
        mensaje: 'No tienes foto de perfil'
      });
    }

    res.json({
      success: true,
      data: {
        imagen_url: foto.obtenerDataURL(),
        info: foto.obtenerInfo(),
        referencia_mysql: `mongodb://foto_usuario_${id_usuario}`
      }
    });

  } catch (error) {
    console.error('Error al obtener foto:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener foto de perfil',
      error: error.message
    });
  }
};

/**
 * Obtener foto de perfil de cualquier usuario (por ID)
 */
exports.obtenerFotoPorUsuario = async (req, res) => {
  try {
    // Verificar conexión a MongoDB
    if (!mongoConnection.estaConectado()) {
      await mongoConnection.conectar();
    }

    const { id_usuario } = req.params;

    const foto = await FotoPerfil.obtenerPorUsuario(parseInt(id_usuario));

    if (!foto) {
      return res.status(404).json({
        success: false,
        mensaje: 'El usuario no tiene foto de perfil'
      });
    }

    res.json({
      success: true,
      data: {
        imagen_url: foto.obtenerDataURL(),
        info: foto.obtenerInfo(),
        referencia_mysql: `mongodb://foto_usuario_${id_usuario}`
      }
    });

  } catch (error) {
    console.error('Error al obtener foto:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener foto de perfil',
      error: error.message
    });
  }
};

/**
 * Eliminar foto de perfil
 */
exports.eliminarFoto = async (req, res) => {
  try {
    // Verificar conexión a MongoDB
    if (!mongoConnection.estaConectado()) {
      await mongoConnection.conectar();
    }

    const id_usuario = req.usuario.id;

    const resultado = await FotoPerfil.eliminarFoto(id_usuario);

    if (resultado.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'No tienes foto de perfil para eliminar'
      });
    }

    // Limpiar referencia en MySQL
    await Usuario.actualizar(id_usuario, {
      Url_foto_perfil: null
    });

    res.json({
      success: true,
      mensaje: 'Foto de perfil eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar foto:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar foto de perfil',
      error: error.message
    });
  }
};

/**
 * Verificar si un usuario tiene foto de perfil (usando referencia MySQL)
 */
exports.verificarFotoUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    // Obtener usuario de MySQL
    const usuario = await Usuario.obtenerPorId(parseInt(id_usuario));

    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Verificar si tiene referencia a foto en MongoDB
    const tieneFoto = usuario.Url_foto_perfil && usuario.Url_foto_perfil.startsWith('mongodb://foto_usuario_');

    res.json({
      success: true,
      data: {
        id_usuario: parseInt(id_usuario),
        tiene_foto: tieneFoto,
        referencia_mysql: usuario.Url_foto_perfil,
        nombre_usuario: `${usuario.Nombres} ${usuario.Apellidos}`
      }
    });

  } catch (error) {
    console.error('Error al verificar foto:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al verificar foto de perfil',
      error: error.message
    });
  }
};

