const mongoose = require('mongoose');

/**
 * Configuración de conexión a MongoDB Atlas
 */
class MongoDBConnection {
  constructor() {
    this.isConnected = false;
  }

  /**
   * Conectar a MongoDB Atlas
   */
  async conectar() {
    try {
      // Si ya está conectado, no reconectar
      if (this.isConnected) {
        console.log('✅ MongoDB ya está conectado');
        return;
      }

      // Construir URI de conexión
      const mongoURI = process.env.MONGODB_URI || 
        `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

      // Opciones de conexión
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
      };

      // Conectar
      await mongoose.connect(mongoURI, options);

      this.isConnected = true;
      console.log('✅ MongoDB Atlas conectado exitosamente');
      console.log(`📦 Base de datos: ${process.env.MONGODB_DATABASE || 'db_voluntariado_archivos'}`);

    } catch (error) {
      console.error('❌ Error al conectar con MongoDB:', error.message);
      console.error('💡 Verifica tus credenciales en el archivo .env');
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Desconectar de MongoDB
   */
  async desconectar() {
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('🔌 MongoDB desconectado');
    } catch (error) {
      console.error('❌ Error al desconectar MongoDB:', error.message);
    }
  }

  /**
   * Verificar estado de conexión
   */
  estaConectado() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}

// Eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose conectado a MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Error de conexión Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔴 Mongoose desconectado de MongoDB Atlas');
});

// Manejar cierre de aplicación
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 Conexión de MongoDB cerrada por terminación de aplicación');
  process.exit(0);
});

module.exports = new MongoDBConnection();

