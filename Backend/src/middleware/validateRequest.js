const { validationResult } = require('express-validator');

/**
 * Middleware de Validación
 * Verifica que los datos de las peticiones sean válidos
 */

/**
 * Validar resultado de express-validator
 */
exports.validarResultado = (req, res, next) => {
  const errores = validationResult(req);
  
  if (!errores.isEmpty()) {
    return res.status(400).json({
      success: false,
      mensaje: 'Errores de validación',
      errores: errores.array().map(error => ({
        campo: error.param,
        mensaje: error.msg
      }))
    });
  }
  
  next();
};

/**
 * Validar que el body no esté vacío
 */
exports.validarBodyNoVacio = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      mensaje: 'El cuerpo de la petición no puede estar vacío'
    });
  }
  
  next();
};

/**
 * Validar que un campo requerido exista
 */
exports.validarCamposRequeridos = (campos) => {
  return (req, res, next) => {
    const camposFaltantes = [];
    
    campos.forEach(campo => {
      if (!req.body[campo]) {
        camposFaltantes.push(campo);
      }
    });
    
    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'Campos requeridos faltantes',
        campos_faltantes: camposFaltantes
      });
    }
    
    next();
  };
};

