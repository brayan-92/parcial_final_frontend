<template>
  <div class="add-role-container">
    <div class="card">
      <div class="card-header">
        <h2 class="title">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="m22 11-3-3m0 0-3 3m3-3v12"/>
          </svg>
          Agregar Nuevo Rol
        </h2>
        <p class="subtitle">Crea un nuevo rol para el sistema</p>
      </div>

      <form @submit.prevent="addRole" class="form">
        <div class="form-group">
          <label for="name" class="label">
            Nombre del rol <span class="required">*</span>
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Ej: Administrador, Editor, Usuario..."
            class="input"
            :class="{ 'error': showError && !name.trim() }"
            @input="showError = false"
          />
          <span v-if="showError && !name.trim()" class="error-message">
            El nombre del rol es obligatorio
          </span>
        </div>

        <div class="form-group">
          <label for="description" class="label">Descripción</label>
          <textarea
            id="description"
            v-model="description"
            placeholder="Describe las funciones y permisos de este rol..."
            class="textarea"
            rows="3"
          ></textarea>
          <span class="help-text">Opcional - Ayuda a otros usuarios a entender el propósito del rol</span>
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
            :disabled="loading || !name.trim()"
          >
            <svg v-if="loading" class="spinner" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4" opacity="0.25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75"/>
            </svg>
            <svg v-else class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14m-7-7h14"/>
            </svg>
            {{ loading ? 'Agregando...' : 'Agregar Rol' }}
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const name = ref('')
const description = ref('')
const loading = ref(false)
const showError = ref(false)
const notification = ref({ show: false, type: '', message: '' })

const showNotification = (type, message) => {
  notification.value = { show: true, type, message }
  setTimeout(() => {
    notification.value.show = false
  }, 4000)
}

const clearForm = () => {
  name.value = ''
  description.value = ''
  showError.value = false
}

const addRole = async () => {
  if (!name.value.trim()) {
    showError.value = true
    return
  }

  loading.value = true
  
  try {
    await axios.post('http://localhost:3001/api/roles', {
      name: name.value.trim(),
      description: description.value.trim(),
    })
    
    showNotification('success', '¡Rol agregado exitosamente!')
    clearForm()
  } catch (error) {
    console.error('Error al agregar rol:', error)
    showNotification('error', 'Error al agregar el rol. Inténtalo de nuevo.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.add-role-container {
  max-width: 500px;
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
.textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input:focus,
.textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

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
@media (max-width: 640px) {
  .add-role-container {
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
  .textarea {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }
  
  .input::placeholder,
  .textarea::placeholder {
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
}
</style>