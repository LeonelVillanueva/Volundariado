/**
 * Seeder - Datos Iniciales del Sistema
 * Crea roles, categorías y permisos básicos
 * Ejecutar con: node src/scripts/seed.js
 */

require('dotenv').config();
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const Rol = require('../models/Rol');

async function seed() {
  console.log('🌱 Iniciando seeder - Datos iniciales...\n');

  try {
    await pool.query(`USE ${process.env.DB_NAME || 'db_voluntariado'}`);

    // ========== ROLES ==========
    console.log('1️⃣  Configurando roles del sistema...\n');
    
    // Definir los 6 roles que deben existir
    const rolesRequeridos = [
      { id: 1, nombre: 'Invitado', estado: 'Activo' },
      { id: 2, nombre: 'Estudiante voluntario', estado: 'Activo' },
      { id: 3, nombre: 'Voluntario general', estado: 'Activo' },
      { id: 4, nombre: 'Docente', estado: 'Activo' },
      { id: 5, nombre: 'Organizador', estado: 'Activo' },
      { id: 6, nombre: 'Administrador', estado: 'Activo' }
    ];
    
    console.log('   🔍 Verificando y creando roles...\n');
    
    for (const rol of rolesRequeridos) {
      try {
        // Verificar si el rol con ese ID ya existe
        const [rolExistente] = await pool.query('SELECT * FROM Roles WHERE ID_rol = ?', [rol.id]);
        
        if (rolExistente.length > 0) {
          console.log(`   ✓ Rol ${rol.id} ya existe: ${rolExistente[0].Nombre}`);
          
          // Actualizar el nombre si es diferente
          if (rolExistente[0].Nombre !== rol.nombre) {
            await pool.query('UPDATE Roles SET Nombre = ?, Estado = ? WHERE ID_rol = ?', 
              [rol.nombre, rol.estado, rol.id]);
            console.log(`     → Actualizado a: ${rol.nombre}`);
          }
        } else {
          // Crear el rol con el ID específico
          await pool.query(
            'INSERT INTO Roles (ID_rol, Nombre, Estado) VALUES (?, ?, ?)',
            [rol.id, rol.nombre, rol.estado]
          );
          console.log(`   ✓ Rol ${rol.id} creado: ${rol.nombre}`);
        }
      } catch (error) {
        console.log(`   ❌ Error con rol ${rol.nombre}:`, error.message);
      }
    }
    
    console.log('\n   ✅ Roles verificados/creados exitosamente\n');
    console.log('   Roles en el sistema:');
    console.log('     1. Invitado - Puede visualizar eventos públicos');
    console.log('     2. Estudiante voluntario - Puede inscribirse en eventos para estudiantes');
    console.log('     3. Voluntario general - Puede inscribirse en eventos públicos');
    console.log('     4. Docente - Crea eventos y valida estudiantes');
    console.log('     5. Organizador - Crea eventos y gestiona inscripciones');
    console.log('     6. Administrador - Control total del sistema');

    // ========== CATEGORÍAS DE EVENTOS ==========
    // NO SE CREAN POR AHORA (según instrucción del usuario)
    console.log('\n2️⃣  Categorías de eventos:');
    console.log('   💡 No se crearán por ahora (se crearán manualmente cuando sea necesario)');

    // ========== PERMISOS ==========
    // NOTA: Los permisos se trabajarán al final del sistema
    console.log('\n3️⃣  Permisos:');
    console.log('   💡 Se configurarán al final del sistema');

    // ========== USUARIO ADMINISTRADOR ==========
    console.log('\n4️⃣  Configurando usuario administrador...\n');
    
    try {
      // Verificar si existe
      const [adminExistente] = await pool.query(
        'SELECT * FROM Usuarios WHERE Usuario_nombre = ?',
        ['admin']
      );
      
      if (adminExistente.length > 0) {
        console.log('   ⚠️  Usuario admin ya existe');
        console.log('   🔄 Actualizando contraseña a "admin123"...\n');
        
        // Actualizar contraseña
        const claveEncriptada = await bcrypt.hash('admin123', 10);
        await pool.query(
          'UPDATE Usuarios SET Clave = ?, ID_rol = 6 WHERE Usuario_nombre = ?',
          [claveEncriptada, 'admin']
        );
        
        console.log('   ✅ Usuario admin actualizado');
      } else {
        console.log('   📝 Creando usuario admin...\n');
        
        const claveEncriptada = await bcrypt.hash('admin123', 10);
        
        await pool.query(`
          INSERT INTO Usuarios (Nombres, Apellidos, Email_personal, Usuario_nombre, Clave, ID_rol, Estado, Esta_verificado)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, ['Administrador', 'del Sistema', 'admin@voluntariado.com', 'admin', claveEncriptada, 6, 'Activo', 1]);
        
        console.log('   ✅ Usuario admin creado');
      }
      
      console.log('   📧 Usuario: admin');
      console.log('   🔑 Contraseña: admin123');
      console.log('   🎭 Rol: Administrador (ID: 6)');
      
    } catch (error) {
      console.log(`   ❌ Error al crear/actualizar admin: ${error.message}`);
      throw error;
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ ¡Seeder completado exitosamente!');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('📊 Resumen:\n');
    console.log('🎭 Roles (6):');
    console.log('  1. Invitado - Visualiza eventos públicos');
    console.log('  2. Estudiante voluntario - Inscripción en eventos para estudiantes');
    console.log('  3. Voluntario general - Inscripción en eventos públicos');
    console.log('  4. Docente - Crea eventos y valida estudiantes');
    console.log('  5. Organizador - Crea eventos y gestiona inscripciones');
    console.log('  6. Administrador - Control total del sistema\n');
    console.log('👤 Usuario admin:');
    console.log('  📧 Usuario: admin');
    console.log('  🔑 Contraseña: admin123\n');
    console.log('💡 Notas:');
    console.log('  • Categorías: Se crearán manualmente cuando sea necesario');
    console.log('  • Permisos: Se configurarán al final del sistema');
    console.log('  • Cambia la contraseña del admin después del primer login\n');
    console.log('🚀 Ahora puedes hacer login en http://localhost:3001');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante el seeder:', error.message);
    console.error('\n🔍 Detalles:', error);
    process.exit(1);
  }
}

// Ejecutar seeder
seed();

