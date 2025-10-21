/**
 * Utilidades de validación para el sistema
 */

/**
 * Validar formato de email (debe contener @)
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido
 */
function validarEmail(email) {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validar que el teléfono tenga exactamente 8 dígitos
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean} true si es válido
 */
function validarTelefono(telefono) {
  if (!telefono) return true; // El teléfono es opcional
  
  const telefonoLimpio = telefono.toString().replace(/\D/g, ''); // Eliminar todo lo que no sea dígito
  return telefonoLimpio.length === 8;
}

/**
 * Validar que el email académico coincida con el dominio del centro educativo
 * @param {string} emailAcademico - Email académico a validar
 * @param {string} dominioInstitucional - Dominio del centro (ej: @unitec.edu)
 * @returns {boolean} true si es válido
 */
function validarEmailAcademico(emailAcademico, dominioInstitucional) {
  if (!emailAcademico || !dominioInstitucional) return true; // Opcional si no hay dominio definido
  
  const emailLimpio = emailAcademico.trim().toLowerCase();
  const dominioLimpio = dominioInstitucional.trim().toLowerCase();
  
  // Verificar que el email termine con el dominio institucional
  return emailLimpio.endsWith(dominioLimpio);
}

/**
 * Extraer el dominio de un email (incluyendo @)
 * @param {string} email - Email del cual extraer el dominio
 * @returns {string|null} Dominio con @ o null si no es válido
 */
function extraerDominioEmail(email) {
  if (!email || !validarEmail(email)) return null;
  
  const partes = email.trim().split('@');
  if (partes.length !== 2) return null;
  
  return '@' + partes[1].toLowerCase();
}

/**
 * Normalizar teléfono (eliminar caracteres no numéricos)
 * @param {string} telefono - Teléfono a normalizar
 * @returns {string} Teléfono solo con dígitos
 */
function normalizarTelefono(telefono) {
  if (!telefono) return '';
  return telefono.toString().replace(/\D/g, '');
}

module.exports = {
  validarEmail,
  validarTelefono,
  validarEmailAcademico,
  extraerDominioEmail,
  normalizarTelefono
};

