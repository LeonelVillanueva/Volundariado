const { pool } = require('../config/database');

/**
 * Modelo de Centros_Carreras
 * Tabla intermedia que relaciona centros educativos con carreras
 */
class CentroCarrera {
  /**
   * Inicializar la tabla de Centros_Carreras
   */
  static async inicializar() {
    try {
      await pool.query(`USE ${process.env.DB_NAME || 'db_voluntariado'}`);

      const crearTabla = `
        CREATE TABLE IF NOT EXISTS Centros_Carreras (
          ID INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único',
          ID_centro_educativo INT NULL COMMENT 'ID del centro educativo',
          ID_carrera INT NULL COMMENT 'ID de la carrera',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',
          
          INDEX idx_centro (ID_centro_educativo),
          INDEX idx_carrera (ID_carrera),
          UNIQUE KEY unique_centro_carrera (ID_centro_educativo, ID_carrera),
          
          CONSTRAINT fk_centros_carreras_centro 
            FOREIGN KEY (ID_centro_educativo) REFERENCES Centros_Educativos(ID)
            ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT fk_centros_carreras_carrera 
            FOREIGN KEY (ID_carrera) REFERENCES Carreras(ID)
            ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;
      
      await pool.query(crearTabla);
      console.log('✅ Tabla Centros_Carreras verificada/creada correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error al inicializar tabla Centros_Carreras:', error);
      throw error;
    }
  }

  static async crear(datos) {
    const { id_centro_educativo, id_carrera } = datos;
    const query = `
      INSERT INTO Centros_Carreras (ID_centro_educativo, ID_carrera) 
      VALUES (?, ?)
    `;

    try {
      const [resultado] = await pool.execute(query, [id_centro_educativo, id_carrera]);
      return { id: resultado.insertId, ...datos };
    } catch (error) {
      console.error('Error al crear relación centro-carrera:', error);
      throw error;
    }
  }

  static async obtenerCarrerasPorCentro(id_centro) {
    const query = `
      SELECT c.* 
      FROM Carreras c
      INNER JOIN Centros_Carreras cc ON c.ID = cc.ID_carrera
      WHERE cc.ID_centro_educativo = ?
      ORDER BY c.Nombre ASC
    `;

    try {
      const [carreras] = await pool.execute(query, [id_centro]);
      return carreras;
    } catch (error) {
      console.error('Error al obtener carreras por centro:', error);
      throw error;
    }
  }

  static async obtenerCentrosPorCarrera(id_carrera) {
    const query = `
      SELECT ce.* 
      FROM Centros_Educativos ce
      INNER JOIN Centros_Carreras cc ON ce.ID = cc.ID_centro_educativo
      WHERE cc.ID_carrera = ?
      ORDER BY ce.Nombre ASC
    `;

    try {
      const [centros] = await pool.execute(query, [id_carrera]);
      return centros;
    } catch (error) {
      console.error('Error al obtener centros por carrera:', error);
      throw error;
    }
  }

  static async eliminar(id) {
    const query = 'DELETE FROM Centros_Carreras WHERE ID = ?';
    try {
      const [resultado] = await pool.execute(query, [id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar relación:', error);
      throw error;
    }
  }

  static async eliminarPorCentroYCarrera(id_centro, id_carrera) {
    const query = 'DELETE FROM Centros_Carreras WHERE ID_centro_educativo = ? AND ID_carrera = ?';
    try {
      const [resultado] = await pool.execute(query, [id_centro, id_carrera]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar relación específica:', error);
      throw error;
    }
  }
}

module.exports = CentroCarrera;

