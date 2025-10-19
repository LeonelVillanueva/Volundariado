const express = require('express');
const router = express.Router();
const permisoController = require('../controllers/permisoController');
const { verificarAutenticacion, verificarRol } = require('../middleware/auth');

/**
 * Rutas de Permisos
 * Base: /api/permisos
 * Todas requieren autenticación y rol de administrador
 */

router.get('/', verificarAutenticacion, verificarRol(6), permisoController.obtenerTodos);
router.get('/seccion/:seccion', verificarAutenticacion, verificarRol(6), permisoController.obtenerPorSeccion);
router.get('/:id', verificarAutenticacion, verificarRol(6), permisoController.obtenerPorId);
router.post('/', verificarAutenticacion, verificarRol(6), permisoController.crear);
router.put('/:id', verificarAutenticacion, verificarRol(6), permisoController.actualizar);
router.delete('/:id', verificarAutenticacion, verificarRol(6), permisoController.eliminar);

// Gestión de permisos por usuario
router.get('/usuario/:id_usuario', verificarAutenticacion, verificarRol(6), permisoController.obtenerPermisosUsuario);
router.post('/usuario/:id_usuario', verificarAutenticacion, verificarRol(6), permisoController.asignarPermisosAUsuario);

module.exports = router;

