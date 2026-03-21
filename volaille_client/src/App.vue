<template>
  <div>
    <!-- Menu de navigation pour utilisateurs connectés -->
    <nav v-if="isLoggedIn" class="navbar">
      <div class="nav-container">
        <div class="nav-brand">🐔 {{ $t('app_name') }}</div>
        <div class="nav-links">
          <router-link to="/dashboard">{{ $t('dashboard') }}</router-link>
          <router-link to="/lots">{{ $t('lots') }}</router-link>
          <router-link to="/stock">{{ $t('stock') }}</router-link>
          <router-link to="/vaccins">{{ $t('vaccins') }}</router-link>
          <router-link to="/ventes">{{ $t('ventes') }}</router-link>
          <LanguageSwitcher />
          <button @click="logout" class="logout-btn">{{ $t('logout') }}</button>
        </div>
      </div>
    </nav>
    
    <!-- Contenu principal -->
    <router-view />
    
    <!-- Sélecteur de langue flottant pour toutes les pages -->
    <FloatingLanguageSwitcher />
  </div>
</template>

<script>
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import FloatingLanguageSwitcher from './components/FloatingLanguageSwitcher.vue'

export default {
  components: {
    LanguageSwitcher,
    FloatingLanguageSwitcher
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token')
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/')
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f5f5;
}

.navbar {
  background: #2c3e50;
  padding: 15px;
  color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-brand {
  font-size: 1.2rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 3px;
  transition: background 0.3s;
}

.nav-links a:hover {
  background: #34495e;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 15px;
  cursor: pointer;
  border-radius: 3px;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #c0392b;
}

@media (max-width: 768px) {
  .nav-links {
    gap: 8px;
  }
  
  .nav-links .language-selector .lang-name {
    display: none;
  }
  
  .nav-links .language-selector .lang-selected {
    padding: 8px;
  }
  
  .nav-links .language-selector .dropdown-icon {
    display: none;
  }
}
</style>