-- Agregar campo de dominio de email a Centros_Educativos
-- Este campo almacenará el dominio del correo institucional (ej: @unitec.edu)

USE db_voluntariado;

-- Agregar columna Dominio_email si no existe
ALTER TABLE Centros_Educativos 
ADD COLUMN IF NOT EXISTS Dominio_email VARCHAR(100) NULL 
COMMENT 'Dominio del correo institucional (ej: @unitec.edu)' 
AFTER Email;

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_dominio_email ON Centros_Educativos(Dominio_email);

-- Actualizar algunos centros con dominios de ejemplo (opcional)
UPDATE Centros_Educativos SET Dominio_email = '@unitec.edu' WHERE Nombre LIKE '%UNITEC%';
UPDATE Centros_Educativos SET Dominio_email = '@unah.edu.hn' WHERE Nombre LIKE '%UNAH%';
UPDATE Centros_Educativos SET Dominio_email = '@unicah.edu' WHERE Nombre LIKE '%UNICAH%';

SELECT 'Campo Dominio_email agregado exitosamente' AS resultado;

