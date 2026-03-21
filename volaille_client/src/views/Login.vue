<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-info">
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
          <h1>{{ $t('welcome') }} !</h1>
          <p>{{ $t('login_subtitle') }}</p>
        </div>
      </div>
      
      <div class="login-form">
        <div class="form-card">
          <h2>{{ $t('login_title') }}</h2>
          <p class="form-subtitle">{{ $t('login_subtitle') }}</p>
          
          <div v-if="errorMessage" class="error-message-box">
            ⚠️ {{ errorMessage }}
          </div>
          
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label>{{ $t('email') }}</label>
              <input 
                type="email" 
                v-model="email" 
                :placeholder="$t('email')"
                required
              >
            </div>
            
            <div class="form-group">
              <label>{{ $t('password') }}</label>
              <div class="password-input">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="password" 
                  :placeholder="$t('password')"
                  required
                >
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>
            
            <button type="submit" class="btn-login" :disabled="loading">
              <span v-if="loading">{{ $t('loading') }}</span>
              <span v-else>🔑 {{ $t('login') }}</span>
            </button>
          </form>
          
          <div class="form-footer">
            <p>{{ $t('no_account') }} <router-link to="/register">{{ $t('create_account') }}</router-link></p>
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
  setup() {
    const { t } = useI18n()
    return { t }
  },
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
        this.errorMessage = this.t('error')
        return
      }
      
      this.loading = true
      this.errorMessage = ''
      
      try {
        const response = await api.post('/auth/login', {
          email: this.email,
          password: this.password
        })
        
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        this.$router.push('/dashboard')
        
      } catch (error) {
        console.error('Erreur:', error)
        
        if (error.response) {
          this.errorMessage = error.response.data.error || this.t('error')
        } else if (error.request) {
          this.errorMessage = 'Impossible de contacter le serveur'
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
/* Vos styles existants pour Login */
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
}

.login-info h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.login-info p {
  font-size: 1rem;
  margin-bottom: 30px;
  opacity: 0.9;
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
  text-align: center;
  color: #2c3e50;
  margin-bottom: 10px;
}

.form-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.error-message-box {
  background: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
}

.form-group input:focus {
  outline: none;
  border-color: #27ae60;
}

.password-input {
  position: relative;
}

.password-input input {
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
}

.btn-login:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.form-footer a {
  color: #27ae60;
  text-decoration: none;
  font-weight: 600;
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