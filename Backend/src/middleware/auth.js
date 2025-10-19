const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { ROLES } = require('../config/constantes');

/**
 * Middleware de Autenticación
 * Verifica que el usuario tenga un token JWT válido
 */

/**
 * Verificar que el usuario esté autenticado
 */
exports.verificarAutenticacion = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        mensaje: 'No se proporcionó token de autenticación'
      });
    }

    // El formato esperado es: "Bearer TOKEN"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        mensaje: 'Formato de token inválido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');

    // Verificar que el usuario existe y está activo
    const usuario = await Usuario.obtenerPorId(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    if (usuario.Estado !== 'Activo') {
      return res.status(403).json({
        success: false,
        mensaje: 'Usuario inactivo. Consulta a tu supervisor'
      });
    }

    // Agregar información del usuario al request
    req.usuario = {
      id: decoded.id,
      usuario_nombre: decoded.usuario_nombre,
      id_rol: decoded.id_rol
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        mensaje: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        mensaje: 'Token expirado'
      });
    }

    res.status(500).json({
      success: false,
      mensaje: 'Error al verificar autenticación',
      error: error.message
    });
  }
};

/**
 * Verificar que el usuario tenga un rol específico
 */
exports.verificarRol = (...rolesPermitidos) => {
  return async (req, res, next) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          success: false,
          mensaje: 'No autenticado'
        });
      }

      // Verificar si el rol del usuario está en los roles permitidos
      if (!rolesPermitidos.includes(req.usuario.id_rol)) {
        return res.status(403).json({
          success: false,
          mensaje: 'No tienes permisos para realizar esta acción. Consulta a tu supervisor'
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: 'Error al verificar rol',
        error: error.message
      });
    }
  };
};

/**
 * Verificar que el usuario es el propietario del recurso o es admin
 */
exports.verificarPropietarioOAdmin = (paramName = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          success: false,
          mensaje: 'No autenticado'
        });
      }

      const recursoId = req.params[paramName];
      
      // Si es admin (rol 6), permitir
      if (req.usuario.id_rol === ROLES.ADMINISTRADOR) {
        return next();
      }

      // Si es el propietario, permitir
      if (req.usuario.id === parseInt(recursoId)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        mensaje: 'No tienes permisos para realizar esta acción. Consulta a tu supervisor'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: 'Error al verificar permisos',
        error: error.message
      });
    }
  };
};

