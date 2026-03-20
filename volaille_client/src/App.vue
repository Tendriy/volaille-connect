<template>
  <div>
    <!-- Menu de navigation pour utilisateurs connectés -->
    <nav v-if="isLoggedIn" class="navbar">
      <div class="nav-container">
        <div class="nav-brand">🐔 VOLAILLE CONNECT</div>
        <div class="nav-links">
          <router-link to="/dashboard">Tableau de bord</router-link>
          <router-link to="/lots">Lots</router-link>
          <router-link to="/stock">Stock</router-link>
          <router-link to="/vaccins">Vaccins</router-link>
          <router-link to="/ventes">Ventes</router-link>
          <button @click="logout" class="logout-btn">Déconnexion</button>
        </div>
      </div>
    </nav>
    
    <!-- Contenu principal -->
    <router-view />
  </div>
</template>

<script>
export default {
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

.nav-links a {
  color: white;
  margin: 0 10px;
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
  margin-left: 10px;
  cursor: pointer;
  border-radius: 3px;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #c0392b;
}
</style>