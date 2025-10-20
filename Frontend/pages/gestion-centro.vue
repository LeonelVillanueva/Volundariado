<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
    <!-- Navbar -->
    <nav class="bg-primary-700 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-4">
            <button @click="volverAlPanel" class="text-white hover:text-primary-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </button>
            <h1 class="text-2xl font-bold text-white">Gestión de Centro Educativo</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="irAPerfil"
              class="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Mi Perfil
            </button>
            <button
              @click="logout"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenido Principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Verificar si el usuario es docente -->
      <div v-if="!esDocente" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <svg class="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <h2 class="text-xl font-bold text-yellow-800 mb-2">Acceso Restringido</h2>
        <p class="text-yellow-700">Solo los docentes pueden acceder a esta sección.</p>
        <button @click="volverAlPanel" class="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg">
          Volver al Panel
        </button>
      </div>

      <!-- Contenido para Docentes -->
      <div v-else>
        <!-- Tabs -->
        <div class="bg-white rounded-lg shadow-md mb-6">
          <div class="border-b border-gray-200">
            <nav class="flex -mb-px">
              <button
                @click="tabActiva = 'centro'"
                :class="[
                  'px-6 py-3 font-medium text-sm border-b-2 transition-colors',
                  tabActiva === 'centro'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Mi Centro Educativo
              </button>
              <button
                @click="tabActiva = 'estudiantes'"
                :class="[
                  'px-6 py-3 font-medium text-sm border-b-2 transition-colors relative',
                  tabActiva === 'estudiantes'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Estudiantes
                <span v-if="estadisticas.pendientes > 0" class="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {{ estadisticas.pendientes }}
                </span>
              </button>
              <button
                @click="tabActiva = 'carreras'"
                :class="[
                  'px-6 py-3 font-medium text-sm border-b-2 transition-colors',
                  tabActiva === 'carreras'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Carreras
              </button>
            </nav>
          </div>
        </div>

        <!-- Tab: Mi Centro Educativo -->
        <div v-if="tabActiva === 'centro'" class="space-y-6">
          <!-- Información del Centro -->
          <div v-if="centro" class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-800">{{ centro.Nombre }}</h2>
              <button
                @click="modoEdicion = !modoEdicion"
                class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
              >
                {{ modoEdicion ? 'Cancelar' : 'Editar' }}
              </button>
            </div>

            <!-- Formulario de Edición -->
            <form v-if="modoEdicion" @submit.prevent="actualizarCentro" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Centro</label>
                <input
                  v-model="formCentro.nombre"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                <input
                  v-model="formCentro.direccion"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                  <input
                    v-model="formCentro.ciudad"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input
                    v-model="formCentro.telefono"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  v-model="formCentro.email"
                  type="email"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div class="flex space-x-4">
                <button
                  type="submit"
                  :disabled="guardando"
                  class="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
                >
                  {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
                </button>
              </div>
            </form>

            <!-- Vista de Información -->
            <div v-else class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Dirección</p>
                  <p class="font-medium">{{ centro.Direccion || 'No especificada' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Ciudad</p>
                  <p class="font-medium">{{ centro.Ciudad || 'No especificada' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Teléfono</p>
                  <p class="font-medium">{{ centro.Telefono || 'No especificado' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Email</p>
                  <p class="font-medium">{{ centro.Email || 'No especificado' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Crear Centro (si no tiene) -->
          <div v-else class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Crear Centro Educativo</h2>
            <p class="text-gray-600 mb-6">Como docente, puedes crear un centro educativo para gestionar estudiantes.</p>
            
            <form @submit.prevent="crearCentro" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Centro *</label>
                <input
                  v-model="formCentro.nombre"
                  type="text"
                  required
                  placeholder="Ej: Universidad Nacional Autónoma de Honduras"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                <input
                  v-model="formCentro.direccion"
                  type="text"
                  placeholder="Ej: Ciudad Universitaria"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                  <input
                    v-model="formCentro.ciudad"
                    type="text"
                    placeholder="Ej: Tegucigalpa"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input
                    v-model="formCentro.telefono"
                    type="text"
                    placeholder="Ej: 22324500"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  v-model="formCentro.email"
                  type="email"
                  placeholder="Ej: info@universidad.edu.hn"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                :disabled="creando"
                class="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
              >
                {{ creando ? 'Creando...' : 'Crear Centro Educativo' }}
              </button>
            </form>
          </div>

          <!-- Estadísticas -->
          <div v-if="centro" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500">Total Estudiantes</p>
                  <p class="text-3xl font-bold text-primary-600">{{ estadisticas.total_estudiantes || 0 }}</p>
                </div>
                <div class="bg-primary-100 p-3 rounded-lg">
                  <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500">Verificados</p>
                  <p class="text-3xl font-bold text-green-600">{{ estadisticas.verificados || 0 }}</p>
                </div>
                <div class="bg-green-100 p-3 rounded-lg">
                  <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500">Pendientes</p>
                  <p class="text-3xl font-bold text-yellow-600">{{ estadisticas.pendientes || 0 }}</p>
                </div>
                <div class="bg-yellow-100 p-3 rounded-lg">
                  <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Estudiantes -->
        <div v-if="tabActiva === 'estudiantes'" class="space-y-6">
          <!-- Pendientes de Verificación -->
          <div v-if="estudiantesPendientes.length > 0" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg class="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Solicitudes Pendientes ({{ estudiantesPendientes.length }})
            </h2>
            <div class="space-y-4">
              <div v-for="estudiante in estudiantesPendientes" :key="estudiante.ID" class="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition">
                <div class="flex items-start space-x-4">
                  <!-- Foto de perfil -->
                  <div 
                    @click="verPerfilEstudiante(estudiante.ID)"
                    class="cursor-pointer flex-shrink-0"
                  >
                    <div v-if="estudiante.foto_perfil" class="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 hover:border-primary-500 transition">
                      <img :src="estudiante.foto_perfil" :alt="estudiante.Nombres" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl border-2 border-gray-300 hover:border-primary-500 transition">
                      {{ getIniciales(estudiante.Nombres, estudiante.Apellidos) }}
                    </div>
                  </div>
                  
                  <!-- Información -->
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <h3 
                        @click="verPerfilEstudiante(estudiante.ID)"
                        class="font-semibold text-lg text-gray-800 hover:text-primary-600 cursor-pointer"
                      >
                        {{ estudiante.Nombres }} {{ estudiante.Apellidos }}
                      </h3>
                      <!-- Badge de Rol -->
                      <span 
                        v-if="estudiante.ID_rol === 4"
                        class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-300"
                      >
                        🎓 Docente
                      </span>
                      <span 
                        v-else
                        class="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-300"
                      >
                        📚 Estudiante
                      </span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                      <div><span class="text-gray-500">Email Personal:</span> {{ estudiante.Email_personal }}</div>
                      <div><span class="text-gray-500">Email Académico:</span> {{ estudiante.Email_academico || 'N/A' }}</div>
                      <div><span class="text-gray-500">Teléfono:</span> {{ estudiante.Telefono || 'N/A' }}</div>
                      <div><span class="text-gray-500">N° Cuenta:</span> {{ estudiante.Num_cuenta || 'N/A' }}</div>
                      <div class="col-span-2"><span class="text-gray-500">Carrera:</span> {{ estudiante.Carrera || 'No especificada' }}</div>
                    </div>
                  </div>
                  
                  <!-- Botones de acción -->
                  <div class="flex flex-col space-y-2 flex-shrink-0">
                    <button
                      @click="verificarEstudiante(estudiante.ID)"
                      class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      ✓ Aprobar
                    </button>
                    <button
                      @click="rechazarEstudiante(estudiante.ID)"
                      class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      ✗ Rechazar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Estudiantes Verificados -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg class="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Estudiantes Verificados
            </h2>
            
            <div v-if="estudiantesVerificados.length === 0" class="text-center text-gray-500 py-8">
              No hay estudiantes verificados aún
            </div>
            
            <div v-else class="space-y-3">
              <div v-for="estudiante in estudiantesVerificados" :key="estudiante.ID" class="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition">
                <div class="flex items-center space-x-4">
                  <!-- Foto de perfil -->
                  <div 
                    @click="verPerfilEstudiante(estudiante.ID)"
                    class="cursor-pointer flex-shrink-0"
                  >
                    <div v-if="estudiante.foto_perfil" class="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 hover:border-primary-500 transition">
                      <img :src="estudiante.foto_perfil" :alt="estudiante.Nombres" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold border-2 border-gray-300 hover:border-primary-500 transition">
                      {{ getIniciales(estudiante.Nombres, estudiante.Apellidos) }}
                    </div>
                  </div>
                  
                  <!-- Nombre (clickable) -->
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <h3 
                        @click="verPerfilEstudiante(estudiante.ID)"
                        class="font-semibold text-gray-800 hover:text-primary-600 cursor-pointer"
                      >
                        {{ estudiante.Nombres }} {{ estudiante.Apellidos }}
                      </h3>
                      <!-- Badge de Rol -->
                      <span 
                        v-if="estudiante.ID_rol === 4"
                        class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-300"
                      >
                        🎓 Docente
                      </span>
                      <span 
                        v-else
                        class="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-300"
                      >
                        📚 Estudiante
                      </span>
                    </div>
                    <p class="text-sm text-gray-500">{{ estudiante.Carrera || 'No especificada' }}</p>
                  </div>
                  
                  <!-- Email -->
                  <div class="hidden md:block flex-1">
                    <p class="text-sm text-gray-600">{{ estudiante.Email_personal }}</p>
                  </div>
                  
                  <!-- N° Cuenta -->
                  <div class="hidden lg:block">
                    <p class="text-sm text-gray-600">{{ estudiante.Num_cuenta || 'N/A' }}</p>
                  </div>
                  
                  <!-- Botón remover -->
                  <button
                    @click="removerEstudiante(estudiante.ID)"
                    class="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded hover:bg-red-50 transition"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Carreras -->
        <div v-if="tabActiva === 'carreras'" class="space-y-6">
          <!-- Formulario para crear carrera -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Agregar Carrera al Centro</h2>
            <p class="text-gray-600 mb-6">Las carreras que agregues estarán disponibles para los estudiantes de tu centro educativo.</p>
            
            <form @submit.prevent="crearCarrera" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la Carrera *</label>
                <input
                  v-model="nuevaCarrera"
                  type="text"
                  placeholder="Ej: Ingeniería en Sistemas"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p class="mt-1 text-sm text-gray-500">Se creará y asociará automáticamente a tu centro educativo</p>
              </div>
              
              <button
                type="submit"
                :disabled="creandoCarrera || !centro"
                class="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
              >
                {{ creandoCarrera ? 'Creando...' : '+ Agregar Carrera' }}
              </button>
              
              <div v-if="!centro" class="text-center text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg">
                ⚠️ Primero debes crear un centro educativo
              </div>
            </form>
          </div>

          <!-- Carreras del Centro -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Carreras del Centro</h2>
            
            <div v-if="carrerasCentro.length === 0" class="text-center text-gray-500 py-8">
              No hay carreras asociadas aún. Busca o crea una carrera arriba.
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="carrera in carrerasCentro"
                :key="carrera.ID"
                class="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:border-primary-300 transition"
              >
                <span class="font-medium">{{ carrera.Nombre }}</span>
                <button
                  @click="desasociarCarrera(carrera.ID)"
                  class="text-red-600 hover:text-red-800 ml-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensajes -->
      <div v-if="mensaje" :class="[
        'fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg transition-all',
        mensajeTipo === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]">
        {{ mensaje }}
      </div>

      <!-- Modal de Confirmación -->
      <div v-if="modalConfirmacion" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="modalConfirmacion = false">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <!-- Header -->
          <div :class="[
            'px-6 py-4',
            modalTipo === 'advertencia' ? 'bg-yellow-500' : 'bg-primary-600'
          ]">
            <h3 class="text-xl font-bold text-white flex items-center">
              <svg v-if="modalTipo === 'advertencia'" class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <svg v-else class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
              </svg>
              {{ modalTitulo }}
            </h3>
          </div>
          
          <!-- Body -->
          <div class="px-6 py-4">
            <p class="text-gray-700 whitespace-pre-line">{{ modalMensaje }}</p>
          </div>
          
          <!-- Footer -->
          <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <button
              @click="modalConfirmacion = false"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              @click="confirmarAccion"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition',
                modalTipo === 'advertencia' 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              ]"
            >
              {{ modalTipo === 'advertencia' ? 'Continuar de Todas Formas' : 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
});

const usuario = ref(null);
const esDocente = ref(false);
const centro = ref(null);
const estadisticas = ref({
  total_estudiantes: 0,
  verificados: 0,
  pendientes: 0
});
const tabActiva = ref('centro');
const modoEdicion = ref(false);
const creando = ref(false);
const guardando = ref(false);
const mensaje = ref('');
const mensajeTipo = ref('success');

// Modal de confirmación
const modalConfirmacion = ref(false);
const modalTitulo = ref('');
const modalMensaje = ref('');
const modalAccion = ref(null);
const modalTipo = ref('normal'); // 'normal' o 'advertencia'

const formCentro = ref({
  nombre: '',
  direccion: '',
  ciudad: '',
  telefono: '',
  email: ''
});

const estudiantesPendientes = ref([]);
const estudiantesVerificados = ref([]);
const carrerasCentro = ref([]);
const nuevaCarrera = ref('');
const creandoCarrera = ref(false);

// Verificar autenticación
onMounted(async () => {
  if (process.client) {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (!token || !usuarioGuardado) {
      window.location.href = '/';
      return;
    }

    usuario.value = JSON.parse(usuarioGuardado);
    
    // Verificar si es docente (ID_rol = 4)
    esDocente.value = usuario.value.ID_rol === 4;

    if (esDocente.value) {
      await cargarDatos();
    }
  }
});

const cargarDatos = async () => {
  await Promise.all([
    cargarCentro(),
    cargarEstadisticas(),
    cargarEstudiantes(),
    cargarCarreras()
  ]);
};

const cargarCentro = async () => {
  if (!usuario.value.ID_centro_educativo) {
    centro.value = null;
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/centros/${usuario.value.ID_centro_educativo}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      centro.value = data.data;
      formCentro.value = {
        nombre: centro.value.Nombre || '',
        direccion: centro.value.Direccion || '',
        ciudad: centro.value.Ciudad || '',
        telefono: centro.value.Telefono || '',
        email: centro.value.Email || ''
      };
    }
  } catch (error) {
    console.error('Error al cargar centro:', error);
  }
};

const cargarEstadisticas = async () => {
  if (!usuario.value?.ID_centro_educativo) {
    estadisticas.value = {
      total_estudiantes: 0,
      verificados: 0,
      pendientes: 0
    };
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/verificacion/estadisticas', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      estadisticas.value = data.data;
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
    estadisticas.value = {
      total_estudiantes: 0,
      verificados: 0,
      pendientes: 0
    };
  }
};

const crearCentro = async () => {
  creando.value = true;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/centros', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formCentro.value)
    });

    const data = await response.json();

    if (data.success) {
      mostrarMensaje('Centro educativo creado exitosamente. Recargando...', 'success');
      
      // Actualizar usuario con el nuevo centro
      usuario.value.ID_centro_educativo = data.data.id;
      localStorage.setItem('usuario', JSON.stringify(usuario.value));
      
      // Recargar la página después de 1 segundo para que el usuario vea el mensaje
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      mostrarMensaje(data.mensaje || 'Error al crear centro', 'error');
      creando.value = false;
    }
  } catch (error) {
    console.error('Error al crear centro:', error);
    mostrarMensaje('Error al crear centro educativo', 'error');
    creando.value = false;
  }
};

const actualizarCentro = async () => {
  guardando.value = true;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/centros/${centro.value.ID}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formCentro.value)
    });

    const data = await response.json();

    if (data.success) {
      mostrarMensaje('Centro actualizado exitosamente', 'success');
      modoEdicion.value = false;
      await cargarCentro();
    } else {
      mostrarMensaje(data.mensaje || 'Error al actualizar centro', 'error');
    }
  } catch (error) {
    console.error('Error al actualizar centro:', error);
    mostrarMensaje('Error al actualizar centro educativo', 'error');
  } finally {
    guardando.value = false;
  }
};

const cargarEstudiantes = async () => {
  if (!usuario.value?.ID_centro_educativo) {
    estudiantesPendientes.value = [];
    estudiantesVerificados.value = [];
    return;
  }

  try {
    const token = localStorage.getItem('token');
    
    // Cargar pendientes
    const responsePendientes = await fetch('http://localhost:3000/api/verificacion/pendientes', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const dataPendientes = await responsePendientes.json();
    if (dataPendientes.success) {
      estudiantesPendientes.value = dataPendientes.data;
      // Cargar fotos de perfil para cada estudiante pendiente
      await cargarFotosEstudiantes(estudiantesPendientes.value);
    }

    // Cargar todos los estudiantes
    const responseEstudiantes = await fetch(`http://localhost:3000/api/centros/${usuario.value.ID_centro_educativo}/estudiantes`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const dataEstudiantes = await responseEstudiantes.json();
    if (dataEstudiantes.success) {
      estudiantesVerificados.value = dataEstudiantes.data.filter(e => e.Esta_verificado === 1);
      // Cargar fotos de perfil para cada estudiante verificado
      await cargarFotosEstudiantes(estudiantesVerificados.value);
    }
  } catch (error) {
    console.error('Error al cargar estudiantes:', error);
    estudiantesPendientes.value = [];
    estudiantesVerificados.value = [];
  }
};

const cargarFotosEstudiantes = async (estudiantes) => {
  const token = localStorage.getItem('token');
  
  for (const estudiante of estudiantes) {
    try {
      const response = await fetch(`http://localhost:3000/api/fotos-perfil/usuario/${estudiante.ID}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success && data.data) {
        estudiante.foto_perfil = data.data.imagen_url;
      }
    } catch (error) {
      // No tiene foto, usar iniciales
      estudiante.foto_perfil = null;
    }
  }
};

const cargarCarreras = async () => {
  if (!usuario.value?.ID_centro_educativo) {
    carrerasCentro.value = [];
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/carreras/centro/${usuario.value.ID_centro_educativo}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data.success) {
      carrerasCentro.value = data.data;
    }
  } catch (error) {
    console.error('Error al cargar carreras:', error);
    carrerasCentro.value = [];
  }
};

const verificarEstudiante = async (idEstudiante) => {
  await mostrarModal(
    'Verificar Estudiante',
    '¿Estás seguro de verificar a este estudiante?',
    async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/verificacion/verificar/${idEstudiante}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success) {
          mostrarMensaje('Estudiante verificado exitosamente', 'success');
          await cargarEstudiantes();
          await cargarEstadisticas();
        } else {
          mostrarMensaje(data.mensaje || 'Error al verificar estudiante', 'error');
        }
      } catch (error) {
        console.error('Error al verificar estudiante:', error);
        mostrarMensaje('Error al verificar estudiante', 'error');
      }
    }
  );
};

const rechazarEstudiante = async (idEstudiante) => {
  await mostrarModal(
    'Rechazar Solicitud',
    '¿Estás seguro de rechazar esta solicitud?\n\nEl estudiante permanecerá como pendiente.',
    async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/verificacion/rechazar/${idEstudiante}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success) {
          mostrarMensaje('Solicitud rechazada', 'success');
          await cargarEstudiantes();
          await cargarEstadisticas();
        } else {
          mostrarMensaje(data.mensaje || 'Error al rechazar', 'error');
        }
      } catch (error) {
        console.error('Error al rechazar:', error);
        mostrarMensaje('Error al rechazar solicitud', 'error');
      }
    }
  );
};

const removerEstudiante = async (idEstudiante) => {
  // Verificar si se está removiendo a sí mismo
  const esAutoRemocion = idEstudiante === usuario.value.ID;
  
  await mostrarModal(
    esAutoRemocion ? 'ADVERTENCIA' : 'Remover Estudiante',
    esAutoRemocion 
      ? 'Estás a punto de removerte a TI MISMO del centro.\n\n' +
        'Si eres el único docente, NO podrás volver a acceder sin ayuda de un administrador.\n\n' +
        '¿Estás seguro de continuar?'
      : '¿Estás seguro de remover este estudiante del centro?\n\n' +
        'Esto eliminará su verificación y asociación al centro.',
    async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/verificacion/remover/${idEstudiante}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success) {
          mostrarMensaje('Estudiante removido del centro', 'success');
          await cargarEstudiantes();
          await cargarEstadisticas();
        } else {
          mostrarMensaje(data.mensaje || 'Error al remover estudiante', 'error');
        }
      } catch (error) {
        console.error('Error al remover estudiante:', error);
        mostrarMensaje('Error al remover estudiante', 'error');
      }
    },
    esAutoRemocion ? 'advertencia' : 'normal'
  );
};

const crearCarrera = async () => {
  if (!centro.value) {
    mostrarMensaje('Primero debes crear un centro educativo', 'error');
    return;
  }

  creandoCarrera.value = true;

  try {
    const token = localStorage.getItem('token');
    
    // 1. Crear la carrera
    const responseCrear = await fetch('http://localhost:3000/api/carreras', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre: nuevaCarrera.value })
    });

    const dataCrear = await responseCrear.json();

    if (dataCrear.success) {
      // 2. Asociar automáticamente la carrera al centro
      const responseAsociar = await fetch('http://localhost:3000/api/carreras/asociar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_carrera: dataCrear.data.id,
          id_centro: usuario.value.ID_centro_educativo
        })
      });

      const dataAsociar = await responseAsociar.json();

      if (dataAsociar.success) {
        nuevaCarrera.value = '';
        mostrarMensaje('Carrera agregada exitosamente', 'success');
        await cargarCarreras();
      } else {
        mostrarMensaje(dataAsociar.mensaje || 'Error al asociar carrera', 'error');
      }
    } else {
      mostrarMensaje(dataCrear.mensaje || 'Error al crear carrera', 'error');
    }
  } catch (error) {
    console.error('Error al crear carrera:', error);
    mostrarMensaje('Error al crear carrera', 'error');
  } finally {
    creandoCarrera.value = false;
  }
};

const desasociarCarrera = async (idCarrera) => {
  await mostrarModal(
    'Desasociar Carrera',
    '¿Estás seguro de desasociar esta carrera del centro?\n\nLos estudiantes ya inscritos la mantendrán.',
    async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/carreras/desasociar', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id_carrera: idCarrera,
            id_centro: usuario.value.ID_centro_educativo
          })
        });

        const data = await response.json();

        if (data.success) {
          mostrarMensaje('Carrera desasociada exitosamente', 'success');
          await cargarCarreras();
        } else {
          mostrarMensaje(data.mensaje || 'Error al desasociar carrera', 'error');
        }
      } catch (error) {
        console.error('Error al desasociar carrera:', error);
        mostrarMensaje('Error al desasociar carrera', 'error');
      }
    }
  );
};

const mostrarMensaje = (texto, tipo = 'success') => {
  mensaje.value = texto;
  mensajeTipo.value = tipo;
  setTimeout(() => {
    mensaje.value = '';
  }, 3000);
};

const mostrarModal = (titulo, mensajeTexto, accion, tipo = 'normal') => {
  return new Promise((resolve) => {
    modalTitulo.value = titulo;
    modalMensaje.value = mensajeTexto;
    modalTipo.value = tipo;
    modalAccion.value = () => {
      modalConfirmacion.value = false;
      resolve(true);
      if (accion) accion();
    };
    modalConfirmacion.value = true;
  });
};

const confirmarAccion = () => {
  if (modalAccion.value) {
    modalAccion.value();
  }
};

const getIniciales = (nombres, apellidos) => {
  const inicial1 = nombres?.charAt(0)?.toUpperCase() || '';
  const inicial2 = apellidos?.charAt(0)?.toUpperCase() || '';
  return inicial1 + inicial2;
};

const verPerfilEstudiante = (idEstudiante) => {
  // Abrir en nueva pestaña para no perder el contexto
  window.open(`/ver-perfil/${idEstudiante}`, '_blank');
};

const volverAlPanel = () => {
  window.location.href = '/panel';
};

const irAPerfil = () => {
  window.location.href = '/perfil';
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '/';
};
</script>

