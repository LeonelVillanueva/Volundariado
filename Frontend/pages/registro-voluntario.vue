<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-200 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <!-- Header -->
      <div class="text-center mb-6">
        <div class="flex items-center justify-center mb-3">
          <img src="/images/Vl_img.png" alt="Voluntario" class="w-16 h-16" />
        </div>
        <h1 class="text-3xl font-bold text-primary-700 mb-1">Registro de Estudiante/Voluntario</h1>
        <p class="text-sm text-primary-600 font-medium">Completa el formulario para crear tu cuenta</p>
      </div>

      <!-- Formulario -->
      <div class="bg-white rounded-lg shadow-xl p-6">
        <form @submit.prevent="handleRegistro">
          <!-- Campos Obligatorios -->
          <div class="mb-4">
            <h3 class="text-base font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-200">
              Información Requerida <span class="text-red-500">*</span>
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Nombre -->
              <div>
                <label class="block text-gray-700 font-medium mb-2">Nombre <span class="text-red-500">*</span></label>
                <input
                  v-model="form.nombres"
                  type="text"
                  placeholder="Tu nombre"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <!-- Apellido -->
              <div>
                <label class="block text-gray-700 font-medium mb-2">Apellido <span class="text-red-500">*</span></label>
                <input
                  v-model="form.apellidos"
                  type="text"
                  placeholder="Tu apellido"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-gray-700 font-medium mb-2">Usuario <span class="text-red-500">*</span></label>
              <input
                v-model="form.usuario_nombre"
                type="text"
                placeholder="Nombre de usuario único"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div class="mt-4">
              <label class="block text-gray-700 font-medium mb-2">Email Personal <span class="text-red-500">*</span></label>
              <input
                v-model="form.email_personal"
                type="email"
                placeholder="correo@ejemplo.com"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <!-- Contraseña -->
              <div>
                <label class="block text-gray-700 font-medium mb-2">Contraseña <span class="text-red-500">*</span></label>
                <input
                  v-model="form.clave"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  minlength="6"
                />
              </div>

              <!-- Confirmar Contraseña -->
              <div>
                <label class="block text-gray-700 font-medium mb-2">Confirmar Contraseña <span class="text-red-500">*</span></label>
                <input
                  v-model="form.confirmar_clave"
                  type="password"
                  placeholder="Repite la contraseña"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  minlength="6"
                />
              </div>
            </div>
          </div>

          <!-- Campos Opcionales -->
          <div class="mb-4">
            <h3 class="text-base font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-200">
              Información Adicional (Opcional)
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

              <!-- Email Académico -->
              <div>
                <label class="block text-gray-700 font-medium mb-2">Email Académico</label>
                <input
                  v-model="form.email_academico"
                  type="email"
                  placeholder="correo@universidad.edu"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <!-- Teléfono -->
              <div>
                <label class="block text-gray-700 font-medium mb-2">Teléfono</label>
                <input
                  v-model="form.telefono"
                  type="tel"
                  placeholder="+504 0000-0000"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <!-- Fecha de Nacimiento -->
              <div>
                <label class="block text-gray-700 font-medium mb-2">Fecha de Nacimiento</label>
                <input
                  v-model="form.fecha_nacimiento"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <!-- Mensaje de Error/Éxito -->
          <div v-if="mensaje" class="mb-4 p-3 rounded-lg" :class="mensajeTipo === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'">
            {{ mensaje }}
          </div>

          <!-- Botones -->
          <div class="flex space-x-4">
            <button
              type="button"
              @click="volver"
              class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Volver
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="loading">Registrando...</span>
              <span v-else>Registrarme</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
});

const form = ref({
  nombres: '',
  apellidos: '',
  usuario_nombre: '',
  clave: '',
  confirmar_clave: '',
  email_personal: '',
  email_academico: '',
  telefono: '',
  fecha_nacimiento: ''
});

const loading = ref(false);
const mensaje = ref('');
const mensajeTipo = ref('');

const volver = () => {
  navigateTo('/');
};

const handleRegistro = async () => {
  loading.value = true;
  mensaje.value = '';

  try {
    // Validar que las contraseñas coincidan
    if (form.value.clave !== form.value.confirmar_clave) {
      mensaje.value = 'Las contraseñas no coinciden';
      mensajeTipo.value = 'error';
      loading.value = false;
      return;
    }

    // Preparar datos para enviar (rol 2 = Estudiante/Voluntario)
    const datosRegistro = {
      nombres: form.value.nombres,
      apellidos: form.value.apellidos,
      usuario_nombre: form.value.usuario_nombre,
      clave: form.value.clave,
      id_rol: 2, // Estudiante voluntario
      email_personal: form.value.email_personal || null,
      email_academico: form.value.email_academico || null,
      telefono: form.value.telefono || null,
      fecha_nacimiento: form.value.fecha_nacimiento || null,
      es_estudiante: false // Por defecto false, puede activarlo en su perfil
    };

    const response = await fetch('http://localhost:3000/api/auth/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosRegistro)
    });

    const data = await response.json();

    if (data.success) {
      mensaje.value = '¡Registro exitoso! Redirigiendo al login...';
      mensajeTipo.value = 'success';
      
      // Limpiar formulario
      form.value = {
        nombres: '',
        apellidos: '',
        usuario_nombre: '',
        clave: '',
        confirmar_clave: '',
        email_personal: '',
        email_academico: '',
        telefono: '',
        fecha_nacimiento: ''
      };

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigateTo('/');
      }, 2000);
    } else {
      // Convertir mensaje técnico a amigable
      const mensajesAmigables = {
        'El nombre de usuario ya está en uso': 'Este usuario ya existe. Elige otro nombre de usuario.',
        'El email personal ya está registrado': 'Este email ya está registrado. Usa otro email.',
        'Nombre, apellido, usuario, contraseña, email personal y rol son requeridos': 'Por favor completa todos los campos obligatorios.',
      };
      
      const mensajeOriginal = data.mensaje || 'Error al registrar usuario';
      mensaje.value = mensajesAmigables[mensajeOriginal] || mensajeOriginal;
      mensajeTipo.value = 'error';
    }
  } catch (error) {
    mensaje.value = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    mensajeTipo.value = 'error';
  } finally {
    loading.value = false;
  }
};
</script>

