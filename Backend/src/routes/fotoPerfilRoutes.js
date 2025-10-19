const express = require('express');
const router = express.Router();
const fotoPerfilController = require('../controllers/fotoPerfilController');
const { verificarAutenticacion } = require('../middleware/auth');

/**
 * Rutas de Fotos de Perfil (MongoDB)
 * Base: /api/fotos-perfil
 */

// Subir o actualizar foto de perfil (requiere autenticación)
router.post('/', verificarAutenticacion, fotoPerfilController.subirFoto);

// Obtener mi foto de perfil (requiere autenticación)
router.get('/mi-foto', verificarAutenticacion, fotoPerfilController.obtenerMiFoto);

// Obtener foto de perfil de un usuario específico (requiere autenticación)
router.get('/usuario/:id_usuario', verificarAutenticacion, fotoPerfilController.obtenerFotoPorUsuario);

// Eliminar mi foto de perfil (requiere autenticación)
router.delete('/', verificarAutenticacion, fotoPerfilController.eliminarFoto);

// Verificar si un usuario tiene foto de perfil (usando referencia MySQL)
router.get('/verificar/:id_usuario', verificarAutenticacion, fotoPerfilController.verificarFotoUsuario);

module.exports = router;

