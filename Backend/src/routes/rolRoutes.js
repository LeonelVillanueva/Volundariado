const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');
const { verificarAutenticacion, verificarRol } = require('../middleware/auth');

/**
 * Rutas de Roles
 * Base: /api/roles
 * Todas requieren autenticación y rol de administrador
 */

router.get('/', verificarAutenticacion, verificarRol(6), rolController.obtenerTodos);
router.get('/:id', verificarAutenticacion, verificarRol(6), rolController.obtenerPorId);
router.post('/', verificarAutenticacion, verificarRol(6), rolController.crear);
router.put('/:id', verificarAutenticacion, verificarRol(6), rolController.actualizar);
router.delete('/:id', verificarAutenticacion, verificarRol(6), rolController.eliminar);

// Gestión de permisos del rol
router.get('/:id/permisos', verificarAutenticacion, verificarRol(6), rolController.obtenerPermisos);
router.post('/:id/permisos', verificarAutenticacion, verificarRol(6), rolController.asignarPermisos);

module.exports = router;

