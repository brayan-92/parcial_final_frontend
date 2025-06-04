<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="brand">
          <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="m22 11-3-3m0 0-3 3m3-3v12"/>
          </svg>
          <h1 class="title">Gestión de Usuarios y Roles</h1>
        </div>
        
        <!-- Navigation -->
        <nav class="navigation">
          <router-link to="/roles" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="m22 11-3-3m0 0-3 3m3-3v12"/>
            </svg>
            Agregar Rol
          </router-link>
          
          <router-link to="/usuarios" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Agregar Usuario
          </router-link>
          
          <router-link to="/dashboard" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Vista General
          </router-link>
        </nav>
        
        <!-- Mobile menu button -->
        <button 
          @click="toggleMobileMenu" 
          class="mobile-menu-btn"
          :class="{ 'active': mobileMenuOpen }"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <!-- Mobile navigation -->
      <nav class="mobile-navigation" :class="{ 'open': mobileMenuOpen }">
        <router-link to="/roles" class="mobile-nav-link" @click="closeMobileMenu">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="m22 11-3-3m0 0-3 3m3-3v12"/>
          </svg>
          Agregar Rol
        </router-link>
        
        <router-link to="/usuarios" class="mobile-nav-link" @click="closeMobileMenu">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Agregar Usuario
        </router-link>
        
        <router-link to="/dashboard" class="mobile-nav-link" @click="closeMobileMenu">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          Vista General
        </router-link>
      </nav>
    </header>

    <!-- Main content -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// Close mobile menu when clicking outside or pressing escape
const handleClickOutside = (event) => {
  if (mobileMenuOpen.value && !event.target.closest('.header')) {
    closeMobileMenu()
  }
}

const handleKeyDown = (event) => {
  if (event.key === 'Escape') {
    closeMobileMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: #f8fafc;
}

/* Header */
.header {
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e2e8f0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  width: 2rem;
  height: 2rem;
  color: #667eea;
  stroke-width: 2;
}

.title {
  margin: 0;
  font-size: 1.375rem;
  font-weight: 600;
  color: #1e293b;
}

/* Desktop Navigation */
.navigation {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: #667eea;
  background: #f1f5f9;
}

.nav-link.router-link-active {
  color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-link.router-link-active:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.nav-icon {
  width: 1rem;
  height: 1rem;
  stroke-width: 2;
}

/* Mobile menu button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  gap: 3px;
}

.mobile-menu-btn span {
  width: 22px;
  height: 2px;
  background: #64748b;
  border-radius: 1px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.mobile-menu-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Mobile Navigation */
.mobile-navigation {
  display: none;
  flex-direction: column;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.mobile-navigation.open {
  max-height: 300px;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.mobile-nav-link:hover {
  background: #f1f5f9;
  color: #667eea;
}

.mobile-nav-link.router-link-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

/* Main content */
.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Responsive */
@media (max-width: 768px) {
  .navigation {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .mobile-navigation {
    display: flex;
  }
  
  .header-content {
    padding: 1rem;
  }
  
  .title {
    font-size: 1.125rem;
  }
  
  .brand-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .main-content {
    padding: 1rem;
  }
}

@media (max-width: 640px) {
  .brand {
    gap: 0.5rem;
  }
  
  .title {
    font-size: 1rem;
  }
  
  .mobile-nav-link {
    padding: 0.875rem 1rem;
  }
}

/* Modo oscuro */
@media (prefers-color-scheme: dark) {
  .app-container {
    background: #0f172a;
  }
  
  .header {
    background: #1e293b;
    border-color: #334155;
  }
  
  .title {
    color: #f1f5f9;
  }
  
  .nav-link {
    color: #cbd5e1;
  }
  
  .nav-link:hover {
    color: #8b5cf6;
    background: #334155;
  }
  
  .nav-link.router-link-active {
    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  }
  
  .nav-link.router-link-active:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
  }
  
  .mobile-navigation {
    background: #1e293b;
    border-color: #334155;
  }
  
  .mobile-nav-link {
    color: #cbd5e1;
    border-color: #334155;
  }
  
  .mobile-nav-link:hover {
    background: #334155;
    color: #8b5cf6;
  }
  
  .mobile-nav-link.router-link-active {
    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  }
  
  .mobile-menu-btn span {
    background: #cbd5e1;
  }
}
</style>