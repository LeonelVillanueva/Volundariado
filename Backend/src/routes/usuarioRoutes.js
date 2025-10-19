const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarAutenticacion, verificarRol } = require('../middleware/auth');

/**
 * Rutas de Usuarios
 * Base: /api/usuarios
 */

// Obtener todos los usuarios (requiere autenticación)
router.get('/', verificarAutenticacion, usuarioController.obtenerTodos);

// Buscar usuarios (requiere autenticación)
router.get('/buscar', verificarAutenticacion, usuarioController.buscar);

// Obtener estadísticas (requiere autenticación y rol admin)
router.get('/estadisticas', verificarAutenticacion, verificarRol(6), usuarioController.obtenerEstadisticas);

// Obtener usuario por ID (requiere autenticación)
router.get('/:id', verificarAutenticacion, usuarioController.obtenerPorId);

// Crear usuario (requiere autenticación y rol admin)
router.post('/', verificarAutenticacion, verificarRol(6), usuarioController.crear);

// Actualizar usuario (requiere autenticación y rol admin)
router.put('/:id', verificarAutenticacion, verificarRol(6), usuarioController.actualizar);

// Eliminar usuario (requiere autenticación y rol admin)
router.delete('/:id', verificarAutenticacion, verificarRol(6), usuarioController.eliminar);

// Verificar usuario (requiere autenticación y rol admin)
router.post('/:id/verificar', verificarAutenticacion, verificarRol(6), usuarioController.verificar);

// Cambiar estado de usuario (requiere autenticación y rol admin)
router.patch('/:id/estado', verificarAutenticacion, verificarRol(6), usuarioController.cambiarEstado);

module.exports = router;

