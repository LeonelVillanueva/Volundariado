/**
 * Ejemplos de uso del modelo Usuario
 * Este archivo muestra cómo usar los diferentes métodos del modelo
 */

require('dotenv').config();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

async function ejemplos() {
  try {
    console.log('=== EJEMPLOS DE USO DEL MODELO USUARIO ===\n');

    // 1. Crear un nuevo usuario
    console.log('1️⃣ Crear un nuevo usuario');
    const claveEncriptada = await bcrypt.hash('password123', 10);
    
    const nuevoUsuario = await Usuario.crear({
      nombres: 'Juan Carlos',
      apellidos: 'Pérez González',
      email_personal: 'juan.perez@gmail.com',
      email_academico: 'juan.perez@unah.hn',
      telefono: '98765432',
      fecha_nacimiento: '2000-05-15',
      es_estudiante: true,
      id_centro_educativo: 1,
      num_cuenta: '20191234567',
      id_carrera: 5,
      estado: 'Activo',
      url_foto_perfil: 'https://ejemplo.com/foto.jpg',
      esta_verificado: false,
      horas_voluntariado_acumuladas: 0,
      usuario_nombre: 'jperez',
      clave: claveEncriptada,
      id_rol: 2
    });
    console.log('✅ Usuario creado:', nuevoUsuario.id);
    console.log('');

    // 2. Obtener todos los usuarios
    console.log('2️⃣ Obtener todos los usuarios');
    const usuarios = await Usuario.obtenerTodos();
    console.log(`✅ Se encontraron ${usuarios.length} usuarios`);
    console.log('');

    // 3. Obtener usuario por ID
    console.log('3️⃣ Obtener usuario por ID');
    const usuario = await Usuario.obtenerPorId(nuevoUsuario.id);
    console.log('✅ Usuario encontrado:', usuario?.Nombres, usuario?.Apellidos);
    console.log('');

    // 4. Obtener usuario por nombre de usuario
    console.log('4️⃣ Obtener usuario por nombre de usuario');
    const usuarioPorNombre = await Usuario.obtenerPorUsuarioNombre('jperez');
    console.log('✅ Usuario encontrado:', usuarioPorNombre?.Usuario_nombre);
    console.log('');

    // 5. Actualizar usuario
    console.log('5️⃣ Actualizar usuario');
    const actualizado = await Usuario.actualizar(nuevoUsuario.id, {
      telefono: '99887766',
      url_foto_perfil: 'https://ejemplo.com/nueva-foto.jpg'
    });
    console.log('✅ Usuario actualizado:', actualizado);
    console.log('');

    // 6. Verificar usuario
    console.log('6️⃣ Verificar usuario');
    const verificado = await Usuario.verificar(nuevoUsuario.id);
    console.log('✅ Usuario verificado:', verificado);
    console.log('');

    // 7. Actualizar horas de voluntariado
    console.log('7️⃣ Actualizar horas de voluntariado');
    const horasActualizadas = await Usuario.actualizarHorasVoluntariado(nuevoUsuario.id, 5);
    console.log('✅ Horas actualizadas:', horasActualizadas);
    console.log('');

    // 8. Buscar usuarios
    console.log('8️⃣ Buscar usuarios por término');
    const resultadosBusqueda = await Usuario.buscar('Juan');
    console.log(`✅ Se encontraron ${resultadosBusqueda.length} usuarios con el término "Juan"`);
    console.log('');

    // 9. Obtener estadísticas
    console.log('9️⃣ Obtener estadísticas de usuarios');
    const estadisticas = await Usuario.obtenerEstadisticas();
    console.log('✅ Estadísticas:', estadisticas);
    console.log('');

    // 10. Filtrar usuarios
    console.log('🔟 Filtrar usuarios activos y estudiantes');
    const usuariosFiltrados = await Usuario.obtenerTodos({
      estado: 'Activo',
      es_estudiante: true
    });
    console.log(`✅ Se encontraron ${usuariosFiltrados.length} usuarios activos que son estudiantes`);
    console.log('');

    // 11. Cambiar estado
    console.log('1️⃣1️⃣ Cambiar estado de usuario');
    const estadoCambiado = await Usuario.cambiarEstado(nuevoUsuario.id, 'Inactivo');
    console.log('✅ Estado cambiado:', estadoCambiado);
    console.log('');

    // 12. Obtener por email
    console.log('1️⃣2️⃣ Obtener usuario por email personal');
    const usuarioPorEmail = await Usuario.obtenerPorEmailPersonal('juan.perez@gmail.com');
    console.log('✅ Usuario encontrado por email:', usuarioPorEmail?.Email_personal);
    console.log('');

    console.log('=== EJEMPLOS COMPLETADOS ===');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error en los ejemplos:', error);
    process.exit(1);
  }
}

// Ejecutar ejemplos
ejemplos();

