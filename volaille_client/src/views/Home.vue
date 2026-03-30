<template>
  <div class="home-container">

    <!-- ===== HEADER ===== -->
    <div class="simple-header">
      <div class="simple-header-container">
        <div class="logo">🐔 Fiompiana vorona  <span class="logo-accent">Nohatraraina</span></div>
        <div class="simple-header-right">
          <LanguageSwitcher />
          <router-link to="/login" class="simple-login-btn">🔑 Connexion</router-link>
          <router-link to="/register" class="simple-register-btn">🚀 Inscription</router-link>
        </div>
      </div>
    </div>

    <!-- ===== HERO ===== -->
    <section class="hero">
      <div class="hero-bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      <div class="hero-body">
        <div class="hero-left">
          <h1 class="hero-title">
            Fiompiana vorona<br>
            <span class="hero-accent">Nohatraraina</span>
          </h1>
          <p class="hero-slogan">{{ $t('slogan') }}</p>
          <p class="hero-desc">{{ $t('description') }}</p>
          <div class="hero-btns">
            <router-link to="/register" class="btn-primary">
              🚀 {{ $t('start_free') }}
            </router-link>
            <router-link to="/login" class="btn-outline">
              🔑 {{ $t('login') }}
            </router-link>
          </div>
        </div>

        <div class="hero-right">
          <div class="stats-row">
            <div class="stat-box">
              <span class="stat-num">100%</span>
              <span class="stat-lbl">{{ $t('malagasy') }}</span>
            </div>
            <div class="stat-box">
              <span class="stat-num">24/7</span>
              <span class="stat-lbl">{{ $t('available') }}</span>
            </div>
            <div class="stat-box">
              <span class="stat-num">📱</span>
              <span class="stat-lbl">{{ $t('offline') }}</span>
            </div>
          </div>
          <div class="feature-pill">
            <span class="pill-icon">📈</span>
            <div>
              <div class="pill-title">Suivi journalier automatisé</div>
              <div class="pill-sub">Mortalité · Consommation · Température</div>
            </div>
          </div>
          <div class="feature-pill">
            <span class="pill-icon">💉</span>
            <div>
              <div class="pill-title">Programme vaccinal intelligent</div>
              <div class="pill-sub">Rappels · Historique · Planification</div>
            </div>
          </div>
          <div class="feature-pill">
            <span class="pill-icon">💰</span>
            <div>
              <div class="pill-title">Rentabilité en temps réel</div>
              <div class="pill-sub">Ventes · Marges · Stats mensuelles</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== PROBLÈMES ===== -->
    <section class="section problems-section">
      <div class="container">
        <h2 class="section-title">{{ $t('challenges') }}</h2>
        <p class="section-sub">{{ $t('problems_subtitle') }}</p>
        <div class="problems-grid">
          <div class="problem-card" v-for="p in problems" :key="p.icon">
            <div class="prob-icon-wrap">{{ p.icon }}</div>
            <h3>{{ $t(p.title) }}</h3>
            <p>{{ $t(p.desc) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== SOLUTIONS ===== -->
    <section class="section solutions-section">
      <div class="container">
        <h2 class="section-title">{{ $t('solutions') }}</h2>
        <p class="section-sub">{{ $t('solutions_subtitle') }}</p>
        <div class="solutions-grid">
          <div class="solution-card" v-for="s in solutions" :key="s.icon">
            <div class="sol-icon-wrap">{{ s.icon }}</div>
            <h3>{{ $t(s.title) }}</h3>
            <p>{{ $t(s.desc) }}</p>
            <ul>
              <li v-for="item in s.items" :key="item">
                <span class="check-dot">✓</span> {{ $t(item) }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== ALGORITHMES ===== -->
    <section class="section algo-section">
      <div class="container">
        <h2 class="section-title">{{ $t('smart_algorithms') }}</h2>
        <p class="section-sub algo-sub">{{ $t('auto_calculations') }}</p>
        <div class="algo-grid">
          <div class="algo-card" v-for="a in algos" :key="a.icon">
            <span class="algo-ico">{{ a.icon }}</span>
            <h3>{{ $t(a.title) }}</h3>
            <p>{{ $t(a.desc) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== POURQUOI NOUS ===== -->
    <section class="section why-section">
      <div class="container">
        <h2 class="section-title">{{ $t('why_choose') }}</h2>
        <div class="why-grid">
          <div class="why-card" v-for="w in whys" :key="w.icon">
            <div class="why-icon-circle">{{ w.icon }}</div>
            <h3>{{ $t(w.title) }}</h3>
            <p>{{ $t(w.desc) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA ===== -->
    <section class="cta-section">
      <div class="cta-bg-feather">🐓</div>
      <div class="container cta-inner">
        <h2>{{ $t('ready_title') }}</h2>
        <p>{{ $t('ready_desc') }}</p>
        <router-link to="/register" class="btn-cta-big">
          {{ $t('create_free_account') }} →
        </router-link>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <h3>🐔 {{ $t('app_name') }}</h3>
          <p>{{ $t('footer_subtitle') }}</p>
        </div>
        <div class="footer-col">
          <h4>{{ $t('quick_links') }}</h4>
          <router-link to="/">{{ $t('home') }}</router-link>
          <router-link to="/login">{{ $t('login') }}</router-link>
          <router-link to="/register">{{ $t('register') }}</router-link>
        </div>
        <div class="footer-col">
          <h4>{{ $t('contact') }}</h4>
          <p>📧 tantsaha-mahomby@gmail.com</p>
          <p>📞 +261 34 08 657 98</p>
        </div>
      </div>
      <!-- <div class="footer-bottom">
        <p>{{ $t('copyright') }}</p>
      </div> -->
    </footer>

  </div>
</template>

<script>
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

export default {
  name: 'Home',
  components: { LanguageSwitcher },
  data() {
    return {
      problems: [
        { icon: '📓', title: 'data_loss',         desc: 'data_loss_desc' },
        { icon: '🧮', title: 'wrong_calculations', desc: 'wrong_calculations_desc' },
        { icon: '🔍', title: 'search_difficulty',  desc: 'search_difficulty_desc' },
        { icon: '💊', title: 'no_reminders',       desc: 'no_reminders_desc' },
        { icon: '📦', title: 'stock_management',   desc: 'stock_management_desc' },
        { icon: '📊', title: 'no_overview',        desc: 'no_overview_desc' },
      ],
      solutions: [
        { icon: '📝', title: 'lot_management',         desc: 'lot_management_desc',           items: ['lot_name', 'initial_number', 'arrival_date'] },
        { icon: '📈', title: 'daily_monitoring',       desc: 'daily_monitoring_desc',         items: ['temperature', 'consumption', 'mortality'] },
        { icon: '💉', title: 'vaccine_program',        desc: 'vaccine_program_desc',          items: ['vaccine_planning', 'automatic_reminders', 'vaccine_history'] },
        { icon: '📦', title: 'stock_management_title', desc: 'stock_management_title_desc',   items: ['stock_in_out', 'low_stock_alerts', 'custom_thresholds'] },
        { icon: '💰', title: 'sales_profitability',    desc: 'sales_profitability_desc',      items: ['sales_recording', 'auto_calculation', 'monthly_stats'] },
        { icon: '📊', title: 'dashboard_title',        desc: 'dashboard_desc',                items: ['key_indicators', 'dynamic_charts', 'real_time_alerts'] },
      ],
      algos: [
        { icon: '📊', title: 'mortality_rate_title',    desc: 'mortality_rate_desc' },
        { icon: '⚠️', title: 'stock_alert_title',       desc: 'stock_alert_desc' },
        { icon: '🔍', title: 'smart_search_title',      desc: 'smart_search_desc' },
        { icon: '📅', title: 'age_calculation_title',   desc: 'age_calculation_desc' },
        { icon: '💉', title: 'vaccine_reminder_title',  desc: 'vaccine_reminder_desc' },
        { icon: '📈', title: 'consumption_index_title', desc: 'consumption_index_desc' },
      ],
      whys: [
        { icon: '🌍', title: 'malagasy_100',     desc: 'malagasy_100_desc' },
        { icon: '📴', title: 'offline_mode',     desc: 'offline_mode_desc' },
        { icon: '🔒', title: 'secure_data',      desc: 'secure_data_desc' },
        { icon: '🎯', title: 'simple_intuitive', desc: 'simple_intuitive_desc' },
      ]
    }
  }
}
</script>

<style scoped>
/* ============================================================
   IMPORTS & VARIABLES — Palette fiompiana vorona Soleil
   ============================================================ */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  /* Ambre & Or — plumage doré */
  --amber:        #D97706;
  --amber-light:  #F59E0B;
  --amber-pale:   #FFFBEB;
  --amber-mid:    #FDE68A;

  /* Terracotta — chaleur de la basse-cour */
  --terra:        #C2410C;
  --terra-light:  #FEF2EE;
  --terra-mid:    #FB923C;

  /* Vert prairie — pâturage naturel */
  --green:        #15803D;
  --green-mid:    #22C55E;
  --green-light:  #F0FDF4;
  --green-pale:   #DCFCE7;

  /* Crème & Blé — fond chaleureux */
  --cream:        #FFFDF5;
  --wheat:        #FEF3C7;
  --parchment:    #FDF6E3;

  /* Encre douce — textes */
  --ink:          #292524;
  --ink-soft:     #78716C;
  --ink-muted:    #A8A29E;

  /* Ciel clair — touches fraîches */
  --sky:          #0EA5E9;
  --sky-light:    #E0F2FE;

  --border:       rgba(180,120,50,0.14);
  --radius:       16px;
  --radius-sm:    10px;
  --shadow-warm:  0 4px 24px rgba(217,119,6,0.10);
  --shadow-card:  0 2px 16px rgba(120,80,20,0.08);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

.home-container {
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
  color: var(--ink);
  overflow-x: hidden;
}

/* ============================================================
   HEADER
   ============================================================ */
.simple-header {
  background: linear-gradient(135deg, #7C2D12 0%, #B45309 50%, #92400E 100%);
  border-bottom: 2px solid rgba(251,146,60,0.3);
  padding: 14px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(120,50,10,0.2);
}

.simple-header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.logo {
  font-family: 'Playfair Display', serif;
  font-size: 21px;
  color: #FEF3C7;
  letter-spacing: 0.02em;
}

.logo-accent {
  color: var(--amber-light);
  font-style: italic;
}

.simple-header-right {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.simple-login-btn {
  background: rgba(254,243,199,0.15);
  color: #FEF3C7;
  padding: 8px 20px;
  border-radius: 100px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(254,243,199,0.3);
  transition: all 0.2s;
}

.simple-login-btn:hover {
  background: rgba(254,243,199,0.25);
  border-color: rgba(254,243,199,0.6);
}

.simple-register-btn {
  background: var(--amber-light);
  color: #3B1A00;
  padding: 8px 20px;
  border-radius: 100px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.2s;
  box-shadow: 0 2px 10px rgba(245,158,11,0.35);
}

.simple-register-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(245,158,11,0.45);
}

/* ============================================================
   HERO
   ============================================================ */
.hero {
  background: linear-gradient(150deg, #FFFBEB 0%, #FEF3C7 35%, #FDE68A 70%, #FEF9EE 100%);
  min-height: 580px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  border-bottom: 3px solid rgba(217,119,6,0.15);
}

/* Formes décoratives douces */
.hero-bg-shapes { position: absolute; inset: 0; pointer-events: none; }

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.18;
}

.shape-1 {
  width: 520px; height: 520px;
  background: radial-gradient(circle, #F59E0B, transparent 70%);
  top: -140px; right: -100px;
}

.shape-2 {
  width: 320px; height: 320px;
  background: radial-gradient(circle, #C2410C, transparent 70%);
  bottom: -80px; left: 10%;
}

.shape-3 {
  width: 200px; height: 200px;
  background: radial-gradient(circle, #22C55E, transparent 70%);
  top: 60%; left: 38%;
}

.hero-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 64px 56px 80px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(217,119,6,0.10);
  border: 1px solid rgba(217,119,6,0.25);
  color: #92400E;
  padding: 7px 18px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
  margin-bottom: 28px;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 68px;
  line-height: 1.0;
  font-weight: 900;
  color: #3B1A00;
  margin-bottom: 4px;
}

.hero-accent {
  color: var(--amber);
  display: block;
  font-style: italic;
}

.hero-slogan {
  font-size: 18px;
  color: #6B3A00;
  font-weight: 400;
  margin: 18px 0 10px;
  line-height: 1.55;
}

.hero-desc {
  font-size: 15px;
  color: var(--ink-soft);
  font-weight: 300;
  line-height: 1.7;
  margin-bottom: 36px;
  max-width: 420px;
}

.hero-btns {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, #D97706, #B45309);
  color: white;
  padding: 14px 30px;
  border-radius: 100px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(180,83,9,0.35);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(180,83,9,0.45);
}

.btn-outline {
  background: white;
  color: #92400E;
  padding: 14px 30px;
  border-radius: 100px;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 2px solid rgba(217,119,6,0.3);
  transition: all 0.2s;
}

.btn-outline:hover {
  border-color: var(--amber);
  background: var(--amber-pale);
}

/* Stats row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 14px;
}

.stat-box {
  background: white;
  border: 1px solid rgba(217,119,6,0.15);
  border-radius: var(--radius);
  padding: 22px 14px;
  text-align: center;
  box-shadow: var(--shadow-card);
  transition: transform 0.2s;
}

.stat-box:hover { transform: translateY(-3px); }

.stat-num {
  display: block;
  font-family: 'Playfair Display', serif;
  font-size: 26px;
  font-weight: 700;
  color: var(--amber);
  margin-bottom: 6px;
}

.stat-lbl {
  font-size: 12px;
  color: var(--ink-soft);
  font-weight: 400;
}

/* Feature pills */
.feature-pill {
  background: white;
  border: 1px solid rgba(217,119,6,0.12);
  border-radius: var(--radius);
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 10px;
  box-shadow: var(--shadow-card);
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-pill:hover {
  transform: translateX(4px);
  box-shadow: 0 6px 24px rgba(180,83,9,0.12);
  border-color: rgba(217,119,6,0.28);
}

.pill-icon {
  font-size: 20px;
  width: 44px;
  height: 44px;
  background: var(--wheat);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(217,119,6,0.12);
}

.pill-title {
  font-size: 14px;
  color: var(--ink);
  font-weight: 600;
  margin-bottom: 3px;
}

.pill-sub {
  font-size: 12px;
  color: var(--ink-muted);
}

/* ============================================================
   SECTIONS COMMUNES
   ============================================================ */
.section { padding: 88px 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 56px; }

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.red-badge   { background: #FFF1EE; color: #C2410C; border: 1px solid #FECACA; }
.green-badge { background: var(--green-light); color: var(--green); border: 1px solid var(--green-pale); }
.amber-badge { background: var(--wheat); color: #92400E; border: 1px solid #FDE68A; }
.blue-badge  { background: var(--sky-light); color: #0369A1; border: 1px solid #BAE6FD; }

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 42px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 14px;
  line-height: 1.15;
}

.section-sub {
  font-size: 16px;
  color: var(--ink-soft);
  font-weight: 300;
  line-height: 1.7;
  max-width: 560px;
  margin-bottom: 52px;
}

/* ============================================================
   PROBLÈMES
   ============================================================ */
.problems-section {
  background: white;
  border-top: 1px solid var(--border);
}

.problems-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.problem-card {
  background: #FFFAF7;
  border: 1px solid #FED7AA;
  border-radius: var(--radius);
  padding: 28px 24px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.problem-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(194,65,12,0.10);
  border-color: var(--terra-mid);
}

.prob-icon-wrap {
  width: 50px;
  height: 50px;
  background: #FFF1EE;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 16px;
  border: 1px solid #FECACA;
}

.problem-card h3 {
  font-size: 15px;
  font-weight: 600;
  color: #C2410C;
  margin-bottom: 8px;
}

.problem-card p {
  font-size: 14px;
  color: var(--ink-soft);
  line-height: 1.65;
}

/* ============================================================
   SOLUTIONS
   ============================================================ */
.solutions-section {
  background: var(--parchment);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.solutions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.solution-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px 24px;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.solution-card:hover {
  transform: translateY(-4px);
  border-color: var(--green-mid);
  box-shadow: 0 12px 32px rgba(21,128,61,0.10);
}

.sol-icon-wrap {
  width: 50px;
  height: 50px;
  background: var(--green-light);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 16px;
  border: 1px solid var(--green-pale);
}

.solution-card h3 {
  font-size: 15px;
  font-weight: 600;
  color: var(--green);
  margin-bottom: 8px;
}

.solution-card p {
  font-size: 14px;
  color: var(--ink-soft);
  line-height: 1.65;
  margin-bottom: 14px;
}

.solution-card ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.solution-card li {
  font-size: 13px;
  color: var(--ink-soft);
  display: flex;
  align-items: center;
  gap: 8px;
}

.check-dot {
  width: 20px;
  height: 20px;
  background: var(--green-pale);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--green);
  flex-shrink: 0;
}

/* ============================================================
   ALGORITHMES — fond paille doré
   ============================================================ */
.algo-section {
  background: linear-gradient(135deg, #78350F 0%, #92400E 45%, #A16207 100%);
  position: relative;
  overflow: hidden;
}

.algo-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F59E0B' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

.algo-section .section-title {
  color: #FEF3C7;
}

.algo-sub {
  color: rgba(254,243,199,0.65) !important;
}

.algo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  position: relative;
}

.algo-card {
  background: rgba(255,251,235,0.07);
  border: 1px solid rgba(254,243,199,0.15);
  border-radius: var(--radius);
  padding: 28px 24px;
  transition: background 0.2s, transform 0.2s;
  backdrop-filter: blur(4px);
}

.algo-card:hover {
  background: rgba(255,251,235,0.13);
  transform: translateY(-4px);
  border-color: rgba(254,243,199,0.35);
}

.algo-ico {
  display: block;
  font-size: 26px;
  margin-bottom: 14px;
}

.algo-card h3 {
  font-size: 15px;
  font-weight: 600;
  color: #FDE68A;
  margin-bottom: 8px;
}

.algo-card p {
  font-size: 13px;
  color: rgba(254,243,199,0.55);
  line-height: 1.65;
}

/* ============================================================
   POURQUOI NOUS
   ============================================================ */
.why-section {
  background: white;
  border-top: 1px solid var(--border);
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.why-card {
  text-align: center;
  padding: 36px 20px;
  border: 1.5px solid rgba(217,119,6,0.12);
  border-radius: var(--radius);
  background: var(--amber-pale);
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.why-card:hover {
  transform: translateY(-5px);
  border-color: var(--amber);
  box-shadow: 0 14px 36px rgba(217,119,6,0.12);
  background: white;
}

.why-icon-circle {
  width: 64px;
  height: 64px;
  background: var(--wheat);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 18px;
  border: 2px solid rgba(217,119,6,0.15);
}

.why-card h3 {
  font-size: 15px;
  font-weight: 600;
  color: #3B1A00;
  margin-bottom: 8px;
}

.why-card p {
  font-size: 13px;
  color: var(--ink-soft);
  line-height: 1.65;
}

/* ============================================================
   CTA
   ============================================================ */
.cta-section {
  background: linear-gradient(135deg, #15803D 0%, #166534 60%, #14532D 100%);
  padding: 100px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-bg-feather {
  position: absolute;
  font-size: 280px;
  opacity: 0.06;
  right: -30px;
  top: 50%;
  transform: translateY(-50%) rotate(-15deg);
  pointer-events: none;
  line-height: 1;
}

.cta-inner { position: relative; }

.cta-inner h2 {
  font-family: 'Playfair Display', serif;
  font-size: 46px;
  color: white;
  margin-bottom: 18px;
  line-height: 1.2;
}

.cta-inner p {
  font-size: 17px;
  color: rgba(255,255,255,0.70);
  font-weight: 300;
  margin-bottom: 42px;
  line-height: 1.7;
}

.btn-cta-big {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--amber-light);
  color: #3B1A00;
  padding: 17px 48px;
  border-radius: 100px;
  text-decoration: none;
  font-weight: 700;
  font-size: 17px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(245,158,11,0.30);
}

.btn-cta-big:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.22);
}

/* ============================================================
   FOOTER
   ============================================================ */
.footer {
  background: #2D1810;
  color: white;
  padding: 56px 0 24px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 56px;
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(245,158,11,0.12);
}

.footer-brand h3 {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  color: var(--amber-mid);
  margin-bottom: 12px;
  font-style: italic;
}

.footer-brand p {
  font-size: 14px;
  color: rgba(254,243,199,0.45);
  line-height: 1.7;
  max-width: 300px;
}

.footer-col h4 {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(254,243,199,0.35);
  font-weight: 600;
  margin-bottom: 18px;
}

.footer-col a,
.footer-col p {
  display: block;
  font-size: 14px;
  color: rgba(254,243,199,0.60);
  text-decoration: none;
  margin-bottom: 10px;
  font-weight: 300;
  transition: color 0.2s;
}

.footer-col a:hover { color: var(--amber-mid); }

.footer-bottom {
  text-align: center;
  font-size: 12px;
  color: rgba(254,243,199,0.22);
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 1024px) {
  .why-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 900px) {
  .simple-header-container { padding: 0 24px; flex-direction: column; text-align: center; }
  .hero-body { grid-template-columns: 1fr; gap: 40px; padding: 40px 24px 60px; }
  .hero-title { font-size: 46px; }
  .container { padding: 0 24px; }
  .problems-grid, .solutions-grid, .algo-grid { grid-template-columns: repeat(2, 1fr); }
  .footer-grid { grid-template-columns: 1fr; gap: 32px; }
}

@media (max-width: 600px) {
  .hero-title { font-size: 36px; }
  .section-title { font-size: 30px; }
  .problems-grid, .solutions-grid, .algo-grid, .why-grid { grid-template-columns: 1fr; }
  .hero-btns { flex-direction: column; }
  .stats-row { grid-template-columns: repeat(3, 1fr); }
  .cta-inner h2 { font-size: 32px; }
}
</style>