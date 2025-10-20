const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarAutenticacion } = require('../middleware/auth');

/**
 * Rutas de Autenticación
 * Base: /api/auth
 */

// Registrar nuevo usuario (método antiguo)
router.post('/registrar', authController.registrar);

// Registro público (nuevo método con centros educativos)
router.post('/registro', authController.registro);

// Iniciar sesión
router.post('/login', authController.login);

// Verificar token
router.get('/verificar', authController.verificarToken);

// Obtener perfil del usuario autenticado (requiere autenticación)
router.get('/perfil', verificarAutenticacion, authController.obtenerPerfil);

// Cambiar contraseña (requiere autenticación)
router.post('/cambiar-clave', verificarAutenticacion, authController.cambiarClave);

// Actualizar perfil propio (requiere autenticación)
router.put('/perfil', verificarAutenticacion, authController.actualizarPerfil);

module.exports = router;

