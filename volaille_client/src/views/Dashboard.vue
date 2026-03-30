<template>
  <div class="dashboard-container">

    <!-- ===== HEADER ===== -->
    <div class="dashboard-header">
      <div class="header-left">
        <div class="header-eyebrow">🐔 Fiompiana vorona Nohatraraina</div>
        <h1 class="dashboard-title">{{ $t('dashboard') }}</h1>
        <p class="dashboard-date">{{ currentDate }}</p>
      </div>
      <div class="header-stats-pill">
        <div class="header-stat">
          <span class="stat-value">{{ resume.lots_actifs }}</span>
          <span class="stat-label">{{ $t('active_lots') }}</span>
        </div>
        <div class="pill-divider"></div>
        <div class="header-stat">
          <span class="stat-value">{{ resume.total_volailles }}</span>
          <span class="stat-label">{{ $t('total_poultry') }}</span>
        </div>
      </div>
    </div>

    <!-- ===== ALERTES ===== -->
    <div class="alerts-section">
      <div v-if="alertesStock.length > 0" class="alert-card alert-stock">
        <div class="alert-icon-wrap">⚠️</div>
        <div class="alert-content">
          <h3>{{ $t('stock_alerts') }} <span class="alert-count">{{ alertesStock.length }}</span></h3>
          <ul>
            <li v-for="alerte in alertesStock" :key="alerte.id">
              <span class="alert-dot stock-dot"></span>
              {{ alerte.type_aliment }} : <strong>{{ alerte.quantite }} {{ alerte.unite }}</strong> restants
              <span class="alert-threshold">(seuil : {{ alerte.seuil_alerte }})</span>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="alertesVaccins.length > 0" class="alert-card alert-vaccin">
        <div class="alert-icon-wrap">💉</div>
        <div class="alert-content">
          <h3>{{ $t('vaccine_reminder') }} <span class="alert-count vaccin-count">{{ alertesVaccins.length }}</span></h3>
          <ul>
            <li v-for="alerte in alertesVaccins" :key="alerte.id">
              <span class="alert-dot vaccin-dot"></span>
              {{ alerte.message }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ===== STATS GRID ===== -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon-box green-box">🐔</div>
        <div class="stat-info">
          <h3>{{ $t('active_lots') }}</h3>
          <p class="stat-number">{{ resume.lots_actifs }}</p>
          <span class="stat-trend positive">+{{ lotsActifsThisMonth }} ce mois</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-box amber-box">🐓</div>
        <div class="stat-info">
          <h3>{{ $t('total_poultry') }}</h3>
          <p class="stat-number">{{ resume.total_volailles }}</p>
          <span class="stat-trend">dont {{ totalVolaillesActives }} actifs</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-box orange-box">📦</div>
        <div class="stat-info">
          <h3>{{ $t('stock_alerts') }}</h3>
          <p class="stat-number" :class="{ 'num-warning': resume.alertes_stock > 0 }">
            {{ resume.alertes_stock }}
          </p>
          <span class="stat-trend">{{ stockAlertMessage }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-box red-box">💉</div>
        <div class="stat-info">
          <h3>{{ $t('upcoming_vaccines_count') }}</h3>
          <p class="stat-number" :class="{ 'num-danger': resume.vaccins_programmes > 0 }">
            {{ resume.vaccins_programmes }}
          </p>
          <span class="stat-trend">{{ vaccinAlertMessage }}</span>
        </div>
      </div>
    </div>

    <!-- ===== GRAPHIQUES ===== -->
    <div class="charts-grid">
      <!-- Répartition des lots -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>📊 {{ $t('lots_distribution') }}</h3>
          <span class="chart-badge">{{ lotsTotal }} lots</span>
        </div>
        <div class="pie-chart-container">
          <div class="pie-chart">
            <svg viewBox="0 0 100 100" class="pie-svg">
              <path
                v-for="(segment, index) in lotsPieData"
                :key="index"
                :d="segment.path"
                :fill="segment.color"
                stroke="white"
                stroke-width="2"
              />
              <circle cx="50" cy="50" r="28" fill="#FFFDF5" stroke="#FDE68A" stroke-width="2" />
            </svg>
          </div>
          <div class="pie-legend">
            <div class="legend-item">
              <span class="legend-color" style="background:#15803D"></span>
              <span>{{ $t('active') }}</span>
              <strong>{{ lotsActifs }}</strong>
              <span class="legend-percent">({{ lotsActifsPercent }}%)</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background:#A8A29E"></span>
              <span>{{ $t('closed') }}</span>
              <strong>{{ lotsClosed }}</strong>
              <span class="legend-percent">({{ lotsClosedPercent }}%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- État du stock -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>📦 {{ $t('stock_status') }}</h3>
          <span class="chart-badge">{{ stockTotal }} articles</span>
        </div>
        <div class="pie-chart-container">
          <div class="pie-chart">
            <svg viewBox="0 0 100 100" class="pie-svg">
              <path
                v-for="(segment, index) in stockPieData"
                :key="index"
                :d="segment.path"
                :fill="segment.color"
                stroke="white"
                stroke-width="2"
              />
              <circle cx="50" cy="50" r="28" fill="#FFFDF5" stroke="#FDE68A" stroke-width="2" />
            </svg>
          </div>
          <div class="pie-legend">
            <div class="legend-item">
              <span class="legend-color" style="background:#15803D"></span>
              <span>{{ $t('normal') }}</span>
              <strong>{{ stockNormal }}</strong>
              <span class="legend-percent">({{ stockNormalPercent }}%)</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background:#C2410C"></span>
              <span>{{ $t('low_stock') }}</span>
              <strong>{{ stockLow }}</strong>
              <span class="legend-percent">({{ stockLowPercent }}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== VENTES MENSUELLES ===== -->
    <div class="chart-card full-width">
      <div class="chart-header">
        <h3>💰 {{ $t('monthly_sales') }}</h3>
        <span class="chart-badge total-badge">Total : {{ formatPrice(totalVentes) }} Ar</span>
      </div>
      <div class="bar-chart-container">
        <div v-for="(item, index) in monthlySalesData" :key="index" class="bar-item">
          <div class="bar-label">{{ item.mois }}</div>
          <div class="bar-wrapper">
            <div
              class="bar"
              :style="{
                width: `${(item.total / maxSales) * 100}%`,
                backgroundColor: getBarColor(index)
              }"
            >
              <span class="bar-value">{{ formatPrice(item.total) }} Ar</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== LOTS RÉCENTS ===== -->
    <div class="table-card">
      <div class="card-header">
        <h2>📋 {{ $t('recent_lots') }}</h2>
        <router-link to="/lots" class="btn-link">Voir tous →</router-link>
      </div>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>{{ $t('lot_name') }}</th>
              <th>{{ $t('breed') }}</th>
              <th class="text-center">{{ $t('initial_number') }}</th>
              <th class="text-center">{{ $t('remaining') }}</th>
              <th class="text-center">{{ $t('age') }}</th>
              <th>{{ $t('status') }}</th>
              <th>{{ $t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lot in lotsRecents" :key="lot.id">
              <td class="lot-name">{{ lot.nom_lot }}</td>
              <td>{{ lot.race || '-' }}</td>
              <td class="text-center">{{ lot.nombre_initial }}</td>
              <td class="text-center">
                <span :class="getRestantClass(lot.nombre_restant)">
                  {{ lot.nombre_restant || lot.nombre_initial }}
                </span>
              </td>
              <td class="text-center">{{ lot.age }} {{ $t('days') }}</td>
              <td>
                <span :class="lot.statut === 'actif' ? 'badge-active' : 'badge-closed'">
                  {{ lot.statut === 'actif' ? $t('active') : $t('closed') }}
                </span>
              </td>
              <td>
                <button class="btn-view" @click="voirLot(lot.id)" title="Voir détails">👁️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===== FOOTER STATS ===== -->
    <div class="footer-stats">
      <div class="stat-item-footer">
        <span class="stat-icon-footer amber-ico">📅</span>
        <div>
          <strong>Dernière mise à jour</strong>
          <p>{{ lastUpdate }}</p>
        </div>
      </div>
      <div class="stat-item-footer">
        <span class="stat-icon-footer green-ico">💰</span>
        <div>
          <strong>Chiffre d'affaires total</strong>
          <p>{{ formatPrice(totalVentes) }} Ar</p>
        </div>
      </div>
      <div class="stat-item-footer">
        <span class="stat-icon-footer terra-ico">🐔</span>
        <div>
          <strong>Mortalité moyenne</strong>
          <p>{{ mortaliteMoyenne }}%</p>
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
      resume: {
        lots_actifs: 0,
        total_volailles: 0,
        alertes_stock: 0,
        vaccins_programmes: 0
      },
      lotsRecents: [],
      alertesStock: [],
      alertesVaccins: [],
      allLots: [],
      allStock: [],
      ventesMensuelles: {},
      totalVentes: 0,
      loading: true,
      error: null,
      currentDate: new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  },
  computed: {
    lotsActifs() { return this.allLots.filter(l => l.statut === 'actif').length },
    lotsClosed() { return this.allLots.filter(l => l.statut === 'cloture').length },
    lotsTotal() { return this.allLots.length || 1 },
    lotsActifsPercent() { return ((this.lotsActifs / this.lotsTotal) * 100).toFixed(1) },
    lotsClosedPercent() { return ((this.lotsClosed / this.lotsTotal) * 100).toFixed(1) },
    lotsActifsThisMonth() {
      return this.lotsActifs > 0 ? Math.max(1, this.lotsActifs - this.lotsClosed) : 0
    },
    totalVolaillesActives() {
      return this.allLots.reduce((sum, lot) => {
        return lot.statut === 'actif' ? sum + (lot.nombre_restant || lot.nombre_initial) : sum
      }, 0)
    },
    lotsPieData() {
      const start = -90
      const actifsAngle = (this.lotsActifs / this.lotsTotal) * 360
      const closedAngle = (this.lotsClosed / this.lotsTotal) * 360
      return [
        { path: this.describeArc(50, 50, 40, start, start + actifsAngle), color: '#15803D' },
        { path: this.describeArc(50, 50, 40, start + actifsAngle, start + actifsAngle + closedAngle), color: '#A8A29E' }
      ]
    },
    stockNormal() { return this.allStock.filter(s => s.quantite > s.seuil_alerte).length },
    stockLow() { return this.allStock.filter(s => s.quantite <= s.seuil_alerte).length },
    stockTotal() { return this.allStock.length || 1 },
    stockNormalPercent() { return ((this.stockNormal / this.stockTotal) * 100).toFixed(1) },
    stockLowPercent() { return ((this.stockLow / this.stockTotal) * 100).toFixed(1) },
    stockAlertMessage() {
      if (this.stockLow === 0) return 'Tous les stocks sont suffisants'
      if (this.stockLow === 1) return '1 aliment en stock faible'
      return `${this.stockLow} aliments en stock faible`
    },
    vaccinAlertMessage() {
      if (this.resume.vaccins_programmes === 0) return 'Aucun vaccin à venir'
      if (this.resume.vaccins_programmes === 1) return '1 vaccin dans les 3 jours'
      return `${this.resume.vaccins_programmes} vaccins à venir`
    },
    stockPieData() {
      const start = -90
      const normalAngle = (this.stockNormal / this.stockTotal) * 360
      const lowAngle = (this.stockLow / this.stockTotal) * 360
      return [
        { path: this.describeArc(50, 50, 40, start, start + normalAngle), color: '#15803D' },
        { path: this.describeArc(50, 50, 40, start + normalAngle, start + normalAngle + lowAngle), color: '#C2410C' }
      ]
    },
    monthlySalesData() {
      return Object.entries(this.ventesMensuelles)
        .map(([mois, total]) => ({ mois, total }))
        .sort((a, b) => a.mois.localeCompare(b.mois))
        .slice(-6)
    },
    maxSales() { return Math.max(...this.monthlySalesData.map(d => d.total), 1) },
    mortaliteMoyenne() {
      if (!this.allLots.length) return '0'
      const totalMorts = this.allLots.reduce((s, l) => s + (l.total_morts || 0), 0)
      const totalInitial = this.allLots.reduce((s, l) => s + l.nombre_initial, 0)
      if (!totalInitial) return '0'
      return ((totalMorts / totalInitial) * 100).toFixed(1)
    },
    lastUpdate() { return new Date().toLocaleString('fr-FR') }
  },
  mounted() {
    this.loadDashboardData()
    this.loadAllData()
  },
  methods: {
    async loadDashboardData() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/dashboard/full')
        this.resume = response.data.resume
        this.lotsRecents = response.data.lotsRecents
        this.alertesStock = response.data.alertesStock
        this.alertesVaccins = response.data.alertesVaccins
      } catch (error) {
        this.error = 'Erreur lors du chargement des données'
        await this.loadIndividualRoutes()
      } finally {
        this.loading = false
      }
    },
    async loadIndividualRoutes() {
      try {
        const resumeRes = await api.get('/dashboard')
        this.resume = resumeRes.data
        const lotsRes = await api.get('/dashboard/recent-lots')
        this.lotsRecents = lotsRes.data
        const alertesRes = await api.get('/dashboard/alertes')
        this.alertesStock = alertesRes.data.alertesStock
        this.alertesVaccins = alertesRes.data.alertesVaccins
      } catch (error) {
        console.error('Erreur chargement routes individuelles:', error)
      }
    },
    async loadAllData() {
      try {
        const lotsRes = await api.get('/lots')
        this.allLots = lotsRes.data
        const stockRes = await api.get('/stock')
        this.allStock = stockRes.data
        const ventesRes = await api.get('/ventes')
        if (ventesRes.data.ventes_mensuelles) this.ventesMensuelles = ventesRes.data.ventes_mensuelles
        this.totalVentes = ventesRes.data.chiffre_affaires_total || 0
      } catch (error) {
        console.error('Erreur chargement données complètes:', error)
      }
    },
    getRestantClass(nombre) {
      if (nombre === undefined || nombre === null) return ''
      if (nombre <= 0) return 'text-danger'
      if (nombre < 10) return 'text-warning'
      return 'text-success'
    },
    getBarColor(index) {
      const colors = ['#D97706', '#15803D', '#C2410C', '#0369A1', '#A16207', '#166534']
      return colors[index % colors.length]
    },
    describeArc(x, y, radius, startAngle, endAngle) {
      if (startAngle === endAngle) return ''
      const start = this.polarToCartesian(x, y, radius, endAngle)
      const end = this.polarToCartesian(x, y, radius, startAngle)
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
      return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y, 'L', x, y, 'Z'].join(' ')
    },
    polarToCartesian(cx, cy, r, angle) {
      const rad = (angle - 90) * Math.PI / 180
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
    },
    formatPrice(prix) {
      if (!prix) return '0'
      return new Intl.NumberFormat('fr-FR').format(Math.round(prix))
    },
    voirLot(id) { this.$router.push(`/lots/${id}`) }
  }
}
</script>

<style scoped>
/* ============================================================
   VARIABLES — Palette Volaille Soleil (cohérente avec Home)
   ============================================================ */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --amber:        #D97706;
  --amber-light:  #F59E0B;
  --amber-pale:   #FFFBEB;
  --amber-mid:    #FDE68A;
  --wheat:        #FEF3C7;

  --green:        #15803D;
  --green-mid:    #22C55E;
  --green-light:  #F0FDF4;
  --green-pale:   #DCFCE7;

  --terra:        #C2410C;
  --terra-light:  #FFF1EE;
  --terra-mid:    #FB923C;

  --sky:          #0369A1;
  --sky-light:    #E0F2FE;

  --cream:        #FFFDF5;
  --parchment:    #FDF6E3;

  --ink:          #292524;
  --ink-soft:     #78716C;
  --ink-muted:    #A8A29E;

  --border:       rgba(180,120,50,0.12);
  --radius:       16px;
  --radius-sm:    10px;
  --shadow:       0 2px 16px rgba(120,80,20,0.08);
  --shadow-hover: 0 8px 28px rgba(120,80,20,0.14);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

.dashboard-container {
  font-family: 'DM Sans', sans-serif;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--cream);
  min-height: 100vh;
  color: var(--ink);
}

/* ============================================================
   HEADER
   ============================================================ */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.2rem;
  background: linear-gradient(135deg, #78350F 0%, #92400E 50%, #A16207 100%);
  border-radius: var(--radius);
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 20px rgba(120,50,10,0.18);
}

.header-eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(254,243,199,0.65);
  margin-bottom: 6px;
}

.dashboard-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.9rem;
  font-weight: 700;
  color: #FEF3C7;
  margin-bottom: 4px;
  font-style: italic;
}

.dashboard-date {
  color: rgba(254,243,199,0.55);
  font-size: 0.82rem;
  font-weight: 300;
}

.header-stats-pill {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(254,243,199,0.10);
  border: 1px solid rgba(254,243,199,0.18);
  padding: 0.9rem 1.6rem;
  border-radius: 60px;
  backdrop-filter: blur(4px);
}

.pill-divider {
  width: 1px;
  height: 30px;
  background: rgba(254,243,199,0.2);
}

.header-stat { text-align: center; }

.header-stat .stat-value {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--amber-mid);
  display: block;
  line-height: 1;
  margin-bottom: 4px;
}

.header-stat .stat-label {
  font-size: 0.68rem;
  color: rgba(254,243,199,0.5);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ============================================================
   ALERTES
   ============================================================ */
.alerts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 1rem;
  margin-bottom: 1.8rem;
}

.alert-card {
  background: white;
  border-radius: var(--radius);
  padding: 1.2rem 1.4rem;
  display: flex;
  gap: 1rem;
  box-shadow: var(--shadow);
  border-left: 4px solid;
}

.alert-stock  { border-left-color: var(--amber); }
.alert-vaccin { border-left-color: var(--terra); }

.alert-icon-wrap {
  font-size: 1.8rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--wheat);
  border-radius: 12px;
  flex-shrink: 0;
}

.alert-content { flex: 1; }

.alert-content h3 {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.alert-count {
  background: var(--wheat);
  color: #92400E;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
}

.vaccin-count { background: var(--terra-light); color: var(--terra); }

.alert-content ul { list-style: none; padding: 0; }

.alert-content li {
  font-size: 0.8rem;
  color: var(--ink-soft);
  margin-bottom: 0.45rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.alert-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.stock-dot  { background: var(--amber); }
.vaccin-dot { background: var(--terra); }

.alert-threshold { font-size: 0.7rem; color: var(--ink-muted); }

/* ============================================================
   STATS GRID
   ============================================================ */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1.8rem;
}

.stat-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.3rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover);
}

.stat-icon-box {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  border: 1px solid transparent;
}

.green-box  { background: var(--green-light);  border-color: var(--green-pale); }
.amber-box  { background: var(--amber-pale);   border-color: var(--amber-mid); }
.orange-box { background: #FFF7ED;             border-color: #FED7AA; }
.red-box    { background: var(--terra-light);  border-color: #FECACA; }

.stat-info { flex: 1; }

.stat-info h3 {
  font-size: 0.72rem;
  text-transform: uppercase;
  color: var(--ink-muted);
  letter-spacing: 0.06em;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-number {
  font-family: 'Playfair Display', serif;
  font-size: 2.1rem;
  font-weight: 700;
  color: var(--ink);
  line-height: 1;
  margin-bottom: 4px;
}

.num-warning { color: var(--amber); }
.num-danger  { color: var(--terra); }

.stat-trend {
  font-size: 0.7rem;
  color: var(--ink-muted);
}

.stat-trend.positive { color: var(--green); font-weight: 500; }

/* ============================================================
   CHARTS
   ============================================================ */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.4rem;
  margin-bottom: 1.4rem;
}

.chart-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.4rem;
  box-shadow: var(--shadow);
}

.chart-card.full-width {
  margin-bottom: 1.4rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid var(--border);
}

.chart-header h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--ink);
}

.chart-badge {
  background: var(--wheat);
  color: #92400E;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid rgba(217,119,6,0.15);
}

.total-badge {
  background: var(--green-light);
  color: var(--green);
  border-color: var(--green-pale);
}

.pie-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.pie-chart { width: 170px; height: 170px; }

.pie-svg { width: 100%; height: 100%; transform: rotate(-90deg); }

.pie-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--ink-soft);
}

.legend-color {
  width: 10px; height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-percent { color: var(--ink-muted); font-size: 0.7rem; }

/* Bar chart */
.bar-chart-container { margin-top: 0.5rem; }

.bar-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.7rem;
}

.bar-label {
  width: 70px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--ink-soft);
  flex-shrink: 0;
}

.bar-wrapper {
  flex: 1;
  background: var(--parchment);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.75rem;
  border-radius: 20px;
  transition: width 0.6s ease;
  min-width: 60px;
  height: 34px;
}

.bar-value {
  color: white;
  font-size: 0.68rem;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0,0,0,0.25);
}

/* ============================================================
   TABLE CARD
   ============================================================ */
.table-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.4rem;
  box-shadow: var(--shadow);
  margin-bottom: 1.4rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
  gap: 0.5rem;
}

.card-header h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink);
}

.btn-link {
  color: var(--amber);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  transition: color 0.2s;
}

.btn-link:hover { color: var(--amber-light); text-decoration: underline; }

.table-responsive { overflow-x: auto; }

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem 0.85rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
  font-size: 0.85rem;
}

.table th {
  background: var(--parchment);
  font-weight: 600;
  color: var(--ink-muted);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.table tr:hover { background: var(--amber-pale); }

.lot-name { font-weight: 600; color: var(--ink); }
.text-center { text-align: center; }

.text-success { color: var(--green);  font-weight: 600; }
.text-warning { color: var(--amber);  font-weight: 600; }
.text-danger  { color: var(--terra);  font-weight: 600; }

.badge-active {
  background: var(--green-pale);
  color: var(--green);
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid rgba(21,128,61,0.15);
}

.badge-closed {
  background: #F5F5F4;
  color: var(--ink-muted);
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.btn-view {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background 0.2s;
}

.btn-view:hover { background: var(--wheat); }

/* ============================================================
   FOOTER STATS
   ============================================================ */
.footer-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.2rem;
  box-shadow: var(--shadow);
}

.stat-item-footer {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.6rem 0.8rem;
  border-radius: var(--radius-sm);
  transition: background 0.2s;
}

.stat-item-footer:hover { background: var(--amber-pale); }

.stat-icon-footer {
  font-size: 1.4rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex-shrink: 0;
  border: 1px solid transparent;
}

.amber-ico { background: var(--wheat);        border-color: var(--amber-mid); }
.green-ico { background: var(--green-light);  border-color: var(--green-pale); }
.terra-ico { background: var(--terra-light);  border-color: #FECACA; }

.stat-item-footer strong {
  font-size: 0.7rem;
  color: var(--ink-muted);
  display: block;
  margin-bottom: 3px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.stat-item-footer p {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 768px) {
  .dashboard-container { padding: 1rem; }
  .dashboard-header { flex-direction: column; align-items: stretch; }
  .header-stats-pill { justify-content: center; }
  .alerts-section { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
  .pie-chart { width: 140px; height: 140px; }
  .footer-stats { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
  .dashboard-title { font-size: 1.5rem; }
  .stat-number { font-size: 1.7rem; }
}
</style>