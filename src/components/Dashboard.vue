<template>
  <div class="users-roles-container">
    <!-- Sección de Usuarios -->
    <div class="card">
      <div class="card-header">
        <h2 class="title">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Usuarios del Sistema
        </h2>
        <p class="subtitle">Lista de todos los usuarios registrados</p>
      </div>

      <!-- Estado sin usuarios -->
      <div v-if="users.length === 0 && !loadingUsers" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <h3 class="empty-title">No hay usuarios registrados</h3>
        <p class="empty-description">
          Aún no se han registrado usuarios en el sistema.
        </p>
      </div>

      <!-- Lista de usuarios -->
      <div v-else-if="users.length > 0" class="content">
        <div class="user-list">
          <div v-for="user in users" :key="user._id" class="user-item">
            <div class="user-avatar">
              <svg class="avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="user-info">
              <h3 class="user-name">{{ user.firstName }} {{ user.lastName }}</h3>
              <p class="user-details">{{ user.email }}</p>
              <p class="user-details">ID: {{ user.idNumber }}</p>
              <div class="user-role">
                <svg class="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {{ user.role.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading overlay para usuarios -->
      <div v-if="loadingUsers" class="loading-overlay">
        <div class="loading-spinner">
          <svg class="spinner" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4" opacity="0.25"/>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75"/>
          </svg>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    </div>

    <!-- Sección de Roles -->
    <div class="card">
      <div class="card-header">
        <h2 class="title">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Roles Disponibles
        </h2>
        <p class="subtitle">Roles configurados en el sistema</p>
      </div>

      <!-- Estado sin roles -->
      <div v-if="roles.length === 0 && !loadingRoles" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <h3 class="empty-title">No hay roles configurados</h3>
        <p class="empty-description">
          No se han configurado roles en el sistema.
        </p>
      </div>

      <!-- Lista de roles -->
      <div v-else-if="roles.length > 0" class="content">
        <div class="role-grid">
          <div v-for="role in roles" :key="role._id" class="role-item">
            <div class="role-header">
              <svg class="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <h3 class="role-name">{{ role.name }}</h3>
            </div>
            <p v-if="role.description" class="role-description">{{ role.description }}</p>
            <div class="role-stats">
              <span class="users-count">
                {{ getUsersCountByRole(role._id) }} usuario(s)
              </span>
            </div>
          </div>
        </div>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const roles = ref([])
const loadingUsers = ref(true)
const loadingRoles = ref(true)
const notification = ref({ show: false, type: '', message: '' })

const showNotification = (type, message) => {
  notification.value = { show: true, type, message }
  setTimeout(() => {
    notification.value.show = false
  }, 4000)
}

const getUsersCountByRole = (roleId) => {
  return users.value.filter(user => user.role._id === roleId).length
}

const loadUsers = async () => {
  try {
    loadingUsers.value = true
    const uRes = await axios.get('http://localhost:3001/api/users')
    users.value = uRes.data
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
    showNotification('error', 'Error al cargar los usuarios')
  } finally {
    loadingUsers.value = false
  }
}

const loadRoles = async () => {
  try {
    loadingRoles.value = true
    const rRes = await axios.get('http://localhost:3001/api/roles')
    roles.value = rRes.data
  } catch (error) {
    console.error('Error al cargar roles:', error)
    showNotification('error', 'Error al cargar los roles')
  } finally {
    loadingRoles.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadUsers(), loadRoles()])
})
</script>

<style scoped>
.users-roles-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

.content {
  padding: 2rem;
}

/* Estilos para usuarios */
.user-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.user-item:hover {
  background: #f3f4f6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
  stroke-width: 2;
}

.user-info {
  flex-grow: 1;
}

.user-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
}

.user-details {
  margin: 0 0 0.25rem 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.user-role {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Estilos para roles */
.role-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.role-item {
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.role-item:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.role-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.role-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #667eea;
  stroke-width: 2;
}

.role-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
}

.role-description {
  margin: 0 0 1rem 0;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
}

.role-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.users-count {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.icon {
  width: 1.2rem;
  height: 1.2rem;
  stroke-width: 2;
}

.spinner {
  width: 2rem;
  height: 2rem;
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
  margin: 0;
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
  position: fixed;
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
  .users-roles-container {
    margin: 1rem;
    padding: 0;
  }
  
  .card {
    border-radius: 12px;
  }
  
  .card-header,
  .content {
    padding: 1.5rem;
  }
  
  .user-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .user-info {
    text-align: center;
  }
  
  .role-grid {
    grid-template-columns: 1fr;
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
  
  .user-item,
  .role-item {
    background: #374151;
    border-color: #4b5563;
  }
  
  .user-item:hover,
  .role-item:hover {
    background: #4b5563;
  }
  
  .user-name,
  .role-name {
    color: #f9fafb;
  }
  
  .user-details,
  .role-description {
    color: #d1d5db;
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
  
  .role-stats {
    border-top-color: #4b5563;
  }
}
</style>