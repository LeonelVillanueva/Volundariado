<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-200 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo/Título -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-4">
          <img :src="`/images/logo.png?v=${Date.now()}`" alt="Logo Voluntariado" class="w-32 h-32" />
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

        <!-- Separador -->
        <div class="my-6 flex items-center">
          <div class="flex-1 border-t border-gray-300"></div>
          <span class="px-4 text-gray-500 text-sm font-medium">o</span>
          <div class="flex-1 border-t border-gray-300"></div>
        </div>

        <!-- Botones de Registro -->
        <div class="space-y-4">
          <p class="text-center text-gray-700 font-medium mb-4">¿No tienes cuenta? Regístrate como:</p>
          
          <div class="grid grid-cols-2 gap-3">
            <!-- Botón Estudiante/Voluntario -->
            <button
              @click="irARegistroVoluntario"
              type="button"
              class="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200 border-2 border-primary-300 hover:border-primary-500 rounded-lg transition-all duration-200 group"
            >
              <img src="/images/Vl_img.png" alt="Voluntario" class="w-12 h-12 mb-2 group-hover:scale-110 transition-transform" />
              <span class="text-xs font-semibold text-primary-700 text-center">Estudiante/<br/>Voluntario</span>
            </button>

            <!-- Botón Docente -->
            <button
              @click="irARegistroDocente"
              type="button"
              class="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-300 hover:border-blue-500 rounded-lg transition-all duration-200 group"
            >
              <img src="/images/Dc_img.png" alt="Docente" class="w-12 h-12 mb-2 group-hover:scale-110 transition-transform" />
              <span class="text-xs font-semibold text-blue-700 text-center">Docente</span>
            </button>
          </div>
        </div>

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

// Navegación a páginas de registro
const irARegistroVoluntario = () => {
  navigateTo('/registro-voluntario');
};

const irARegistroDocente = () => {
  navigateTo('/registro-docente');
};

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
    // El mensaje ya viene amigable desde useApi
    error.value = err.message || 'Ocurrió un error. Por favor intenta de nuevo.';
  } finally {
    loading.value = false;
  }
};
</script>
