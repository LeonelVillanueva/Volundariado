<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-200 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo/Título -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-4">
          <div class="p-4 bg-primary-600 rounded-full shadow-lg">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </div>
        </div>
        <h1 class="text-4xl font-bold text-primary-700 mb-2">Voluntariado</h1>
        <p class="text-primary-600 font-medium">Sistema de Gestión de Eventos</p>
      </div>

      <!-- Formulario de Login -->
      <div class="bg-white rounded-lg shadow-xl p-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Iniciar Sesión</h2>

        <form @submit.prevent="handleLogin">
          <!-- Usuario -->
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Usuario</label>
            <input
              v-model="form.usuario"
              type="text"
              placeholder="Ingresa tu usuario"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <!-- Contraseña -->
          <div class="mb-6">
            <label class="block text-gray-700 font-medium mb-2">Contraseña</label>
            <input
              v-model="form.clave"
              type="password"
              placeholder="Ingresa tu contraseña"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <!-- Mensaje de Error -->
          <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {{ error }}
          </div>

          <!-- Botón de Login -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="loading">Iniciando sesión...</span>
            <span v-else>Iniciar Sesión</span>
          </button>
        </form>

        <!-- Credenciales de prueba -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p class="text-sm text-gray-600 font-medium mb-2">Credenciales de prueba:</p>
          <p class="text-sm text-gray-700">Usuario: <span class="font-mono font-semibold">admin</span></p>
          <p class="text-sm text-gray-700">Contraseña: <span class="font-mono font-semibold">admin123</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
});

const form = ref({
  usuario: '',
  clave: ''
});

const loading = ref(false);
const error = ref('');
const api = useApi();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const data = await api.login(form.value.usuario, form.value.clave);

    if (data.success) {
      // Guardar token y usuario en localStorage
      if (process.client) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('usuario', JSON.stringify(data.data.usuario));
      }

      // Limpiar formulario
      form.value = { usuario: '', clave: '' };

      // Redirigir al panel
      if (process.client) {
        window.location.href = '/panel';
      }
    } else {
      error.value = data.mensaje || 'Error al iniciar sesión';
    }
  } catch (err) {
    console.error('Error en login:', err);
    error.value = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000';
  } finally {
    loading.value = false;
  }
};
</script>
