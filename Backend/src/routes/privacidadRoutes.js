const express = require('express');
const router = express.Router();
const privacidadController = require('../controllers/privacidadController');
const { verificarAutenticacion } = require('../middleware/auth');

// Todas las rutas requieren autenticación

// Obtener mi configuración de privacidad
router.get('/mi-configuracion', verificarAutenticacion, privacidadController.obtenerMiConfiguracion);

// Actualizar mi configuración de privacidad
router.put('/mi-configuracion', verificarAutenticacion, privacidadController.actualizarMiConfiguracion);

// Restablecer configuración por defecto
router.post('/restablecer', verificarAutenticacion, privacidadController.restablecerConfiguracion);

module.exports = router;

