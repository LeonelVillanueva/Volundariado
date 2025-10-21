const { pool } = require('../config/database');

/**
 * Modelo de Centros_Educativos
 * Representa los centros educativos del sistema
 */
class CentroEducativo {
  /**
   * Inicializar la tabla de Centros_Educativos
   */
  static async inicializar() {
    try {
      await pool.query(`USE ${process.env.DB_NAME || 'db_voluntariado'}`);

      const crearTabla = `
        CREATE TABLE IF NOT EXISTS Centros_Educativos (
          ID INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del centro educativo',
          Nombre VARCHAR(150) NULL COMMENT 'Nombre del centro educativo',
          Direccion VARCHAR(255) NULL COMMENT 'Dirección del centro',
          Ciudad VARCHAR(100) NULL COMMENT 'Ciudad donde se ubica',
          Telefono VARCHAR(20) NULL COMMENT 'Teléfono de contacto',
          Email VARCHAR(150) NULL COMMENT 'Email de contacto',
          Dominio_email VARCHAR(100) NULL COMMENT 'Dominio del correo institucional (ej: @unitec.edu)',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',
          
          INDEX idx_nombre (Nombre),
          INDEX idx_ciudad (Ciudad),
          INDEX idx_dominio_email (Dominio_email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;
      
      await pool.query(crearTabla);
      console.log('✅ Tabla Centros_Educativos verificada/creada correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error al inicializar tabla Centros_Educativos:', error);
      throw error;
    }
  }

  static async crear(datos) {
    const { nombre, direccion = null, ciudad = null, telefono = null, email = null, dominio_email = null } = datos;
    const query = `
      INSERT INTO Centros_Educativos (Nombre, Direccion, Ciudad, Telefono, Email, Dominio_email) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      const [resultado] = await pool.execute(query, [nombre, direccion, ciudad, telefono, email, dominio_email]);
      return { id: resultado.insertId, ...datos };
    } catch (error) {
      console.error('Error al crear centro educativo:', error);
      throw error;
    }
  }

  static async obtenerTodos(filtros = {}) {
    let query = 'SELECT * FROM Centros_Educativos WHERE 1=1';
    const valores = [];

    if (filtros.ciudad) {
      query += ' AND Ciudad = ?';
      valores.push(filtros.ciudad);
    }

    query += ' ORDER BY Nombre ASC';

    try {
      const [centros] = await pool.execute(query, valores);
      return centros;
    } catch (error) {
      console.error('Error al obtener centros educativos:', error);
      throw error;
    }
  }

  static async obtenerPorId(id) {
    const query = 'SELECT * FROM Centros_Educativos WHERE ID = ?';
    try {
      const [centros] = await pool.execute(query, [id]);
      return centros.length > 0 ? centros[0] : null;
    } catch (error) {
      console.error('Error al obtener centro educativo por ID:', error);
      throw error;
    }
  }

  static async actualizar(id, datos) {
    const campos = [];
    const valores = [];

    const camposPermitidos = ['Nombre', 'Direccion', 'Ciudad', 'Telefono', 'Email', 'Dominio_email'];
    
    for (const [key, value] of Object.entries(datos)) {
      const campo = key.charAt(0).toUpperCase() + key.slice(1).replace(/_([a-z])/g, (_, letra) => '_' + letra);
      if (camposPermitidos.includes(campo)) {
        campos.push(`${campo} = ?`);
        valores.push(value);
      }
    }

    if (campos.length === 0) {
      throw new Error('No se proporcionaron campos para actualizar');
    }

    valores.push(id);
    const query = `UPDATE Centros_Educativos SET ${campos.join(', ')} WHERE ID = ?`;

    try {
      const [resultado] = await pool.execute(query, valores);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al actualizar centro educativo:', error);
      throw error;
    }
  }

  static async eliminar(id) {
    const query = 'DELETE FROM Centros_Educativos WHERE ID = ?';
    try {
      const [resultado] = await pool.execute(query, [id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar centro educativo:', error);
      throw error;
    }
  }

  static async buscar(termino) {
    const query = `
      SELECT * FROM Centros_Educativos 
      WHERE Nombre LIKE ? OR Ciudad LIKE ?
      ORDER BY Nombre ASC
    `;
    const terminoBusqueda = `%${termino}%`;

    try {
      const [centros] = await pool.execute(query, [terminoBusqueda, terminoBusqueda]);
      return centros;
    } catch (error) {
      console.error('Error al buscar centros educativos:', error);
      throw error;
    }
  }
}

module.exports = CentroEducativo;

