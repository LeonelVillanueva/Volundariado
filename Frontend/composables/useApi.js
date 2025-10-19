/**
 * Composable para hacer peticiones al backend
 */

const API_URL = 'http://localhost:3000';

export const useApi = () => {
  const login = async (usuario_nombre, clave) => {
    try {
      console.log('🔍 Intentando conectar a:', `${API_URL}/api/auth/login`);
      
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

      console.log('📡 Respuesta recibida, status:', response.status);
      console.log('📡 Content-Type:', response.headers.get('content-type'));

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ Se recibió HTML en lugar de JSON:', text.substring(0, 200));
        throw new Error('El servidor no está respondiendo correctamente. Verifica que el BACKEND esté en puerto 3000');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || `HTTP error! status: ${response.status}`);
      }

      console.log('✅ Login exitoso');
      return data;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  };

  return {
    login
  };
};

