<template>
  <div class="home-container">
    <!-- Section Hero avec sélecteur de langue -->
    <div class="hero-section">
      <div class="hero-content">
        <!-- Sélecteur de langue en haut à droite -->
        <div class="hero-header">
          <div class="language-wrapper">
            <LanguageSwitcher />
          </div>
        </div>
        
        <div class="hero-text">
          <div class="logo-animation">
            <span class="chicken-icon">🐔</span>
            <span class="chicken-icon">🐓</span>
            <span class="chicken-icon">🥚</span>
          </div>
          <h1>VOLAILLE <span class="highlight">CONNECT</span></h1>
          <p class="slogan">{{ $t('slogan') }}</p>
          <p class="description">{{ $t('description') }}</p>
          <div class="buttons">
            <router-link to="/register" class="btn btn-primary">
              <span>🚀</span> {{ $t('start_free') }}
            </router-link>
            <router-link to="/login" class="btn btn-secondary">
              <span>🔑</span> {{ $t('login') }}
            </router-link>
          </div>
        </div>
        
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-number">100%</div>
            <div class="stat-label">{{ $t('malagasy') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">{{ $t('available') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">📱</div>
            <div class="stat-label">{{ $t('offline') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Problèmes -->
    <div class="problems-section">
      <div class="container">
        <h2>{{ $t('challenges') }}</h2>
        <p class="section-subtitle">{{ $t('problems_subtitle') }}</p>
        <div class="problems-grid">
          <div class="problem-card">
            <div class="problem-icon">📓</div>
            <h3>{{ $t('data_loss') }}</h3>
            <p>{{ $t('data_loss_desc') }}</p>
          </div>
          <div class="problem-card">
            <div class="problem-icon">🧮</div>
            <h3>{{ $t('wrong_calculations') }}</h3>
            <p>{{ $t('wrong_calculations_desc') }}</p>
          </div>
          <div class="problem-card">
            <div class="problem-icon">🔍</div>
            <h3>{{ $t('search_difficulty') }}</h3>
            <p>{{ $t('search_difficulty_desc') }}</p>
          </div>
          <div class="problem-card">
            <div class="problem-icon">💊</div>
            <h3>{{ $t('no_reminders') }}</h3>
            <p>{{ $t('no_reminders_desc') }}</p>
          </div>
          <div class="problem-card">
            <div class="problem-icon">📦</div>
            <h3>{{ $t('stock_management') }}</h3>
            <p>{{ $t('stock_management_desc') }}</p>
          </div>
          <div class="problem-card">
            <div class="problem-icon">📊</div>
            <h3>{{ $t('no_overview') }}</h3>
            <p>{{ $t('no_overview_desc') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Solutions -->
    <div class="solutions-section">
      <div class="container">
        <h2>{{ $t('solutions') }}</h2>
        <p class="section-subtitle">{{ $t('solutions_subtitle') }}</p>
        <div class="solutions-grid">
          <div class="solution-card">
            <div class="solution-icon">📝</div>
            <h3>{{ $t('lot_management') }}</h3>
            <p>{{ $t('lot_management_desc') }}</p>
            <ul>
              <li>✓ {{ $t('lot_name') }}, {{ $t('breed') }}, {{ $t('supplier') }}</li>
              <li>✓ {{ $t('initial_number') }}</li>
              <li>✓ {{ $t('arrival_date') }}</li>
            </ul>
          </div>
          <div class="solution-card">
            <div class="solution-icon">📈</div>
            <h3>{{ $t('daily_monitoring') }}</h3>
            <p>{{ $t('daily_monitoring_desc') }}</p>
            <ul>
              <li>✓ {{ $t('temperature') }}</li>
              <li>✓ {{ $t('consumption') }}</li>
              <li>✓ {{ $t('mortality') }}</li>
            </ul>
          </div>
          <div class="solution-card">
            <div class="solution-icon">💉</div>
            <h3>{{ $t('vaccine_program') }}</h3>
            <p>{{ $t('vaccine_program_desc') }}</p>
            <ul>
              <li>✓ {{ $t('vaccine_planning') }}</li>
              <li>✓ {{ $t('automatic_reminders') }}</li>
              <li>✓ {{ $t('vaccine_history') }}</li>
            </ul>
          </div>
          <div class="solution-card">
            <div class="solution-icon">📦</div>
            <h3>{{ $t('stock_management_title') }}</h3>
            <p>{{ $t('stock_management_title_desc') }}</p>
            <ul>
              <li>✓ {{ $t('stock_in_out') }}</li>
              <li>✓ {{ $t('low_stock_alerts') }}</li>
              <li>✓ {{ $t('custom_thresholds') }}</li>
            </ul>
          </div>
          <div class="solution-card">
            <div class="solution-icon">💰</div>
            <h3>{{ $t('sales_profitability') }}</h3>
            <p>{{ $t('sales_profitability_desc') }}</p>
            <ul>
              <li>✓ {{ $t('sales_recording') }}</li>
              <li>✓ {{ $t('auto_calculation') }}</li>
              <li>✓ {{ $t('monthly_stats') }}</li>
            </ul>
          </div>
          <div class="solution-card">
            <div class="solution-icon">📊</div>
            <h3>{{ $t('dashboard_title') }}</h3>
            <p>{{ $t('dashboard_desc') }}</p>
            <ul>
              <li>✓ {{ $t('key_indicators') }}</li>
              <li>✓ {{ $t('dynamic_charts') }}</li>
              <li>✓ {{ $t('real_time_alerts') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Algorithmes -->
    <div class="algorithms-section">
      <div class="container">
        <h2>{{ $t('smart_algorithms') }}</h2>
        <p class="section-subtitle">{{ $t('auto_calculations') }}</p>
        <div class="algorithms-grid">
          <div class="algo-card">
            <div class="algo-icon">📊</div>
            <h3>{{ $t('mortality_rate_title') }}</h3>
            <p>{{ $t('mortality_rate_desc') }}</p>
          </div>
          <div class="algo-card">
            <div class="algo-icon">⚠️</div>
            <h3>{{ $t('stock_alert_title') }}</h3>
            <p>{{ $t('stock_alert_desc') }}</p>
          </div>
          <div class="algo-card">
            <div class="algo-icon">🔍</div>
            <h3>{{ $t('smart_search_title') }}</h3>
            <p>{{ $t('smart_search_desc') }}</p>
          </div>
          <div class="algo-card">
            <div class="algo-icon">📅</div>
            <h3>{{ $t('age_calculation_title') }}</h3>
            <p>{{ $t('age_calculation_desc') }}</p>
          </div>
          <div class="algo-card">
            <div class="algo-icon">💉</div>
            <h3>{{ $t('vaccine_reminder_title') }}</h3>
            <p>{{ $t('vaccine_reminder_desc') }}</p>
          </div>
          <div class="algo-card">
            <div class="algo-icon">📈</div>
            <h3>{{ $t('consumption_index_title') }}</h3>
            <p>{{ $t('consumption_index_desc') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Pourquoi nous -->
    <div class="why-section">
      <div class="container">
        <h2>{{ $t('why_choose') }}</h2>
        <div class="why-grid">
          <div class="why-card">
            <div class="why-icon">🌍</div>
            <h3>{{ $t('malagasy_100') }}</h3>
            <p>{{ $t('malagasy_100_desc') }}</p>
          </div>
          <div class="why-card">
            <div class="why-icon">📴</div>
            <h3>{{ $t('offline_mode') }}</h3>
            <p>{{ $t('offline_mode_desc') }}</p>
          </div>
          <div class="why-card">
            <div class="why-icon">🔒</div>
            <h3>{{ $t('secure_data') }}</h3>
            <p>{{ $t('secure_data_desc') }}</p>
          </div>
          <div class="why-card">
            <div class="why-icon">🎯</div>
            <h3>{{ $t('simple_intuitive') }}</h3>
            <p>{{ $t('simple_intuitive_desc') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section CTA -->
    <div class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>{{ $t('ready_title') }}</h2>
          <p>{{ $t('ready_desc') }}</p>
          <router-link to="/register" class="btn-cta">
            {{ $t('create_free_account') }}
            <span>→</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3>🐔 {{ $t('app_name') }}</h3>
            <p>{{ $t('footer_subtitle') }}</p>
          </div>
          <div class="footer-links">
            <div class="footer-section">
              <h4>{{ $t('quick_links') }}</h4>
              <router-link to="/">{{ $t('home') }}</router-link>
              <router-link to="/login">{{ $t('login') }}</router-link>
              <router-link to="/register">{{ $t('register') }}</router-link>
            </div>
            <div class="footer-section">
              <h4>{{ $t('contact') }}</h4>
              <p>📧 support@volailleconnect.com</p>
              <p>📞 +261 34 00 000 00</p>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>{{ $t('copyright') }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

export default {
  name: 'Home',
  components: {
    LanguageSwitcher
  }
}
</script>

<style scoped>
/* Gardez tous vos styles CSS existants ici */
.home-container {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 20px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.1)" fill-opacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom;
  background-size: cover;
  opacity: 0.3;
}

.hero-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 40px;
  padding: 20px 0;
}

.language-wrapper {
  position: relative;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-text {
  text-align: center;
  color: white;
}

.logo-animation {
  margin-bottom: 30px;
}

.chicken-icon {
  font-size: 3rem;
  display: inline-block;
  margin: 0 10px;
  animation: bounce 2s infinite;
}

.chicken-icon:nth-child(2) {
  animation-delay: 0.2s;
}

.chicken-icon:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

h1 {
  font-size: 3.5rem;
  margin-bottom: 20px;
}

.highlight {
  color: #f39c12;
}

.slogan {
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 300;
}

.description {
  font-size: 1.1rem;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.9;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 60px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-primary {
  background: #27ae60;
  color: white;
  box-shadow: 0 4px 15px rgba(39,174,96,0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(39,174,96,0.4);
}

.btn-secondary {
  background: rgba(255,255,255,0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-3px);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 50px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #f39c12;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-top: 5px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #2c3e50;
}

.section-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 50px;
  font-size: 1.1rem;
}

.problems-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.problems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.problem-card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.problem-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.problem-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.problem-card h3 {
  color: #e74c3c;
  margin-bottom: 10px;
}

.problem-card p {
  color: #666;
}

.solutions-section {
  padding: 80px 0;
  background: white;
}

.solutions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.solution-card {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 15px;
  transition: all 0.3s;
  border: 1px solid #e0e0e0;
}

.solution-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border-color: #27ae60;
}

.solution-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.solution-card h3 {
  color: #27ae60;
  margin-bottom: 15px;
}

.solution-card p {
  color: #666;
  margin-bottom: 15px;
}

.solution-card ul {
  list-style: none;
  padding: 0;
}

.solution-card li {
  padding: 5px 0;
  color: #888;
  font-size: 0.9rem;
}

.algorithms-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.algorithms-section h2 {
  color: white;
}

.algorithms-section .section-subtitle {
  color: rgba(255,255,255,0.9);
}

.algorithms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.algo-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  color: white;
  transition: all 0.3s;
}

.algo-card:hover {
  transform: translateY(-5px);
  background: rgba(255,255,255,0.2);
}

.algo-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.algo-card h3 {
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.algo-card p {
  font-size: 0.95rem;
  opacity: 0.9;
  line-height: 1.5;
}

.why-section {
  padding: 80px 0;
  background: white;
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.why-card {
  text-align: center;
  padding: 30px;
  border-radius: 15px;
  transition: all 0.3s;
}

.why-card:hover {
  transform: translateY(-5px);
}

.why-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.why-card h3 {
  color: #27ae60;
  margin-bottom: 10px;
}

.why-card p {
  color: #666;
}

.cta-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #27ae60 0%, #2c3e50 100%);
  text-align: center;
}

.cta-content h2 {
  color: white;
  margin-bottom: 20px;
}

.cta-content p {
  color: rgba(255,255,255,0.9);
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: white;
  color: #27ae60;
  padding: 15px 40px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.btn-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.footer {
  background: #2c3e50;
  color: white;
  padding: 50px 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-bottom: 40px;
}

.footer-brand h3 {
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.footer-brand p {
  opacity: 0.8;
}

.footer-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.footer-section h4 {
  margin-bottom: 15px;
  color: #27ae60;
}

.footer-section a {
  display: block;
  color: white;
  text-decoration: none;
  margin-bottom: 10px;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.footer-section a:hover {
  opacity: 1;
}

.footer-section p {
  margin-bottom: 5px;
  opacity: 0.8;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
  opacity: 0.7;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .hero-header {
    margin-bottom: 20px;
  }
  
  .chicken-icon {
    font-size: 2rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .slogan {
    font-size: 1.2rem;
  }
  
  .buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 20px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .solutions-grid,
  .problems-grid,
  .algorithms-grid,
  .why-grid {
    grid-template-columns: 1fr;
  }
}
</style>