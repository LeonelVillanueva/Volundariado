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
        <!-- Layout de 2 columnas: Sidebar izquierda + Contenido derecha -->
        <div class="flex flex-col lg:flex-row gap-6">
          
          <!-- SIDEBAR IZQUIERDA - Información del Centro (flotante) -->
          <aside class="lg:w-80 xl:w-96 shrink-0">
            <div class="sticky top-24 space-y-6">
              <!-- Tarjeta de Información del Centro -->
              <div v-if="centro" class="bg-gradient-to-br from-white to-primary-50 rounded-2xl shadow-xl border border-primary-100 overflow-hidden">
                <!-- Mini header -->
                <div class="bg-gradient-to-r from-primary-600 to-primary-700 p-4 text-white">
                  <div class="flex items-start space-x-3">
                    <div class="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex-shrink-0">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="font-bold text-base leading-tight break-words">{{ centro.Nombre }}</h3>
                    </div>
                    <button
                      @click="modoEdicion = true; tabActiva = 'centro'"
                      class="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-lg transition flex-shrink-0"
                      title="Editar información"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Info compacta -->
                <div class="p-4 space-y-3">
                  <!-- Dirección -->
                  <div class="flex items-start space-x-2">
                    <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    </svg>
                    <div class="flex-1">
                      <p class="text-xs text-gray-500">Dirección</p>
                      <p class="text-sm font-medium text-gray-800">{{ centro.Direccion || 'No especificada' }}</p>
                    </div>
                  </div>
                  
                  <!-- Ciudad -->
                  <div class="flex items-start space-x-2">
                    <svg class="w-5 h-5 text-purple-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                    <div class="flex-1">
                      <p class="text-xs text-gray-500">Ciudad</p>
                      <p class="text-sm font-medium text-gray-800">{{ centro.Ciudad || 'No especificada' }}</p>
                    </div>
                  </div>
                  
                  <!-- Teléfono -->
                  <div class="flex items-start space-x-2">
                    <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <div class="flex-1">
                      <p class="text-xs text-gray-500">Teléfono</p>
                      <p class="text-sm font-medium text-gray-800">{{ centro.Telefono || 'No especificado' }}</p>
                    </div>
                  </div>
                  
                  <!-- Email -->
                  <div class="flex items-start space-x-2">
                    <svg class="w-5 h-5 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <div class="flex-1">
                      <p class="text-xs text-gray-500">Email</p>
                      <p class="text-sm font-medium text-gray-800 break-all">{{ centro.Email || 'No especificado' }}</p>
                    </div>
                  </div>
                  
                  <!-- Dominio Email -->
                  <div v-if="centro.Dominio_email" class="flex items-start space-x-2">
                    <svg class="w-5 h-5 text-indigo-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <div class="flex-1">
                      <p class="text-xs text-gray-500">Dominio Institucional</p>
                      <span class="inline-flex items-center px-2 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold mt-1">
                        {{ centro.Dominio_email }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Tarjetas de Estadísticas (compactas) -->
              <div v-if="centro" class="space-y-3">
                <!-- Total -->
                <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg p-4 text-white">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-xs text-primary-100 uppercase tracking-wide">Total</p>
                      <p class="text-3xl font-extrabold">{{ estadisticas.total_estudiantes || 0 }}</p>
                      <p class="text-xs text-primary-100 mt-1">Estudiantes</p>
                    </div>
                    <div class="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <!-- Verificados -->
                <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-4 text-white">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-xs text-green-100 uppercase tracking-wide">Verificados</p>
                      <p class="text-3xl font-extrabold">{{ estadisticas.verificados || 0 }}</p>
                      <p class="text-xs text-green-100 mt-1">Aprobados</p>
                    </div>
                    <div class="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <!-- Pendientes -->
                <div class="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg p-4 text-white relative overflow-hidden">
                  <div class="flex items-center justify-between relative z-10">
                    <div>
                      <p class="text-xs text-yellow-100 uppercase tracking-wide">Pendientes</p>
                      <p class="text-3xl font-extrabold">{{ estadisticas.pendientes || 0 }}</p>
                      <p class="text-xs text-yellow-100 mt-1">Requieren atención</p>
                    </div>
                    <div class="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                  <div v-if="estadisticas.pendientes > 0" class="absolute -right-2 -top-2 w-16 h-16 bg-white/10 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
          </aside>
          
          <!-- CONTENIDO DERECHA - Tabs y contenido -->
          <div class="flex-1 min-w-0">
            <!-- Tabs -->
            <div class="bg-white rounded-lg shadow-md mb-6">
              <div class="border-b border-gray-200">
                <nav class="flex -mb-px">
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
          <!-- Editar Centro (si tiene) -->
          <div v-if="centro" class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <svg class="w-7 h-7 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Editar Información del Centro
            </h2>
            
            <!-- Formulario de Edición -->
            <form @submit.prevent="actualizarCentro" class="space-y-4">
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
                    type="tel"
                    pattern="[0-9]{8}"
                    maxlength="8"
                    placeholder="12345678"
                    title="Debe contener exactamente 8 dígitos"
                    @keypress="soloNumeros"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email de Contacto</label>
                  <input
                    v-model="formCentro.email"
                    type="email"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Dominio de Email Institucional
                    <span class="text-xs text-gray-500">(para docentes)</span>
                  </label>
                  <input
                    v-model="formCentro.dominio_email"
                    type="text"
                    placeholder="Ej: @unitec.edu"
                    pattern="@[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}"
                    title="Debe iniciar con @ seguido del dominio (ej: @unitec.edu)"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Los docentes deberán usar este dominio en su email académico
                  </p>
                </div>
              </div>
              <button
                type="submit"
                :disabled="guardando"
                class="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-lg font-bold transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <svg v-if="!guardando" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>{{ guardando ? 'Guardando...' : 'Guardar Cambios' }}</span>
              </button>
            </form>
          </div>

          <!-- Crear Centro (si no tiene) -->
          <div v-else class="bg-gradient-to-br from-white to-primary-50 rounded-2xl shadow-xl border border-primary-100 overflow-hidden">
            <!-- Header con gradiente -->
            <div class="bg-gradient-to-r from-primary-600 to-emerald-600 p-8 text-white text-center">
              <div class="bg-white/20 backdrop-blur-sm rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <h2 class="text-3xl font-bold mb-2">Crear Centro Educativo</h2>
              <p class="text-primary-100">Como docente, puedes crear un centro educativo para gestionar estudiantes y carreras.</p>
            </div>
            
            <!-- Contenido con padding -->
            <div class="p-8">
            
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
                    type="tel"
                    pattern="[0-9]{8}"
                    maxlength="8"
                    placeholder="12345678"
                    title="Debe contener exactamente 8 dígitos"
                    @keypress="soloNumeros"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email de Contacto</label>
                  <input
                    v-model="formCentro.email"
                    type="email"
                    placeholder="Ej: info@universidad.edu.hn"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Dominio de Email Institucional
                    <span class="text-xs text-gray-500">(para docentes)</span>
                  </label>
                  <input
                    v-model="formCentro.dominio_email"
                    type="text"
                    placeholder="Ej: @unitec.edu"
                    pattern="@[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}"
                    title="Debe iniciar con @ seguido del dominio (ej: @unitec.edu)"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Los docentes deberán usar este dominio en su email académico
                  </p>
                </div>
              </div>
              <button
                type="submit"
                :disabled="creando"
                class="w-full bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg flex items-center justify-center space-x-3"
              >
                <svg v-if="!creando" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <div v-else class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>{{ creando ? 'Creando...' : 'Crear Centro Educativo' }}</span>
              </button>
            </form>
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
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <!-- Header con contador -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div class="flex items-center space-x-3">
                <div class="bg-green-100 p-2 rounded-lg">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-gray-800">Estudiantes Verificados</h2>
                  <p class="text-sm text-gray-500">
                    {{ estudiantesFiltrados.length }} de {{ estudiantesVerificados.length }} estudiante{{ estudiantesVerificados.length !== 1 ? 's' : '' }}
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Barra de búsqueda y filtros -->
            <div class="flex flex-col sm:flex-row gap-3 mb-6">
              <!-- Búsqueda -->
              <div class="flex-1 relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Buscar por nombre, email, carrera o N° cuenta..."
                  class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              
              <!-- Filtro por rol -->
              <div class="sm:w-48">
                <select
                  v-model="filtroRol"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="todos">Todos los roles</option>
                  <option value="estudiantes">📚 Solo Estudiantes</option>
                  <option value="docentes">🎓 Solo Docentes</option>
                </select>
              </div>
            </div>
            
            <!-- Estado vacío -->
            <div v-if="estudiantesVerificados.length === 0" class="text-center py-12">
              <div class="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <p class="text-gray-500 font-medium">No hay estudiantes verificados aún</p>
              <p class="text-sm text-gray-400 mt-1">Los estudiantes aparecerán aquí una vez que los apruebes</p>
            </div>
            
            <!-- Sin resultados de búsqueda -->
            <div v-else-if="estudiantesFiltrados.length === 0" class="text-center py-12">
              <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <p class="text-gray-500 font-medium">No se encontraron resultados</p>
              <p class="text-sm text-gray-400 mt-1">Intenta con otros términos de búsqueda</p>
              <button
                @click="searchQuery = ''; filtroRol = 'todos'"
                class="mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Limpiar filtros
              </button>
            </div>
            
            <!-- Grid de tarjetas -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="estudiante in estudiantesPaginados" 
                :key="estudiante.ID" 
                class="bg-gradient-to-br from-white to-green-50 border border-green-200 rounded-xl p-4 hover:shadow-lg hover:border-green-300 transition-all transform hover:-translate-y-1"
              >
                <!-- Foto y nombre -->
                <div class="flex items-start space-x-3 mb-3">
                  <div 
                    @click="verPerfilEstudiante(estudiante.ID)"
                    class="cursor-pointer flex-shrink-0"
                  >
                    <div v-if="estudiante.foto_perfil" class="w-14 h-14 rounded-full overflow-hidden border-2 border-green-300 hover:border-green-500 transition">
                      <img :src="estudiante.foto_perfil" :alt="estudiante.Nombres" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg border-2 border-green-300 hover:border-green-500 transition">
                      {{ getIniciales(estudiante.Nombres, estudiante.Apellidos) }}
                    </div>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <h3 
                      @click="verPerfilEstudiante(estudiante.ID)"
                      class="font-bold text-gray-800 hover:text-green-600 cursor-pointer truncate"
                      :title="estudiante.Nombres + ' ' + estudiante.Apellidos"
                    >
                      {{ estudiante.Nombres }} {{ estudiante.Apellidos }}
                    </h3>
                    <!-- Badge de Rol -->
                    <span 
                      v-if="estudiante.ID_rol === 4"
                      class="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-300 mt-1"
                    >
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                      </svg>
                      Docente
                    </span>
                    <span 
                      v-else
                      class="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-300 mt-1"
                    >
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                      </svg>
                      Estudiante
                    </span>
                  </div>
                </div>
                
                <!-- Información detallada -->
                <div class="space-y-2 mb-3">
                  <!-- Carrera -->
                  <div class="flex items-start space-x-2">
                    <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    <p class="text-sm text-gray-600 flex-1">{{ estudiante.Carrera || 'No especificada' }}</p>
                  </div>
                  
                  <!-- Email -->
                  <div class="flex items-start space-x-2">
                    <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <p class="text-sm text-gray-600 truncate flex-1" :title="estudiante.Email_personal">{{ estudiante.Email_personal }}</p>
                  </div>
                  
                  <!-- N° Cuenta -->
                  <div v-if="estudiante.Num_cuenta" class="flex items-start space-x-2">
                    <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/>
                    </svg>
                    <p class="text-sm text-gray-600">{{ estudiante.Num_cuenta }}</p>
                  </div>
                </div>
                
                <!-- Botones de acción -->
                <div class="flex space-x-2 pt-3 border-t border-green-200">
                  <button
                    @click="verPerfilEstudiante(estudiante.ID)"
                    class="flex-1 bg-green-100 hover:bg-green-200 text-green-700 font-medium px-3 py-2 rounded-lg transition text-sm flex items-center justify-center space-x-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <span>Ver Perfil</span>
                  </button>
                  <button
                    @click="removerEstudiante(estudiante.ID)"
                    class="bg-red-100 hover:bg-red-200 text-red-700 font-medium px-3 py-2 rounded-lg transition text-sm flex items-center justify-center"
                    title="Remover estudiante"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Paginación -->
            <div v-if="totalPaginas > 1" class="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <!-- Info -->
              <div class="text-sm text-gray-600">
                Mostrando {{ (paginaActual - 1) * itemsPorPagina + 1 }} - 
                {{ Math.min(paginaActual * itemsPorPagina, estudiantesFiltrados.length) }} 
                de {{ estudiantesFiltrados.length }}
              </div>
              
              <!-- Controles -->
              <div class="flex items-center space-x-2">
                <!-- Anterior -->
                <button
                  @click="cambiarPagina(paginaActual - 1)"
                  :disabled="paginaActual === 1"
                  class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                
                <!-- Números de página -->
                <div class="flex items-center space-x-1">
                  <template v-for="pagina in totalPaginas" :key="pagina">
                    <!-- Mostrar página si está cerca de la actual -->
                    <button
                      v-if="pagina === 1 || pagina === totalPaginas || (pagina >= paginaActual - 1 && pagina <= paginaActual + 1)"
                      @click="cambiarPagina(pagina)"
                      :class="[
                        'w-10 h-10 rounded-lg font-medium transition',
                        pagina === paginaActual
                          ? 'bg-primary-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      ]"
                    >
                      {{ pagina }}
                    </button>
                    <!-- Mostrar "..." -->
                    <span
                      v-else-if="pagina === paginaActual - 2 || pagina === paginaActual + 2"
                      class="px-2 text-gray-400"
                    >
                      ...
                    </span>
                  </template>
                </div>
                
                <!-- Siguiente -->
                <button
                  @click="cambiarPagina(paginaActual + 1)"
                  :disabled="paginaActual === totalPaginas"
                  class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Carreras -->
        <div v-if="tabActiva === 'carreras'" class="space-y-6">
          <!-- Formulario minimalista -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form @submit.prevent="crearCarrera" class="flex gap-3">
              <div class="flex-1">
                <input
                  v-model="nuevaCarrera"
                  type="text"
                  placeholder="Nombre de la carrera (ej: Ingeniería en Sistemas)"
                  required
                  :disabled="!centro"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                :disabled="creandoCarrera || !centro"
                class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg v-if="!creandoCarrera" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span class="hidden sm:inline">{{ creandoCarrera ? 'Agregando...' : 'Agregar' }}</span>
              </button>
            </form>
            <p v-if="!centro" class="mt-3 text-sm text-amber-600 flex items-center">
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              Primero debes crear un centro educativo
            </p>
          </div>

          <!-- Lista minimalista de carreras -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <!-- Header simple -->
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">Carreras Disponibles</h3>
                <span class="text-sm text-gray-500">{{ carrerasCentro.length }} carrera{{ carrerasCentro.length !== 1 ? 's' : '' }}</span>
              </div>
            </div>
            
            <!-- Estado vacío minimalista -->
            <div v-if="carrerasCentro.length === 0" class="px-6 py-12 text-center">
              <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              <p class="text-gray-500 text-sm">No hay carreras agregadas</p>
            </div>
            
            <!-- Lista simple -->
            <div v-else class="divide-y divide-gray-100">
              <div
                v-for="carrera in carrerasCentro"
                :key="carrera.ID"
                class="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition group"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span class="text-gray-900">{{ carrera.Nombre }}</span>
                </div>
                <button
                  @click="desasociarCarrera(carrera.ID)"
                  class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition"
                  title="Eliminar carrera"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
          </div><!-- Fin de contenido derecha -->
        </div><!-- Fin de flex layout -->
      </div><!-- Fin de contenido docentes -->

      <!-- Mensajes -->
      <div
        v-if="mensaje"
        :class="[
          'fixed top-20 right-4 px-6 py-4 rounded-lg shadow-2xl transition-all transform',
          mensajeTipo === 'success' ? 'bg-green-500' : 'bg-red-500',
          'text-white flex items-center space-x-3 animate-slide-in'
        ]"
      >
        <svg v-if="mensajeTipo === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="font-medium">{{ mensaje }}</span>
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
const tabActiva = ref('estudiantes');
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
  email: '',
  dominio_email: ''
});

const estudiantesPendientes = ref([]);
const estudiantesVerificados = ref([]);
const carrerasCentro = ref([]);
const nuevaCarrera = ref('');

// Variables para búsqueda y paginación
const searchQuery = ref('');
const filtroRol = ref('todos'); // 'todos', 'estudiantes', 'docentes'
const paginaActual = ref(1);
const itemsPorPagina = 12;

// Función auxiliar para manejar errores 401 (sesión expirada)
const manejarError401 = (response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    // Redirigir sin alert
    window.location.href = '/';
    return true;
  }
  return false;
};
const creandoCarrera = ref(false);

// Función de búsqueda y filtrado
const estudiantesFiltrados = computed(() => {
  let filtrados = [...estudiantesVerificados.value];
  
  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtrados = filtrados.filter(est => {
      const nombreCompleto = `${est.Nombres} ${est.Apellidos}`.toLowerCase();
      const email = (est.Email_personal || '').toLowerCase();
      const carrera = (est.Carrera || '').toLowerCase();
      const numCuenta = (est.Num_cuenta || '').toLowerCase();
      
      return nombreCompleto.includes(query) ||
             email.includes(query) ||
             carrera.includes(query) ||
             numCuenta.includes(query);
    });
  }
  
  // Filtrar por rol
  if (filtroRol.value === 'estudiantes') {
    filtrados = filtrados.filter(est => est.ID_rol !== 4);
  } else if (filtroRol.value === 'docentes') {
    filtrados = filtrados.filter(est => est.ID_rol === 4);
  }
  
  return filtrados;
});

// Paginación
const totalPaginas = computed(() => {
  return Math.ceil(estudiantesFiltrados.value.length / itemsPorPagina);
});

const estudiantesPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  return estudiantesFiltrados.value.slice(inicio, fin);
});

// Cambiar página
const cambiarPagina = (pagina) => {
  if (pagina >= 1 && pagina <= totalPaginas.value) {
    paginaActual.value = pagina;
    // Scroll suave al inicio de la sección
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Resetear paginación al buscar o filtrar
watch([searchQuery, filtroRol], () => {
  paginaActual.value = 1;
});

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

    // Manejar error 401 (sesión expirada)
    if (manejarError401(response)) return;

    const data = await response.json();

    if (data.success) {
      centro.value = data.data;
      formCentro.value = {
        nombre: centro.value.Nombre || '',
        direccion: centro.value.Direccion || '',
        ciudad: centro.value.Ciudad || '',
        telefono: centro.value.Telefono || '',
        email: centro.value.Email || '',
        dominio_email: centro.value.Dominio_email || ''
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
      
      // Si es 404, el usuario no tiene foto (esto es normal)
      if (response.status === 404) {
        estudiante.foto_perfil = null;
        continue;
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        estudiante.foto_perfil = data.data.imagen_url;
      } else {
        estudiante.foto_perfil = null;
      }
    } catch (error) {
      // No tiene foto o error de red, usar iniciales
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

// Función para validar entrada de teclado (solo números)
const soloNumeros = (event) => {
  const char = String.fromCharCode(event.keyCode);
  if (!/^[0-9]$/.test(char)) {
    event.preventDefault();
  }
};
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>

