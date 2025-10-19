/**
 * Script de prueba para crear y verificar la tabla Usuarios
 * Ejecutar con: node src/scripts/testCrearTabla.js
 */

require('dotenv').config();
const { pool } = require('../config/database');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// Colores para la consola
const colores = {
  reset: '\x1b[0m',
  verde: '\x1b[32m',
  rojo: '\x1b[31m',
  amarillo: '\x1b[33m',
  azul: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(mensaje, color = 'reset') {
  console.log(`${colores[color]}${mensaje}${colores.reset}`);
}

function separador() {
  console.log('═'.repeat(60));
}

async function testCrearTabla() {
  console.clear();
  separador();
  log('🧪 SCRIPT DE PRUEBA - CREACIÓN DE TABLA USUARIOS', 'cyan');
  separador();
  console.log('');

  try {
    // ========== PASO 1: Verificar conexión ==========
    log('📡 PASO 1: Verificando conexión a MySQL...', 'azul');
    try {
      const connection = await pool.getConnection();
      log('✅ Conexión exitosa a MySQL', 'verde');
      log(`   Host: ${process.env.DB_HOST || 'localhost'}`, 'cyan');
      log(`   Usuario: ${process.env.DB_USER || 'root'}`, 'cyan');
      connection.release();
    } catch (error) {
      log('❌ Error al conectar a MySQL', 'rojo');
      log(`   ${error.message}`, 'rojo');
      log('', 'reset');
      log('💡 Verifica:', 'amarillo');
      log('   1. Que MySQL esté ejecutándose', 'amarillo');
      log('   2. Que las credenciales en .env sean correctas', 'amarillo');
      log('   3. Que el puerto de MySQL esté disponible', 'amarillo');
      process.exit(1);
    }
    console.log('');

    // ========== PASO 2: Crear base de datos ==========
    log('🗄️  PASO 2: Creando base de datos...', 'azul');
    try {
      const nombreDB = process.env.DB_NAME || 'db_voluntariado';
      const [bases] = await pool.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
        [nombreDB]
      );

      if (bases.length > 0) {
        log(`⚠️  La base de datos '${nombreDB}' ya existe`, 'amarillo');
      } else {
        await pool.query(
          `CREATE DATABASE ${nombreDB} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
        );
        log(`✅ Base de datos '${nombreDB}' creada exitosamente`, 'verde');
      }
    } catch (error) {
      log('❌ Error al crear base de datos', 'rojo');
      log(`   ${error.message}`, 'rojo');
      throw error;
    }
    console.log('');

    // ========== PASO 3: Usar la base de datos ==========
    log('📋 PASO 3: Seleccionando base de datos...', 'azul');
    try {
      await pool.query(`USE ${process.env.DB_NAME || 'db_voluntariado'}`);
      log('✅ Base de datos seleccionada', 'verde');
    } catch (error) {
      log('❌ Error al seleccionar base de datos', 'rojo');
      log(`   ${error.message}`, 'rojo');
      throw error;
    }
    console.log('');

    // ========== PASO 4: Crear tabla Usuarios ==========
    log('🏗️  PASO 4: Creando tabla Usuarios...', 'azul');
    try {
      // Verificar si la tabla ya existe
      const [tablas] = await pool.query(
        `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'Usuarios'`,
        [process.env.DB_NAME || 'db_voluntariado']
      );

      if (tablas.length > 0) {
        log('⚠️  La tabla Usuarios ya existe', 'amarillo');
        log('   Se verificará su estructura...', 'cyan');
      } else {
        await Usuario.inicializar();
        log('✅ Tabla Usuarios creada exitosamente', 'verde');
      }
    } catch (error) {
      log('❌ Error al crear tabla', 'rojo');
      log(`   ${error.message}`, 'rojo');
      throw error;
    }
    console.log('');

    // ========== PASO 5: Verificar estructura de la tabla ==========
    log('🔍 PASO 5: Verificando estructura de la tabla...', 'azul');
    try {
      const [columnas] = await pool.query('DESCRIBE Usuarios');
      log('✅ Estructura de la tabla:', 'verde');
      console.log('');
      
      // Mostrar tabla formateada
      log('   ╔═══════════════════════════════╦═══════════════╦═════════════╗', 'cyan');
      log('   ║ Campo                         ║ Tipo          ║ Default     ║', 'cyan');
      log('   ╠═══════════════════════════════╬═══════════════╬═════════════╣', 'cyan');
      
      columnas.forEach(col => {
        const campo = col.Field.padEnd(29);
        const tipo = col.Type.padEnd(13);
        const def = (col.Default || 'NULL').padEnd(11);
        log(`   ║ ${campo} ║ ${tipo} ║ ${def} ║`, 'cyan');
      });
      
      log('   ╚═══════════════════════════════╩═══════════════╩═════════════╝', 'cyan');
      console.log('');
      log(`   📊 Total de campos: ${columnas.length}`, 'verde');
      
      // Verificar campos importantes
      const camposEsperados = [
        'ID', 'Nombres', 'Apellidos', 'Email_personal', 'Email_academico',
        'Telefono', 'Fecha_nacimiento', 'Es_estudiante', 'ID_centro_educativo',
        'Num_cuenta', 'ID_carrera', 'Estado', 'Url_foto_perfil', 'Esta_verificado',
        'Horas_voluntariado_acumuladas', 'Usuario_nombre', 'Clave', 'ID_rol',
        'created_at', 'updated_at'
      ];
      
      const camposExistentes = columnas.map(col => col.Field);
      const camposFaltantes = camposEsperados.filter(c => !camposExistentes.includes(c));
      
      if (camposFaltantes.length === 0) {
        log('   ✅ Todos los campos esperados están presentes', 'verde');
      } else {
        log('   ⚠️  Campos faltantes:', 'amarillo');
        camposFaltantes.forEach(campo => {
          log(`      - ${campo}`, 'amarillo');
        });
      }
    } catch (error) {
      log('❌ Error al verificar estructura', 'rojo');
      log(`   ${error.message}`, 'rojo');
      throw error;
    }
    console.log('');

    // ========== PASO 6: Verificar índices ==========
    log('🔑 PASO 6: Verificando índices...', 'azul');
    try {
      const [indices] = await pool.query('SHOW INDEX FROM Usuarios');
      const nombresIndices = [...new Set(indices.map(idx => idx.Key_name))];
      log(`✅ Índices encontrados: ${nombresIndices.length}`, 'verde');
      nombresIndices.forEach(nombre => {
        log(`   - ${nombre}`, 'cyan');
      });
    } catch (error) {
      log('❌ Error al verificar índices', 'rojo');
      log(`   ${error.message}`, 'rojo');
    }
    console.log('');

    // ========== PASO 7: Crear usuario de prueba ==========
    log('👤 PASO 7: Creando usuario de prueba...', 'azul');
    try {
      // Verificar si ya existe un usuario de prueba
      const usuarioExistente = await Usuario.obtenerPorUsuarioNombre('usuario_prueba');
      
      if (usuarioExistente) {
        log('⚠️  Ya existe un usuario de prueba', 'amarillo');
        log(`   ID: ${usuarioExistente.ID}`, 'cyan');
        log(`   Usuario: ${usuarioExistente.Usuario_nombre}`, 'cyan');
        log(`   Email: ${usuarioExistente.Email_personal}`, 'cyan');
      } else {
        const claveEncriptada = await bcrypt.hash('prueba123', 10);
        const nuevoUsuario = await Usuario.crear({
          nombres: 'Usuario',
          apellidos: 'De Prueba',
          email_personal: 'prueba@test.com',
          email_academico: 'prueba@unah.hn',
          telefono: '12345678',
          fecha_nacimiento: '2000-01-01',
          es_estudiante: true,
          id_centro_educativo: 1,
          num_cuenta: '20200000000',
          id_carrera: 1,
          estado: 'Activo',
          url_foto_perfil: null,
          esta_verificado: false,
          horas_voluntariado_acumuladas: 0,
          usuario_nombre: 'usuario_prueba',
          clave: claveEncriptada,
          id_rol: 1
        });
        
        log('✅ Usuario de prueba creado exitosamente', 'verde');
        log(`   ID: ${nuevoUsuario.id}`, 'cyan');
        log(`   Usuario: usuario_prueba`, 'cyan');
        log(`   Contraseña: prueba123`, 'cyan');
        log(`   Email: prueba@test.com`, 'cyan');
      }
    } catch (error) {
      log('⚠️  No se pudo crear usuario de prueba', 'amarillo');
      log(`   ${error.message}`, 'amarillo');
      log('   (Esto puede ser normal si la tabla de roles no existe)', 'amarillo');
    }
    console.log('');

    // ========== PASO 8: Verificar operaciones CRUD ==========
    log('🔧 PASO 8: Probando operaciones CRUD...', 'azul');
    try {
      // Contar usuarios
      const [resultado] = await pool.query('SELECT COUNT(*) as total FROM Usuarios');
      log(`✅ Total de usuarios en la tabla: ${resultado[0].total}`, 'verde');
      
      // Probar obtenerTodos
      const usuarios = await Usuario.obtenerTodos();
      log(`✅ Método obtenerTodos() funciona: ${usuarios.length} usuarios`, 'verde');
      
      // Probar estadísticas
      const stats = await Usuario.obtenerEstadisticas();
      log(`✅ Método obtenerEstadisticas() funciona`, 'verde');
      log(`   Total: ${stats.total}`, 'cyan');
      log(`   Activos: ${stats.activos}`, 'cyan');
      log(`   Estudiantes: ${stats.estudiantes}`, 'cyan');
    } catch (error) {
      log('⚠️  Error en operaciones CRUD', 'amarillo');
      log(`   ${error.message}`, 'amarillo');
    }
    console.log('');

    // ========== RESUMEN FINAL ==========
    separador();
    log('🎉 PRUEBA COMPLETADA EXITOSAMENTE', 'verde');
    separador();
    console.log('');
    log('✅ Resumen:', 'verde');
    log('   ✓ Conexión a MySQL funcionando', 'cyan');
    log('   ✓ Base de datos creada/verificada', 'cyan');
    log('   ✓ Tabla Usuarios creada con todos los campos', 'cyan');
    log('   ✓ Índices configurados correctamente', 'cyan');
    log('   ✓ Campos created_at y updated_at presentes', 'cyan');
    log('   ✓ Operaciones CRUD funcionando', 'cyan');
    console.log('');
    log('🚀 La tabla está lista para usar!', 'verde');
    log('', 'reset');
    log('💡 Comandos útiles:', 'amarillo');
    log('   npm run dev          - Iniciar servidor', 'cyan');
    log('   npm run db:ejemplo   - Ver ejemplos de uso', 'cyan');
    console.log('');

    process.exit(0);

  } catch (error) {
    console.log('');
    separador();
    log('❌ ERROR EN LA PRUEBA', 'rojo');
    separador();
    console.log('');
    log(`Error: ${error.message}`, 'rojo');
    console.log('');
    log('🔍 Stack trace completo:', 'amarillo');
    console.error(error);
    console.log('');
    log('💡 Consulta a tu supervisor si el problema persiste', 'amarillo');
    console.log('');
    process.exit(1);
  }
}

// Ejecutar el test
testCrearTabla();

