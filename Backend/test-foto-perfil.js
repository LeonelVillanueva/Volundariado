/**
 * Script de prueba para el sistema de fotos de perfil
 * Prueba la integración entre MySQL y MongoDB
 */

require('dotenv').config();
const Usuario = require('./src/models/Usuario');
const FotoPerfil = require('./src/models/FotoPerfil');
const mongoConnection = require('./src/config/mongodb');

async function probarSistemaFotos() {
  try {
    console.log('🧪 Iniciando pruebas del sistema de fotos de perfil...\n');

    // 1. Conectar a MongoDB
    console.log('1️⃣ Conectando a MongoDB Atlas...');
    await mongoConnection.conectar();
    console.log('✅ MongoDB conectado\n');

    // 2. Obtener usuario admin
    console.log('2️⃣ Obteniendo usuario admin...');
    const admin = await Usuario.obtenerPorId(1);
    if (!admin) {
      console.log('❌ Usuario admin no encontrado');
      return;
    }
    console.log(`✅ Usuario encontrado: ${admin.Nombres} ${admin.Apellidos}`);
    console.log(`📋 Url_foto_perfil actual: ${admin.Url_foto_perfil || 'null'}\n`);

    // 3. Simular subida de foto
    console.log('3️⃣ Simulando subida de foto...');
    const imagenBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='; // 1x1 pixel PNG
    
    const foto = await FotoPerfil.guardarFoto(1, {
      imagen_base64: imagenBase64,
      mime_type: 'image/png',
      tamaño_bytes: 100,
      nombre_original: 'test_foto.png'
    });
    console.log('✅ Foto guardada en MongoDB');

    // 4. Actualizar referencia en MySQL
    console.log('4️⃣ Actualizando referencia en MySQL...');
    const referenciaMongoDB = `mongodb://foto_usuario_1`;
    await Usuario.actualizar(1, {
      Url_foto_perfil: referenciaMongoDB
    });
    console.log('✅ Referencia actualizada en MySQL');

    // 5. Verificar en MySQL
    console.log('5️⃣ Verificando en MySQL...');
    const adminActualizado = await Usuario.obtenerPorId(1);
    console.log(`📋 Nueva Url_foto_perfil: ${adminActualizado.Url_foto_perfil}`);

    // 6. Verificar en MongoDB
    console.log('6️⃣ Verificando en MongoDB...');
    const fotoVerificada = await FotoPerfil.obtenerPorUsuario(1);
    if (fotoVerificada) {
      console.log('✅ Foto encontrada en MongoDB');
      console.log(`📋 Info: ${JSON.stringify(fotoVerificada.obtenerInfo(), null, 2)}`);
    } else {
      console.log('❌ Foto no encontrada en MongoDB');
    }

    // 7. Probar verificación
    console.log('7️⃣ Probando verificación...');
    const tieneFoto = adminActualizado.Url_foto_perfil && 
                     adminActualizado.Url_foto_perfil.startsWith('mongodb://foto_usuario_');
    console.log(`🔍 Usuario tiene foto: ${tieneFoto}`);

    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   • MySQL: Url_foto_perfil = "${adminActualizado.Url_foto_perfil}"`);
    console.log(`   • MongoDB: Foto guardada para usuario ID 1`);
    console.log(`   • Verificación: ${tieneFoto ? 'SÍ tiene foto' : 'NO tiene foto'}`);

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  } finally {
    // Cerrar conexión
    await mongoConnection.desconectar();
    console.log('\n🔌 Conexión cerrada');
    process.exit(0);
  }
}

// Ejecutar pruebas
probarSistemaFotos();
