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
          <div class="form-header">
            <div class="form-icon">📝</div>
            <div>
              <h2>Créer un compte</h2>
              <p>{{ $t('register_subtitle') }}</p>
            </div>
          </div>
          
          <!-- Message d'erreur -->
          <div v-if="errorMessage" class="error-message-box">
            ⚠️ {{ errorMessage }}
          </div>
          
          <form @submit.prevent="handleRegister">
            <!-- Nom complet -->
            <div class="form-group">
              <label>{{ $t('full_name') }}</label>
              <div class="input-wrap">
                <span class="input-prefix">👤</span>
                <input 
                  type="text" 
                  v-model="nom_complet" 
                  :placeholder="$t('full_name')"
                  required
                >
              </div>
            </div>
            
            <!-- Nom d'utilisateur -->
            <div class="form-group">
              <label>{{ $t('username') }}</label>
              <div class="input-wrap">
                <span class="input-prefix">@</span>
                <input 
                  type="text" 
                  v-model="username" 
                  :placeholder="$t('username')"
                  required
                >
              </div>
            </div>
            
            <!-- Email -->
            <div class="form-group">
              <label>{{ $t('email') }}</label>
              <div class="input-wrap">
                <span class="input-prefix">📧</span>
                <input 
                  type="email" 
                  v-model="email" 
                  :placeholder="$t('email')"
                  required
                >
              </div>
            </div>
            
            <!-- Mot de passe -->
            <div class="form-group">
              <label>{{ $t('password') }}</label>
              <div class="input-wrap">
                <span class="input-prefix">🔒</span>
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
              <div class="input-wrap">
                <span class="input-prefix">🔒</span>
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
              <span v-else>🚀 {{ $t('register') }}</span>
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
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --amber:       #D97706;
  --amber-light: #F59E0B;
  --amber-pale:  #FFFBEB;
  --amber-mid:   #FDE68A;
  --wheat:       #FEF3C7;
  --green:       #15803D;
  --green-light: #F0FDF4;
  --terra:       #C2410C;
  --cream:       #FFFDF5;
  --parchment:   #FDF6E3;
  --ink:         #292524;
  --ink-soft:    #78716C;
  --ink-muted:   #A8A29E;
  --border:      rgba(180,120,50,0.14);
  --radius:      16px;
  --radius-sm:   10px;
  --shadow:      0 2px 16px rgba(120,80,20,0.08);
  --shadow-lg:   0 8px 40px rgba(120,80,20,0.16);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #78350F 0%, #92400E 50%, #A16207 100%);
  font-family: 'DM Sans', sans-serif;
}

.register-wrapper {
  display: flex;
  min-height: 100vh;
}

/* ============================================================
   PARTIE GAUCHE - INFORMATIONS (STYLE ORANGE)
   ============================================================ */
.register-info {
  flex: 1;
  background: linear-gradient(135deg, rgba(120,53,15,0.95) 0%, rgba(146,64,14,0.95) 50%, rgba(161,98,7,0.95) 100%);
  padding: 50px;
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.register-info::after {
  content: '🐔';
  position: absolute;
  font-size: 200px;
  opacity: 0.05;
  right: -50px;
  bottom: -50px;
  transform: rotate(-15deg);
  pointer-events: none;
}

.info-content {
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.back-home {
  margin-bottom: 30px;
}

.back-link {
  color: rgba(254,243,199,0.8);
  text-decoration: none;
  transition: all 0.3s;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.back-link:hover {
  color: #FEF3C7;
  transform: translateX(-3px);
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
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  margin: 0;
  color: #FEF3C7;
  font-style: italic;
}

.register-info h1 {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #FEF3C7;
}

.register-info p {
  font-size: 1rem;
  margin-bottom: 30px;
  opacity: 0.9;
  line-height: 1.6;
  color: rgba(254,243,199,0.85);
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
  color: rgba(254,243,199,0.9);
}

.feature-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: rgba(254,243,199,0.2);
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.8rem;
  color: #FEF3C7;
}

/* ============================================================
   PARTIE DROITE - FORMULAIRE (STYLE VENTES)
   ============================================================ */
.register-form {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
  background: var(--cream);
}

.form-card {
  max-width: 500px;
  width: 100%;
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border);
  overflow: hidden;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 1.5rem 1.8rem 1rem;
  background: linear-gradient(135deg, #78350F 0%, #92400E 50%, #A16207 100%);
}

.form-icon {
  width: 50px;
  height: 50px;
  background: rgba(254,243,199,0.15);
  border: 1px solid rgba(254,243,199,0.25);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.form-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #FEF3C7;
  font-style: italic;
  margin-bottom: 2px;
}

.form-header p {
  font-size: 12px;
  color: rgba(254,243,199,0.6);
  margin: 0;
}

.form-subtitle {
  text-align: center;
  color: var(--ink-soft);
  margin-bottom: 30px;
  font-size: 0.9rem;
}

.error-message-box {
  background: #FFF1EE;
  border-left: 4px solid var(--terra);
  color: var(--terra);
  padding: 12px 16px;
  margin: 1rem 1.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
}

/* Formulaire */
form {
  padding: 1.5rem 1.8rem;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 7px;
  font-weight: 600;
  font-size: 13px;
  color: var(--ink);
  letter-spacing: 0.02em;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix {
  position: absolute;
  left: 12px;
  font-size: 14px;
  pointer-events: none;
  z-index: 1;
}

.input-wrap input {
  width: 100%;
  padding: 12px 12px 12px 42px;
  border: 1.5px solid rgba(180,120,50,0.22);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  color: var(--ink);
  background: white;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-wrap input::placeholder {
  color: var(--ink-muted);
}

.input-wrap input:focus {
  border-color: var(--amber-light);
  box-shadow: 0 0 0 3px rgba(245,158,11,0.10);
}

/* Password input avec bouton toggle */
.password-input {
  position: relative;
}

.password-input input {
  padding-right: 45px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  opacity: 0.6;
  transition: opacity 0.2s;
  z-index: 2;
}

.toggle-password:hover {
  opacity: 1;
}

/* Force de mot de passe */
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
  background: var(--terra);
}

.strength-medium {
  width: 66%;
  background: var(--amber-light);
}

.strength-strong {
  width: 100%;
  background: var(--green);
}

.strength-text {
  font-size: 0.7rem;
  color: var(--ink-muted);
}

.error-message {
  color: var(--terra);
  font-size: 0.75rem;
  margin-top: 5px;
}

/* Checkbox */
.checkbox {
  margin: 20px 0 25px;
}

.checkbox label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: normal;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--ink-soft);
}

.checkbox input {
  width: 16px;
  height: 16px;
  margin: 0;
  cursor: pointer;
}

.checkbox a {
  color: var(--amber);
  text-decoration: none;
}

.checkbox a:hover {
  text-decoration: underline;
}

/* Bouton d'inscription */
.btn-register {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #D97706, #B45309);
  color: white;
  border: none;
  border-radius: 100px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 3px 12px rgba(180,83,9,0.28);
  margin-bottom: 20px;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(180,83,9,0.38);
}

.btn-register:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Footer */
.form-footer {
  text-align: center;
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid var(--border);
  background: #fafafa;
}

.form-footer p {
  font-size: 0.85rem;
  color: var(--ink-soft);
}

.form-footer a {
  color: var(--amber);
  text-decoration: none;
  font-weight: 600;
}

.form-footer a:hover {
  text-decoration: underline;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 768px) {
  .register-wrapper {
    flex-direction: column;
  }
  
  .register-info {
    padding: 40px 24px;
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
  
  form {
    padding: 1rem 1.2rem;
  }
  
  .form-header {
    padding: 1rem 1.2rem;
  }
  
  .error-message-box {
    margin: 0.8rem 1.2rem;
  }
}
</style>