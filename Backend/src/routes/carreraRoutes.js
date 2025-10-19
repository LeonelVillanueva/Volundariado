const express = require('express');
const router = express.Router();
const carreraController = require('../controllers/carreraController');
const { verificarAutenticacion, verificarRol } = require('../middleware/auth');

/**
 * Rutas de Carreras
 * Base: /api/carreras
 */

// Obtener todas las carreras (público)
router.get('/', carreraController.obtenerTodos);

// Buscar carreras (público)
router.get('/buscar', carreraController.buscar);

// Obtener carreras por centro educativo (público)
router.get('/centro/:id_centro', carreraController.obtenerPorCentro);

// Obtener carrera por ID (público)
router.get('/:id', carreraController.obtenerPorId);

// Crear carrera (requiere autenticación y rol admin)
router.post('/', verificarAutenticacion, verificarRol(6), carreraController.crear);

// Actualizar carrera (requiere autenticación y rol admin)
router.put('/:id', verificarAutenticacion, verificarRol(6), carreraController.actualizar);

// Eliminar carrera (requiere autenticación y rol admin)
router.delete('/:id', verificarAutenticacion, verificarRol(6), carreraController.eliminar);

module.exports = router;

