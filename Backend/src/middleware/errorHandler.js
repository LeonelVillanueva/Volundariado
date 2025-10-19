/**
 * Middleware de Manejo de Errores Global
 * Captura todos los errores no manejados
 */

/**
 * Manejador de errores 404
 */
exports.notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    sugerencia: 'Verifica la URL y el método HTTP'
  });
};

/**
 * Manejador de errores global
 */
exports.errorHandler = (err, req, res, next) => {
  console.error('Error capturado:', err);

  // Error de validación de Mongoose/Express
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      mensaje: 'Error de validación',
      errores: Object.values(err.errors).map(e => e.message)
    });
  }

  // Error de duplicado en BD
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      success: false,
      mensaje: 'El registro ya existe',
      detalle: err.sqlMessage
    });
  }

  // Error de FK constraint
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      mensaje: 'Referencia inválida. El ID referenciado no existe',
      detalle: err.sqlMessage
    });
  }

  // Error de FK al intentar eliminar
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(400).json({
      success: false,
      mensaje: 'No se puede eliminar porque tiene registros relacionados',
      detalle: err.sqlMessage
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      mensaje: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      mensaje: 'Token expirado'
    });
  }

  // Error de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      mensaje: 'JSON inválido en el cuerpo de la petición'
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    success: false,
    mensaje: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Manejador de errores asíncronos
 */
exports.asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

