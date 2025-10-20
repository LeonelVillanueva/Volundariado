const Usuario = require('../models/Usuario');

/**
 * Controlador para gestión de Configuración de Privacidad
 */

// Obtener mi configuración de privacidad
exports.obtenerMiConfiguracion = async (req, res) => {
  try {
    const usuario = await Usuario.obtenerPorId(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    const configuracion = Usuario.getPrivacidad(usuario);

    res.json({
      success: true,
      data: configuracion
    });
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener configuración de privacidad',
      error: error.message
    });
  }
};

// Actualizar mi configuración de privacidad
exports.actualizarMiConfiguracion = async (req, res) => {
  try {
    const {
      perfil_publico,
      mostrar_email_personal,
      mostrar_email_academico,
      mostrar_telefono,
      mostrar_fecha_nacimiento,
      mostrar_centro_educativo,
      mostrar_carrera,
      mostrar_horas_voluntariado
    } = req.body;

    // Construir configuración
    const configuracion = {
      perfil_publico: perfil_publico !== undefined ? perfil_publico : true,
      mostrar_email_personal: mostrar_email_personal !== undefined ? mostrar_email_personal : false,
      mostrar_email_academico: mostrar_email_academico !== undefined ? mostrar_email_academico : false,
      mostrar_telefono: mostrar_telefono !== undefined ? mostrar_telefono : false,
      mostrar_fecha_nacimiento: mostrar_fecha_nacimiento !== undefined ? mostrar_fecha_nacimiento : false,
      mostrar_centro_educativo: mostrar_centro_educativo !== undefined ? mostrar_centro_educativo : true,
      mostrar_carrera: mostrar_carrera !== undefined ? mostrar_carrera : true,
      mostrar_horas_voluntariado: mostrar_horas_voluntariado !== undefined ? mostrar_horas_voluntariado : true
    };

    const actualizado = await Usuario.actualizarPrivacidad(req.usuario.id, configuracion);

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Error al actualizar configuración'
      });
    }

    res.json({
      success: true,
      mensaje: 'Configuración de privacidad actualizada exitosamente',
      data: configuracion
    });
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar configuración de privacidad',
      error: error.message
    });
  }
};

// Restablecer configuración por defecto
exports.restablecerConfiguracion = async (req, res) => {
  try {
    const configuracionDefecto = Usuario.getConfiguracionPrivacidadPorDefecto();
    
    const actualizado = await Usuario.actualizarPrivacidad(req.usuario.id, configuracionDefecto);

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Error al restablecer configuración'
      });
    }

    res.json({
      success: true,
      mensaje: 'Configuración restablecida a valores por defecto',
      data: configuracionDefecto
    });
  } catch (error) {
    console.error('Error al restablecer configuración:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al restablecer configuración',
      error: error.message
    });
  }
};

