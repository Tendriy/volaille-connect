<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-info">
        <div class="info-content">
          <div class="back-home">
            <router-link to="/" class="back-link">
              ← Retour à l'accueil
            </router-link>
          </div>
          <div class="logo">
            <span class="logo-icon">🐔</span>
            <h2>VOLAILLE CONNECT</h2>
          </div>
          <h1>Bienvenue !</h1>
          <p>Connectez-vous pour accéder à votre espace de gestion de ferme avicole</p>
        </div>
      </div>
      
      <div class="login-form">
        <div class="form-card">
          <h2>Connexion</h2>
          <p class="form-subtitle">Accédez à votre compte</p>
          
          <!-- Message d'erreur -->
          <div v-if="errorMessage" class="error-message-box">
            ⚠️ {{ errorMessage }}
          </div>
          
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label>
                <span class="label-icon">📧</span>
                Email
              </label>
              <input 
                type="email" 
                v-model="email" 
                placeholder="votre@email.com"
                required
              >
            </div>
            
            <div class="form-group">
              <label>
                <span class="label-icon">🔒</span>
                Mot de passe
              </label>
              <div class="password-input">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="password" 
                  placeholder="Votre mot de passe"
                  required
                >
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>
            
            <button type="submit" class="btn-login" :disabled="loading">
              <span v-if="loading">⏳ Connexion en cours...</span>
              <span v-else>🔑 Se connecter</span>
            </button>
          </form>
          
          <div class="form-footer">
            <p>Pas encore de compte? <router-link to="/register">Créer un compte gratuit</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      showPassword: false,
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      if (!this.email || !this.password) {
        this.errorMessage = 'Veuillez remplir tous les champs'
        return
      }
      
      this.loading = true
      this.errorMessage = ''
      
      try {
        console.log('Tentative de connexion avec:', this.email)
        
        const response = await api.post('/auth/login', {
          email: this.email,
          password: this.password
        })
        
        console.log('Réponse reçue:', response.data)
        
        // Stocker le token
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // Rediriger vers le tableau de bord
        this.$router.push('/dashboard')
        
      } catch (error) {
        console.error('Erreur complète:', error)
        
        if (error.response) {
          // Le serveur a répondu avec un statut d'erreur
          console.log('Status:', error.response.status)
          console.log('Données:', error.response.data)
          this.errorMessage = error.response.data.error || 'Erreur de connexion'
        } else if (error.request) {
          // La requête a été faite mais pas de réponse
          console.log('Pas de réponse du serveur')
          this.errorMessage = 'Impossible de contacter le serveur. Vérifiez que le backend est démarré sur http://localhost:3000'
        } else {
          // Erreur lors de la configuration
          console.log('Erreur:', error.message)
          this.errorMessage = 'Erreur: ' + error.message
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-wrapper {
  display: flex;
  min-height: 100vh;
}

.login-info {
  flex: 1;
  background: linear-gradient(135deg, rgba(39,174,96,0.95) 0%, rgba(44,62,80,0.95) 100%);
  padding: 50px;
  color: white;
  display: flex;
  align-items: center;
}

.info-content {
  max-width: 500px;
  margin: 0 auto;
}

.back-home {
  margin-bottom: 30px;
}

.back-link {
  color: white;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.3s;
  font-size: 0.9rem;
}

.back-link:hover {
  opacity: 1;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

.logo-icon {
  font-size: 2rem;
}

.logo h2 {
  font-size: 1.5rem;
  margin: 0;
  color: white;
}

.login-info h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.login-info p {
  font-size: 1rem;
  margin-bottom: 30px;
  opacity: 0.9;
  line-height: 1.6;
}

.login-form {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
  background: white;
}

.form-card {
  max-width: 450px;
  width: 100%;
}

.form-card h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 8px;
  text-align: center;
}

.form-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 0.9rem;
}

.error-message-box {
  background: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.label-icon {
  font-size: 1rem;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: #27ae60;
  box-shadow: 0 0 0 3px rgba(39,174,96,0.1);
}

.password-input {
  position: relative;
}

.password-input input {
  width: 100%;
  padding-right: 40px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0;
  opacity: 0.6;
}

.toggle-password:hover {
  opacity: 1;
}

.btn-login {
  width: 100%;
  padding: 12px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-login:hover:not(:disabled) {
  background: #229954;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(39,174,96,0.3);
}

.btn-login:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.form-footer p {
  font-size: 0.9rem;
  color: #666;
}

.form-footer a {
  color: #27ae60;
  text-decoration: none;
  font-weight: 600;
}

.form-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-wrapper {
    flex-direction: column;
  }
  
  .login-info {
    padding: 40px 20px;
  }
  
  .login-form {
    padding: 40px 20px;
  }
  
  .login-info h1 {
    font-size: 1.8rem;
  }
}
</style>