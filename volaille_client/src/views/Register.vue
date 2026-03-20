<template>
  <div class="register-container">
    <div class="register-wrapper">
      <!-- Partie gauche - Informations -->
      <div class="register-info">
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
          
          <h1>Créer un compte</h1>
          <p>Rejoignez notre communauté d'éleveurs et simplifiez la gestion de votre ferme avicole</p>
          
          <div class="features-list">
            <div class="feature">
              <span class="feature-check">✓</span>
              <span>Gestion complète des lots de volailles</span>
            </div>
            <div class="feature">
              <span class="feature-check">✓</span>
              <span>Suivi quotidien automatique</span>
            </div>
            <div class="feature">
              <span class="feature-check">✓</span>
              <span>Alertes et rappels intelligents</span>
            </div>
            <div class="feature">
              <span class="feature-check">✓</span>
              <span>Tableau de bord personnalisé</span>
            </div>
            <div class="feature">
              <span class="feature-check">✓</span>
              <span>100% gratuit et sans engagement</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Partie droite - Formulaire -->
      <div class="register-form">
        <div class="form-card">
          <p class="form-subtitle">Créez votre compte en quelques secondes</p>
          
          <!-- Message d'erreur -->
          <div v-if="errorMessage" class="error-message-box">
            ⚠️ {{ errorMessage }}
          </div>
          
          <form @submit.prevent="handleRegister">
            <!-- Nom complet -->
            <div class="form-group">
              <label>
                <span class="label-icon"></span>
                Nom complet
              </label>
              <input 
                type="text" 
                v-model="nom_complet" 
                placeholder="Votre nom et prénom"
                required
              >
            </div>
            
            <!-- Nom d'utilisateur -->
            <div class="form-group">
              <label>
                <span class="label-icon"></span>
                Nom d'utilisateur
              </label>
              <input 
                type="text" 
                v-model="username" 
                placeholder="Choisissez un pseudo"
                required
              >
            </div>
            
            <!-- Email -->
            <div class="form-group">
              <label>
                <span class="label-icon"></span>
                Email
              </label>
              <input 
                type="email" 
                v-model="email" 
                placeholder="votre@email.com"
                required
              >
            </div>
            
            <!-- Mot de passe -->
            <div class="form-group">
              <label>
                <span class="label-icon"></span>
                Mot de passe
              </label>
              <div class="password-input">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="password" 
                  placeholder="Au moins 6 caractères"
                  required
                  @input="checkPasswordStrength"
                >
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <div class="password-strength" v-if="password">
                <div class="strength-bar" :class="strengthClass"></div>
                <span class="strength-text">{{ strengthText }}</span>
              </div>
            </div>
            
            <!-- Confirmer mot de passe -->
            <div class="form-group">
              <label>
                <span class="label-icon">✓</span>
                Confirmer mot de passe
              </label>
              <div class="password-input">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  v-model="confirmPassword" 
                  placeholder="Confirmez votre mot de passe"
                  required
                >
                <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
                  {{ showConfirmPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <div v-if="confirmPassword && password !== confirmPassword" class="error-message">
                ⚠️ Les mots de passe ne correspondent pas
              </div>
            </div>
            
            <!-- Acceptation des conditions -->
            <div class="form-group checkbox">
              <label>
                <input type="checkbox" v-model="acceptTerms" required>
                <span>J'accepte les <a href="#" @click.prevent="">conditions d'utilisation</a> et la <a href="#" @click.prevent="">politique de confidentialité</a></span>
              </label>
            </div>
            
            <!-- Bouton d'inscription -->
            <button 
              type="submit" 
              class="btn-register" 
              :disabled="loading || !acceptTerms || password !== confirmPassword || !password"
            >
              <span v-if="loading"> Inscription en cours...</span>
              <span v-else> S'inscrire gratuitement</span>
            </button>
          </form>
          
          <div class="form-footer">
            <p>Déjà inscrit? <router-link to="/login">Se connecter</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api' // IMPORTANT: Ajoutez cette ligne

export default {
  name: 'Register',
  data() {
    return {
      nom_complet: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      loading: false,
      errorMessage: '', // Ajouté pour les messages d'erreur
      showPassword: false,
      showConfirmPassword: false,
      passwordStrength: 0
    }
  },
  computed: {
    strengthClass() {
      if (this.passwordStrength <= 1) return 'strength-weak'
      if (this.passwordStrength <= 2) return 'strength-medium'
      return 'strength-strong'
    },
    strengthText() {
      if (this.passwordStrength <= 1) return 'Mot de passe faible'
      if (this.passwordStrength <= 2) return 'Mot de passe moyen'
      return 'Mot de passe fort'
    }
  },
  methods: {
    checkPasswordStrength() {
      let strength = 0
      if (this.password.length >= 8) strength++
      if (this.password.match(/[a-z]/) && this.password.match(/[A-Z]/)) strength++
      if (this.password.match(/[0-9]/)) strength++
      if (this.password.match(/[^a-zA-Z0-9]/)) strength++
      this.passwordStrength = strength
    },
    
    async handleRegister() {
      // Validation
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Les mots de passe ne correspondent pas'
        return
      }
      
      if (this.password.length < 6) {
        this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères'
        return
      }
      
      if (!this.acceptTerms) {
        this.errorMessage = 'Vous devez accepter les conditions d\'utilisation'
        return
      }
      
      this.loading = true
      this.errorMessage = ''
      
      try {
        console.log('Tentative d\'inscription avec:', {
          username: this.username,
          email: this.email,
          nom_complet: this.nom_complet
        })
        
        // Appel réel à l'API
        const response = await api.post('/auth/register', {
          username: this.username,
          email: this.email,
          password: this.password,
          nom_complet: this.nom_complet
        })
        
        console.log('Inscription réussie:', response.data)
        
        // Message de succès
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.')
        
        // Redirection vers la page de connexion
        this.$router.push('/login')
        
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error)
        
        if (error.response) {
          // Le serveur a répondu avec une erreur
          console.log('Status:', error.response.status)
          console.log('Données:', error.response.data)
          this.errorMessage = error.response.data.error || 'Erreur lors de l\'inscription'
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
/* Gardez tous vos styles existants ici */
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-wrapper {
  display: flex;
  min-height: 100vh;
}

.register-info {
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

.register-info h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.register-info p {
  font-size: 1rem;
  margin-bottom: 30px;
  opacity: 0.9;
  line-height: 1.6;
}

.features-list {
  margin: 30px 0;
}

.feature {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.feature-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.8rem;
}

.register-form {
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
  text-align: center;
  font-size: 0.9rem;
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

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"] {
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

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 3px;
  background: #e0e0e0;
  border-radius: 2px;
  margin-bottom: 5px;
  transition: all 0.3s;
}

.strength-weak {
  width: 33%;
  background: #e74c3c;
}

.strength-medium {
  width: 66%;
  background: #f39c12;
}

.strength-strong {
  width: 100%;
  background: #27ae60;
}

.strength-text {
  font-size: 0.7rem;
  color: #888;
}

.error-message {
  color: #e74c3c;
  font-size: 0.75rem;
  margin-top: 5px;
}

.checkbox {
  margin-top: 20px;
  margin-bottom: 25px;
}

.checkbox label {
  display: flex;
  gap: 10px;
  font-weight: normal;
  cursor: pointer;
  font-size: 0.85rem;
}

.checkbox input {
  margin-top: 2px;
  width: auto;
}

.checkbox a {
  color: #27ae60;
  text-decoration: none;
}

.checkbox a:hover {
  text-decoration: underline;
}

.btn-register {
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

.btn-register:hover:not(:disabled) {
  background: #229954;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(39,174,96,0.3);
}

.btn-register:disabled {
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
  .register-wrapper {
    flex-direction: column;
  }
  
  .register-info {
    padding: 40px 20px;
  }
  
  .register-form {
    padding: 40px 20px;
  }
  
  .register-info h1 {
    font-size: 1.8rem;
  }
  
  .features-list {
    margin: 20px 0;
  }
  
  .feature {
    font-size: 0.85rem;
  }
  
  .form-subtitle {
    font-size: 0.85rem;
  }
}
</style>