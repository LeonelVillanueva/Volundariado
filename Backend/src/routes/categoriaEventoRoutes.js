const express = require('express');
const router = express.Router();
const categoriaEventoController = require('../controllers/categoriaEventoController');
const { verificarAutenticacion, verificarRol } = require('../middleware/auth');

/**
 * Rutas de Categorías de Eventos
 * Base: /api/categorias
 */

// Obtener todas las categorías (público)
router.get('/', categoriaEventoController.obtenerTodos);

// Obtener categoría por ID (público)
router.get('/:id', categoriaEventoController.obtenerPorId);

// Crear categoría (requiere autenticación y rol admin)
router.post('/', verificarAutenticacion, verificarRol(6), categoriaEventoController.crear);

// Actualizar categoría (requiere autenticación y rol admin)
router.put('/:id', verificarAutenticacion, verificarRol(6), categoriaEventoController.actualizar);

// Eliminar categoría (requiere autenticación y rol admin)
router.delete('/:id', verificarAutenticacion, verificarRol(6), categoriaEventoController.eliminar);

module.exports = router;

