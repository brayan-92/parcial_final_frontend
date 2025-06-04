<template>
  <div class="add-user-container">
    <div class="card">
      <div class="card-header">
        <h2 class="title">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Agregar Nuevo Usuario
        </h2>
        <p class="subtitle">Registra un nuevo usuario en el sistema</p>
      </div>

      <!-- Estado sin roles -->
      <div v-if="roles.length === 0 && !loadingRoles" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <path d="m9 9 3 3m0 0 3-3m-3 3V8m0 13v-6"/>
        </svg>
        <h3 class="empty-title">No hay roles disponibles</h3>
        <p class="empty-description">
          Debe agregar al menos un rol antes de crear usuarios.
        </p>
        <router-link to="/roles" class="btn btn-primary">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="m22 11-3-3m0 0-3 3m3-3v12"/>
          </svg>
          Crear Rol
        </router-link>
      </div>

      <!-- Formulario -->
      <form v-else @submit.prevent="addUser" class="form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName" class="label">
              Nombres <span class="required">*</span>
            </label>
            <input
              id="firstName"
              v-model="firstName"
              type="text"
              placeholder="Ej: Juan Carlos"
              class="input"
              :class="{ 'error': showErrors && !firstName.trim() }"
              @input="clearErrors"
            />
            <span v-if="showErrors && !firstName.trim()" class="error-message">
              Los nombres son obligatorios
            </span>
          </div>

          <div class="form-group">
            <label for="lastName" class="label">
              Apellidos <span class="required">*</span>
            </label>
            <input
              id="lastName"
              v-model="lastName"
              type="text"
              placeholder="Ej: Pérez García"
              class="input"
              :class="{ 'error': showErrors && !lastName.trim() }"
              @input="clearErrors"
            />
            <span v-if="showErrors && !lastName.trim()" class="error-message">
              Los apellidos son obligatorios
            </span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="idNumber" class="label">
              Identificación <span class="required">*</span>
            </label>
            <input
              id="idNumber"
              v-model="idNumber"
              type="text"
              placeholder="Ej: 12345678"
              class="input"
              :class="{ 'error': showErrors && !idNumber.trim() }"
              @input="clearErrors"
            />
            <span v-if="showErrors && !idNumber.trim()" class="error-message">
              La identificación es obligatoria
            </span>
          </div>

          <div class="form-group">
            <label for="email" class="label">
              Correo electrónico <span class="required">*</span>
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Ej: usuario@empresa.com"
              class="input"
              :class="{ 'error': showErrors && (!email.trim() || !isValidEmail) }"
              @input="clearErrors"
            />
            <span v-if="showErrors && !email.trim()" class="error-message">
              El correo electrónico es obligatorio
            </span>
            <span v-else-if="showErrors && !isValidEmail && email.trim()" class="error-message">
              Ingrese un correo electrónico válido
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="role" class="label">
            Rol del usuario <span class="required">*</span>
          </label>
          <div class="select-wrapper">
            <select
              id="role"
              v-model="role"
              class="select"
              :class="{ 'error': showErrors && !role }"
              @change="clearErrors"
            >
              <option disabled value="">Seleccione un rol</option>
              <option v-for="r in roles" :key="r._id" :value="r._id">
                {{ r.name }}
                <span v-if="r.description"> - {{ r.description }}</span>
              </option>
            </select>
            <svg class="select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="6,9 12,15 18,9"/>
            </svg>
          </div>
          <span v-if="showErrors && !role" class="error-message">
            Debe seleccionar un rol
          </span>
          <span class="help-text">Seleccione el rol que tendrá el usuario en el sistema</span>
        </div>

        <div class="form-actions">
          <button
            type="button"
            @click="clearForm"
            class="btn btn-secondary"
            :disabled="loading"
          >
            Limpiar
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading || !isFormValid"
          >
            <svg v-if="loading" class="spinner" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4" opacity="0.25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75"/>
            </svg>
            <svg v-else class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14m-7-7h14"/>
            </svg>
            {{ loading ? 'Agregando...' : 'Agregar Usuario' }}
          </button>
        </div>
      </form>

      <!-- Toast de notificación -->
      <div v-if="notification.show" :class="['toast', notification.type]">
        <svg v-if="notification.type === 'success'" class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <svg v-else class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <span>{{ notification.message }}</span>
      </div>

      <!-- Loading overlay para roles -->
      <div v-if="loadingRoles" class="loading-overlay">
        <div class="loading-spinner">
          <svg class="spinner" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4" opacity="0.25"/>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75"/>
          </svg>
          <p>Cargando roles...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const roles = ref([])
const firstName = ref('')
const lastName = ref('')
const idNumber = ref('')
const email = ref('')
const role = ref('')
const loading = ref(false)
const loadingRoles = ref(true)
const showErrors = ref(false)
const notification = ref({ show: false, type: '', message: '' })

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

const isFormValid = computed(() => {
  return firstName.value.trim() && 
         lastName.value.trim() && 
         idNumber.value.trim() && 
         email.value.trim() && 
         isValidEmail.value && 
         role.value
})

const showNotification = (type, message) => {
  notification.value = { show: true, type, message }
  setTimeout(() => {
    notification.value.show = false
  }, 4000)
}

const clearErrors = () => {
  showErrors.value = false
}

const clearForm = () => {
  firstName.value = ''
  lastName.value = ''
  idNumber.value = ''
  email.value = ''
  role.value = ''
  showErrors.value = false
}

const loadRoles = async () => {
  try {
    loadingRoles.value = true
    const res = await axios.get('http://localhost:3001/api/roles')
    roles.value = res.data
  } catch (error) {
    console.error('Error al cargar roles:', error)
    showNotification('error', 'Error al cargar los roles disponibles')
  } finally {
    loadingRoles.value = false
  }
}

const addUser = async () => {
  if (!isFormValid.value) {
    showErrors.value = true
    return
  }

  loading.value = true
  
  try {
    await axios.post('http://localhost:3001/api/users', {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      idNumber: idNumber.value.trim(),
      email: email.value.trim(),
      role: role.value,
    })
    
    showNotification('success', '¡Usuario agregado exitosamente!')
    clearForm()
  } catch (error) {
    console.error('Error al agregar usuario:', error)
    if (error.response?.status === 400) {
      showNotification('error', 'Ya existe un usuario con esa identificación o correo')
    } else {
      showNotification('error', 'Error al agregar el usuario. Inténtalo de nuevo.')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRoles()
})
</script>

<style scoped>
.add-user-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  position: relative;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.title {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.form {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

.required {
  color: #ef4444;
}

.input,
.select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input:focus,
.select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input.error,
.select.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.select-wrapper {
  position: relative;
}

.select {
  appearance: none;
  background: white;
  cursor: pointer;
}

.select-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #6b7280;
  pointer-events: none;
  stroke-width: 2;
}

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.help-text {
  color: #6b7280;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f9fafb;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.icon {
  width: 1.2rem;
  height: 1.2rem;
  stroke-width: 2;
}

.spinner {
  width: 1.2rem;
  height: 1.2rem;
  animation: spin 1s linear infinite;
}

/* Empty state */
.empty-state {
  padding: 3rem 2rem;
  text-align: center;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #9ca3af;
  margin-bottom: 1rem;
  stroke-width: 1.5;
}

.empty-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
}

.empty-description {
  margin: 0 0 2rem 0;
  color: #6b7280;
  line-height: 1.5;
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  text-align: center;
}

.loading-spinner p {
  margin-top: 1rem;
  color: #6b7280;
  font-weight: 500;
}

/* Toast */
.toast {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
  z-index: 50;
}

.toast.success {
  background: #10b981;
  color: white;
}

.toast.error {
  background: #ef4444;
  color: white;
}

.toast-icon {
  width: 1.2rem;
  height: 1.2rem;
  stroke-width: 2;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .add-user-container {
    margin: 1rem;
    padding: 0;
  }
  
  .card {
    border-radius: 12px;
  }
  
  .card-header,
  .form {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .toast {
    right: 1rem;
    left: 1rem;
    max-width: calc(100% - 2rem);
  }
  
  .empty-state {
    padding: 2rem 1.5rem;
  }
}

/* Modo oscuro */
@media (prefers-color-scheme: dark) {
  .card {
    background: #1f2937;
    color: #f9fafb;
  }
  
  .label {
    color: #d1d5db;
  }
  
  .input,
  .select {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }
  
  .input::placeholder {
    color: #9ca3af;
  }
  
  .help-text {
    color: #9ca3af;
  }
  
  .btn-secondary {
    background: #374151;
    border-color: #4b5563;
    color: #d1d5db;
  }
  
  .btn-secondary:hover:not(:disabled) {
    background: #4b5563;
    border-color: #6b7280;
  }
  
  .select-icon {
    color: #9ca3af;
  }
  
  .empty-title {
    color: #d1d5db;
  }
  
  .empty-description {
    color: #9ca3af;
  }
  
  .loading-overlay {
    background: rgba(31, 41, 55, 0.9);
  }
  
  .loading-spinner p {
    color: #9ca3af;
  }
}
</style>