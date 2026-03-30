<template>
  <div class="login-container">

    <!-- Panneau gauche — identité visuelle -->
    <div class="login-info">
      <div class="info-bg-shapes">
        <div class="shape s1"></div>
        <div class="shape s2"></div>
        <div class="shape s3"></div>
      </div>
      <div class="info-content">
        <div class="back-home">
          <router-link to="/" class="back-link">← {{ $t('home') }}</router-link>
        </div>
        <div class="logo">
          <span class="logo-icon">🐔</span>
          <h2>Fiompiana Vorona  <span class="logo-accent">Nohatraraina</span></h2>
        </div>
        <h1>{{ $t('welcome') }}&nbsp;!</h1>
        <p class="info-desc">{{ $t('login_subtitle') }}</p>

        <div class="info-features">
          <div class="feature-row">
            <span class="feat-ico">📈</span>
            <span>Suivi journalier automatisé</span>
          </div>
          <div class="feature-row">
            <span class="feat-ico">💉</span>
            <span>Programme vaccinal intelligent</span>
          </div>
          <div class="feature-row">
            <span class="feat-ico">💰</span>
            <span>Rentabilité en temps réel</span>
          </div>
          <div class="feature-row">
            <span class="feat-ico">📴</span>
            <span>Disponible hors ligne</span>
          </div>
        </div>

        <div class="info-badge">🇲🇬 Solution 100% Malagasy</div>
      </div>
    </div>

    <!-- Panneau droit — formulaire -->
    <div class="login-form-panel">
      <div class="form-card">

        <div class="form-top">
          <div class="form-logo-mini">🐔</div>
          <h2>{{ $t('login_title') }}</h2>
          <p class="form-subtitle">{{ $t('login_subtitle') }}</p>
        </div>

        <div v-if="errorMessage" class="error-box">
          <span class="error-icon">⚠️</span>
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>{{ $t('email') }}</label>
            <div class="input-wrap">
              <span class="input-prefix">✉️</span>
              <input
                type="email"
                v-model="email"
                :placeholder="$t('email')"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label>{{ $t('password') }}</label>
            <div class="input-wrap">
              <span class="input-prefix">🔒</span>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                :placeholder="$t('password')"
                required
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <button type="submit" class="btn-login" :disabled="loading">
            <span v-if="loading" class="spinner">⏳</span>
            <span v-else>🔑 {{ $t('login') }}</span>
          </button>
        </form>

        <div class="form-footer">
          <p>{{ $t('no_account') }}
            <router-link to="/register">{{ $t('create_account') }}</router-link>
          </p>
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
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --amber:       #D97706;
  --amber-light: #F59E0B;
  --amber-pale:  #FFFBEB;
  --amber-mid:   #FDE68A;
  --wheat:       #FEF3C7;

  --green:       #15803D;
  --green-light: #F0FDF4;
  --green-pale:  #DCFCE7;

  --terra:       #C2410C;
  --terra-light: #FFF1EE;

  --cream:       #FFFDF5;
  --parchment:   #FDF6E3;

  --ink:         #292524;
  --ink-soft:    #78716C;
  --ink-muted:   #A8A29E;

  --border:      rgba(180,120,50,0.14);
  --radius:      16px;
  --shadow:      0 2px 20px rgba(120,80,20,0.10);
  --shadow-lg:   0 8px 40px rgba(120,80,20,0.16);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

.login-container {
  font-family: 'DM Sans', sans-serif;
  display: flex;
  min-height: 100vh;
}

/* ============================================================
   PANNEAU GAUCHE
   ============================================================ */
.login-info {
  flex: 1.1;
  background: linear-gradient(150deg, #78350F 0%, #92400E 45%, #A16207 100%);
  padding: 56px 64px;
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* Formes décoratives */
.info-bg-shapes { position: absolute; inset: 0; pointer-events: none; }

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.12;
}

.s1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #F59E0B, transparent 70%);
  top: -180px; right: -120px;
}

.s2 {
  width: 280px; height: 280px;
  background: radial-gradient(circle, #FDE68A, transparent 70%);
  bottom: -60px; left: -60px;
}

.s3 {
  width: 160px; height: 160px;
  background: radial-gradient(circle, #22C55E, transparent 70%);
  bottom: 30%; right: 10%;
}

.info-content {
  position: relative;
  max-width: 460px;
  margin: 0 auto;
  width: 100%;
}

.back-link {
  color: rgba(254,243,199,0.65);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.back-link:hover { color: #FEF3C7; }

.back-home { margin-bottom: 36px; }

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.logo-icon { font-size: 2rem; }

.logo h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: #FEF3C7;
  font-weight: 700;
}

.logo-accent {
  color: var(--amber-mid);
  font-style: italic;
}

.login-info h1 {
  font-family: 'Playfair Display', serif;
  font-size: 2.8rem;
  font-weight: 900;
  color: white;
  line-height: 1.1;
  margin-bottom: 16px;
}

.info-desc {
  font-size: 15px;
  color: rgba(254,243,199,0.7);
  font-weight: 300;
  line-height: 1.7;
  margin-bottom: 36px;
}

.info-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 36px;
}

.feature-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: rgba(254,243,199,0.80);
  font-weight: 400;
}

.feat-ico {
  width: 36px;
  height: 36px;
  background: rgba(254,243,199,0.10);
  border: 1px solid rgba(254,243,199,0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.info-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(254,243,199,0.10);
  border: 1px solid rgba(254,243,199,0.20);
  color: rgba(254,243,199,0.80);
  padding: 8px 18px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

/* ============================================================
   PANNEAU DROIT — FORMULAIRE
   ============================================================ */
.login-form-panel {
  flex: 1;
  background: var(--cream);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 40px;
  position: relative;
}

/* Texture subtile */
.login-form-panel::before {
  content: '🐓';
  position: absolute;
  font-size: 220px;
  opacity: 0.03;
  bottom: -20px;
  right: -20px;
  pointer-events: none;
  line-height: 1;
}

.form-card {
  max-width: 440px;
  width: 100%;
  position: relative;
}

/* En-tête du formulaire */
.form-top {
  text-align: center;
  margin-bottom: 32px;
}

.form-logo-mini {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #78350F, #A16207);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 18px;
  box-shadow: 0 4px 16px rgba(120,50,10,0.25);
}

.form-card h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 14px;
  color: var(--ink-muted);
  font-weight: 300;
  line-height: 1.6;
}

/* Erreur */
.error-box {
  background: var(--terra-light);
  border: 1px solid #FECACA;
  color: var(--terra);
  padding: 12px 16px;
  border-radius: var(--radius);
  margin-bottom: 22px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-icon { font-size: 16px; flex-shrink: 0; }

/* Champs */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
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
  left: 14px;
  font-size: 15px;
  pointer-events: none;
  z-index: 1;
}

.input-wrap input {
  width: 100%;
  padding: 12px 14px 12px 44px;
  border: 1.5px solid rgba(180,120,50,0.22);
  border-radius: var(--radius);
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  color: var(--ink);
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.input-wrap input::placeholder { color: var(--ink-muted); }

.input-wrap input:focus {
  border-color: var(--amber);
  box-shadow: 0 0 0 3px rgba(217,119,6,0.10);
}

.toggle-password {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
  border-radius: 6px;
  transition: background 0.2s;
}

.toggle-password:hover { background: var(--wheat); }

/* Bouton */
.btn-login {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #D97706, #B45309);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: 15px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  box-shadow: 0 4px 18px rgba(180,83,9,0.30);
  margin-top: 8px;
  letter-spacing: 0.02em;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(180,83,9,0.40);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spinner { display: inline-block; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Footer */
.form-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 22px;
  border-top: 1px solid var(--border);
  font-size: 13px;
  color: var(--ink-soft);
}

.form-footer a {
  color: var(--amber);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.form-footer a:hover { color: var(--amber-light); text-decoration: underline; }

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 860px) {
  .login-container { flex-direction: column; }

  .login-info {
    padding: 40px 28px;
    min-height: auto;
  }

  .login-info h1 { font-size: 2rem; }

  .login-form-panel {
    padding: 40px 24px;
  }
}

@media (max-width: 480px) {
  .login-info { padding: 32px 20px; }
  .login-info h1 { font-size: 1.7rem; }
  .login-form-panel { padding: 32px 16px; }
}
</style>