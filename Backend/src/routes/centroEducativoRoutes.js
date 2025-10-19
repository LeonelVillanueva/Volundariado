const express = require('express');
const router = express.Router();
const centroEducativoController = require('../controllers/centroEducativoController');
const { verificarAutenticacion, verificarRol } = require('../middleware/auth');

/**
 * Rutas de Centros Educativos
 * Base: /api/centros
 */

// Obtener todos los centros (público)
router.get('/', centroEducativoController.obtenerTodos);

// Buscar centros (público)
router.get('/buscar', centroEducativoController.buscar);

// Obtener centro por ID (público)
router.get('/:id', centroEducativoController.obtenerPorId);

// Crear centro (requiere autenticación y rol admin)
router.post('/', verificarAutenticacion, verificarRol(6), centroEducativoController.crear);

// Actualizar centro (requiere autenticación y rol admin)
router.put('/:id', verificarAutenticacion, verificarRol(6), centroEducativoController.actualizar);

// Eliminar centro (requiere autenticación y rol admin)
router.delete('/:id', verificarAutenticacion, verificarRol(6), centroEducativoController.eliminar);

module.exports = router;

