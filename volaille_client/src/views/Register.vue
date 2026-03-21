<template>
  <div class="register-container">
    <div class="register-wrapper">
      <!-- Partie gauche - Informations -->
      <div class="register-info">
        <div class="info-content">
          <div class="back-home">
            <router-link to="/" class="back-link">
              ← {{ $t('home') }}
            </router-link>
          </div>
          
          <div class="logo">
            <span class="logo-icon">🐔</span>
            <h2>{{ $t('app_name') }}</h2>
          </div>
          
          <h1>{{ $t('create_account') }}</h1>
          <p>{{ $t('register_subtitle') }}</p>
          
          <div class="features-list">
            <div class="feature">
              <span class="feature-check">✓</span>
              <span>{{ $t('lot_management') }}</span>
            </div>
            <div class="feature">
              <span class="feature-check">✓</span>
              <span>{{ $t('daily_monitoring') }}</span>
            </div>
            <div class="feature">
              <span class="feature-check">✓</span>
              <span>{{ $t('vaccine_program') }}</span>
            </div>
            <div class="feature">
              <span class="feature-check">✓</span>
              <span>{{ $t('dashboard_title') }}</span>
            </div>
            <div class="feature">
              <span class="feature-check">✓</span>
              <span>100% maimaim-poana</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Partie droite - Formulaire -->
      <div class="register-form">
        <div class="form-card">
          <p class="form-subtitle">{{ $t('register_subtitle') }}</p>
          
          <!-- Message d'erreur -->
          <div v-if="errorMessage" class="error-message-box">
            ⚠️ {{ errorMessage }}
          </div>
          
          <form @submit.prevent="handleRegister">
            <!-- Nom complet -->
            <div class="form-group">
              <label>{{ $t('full_name') }}</label>
              <input 
                type="text" 
                v-model="nom_complet" 
                :placeholder="$t('full_name')"
                required
              >
            </div>
            
            <!-- Nom d'utilisateur -->
            <div class="form-group">
              <label>{{ $t('username') }}</label>
              <input 
                type="text" 
                v-model="username" 
                :placeholder="$t('username')"
                required
              >
            </div>
            
            <!-- Email -->
            <div class="form-group">
              <label>{{ $t('email') }}</label>
              <input 
                type="email" 
                v-model="email" 
                :placeholder="$t('email')"
                required
              >
            </div>
            
            <!-- Mot de passe -->
            <div class="form-group">
              <label>{{ $t('password') }}</label>
              <div class="password-input">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="password" 
                  :placeholder="$t('password_min')"
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
              <label>{{ $t('confirm_password') }}</label>
              <div class="password-input">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  v-model="confirmPassword" 
                  :placeholder="$t('confirm_password')"
                  required
                >
                <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
                  {{ showConfirmPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <div v-if="confirmPassword && password !== confirmPassword" class="error-message">
                ⚠️ {{ $t('password_mismatch') }}
              </div>
            </div>
            
            <!-- Acceptation des conditions -->
            <div class="form-group checkbox">
              <label>
                <input type="checkbox" v-model="acceptTerms" required>
                <span>{{ $t('accept_terms') }}</span>
              </label>
            </div>
            
            <!-- Bouton d'inscription -->
            <button 
              type="submit" 
              class="btn-register" 
              :disabled="loading || !acceptTerms || password !== confirmPassword || !password"
            >
              <span v-if="loading">{{ $t('loading') }}</span>
              <span v-else>{{ $t('register') }}</span>
            </button>
          </form>
          
          <div class="form-footer">
            <p>{{ $t('already_account') }} <router-link to="/login">{{ $t('login') }}</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'
import { useI18n } from 'vue-i18n'

export default {
  name: 'Register',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      nom_complet: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      loading: false,
      errorMessage: '',
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
      if (this.passwordStrength <= 1) return this.t('password_weak')
      if (this.passwordStrength <= 2) return this.t('password_medium')
      return this.t('password_strong')
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
      if (this.password !== this.confirmPassword) {
        this.errorMessage = this.t('password_mismatch')
        return
      }
      
      if (this.password.length < 6) {
        this.errorMessage = this.t('password_min_error')
        return
      }
      
      if (!this.acceptTerms) {
        this.errorMessage = this.t('accept_terms_error')
        return
      }
      
      this.loading = true
      this.errorMessage = ''
      
      try {
        const response = await api.post('/auth/register', {
          username: this.username,
          email: this.email,
          password: this.password,
          nom_complet: this.nom_complet
        })
        
        console.log('Inscription réussie:', response.data)
        alert(this.t('register_success'))
        this.$router.push('/login')
        
      } catch (error) {
        console.error('Erreur inscription:', error)
        
        if (error.response) {
          this.errorMessage = error.response.data.error || this.t('error')
        } else if (error.request) {
          this.errorMessage = this.t('server_error')
        } else {
          this.errorMessage = this.t('error')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
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