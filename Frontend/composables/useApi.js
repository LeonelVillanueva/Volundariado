/**
 * Composable para hacer peticiones al backend
 */

const API_URL = 'http://localhost:3000';

// Mapeo de mensajes amigables
const mensajesAmigables = {
  // Errores de autenticación
  'Credenciales inválidas': 'Usuario o contraseña incorrectos',
  'Usuario y contraseña son requeridos': 'Por favor completa todos los campos',
  'El servidor no está respondiendo correctamente': 'No se pudo conectar con el servidor',
  
  // Aprobación de docentes
  'Tu cuenta está pendiente de aprobación por un administrador. Por favor espera a que tu cuenta sea verificada.': 'Tu cuenta está en revisión. Te notificaremos cuando sea aprobada.',
  'Tu cuenta fue rechazada. Contacta al administrador para más información.': 'Tu solicitud fue rechazada. Contacta al administrador del sistema.',
  
  // Estado de usuario
  'Usuario inactivo. Consulta a tu supervisor': 'Tu cuenta está inactiva. Contacta al administrador.',
  
  // Registro
  'El nombre de usuario ya está en uso': 'Este nombre de usuario ya existe. Elige otro.',
  'El email personal ya está registrado': 'Este email ya está registrado.',
  'El email académico es requerido para docentes': 'Los docentes deben proporcionar un email académico.',
  
  // Genérico
  'Error de autenticación': 'No se pudo iniciar sesión. Verifica tus credenciales.',
  'Error al registrar usuario': 'No se pudo completar el registro. Intenta de nuevo.'
};

const obtenerMensajeAmigable = (mensajeOriginal) => {
  // Buscar mensaje exacto
  if (mensajesAmigables[mensajeOriginal]) {
    return mensajesAmigables[mensajeOriginal];
  }
  
  // Buscar por palabra clave
  if (mensajeOriginal.includes('pendiente de aprobación')) {
    return 'Tu cuenta está en revisión. Te notificaremos cuando sea aprobada.';
  }
  if (mensajeOriginal.includes('rechazada')) {
    return 'Tu solicitud fue rechazada. Contacta al administrador.';
  }
  if (mensajeOriginal.includes('inactivo') || mensajeOriginal.includes('Inactivo')) {
    return 'Tu cuenta está inactiva. Contacta al administrador.';
  }
  if (mensajeOriginal.includes('usuario ya está en uso') || mensajeOriginal.includes('usuario ya existe')) {
    return 'Este nombre de usuario ya existe. Elige otro.';
  }
  
  // Si no hay mapeo, retornar mensaje genérico
  return 'Ocurrió un error. Por favor intenta de nuevo.';
};

export const useApi = () => {
  const login = async (usuario_nombre, clave) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_nombre,
          clave
        })
      });

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('servidor_no_responde');
      }

      const data = await response.json();

      if (!response.ok) {
        // Lanzar error con el mensaje del backend
        throw new Error(data.mensaje || 'error_autenticacion');
      }

      return data;
    } catch (error) {
      // Convertir mensaje técnico a mensaje amigable
      const mensajeAmigable = obtenerMensajeAmigable(error.message);
      const nuevoError = new Error(mensajeAmigable);
      nuevoError.original = error.message; // Guardar mensaje original por si se necesita
      throw nuevoError;
    }
  };

  return {
    login
  };
};

