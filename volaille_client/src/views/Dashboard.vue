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
            <li v-for="alerte in alertesStock.slice(0, 5)" :key="alerte.id">
              <span class="alert-dot stock-dot"></span>
              {{ alerte.type_aliment }} : <strong>{{ parseFloat(alerte.quantite).toFixed(2) }} {{ alerte.unite }}</strong> restants
              <span class="alert-threshold">(seuil : {{ alerte.seuil_alerte }})</span>
            </li>
            <li v-if="alertesStock.length > 5" class="more-alerts">
              ... et {{ alertesStock.length - 5 }} autres alertes
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

      <!-- ===== ALERTE MORTALITÉ ÉLEVÉE ===== -->
      <div v-if="lotsMortaliteEleve.length > 0" class="alert-card alert-mortality">
        <div class="alert-icon-wrap"></div>
        <div class="alert-content">
          <h3>⚠️ Alerte mortalité élevée <span class="alert-count mortality-count">{{ lotsMortaliteEleve.length }}</span></h3>
          <ul>
            <li v-for="lot in lotsMortaliteEleve" :key="lot.id">
              <span class="alert-dot mortality-dot"></span>
              <strong>{{ lot.nom_lot }}</strong> ({{ lot.race }}) : 
              <strong class="text-danger">{{ lot.taux_mortalite }}%</strong> de mortalité
              <span class="alert-threshold">({{ lot.total_morts }} morts sur {{ lot.nombre_initial }})</span>
              <button class="btn-view-small" @click="voirLot(lot.id)" title="Voir détails">👁️</button>
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
          <div class="bar-label">{{ formatMoisCourt(item.mois) }}</div>
          <div class="bar-wrapper">
            <div
              class="bar sales-bar"
              :style="{
                width: `${(item.total / maxSales) * 100}%`,
                backgroundColor: getSalesBarColor(index)
              }"
            >
              <span class="bar-value">{{ formatPrice(item.total) }} Ar</span>
            </div>
          </div>
          <div class="bar-value-label">{{ formatPrice(item.total) }} Ar</div>
        </div>
      </div>
      <div v-if="monthlySalesData.length === 0" class="empty-chart">
        <p>Aucune donnée de vente disponible</p>
      </div>
    </div>

    <!-- ===== TAUX DE MORTALITÉ MENSUEL (DIAGRAMME VERTICAL) ===== -->
    <div class="chart-card full-width">
      <div class="chart-header">
        <h3>📉 Taux de mortalité mensuel</h3>
        <span class="chart-badge total-badge">Moyenne : {{ mortaliteMoyenneGlobale }}%</span>
      </div>
      <div class="vertical-bar-chart">
        <div class="chart-y-axis">
          <div class="y-axis-label">Taux de mortalité (%)</div>
          <div class="y-axis-grid">
            <div class="y-tick">20%</div>
            <div class="y-tick">15%</div>
            <div class="y-tick">10%</div>
            <div class="y-tick">5%</div>
            <div class="y-tick">0%</div>
          </div>
        </div>
        <div class="chart-bars-container">
          <div v-for="(item, index) in mortaliteData" :key="index" class="vertical-bar-item">
            <div class="bar-container">
              <div
                class="vertical-bar"
                :style="{
                  height: `${Math.min((item.taux / maxMortalite) * 200, 200)}px`,
                  backgroundColor: getMortalityBarColor(item.taux)
                }"
              >
                <span class="bar-value-top">{{ item.taux }}%</span>
              </div>
            </div>
            <div class="bar-label-x">{{ formatMoisCourt(item.mois) }}</div>
          </div>
        </div>
      </div>
      <div v-if="mortaliteData.length === 0" class="empty-chart">
        <p>Aucune donnée de mortalité disponible</p>
      </div>
    </div>

    <!-- ===== ÉVOLUTION DE LA MORTALITÉ PAR LOT ===== -->
    <div class="chart-card full-width">
      <div class="chart-header">
        <h3>📈 Lots avec mortalité élevée</h3>
        <span class="chart-badge total-badge">Moyenne globale : {{ tauxMortaliteMoyen }}%</span>
      </div>
      <div class="table-responsive">
        <table class="table table-mortality">
          <thead>
            <tr>
              <th>Lot</th>
              <th>Race</th>
              <th class="text-center">Initial</th>
              <th class="text-center">Morts</th>
              <th class="text-center">Taux</th>
              <th>Progression</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lot in lotsMortaliteEleve" :key="lot.id">
              <td class="lot-name">{{ lot.nom_lot }}</td>
              <td>{{ lot.race || '-' }}</td>
              <td class="text-center">{{ lot.nombre_initial }}</td>
              <td class="text-center text-danger">{{ lot.total_morts || 0 }}</td>
              <td class="text-center">
                <span :class="getMortalityClass((lot.total_morts / lot.nombre_initial) * 100)">
                  {{ ((lot.total_morts / lot.nombre_initial) * 100).toFixed(1) }}%
                </span>
              </td>
              <td>
                <div class="mortality-bar-mini">
                  <div class="mortality-fill" :style="{ width: Math.min(((lot.total_morts / lot.nombre_initial) * 100), 100) + '%' }"></div>
                </div>
              </td>
              <td class="text-center">
                <button class="btn-view" @click="voirLot(lot.id)" title="Voir détails">👁️</button>
              </td>
            </tr>
            <tr v-if="lotsMortaliteEleve.length === 0">
              <td colspan="7" class="empty-row">
                <span>✅ Aucun lot avec mortalité élevée</span>
              </td>
            </tr>
          </tbody>
        </table>
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
              <td class="text-center">
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
      mortaliteData: [],
      mortaliteMoyenneGlobale: 0,
      maxMortalite: 0,
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
      const thisMonth = new Date().getMonth()
      const count = this.allLots.filter(l => {
        const created = new Date(l.created_at)
        return l.statut === 'actif' && created.getMonth() === thisMonth
      }).length
      return count || 0
    },
    totalVolaillesActives() {
      return this.allLots.reduce((sum, lot) => {
        if (lot.statut === 'actif') {
          const restant = lot.nombre_restant || (lot.nombre_initial - (lot.total_morts || 0) - (lot.total_vendus || 0))
          return sum + (restant > 0 ? restant : 0)
        }
        return sum
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
    stockNormal() { return this.allStock.filter(s => parseFloat(s.quantite) > parseFloat(s.seuil_alerte)).length },
    stockLow() { return this.allStock.filter(s => parseFloat(s.quantite) <= parseFloat(s.seuil_alerte)).length },
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
        .map(([mois, total]) => ({ mois, total: parseFloat(total) }))
        .sort((a, b) => a.mois.localeCompare(b.mois))
        .slice(-12)
    },
    maxSales() { 
      const max = Math.max(...this.monthlySalesData.map(d => d.total), 1)
      return max === 0 ? 1 : max
    },
    mortaliteMoyenne() {
      if (!this.allLots.length) return '0'
      const totalMorts = this.allLots.reduce((s, l) => s + (parseFloat(l.total_morts) || 0), 0)
      const totalInitial = this.allLots.reduce((s, l) => s + parseFloat(l.nombre_initial), 0)
      if (!totalInitial || totalInitial === 0) return '0'
      return ((totalMorts / totalInitial) * 100).toFixed(1)
    },
    tauxMortaliteMoyen() {
      if (!this.allLots.length) return '0'
      const totalMorts = this.allLots.reduce((s, l) => s + (parseFloat(l.total_morts) || 0), 0)
      const totalInitial = this.allLots.reduce((s, l) => s + parseFloat(l.nombre_initial), 0)
      if (!totalInitial || totalInitial === 0) return '0'
      return ((totalMorts / totalInitial) * 100).toFixed(1)
    },
    lotsMortaliteEleve() {
      return this.allLots.filter(lot => {
        const totalMorts = parseFloat(lot.total_morts) || 0
        const initial = parseFloat(lot.nombre_initial) || 1
        const taux = (totalMorts / initial) * 100
        return lot.statut === 'actif' && taux > 10
      }).map(lot => {
        const totalMorts = parseFloat(lot.total_morts) || 0
        const initial = parseFloat(lot.nombre_initial) || 1
        return {
          ...lot,
          total_morts: totalMorts,
          taux_mortalite: ((totalMorts / initial) * 100).toFixed(1)
        }
      })
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
        this.lotsRecents = response.data.lotsRecents || []
        this.alertesStock = response.data.alertesStock || []
        this.alertesVaccins = response.data.alertesVaccins || []
        this.ventesMensuelles = response.data.ventesMensuelles || {}
        this.totalVentes = response.data.chiffreAffairesTotal || 0
        this.mortaliteData = response.data.mortaliteMensuelle || []
        
        if (this.mortaliteData.length > 0) {
          const total = this.mortaliteData.reduce((sum, m) => sum + (parseFloat(m.taux) || 0), 0)
          this.mortaliteMoyenneGlobale = (total / this.mortaliteData.length).toFixed(1)
          this.maxMortalite = Math.max(...this.mortaliteData.map(m => parseFloat(m.taux) || 0), 1)
        }
      } catch (error) {
        console.error('Erreur chargement dashboard:', error)
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
        this.lotsRecents = lotsRes.data || []
        const alertesRes = await api.get('/dashboard/alertes')
        this.alertesStock = alertesRes.data.alertesStock || []
        this.alertesVaccins = alertesRes.data.alertesVaccins || []
      } catch (error) {
        console.error('Erreur chargement routes individuelles:', error)
      }
    },
    async loadAllData() {
      try {
        const lotsRes = await api.get('/lots')
        this.allLots = lotsRes.data || []
        
        const stockRes = await api.get('/stock')
        this.allStock = stockRes.data || []
        
        if (Object.keys(this.ventesMensuelles).length === 0) {
          const ventesRes = await api.get('/dashboard/ventes-mensuelles')
          this.ventesMensuelles = ventesRes.data.ventes_mensuelles || {}
          this.totalVentes = ventesRes.data.chiffre_affaires_total || 0
        }
        
        if (this.mortaliteData.length === 0) {
          const mortaliteRes = await api.get('/dashboard/mortalite-mensuelle')
          this.mortaliteData = mortaliteRes.data || []
          if (this.mortaliteData.length > 0) {
            const total = this.mortaliteData.reduce((sum, m) => sum + (parseFloat(m.taux) || 0), 0)
            this.mortaliteMoyenneGlobale = (total / this.mortaliteData.length).toFixed(1)
            this.maxMortalite = Math.max(...this.mortaliteData.map(m => parseFloat(m.taux) || 0), 1)
          }
        }
      } catch (error) {
        console.error('Erreur chargement données complètes:', error)
      }
    },
    getRestantClass(nombre) {
      const n = parseFloat(nombre)
      if (isNaN(n)) return ''
      if (n <= 0) return 'text-danger'
      if (n < 10) return 'text-warning'
      return 'text-success'
    },
    getMortalityClass(taux) {
      if (taux <= 5) return 'text-success'
      if (taux <= 10) return 'text-warning'
      return 'text-danger'
    },
    getSalesBarColor(index) {
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
      return colors[index % colors.length]
    },
    getMortalityBarColor(taux) {
      if (taux <= 5) return '#10B981'
      if (taux <= 10) return '#F59E0B'
      return '#EF4444'
    },
    formatMoisCourt(mois) {
      if (!mois) return ''
      const [annee, moisNum] = mois.split('-')
      const moisNoms = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
      return `${moisNoms[parseInt(moisNum) - 1]} ${annee}`
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
      if (!prix || prix === 0) return '0'
      return new Intl.NumberFormat('fr-FR').format(Math.round(parseFloat(prix)))
    },
    voirLot(id) { this.$router.push(`/lots/${id}`) }
  }
}
</script>

<style scoped>
/* ============================================================
   VARIABLES
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

/* ===== HEADER ===== */
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

/* ===== ALERTES ===== */
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
.alert-mortality { border-left-color: #C2410C; background: #FFF1EE; }

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
.mortality-count { background: #C2410C; color: white; }

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
.mortality-dot { background: #C2410C; }

.alert-threshold { font-size: 0.7rem; color: var(--ink-muted); }

.more-alerts {
  color: var(--ink-muted);
  font-style: italic;
  margin-top: 4px;
  padding-left: 20px;
}

.btn-view-small {
  background: none;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
  transition: background 0.2s;
}
.btn-view-small:hover { background: var(--wheat); }

/* ===== STATS GRID ===== */
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

/* ===== CHARTS ===== */
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

/* Bar chart horizontal (ventes) */
.bar-chart-container { margin-top: 0.5rem; }

.bar-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
  padding: 0.3rem 0;
}

.bar-label {
  width: 70px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ink);
  flex-shrink: 0;
}

.bar-wrapper {
  flex: 1;
  background: var(--parchment);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  height: 40px;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1rem;
  border-radius: 8px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 60px;
  height: 40px;
}

.sales-bar {
  background: linear-gradient(90deg, #3B82F6, #60A5FA);
  box-shadow: 0 2px 8px rgba(59,130,246,0.3);
}

.sales-bar:hover {
  filter: brightness(1.05);
  box-shadow: 0 4px 12px rgba(59,130,246,0.4);
}

.bar-value {
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.bar-value-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--ink-soft);
  min-width: 80px;
  text-align: right;
  margin-left: 8px;
}

/* Diagramme vertical pour la mortalité */
.vertical-bar-chart {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  padding: 1rem 0;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
  flex-shrink: 0;
}

.y-axis-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

.y-axis-grid {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 220px;
  position: relative;
}

.y-tick {
  font-size: 0.7rem;
  color: var(--ink-muted);
  text-align: right;
  position: relative;
}

.y-tick::after {
  content: '';
  position: absolute;
  left: 25px;
  right: -40px;
  top: 50%;
  height: 1px;
  background: var(--border);
  z-index: 0;
}

.chart-bars-container {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  gap: 1rem;
  padding-left: 0.5rem;
}

.vertical-bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.bar-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 220px;
  width: 100%;
}

.vertical-bar {
  width: 60px;
  max-width: 80px;
  border-radius: 8px 8px 0 0;
  transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 5px;
  cursor: pointer;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
}

.vertical-bar:hover {
  transform: scaleX(1.05);
  box-shadow: 0 -4px 12px rgba(0,0,0,0.15);
}

.bar-value-top {
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.bar-label-x {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ink);
  text-align: center;
}

@keyframes slideIn {
  from {
    width: 0%;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.bar, .vertical-bar {
  animation: slideIn 0.6s ease-out;
}

.empty-chart {
  text-align: center;
  padding: 2rem;
  color: var(--ink-muted);
}

/* Table mortalité */
.table-mortality td { padding: 0.6rem 0.85rem; }
.mortality-bar-mini {
  width: 100px;
  height: 8px;
  background: var(--parchment);
  border-radius: 10px;
  overflow: hidden;
}
.mortality-fill {
  height: 100%;
  background: linear-gradient(90deg, #C2410C, #FB923C);
  border-radius: 10px;
  transition: width 0.6s ease;
}

/* ===== TABLE CARD ===== */
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

.empty-row {
  text-align: center;
  padding: 2rem;
  color: var(--ink-muted);
}

/* ===== FOOTER STATS ===== */
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

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .dashboard-container { padding: 1rem; }
  .dashboard-header { flex-direction: column; align-items: stretch; }
  .header-stats-pill { justify-content: center; }
  .alerts-section { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
  .pie-chart { width: 140px; height: 140px; }
  .footer-stats { grid-template-columns: 1fr; }
  .bar-item { flex-wrap: wrap; }
  .bar-label { width: 50px; }
  .bar-value-label { min-width: 60px; font-size: 0.65rem; }
  .vertical-bar { width: 40px; }
  .y-axis-grid { height: 180px; }
  .bar-container { height: 180px; }
  .y-tick::after { left: 15px; right: -20px; }
}

@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
  .dashboard-title { font-size: 1.5rem; }
  .stat-number { font-size: 1.7rem; }
  .bar-label { width: 45px; font-size: 0.7rem; }
  .bar { height: 30px; }
  .bar-value { font-size: 0.65rem; }
  .bar-wrapper { height: 30px; }
  .vertical-bar { width: 30px; }
  .bar-label-x { font-size: 0.65rem; }
  .y-axis-grid { height: 150px; }
  .bar-container { height: 150px; }
}
</style>