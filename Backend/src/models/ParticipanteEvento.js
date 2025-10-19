const { pool } = require('../config/database');

/**
 * Modelo de Participantes_Eventos
 * Representa la inscripción de usuarios a eventos de voluntariado
 */
class ParticipanteEvento {
  /**
   * Inicializar la tabla de Participantes_Eventos
   */
  static async inicializar() {
    try {
      await pool.query(`USE ${process.env.DB_NAME || 'db_voluntariado'}`);

      const crearTabla = `
        CREATE TABLE IF NOT EXISTS Participantes_Eventos (
          ID INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único',
          ID_Evento INT NULL COMMENT 'ID del evento',
          ID_Usuario INT NULL COMMENT 'ID del usuario participante',
          Fecha_registro DATE DEFAULT (CURRENT_DATE) COMMENT 'Fecha de registro',
          Estado_inscripcion VARCHAR(50) DEFAULT 'Pendiente' COMMENT 'Estado de la inscripción',
          Asistencia BOOLEAN DEFAULT FALSE COMMENT 'Confirmación de asistencia',
          Apor_monetaria DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Aporte monetario realizado',
          Comentarios TEXT NULL COMMENT 'Comentarios del participante',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',
          
          INDEX idx_evento (ID_Evento),
          INDEX idx_usuario (ID_Usuario),
          INDEX idx_estado (Estado_inscripcion),
          INDEX idx_fecha (Fecha_registro),
          UNIQUE KEY unique_participante_evento (ID_Evento, ID_Usuario),
          
          CONSTRAINT fk_participantes_evento 
            FOREIGN KEY (ID_Evento) REFERENCES Eventos(ID)
            ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT fk_participantes_usuario 
            FOREIGN KEY (ID_Usuario) REFERENCES Usuarios(ID)
            ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;
      
      await pool.query(crearTabla);
      console.log('✅ Tabla Participantes_Eventos verificada/creada correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error al inicializar tabla Participantes_Eventos:', error);
      throw error;
    }
  }

  static async crear(datos) {
    const {
      id_evento,
      id_usuario,
      fecha_registro = null,
      estado_inscripcion = 'Pendiente',
      asistencia = false,
      apor_monetaria = 0.00,
      comentarios = null
    } = datos;

    const query = `
      INSERT INTO Participantes_Eventos 
      (ID_Evento, ID_Usuario, Fecha_registro, Estado_inscripcion, Asistencia, Apor_monetaria, Comentarios) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const [resultado] = await pool.execute(query, [
        id_evento, id_usuario, fecha_registro, estado_inscripcion, 
        asistencia, apor_monetaria, comentarios
      ]);
      return { id: resultado.insertId, ...datos };
    } catch (error) {
      console.error('Error al crear participante:', error);
      throw error;
    }
  }

  static async obtenerParticipantesPorEvento(id_evento, filtros = {}) {
    let query = `
      SELECT pe.*, u.Nombres, u.Apellidos, u.Email_personal 
      FROM Participantes_Eventos pe
      INNER JOIN Usuarios u ON pe.ID_Usuario = u.ID
      WHERE pe.ID_Evento = ?
    `;
    const valores = [id_evento];

    if (filtros.estado_inscripcion) {
      query += ' AND pe.Estado_inscripcion = ?';
      valores.push(filtros.estado_inscripcion);
    }

    if (filtros.asistencia !== undefined) {
      query += ' AND pe.Asistencia = ?';
      valores.push(filtros.asistencia);
    }

    query += ' ORDER BY pe.Fecha_registro DESC';

    try {
      const [participantes] = await pool.execute(query, valores);
      return participantes;
    } catch (error) {
      console.error('Error al obtener participantes del evento:', error);
      throw error;
    }
  }

  static async obtenerEventosPorUsuario(id_usuario, filtros = {}) {
    let query = `
      SELECT pe.*, e.Nombre_evento, e.Fecha_ini_evento, e.Fecha_fin_evento, e.Ciudad 
      FROM Participantes_Eventos pe
      INNER JOIN Eventos e ON pe.ID_Evento = e.ID
      WHERE pe.ID_Usuario = ?
    `;
    const valores = [id_usuario];

    if (filtros.estado_inscripcion) {
      query += ' AND pe.Estado_inscripcion = ?';
      valores.push(filtros.estado_inscripcion);
    }

    query += ' ORDER BY e.Fecha_ini_evento DESC';

    try {
      const [eventos] = await pool.execute(query, valores);
      return eventos;
    } catch (error) {
      console.error('Error al obtener eventos del usuario:', error);
      throw error;
    }
  }

  static async obtenerPorId(id) {
    const query = 'SELECT * FROM Participantes_Eventos WHERE ID = ?';
    try {
      const [participantes] = await pool.execute(query, [id]);
      return participantes.length > 0 ? participantes[0] : null;
    } catch (error) {
      console.error('Error al obtener participante por ID:', error);
      throw error;
    }
  }

  static async actualizar(id, datos) {
    const campos = [];
    const valores = [];

    const camposPermitidos = ['Estado_inscripcion', 'Asistencia', 'Apor_monetaria', 'Comentarios'];
    
    for (const [key, value] of Object.entries(datos)) {
      const campo = key.split('_').map((word, index) => 
        index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) 
        : word.charAt(0).toUpperCase() + word.slice(1)
      ).join('_');
      
      if (camposPermitidos.includes(campo)) {
        campos.push(`${campo} = ?`);
        valores.push(value);
      }
    }

    if (campos.length === 0) {
      throw new Error('No se proporcionaron campos para actualizar');
    }

    valores.push(id);
    const query = `UPDATE Participantes_Eventos SET ${campos.join(', ')} WHERE ID = ?`;

    try {
      const [resultado] = await pool.execute(query, valores);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al actualizar participante:', error);
      throw error;
    }
  }

  static async cambiarEstadoInscripcion(id, nuevo_estado) {
    const query = 'UPDATE Participantes_Eventos SET Estado_inscripcion = ? WHERE ID = ?';
    try {
      const [resultado] = await pool.execute(query, [nuevo_estado, id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al cambiar estado de inscripción:', error);
      throw error;
    }
  }

  static async registrarAsistencia(id, asistio) {
    const query = 'UPDATE Participantes_Eventos SET Asistencia = ? WHERE ID = ?';
    try {
      const [resultado] = await pool.execute(query, [asistio, id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
      throw error;
    }
  }

  static async eliminar(id) {
    const query = 'DELETE FROM Participantes_Eventos WHERE ID = ?';
    try {
      const [resultado] = await pool.execute(query, [id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar participante:', error);
      throw error;
    }
  }

  static async contarParticipantes(id_evento, filtros = {}) {
    let query = 'SELECT COUNT(*) as total FROM Participantes_Eventos WHERE ID_Evento = ?';
    const valores = [id_evento];

    if (filtros.estado_inscripcion) {
      query += ' AND Estado_inscripcion = ?';
      valores.push(filtros.estado_inscripcion);
    }

    try {
      const [resultado] = await pool.execute(query, valores);
      return resultado[0].total;
    } catch (error) {
      console.error('Error al contar participantes:', error);
      throw error;
    }
  }
}

module.exports = ParticipanteEvento;

