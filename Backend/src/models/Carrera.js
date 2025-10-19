const { pool } = require('../config/database');

/**
 * Modelo de Carreras
 * Representa las carreras académicas del sistema
 */
class Carrera {
  /**
   * Inicializar la tabla de Carreras
   */
  static async inicializar() {
    try {
      await pool.query(`USE ${process.env.DB_NAME || 'db_voluntariado'}`);

      const crearTabla = `
        CREATE TABLE IF NOT EXISTS Carreras (
          ID INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la carrera',
          Nombre VARCHAR(150) NULL COMMENT 'Nombre de la carrera',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',
          
          INDEX idx_nombre (Nombre)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;
      
      await pool.query(crearTabla);
      console.log('✅ Tabla Carreras verificada/creada correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error al inicializar tabla Carreras:', error);
      throw error;
    }
  }

  static async crear(datos) {
    const { nombre } = datos;
    const query = `INSERT INTO Carreras (Nombre) VALUES (?)`;

    try {
      const [resultado] = await pool.execute(query, [nombre]);
      return { id: resultado.insertId, ...datos };
    } catch (error) {
      console.error('Error al crear carrera:', error);
      throw error;
    }
  }

  static async obtenerTodos() {
    const query = 'SELECT * FROM Carreras ORDER BY Nombre ASC';

    try {
      const [carreras] = await pool.execute(query);
      return carreras;
    } catch (error) {
      console.error('Error al obtener carreras:', error);
      throw error;
    }
  }

  static async obtenerPorId(id) {
    const query = 'SELECT * FROM Carreras WHERE ID = ?';
    try {
      const [carreras] = await pool.execute(query, [id]);
      return carreras.length > 0 ? carreras[0] : null;
    } catch (error) {
      console.error('Error al obtener carrera por ID:', error);
      throw error;
    }
  }

  static async actualizar(id, datos) {
    const { nombre } = datos;
    const query = 'UPDATE Carreras SET Nombre = ? WHERE ID = ?';

    try {
      const [resultado] = await pool.execute(query, [nombre, id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al actualizar carrera:', error);
      throw error;
    }
  }

  static async eliminar(id) {
    const query = 'DELETE FROM Carreras WHERE ID = ?';
    try {
      const [resultado] = await pool.execute(query, [id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar carrera:', error);
      throw error;
    }
  }

  static async buscar(termino) {
    const query = 'SELECT * FROM Carreras WHERE Nombre LIKE ? ORDER BY Nombre ASC';
    const terminoBusqueda = `%${termino}%`;

    try {
      const [carreras] = await pool.execute(query, [terminoBusqueda]);
      return carreras;
    } catch (error) {
      console.error('Error al buscar carreras:', error);
      throw error;
    }
  }
}

module.exports = Carrera;

