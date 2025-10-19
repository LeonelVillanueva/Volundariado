require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./src/config/database');

async function crearAdmin() {
  try {
    console.log('🔍 Verificando usuario admin...\n');

    await pool.query(`USE ${process.env.DB_NAME || 'db_voluntariado'}`);

    // Verificar si existe
    const [usuarios] = await pool.query('SELECT * FROM Usuarios WHERE Usuario_nombre = ?', ['admin']);
    
    if (usuarios.length > 0) {
      console.log('⚠️  Usuario admin ya existe:');
      console.log('   ID:', usuarios[0].ID);
      console.log('   Usuario:', usuarios[0].Usuario_nombre);
      console.log('   Rol:', usuarios[0].ID_rol);
      console.log('\n🔄 Actualizando contraseña a "admin123"...\n');
      
      // Actualizar la contraseña
      const claveEncriptada = await bcrypt.hash('admin123', 10);
      await pool.query('UPDATE Usuarios SET Clave = ? WHERE Usuario_nombre = ?', [claveEncriptada, 'admin']);
      
      console.log('✅ Contraseña actualizada correctamente\n');
    } else {
      console.log('📝 Creando usuario admin...\n');
      
      const claveEncriptada = await bcrypt.hash('admin123', 10);
      
      await pool.query(`
        INSERT INTO Usuarios (Nombres, Apellidos, Email_personal, Usuario_nombre, Clave, ID_rol, Estado, Esta_verificado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, ['Administrador', 'del Sistema', 'admin@voluntariado.com', 'admin', claveEncriptada, 6, 'Activo', 1]);
      
      console.log('✅ Usuario admin creado correctamente\n');
    }

    console.log('═══════════════════════════════════════');
    console.log('📧 Usuario: admin');
    console.log('🔑 Contraseña: admin123');
    console.log('🎭 Rol: 6 (Administrador)');
    console.log('═══════════════════════════════════════\n');
    
    console.log('✅ Ahora puedes hacer login en el frontend\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Verifica:');
    console.error('   - MySQL está corriendo');
    console.error('   - La base de datos existe (npm run db:recrear)');
    console.error('   - La tabla Roles tiene el rol con ID 6\n');
    process.exit(1);
  }
}

crearAdmin();

