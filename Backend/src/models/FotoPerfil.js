const mongoose = require('mongoose');

/**
 * Schema de Mongoose para Fotos de Perfil
 * 
 * Las fotos se guardan en formato Base64 en MongoDB
 * Para optimizar: las imágenes deben ser comprimidas antes de guardar
 */
const fotoPerfilSchema = new mongoose.Schema({
  // ID del usuario en MySQL
  id_usuario: {
    type: Number,
    required: true,
    unique: true, // Solo una foto por usuario
    index: true
  },

  // Imagen en Base64
  imagen_base64: {
    type: String,
    required: true
  },

  // Tipo MIME (image/jpeg, image/png, image/webp)
  mime_type: {
    type: String,
    required: true,
    enum: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    default: 'image/jpeg'
  },

  // Tamaño del archivo en bytes
  tamaño_bytes: {
    type: Number,
    required: true
  },

  // Nombre original del archivo
  nombre_original: {
    type: String,
    default: 'foto_perfil'
  },

  // Fecha de subida
  fecha_subida: {
    type: Date,
    default: Date.now
  },

  // Última actualización
  fecha_actualizacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  collection: 'fotos_perfil' // Nombre de la colección en MongoDB
});

// Método para actualizar la fecha de modificación antes de guardar
fotoPerfilSchema.pre('save', function(next) {
  this.fecha_actualizacion = new Date();
  next();
});

// Método estático para obtener foto por ID de usuario
fotoPerfilSchema.statics.obtenerPorUsuario = async function(id_usuario) {
  return await this.findOne({ id_usuario });
};

// Método estático para crear o actualizar foto
fotoPerfilSchema.statics.guardarFoto = async function(id_usuario, datos) {
  return await this.findOneAndUpdate(
    { id_usuario },
    {
      ...datos,
      fecha_actualizacion: new Date()
    },
    {
      upsert: true, // Crear si no existe
      new: true, // Retornar el documento actualizado
      runValidators: true
    }
  );
};

// Método estático para eliminar foto
fotoPerfilSchema.statics.eliminarFoto = async function(id_usuario) {
  return await this.deleteOne({ id_usuario });
};

// Método de instancia para obtener solo la URL data (sin metadata)
fotoPerfilSchema.methods.obtenerDataURL = function() {
  return `data:${this.mime_type};base64,${this.imagen_base64}`;
};

// Método de instancia para obtener información resumida (sin la imagen)
fotoPerfilSchema.methods.obtenerInfo = function() {
  return {
    id_usuario: this.id_usuario,
    mime_type: this.mime_type,
    tamaño_bytes: this.tamaño_bytes,
    tamaño_kb: Math.round(this.tamaño_bytes / 1024),
    nombre_original: this.nombre_original,
    fecha_subida: this.fecha_subida,
    fecha_actualizacion: this.fecha_actualizacion
  };
};

const FotoPerfil = mongoose.model('FotoPerfil', fotoPerfilSchema);

module.exports = FotoPerfil;

