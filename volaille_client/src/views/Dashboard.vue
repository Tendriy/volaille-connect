<template>
  <div class="container">
    <h1>Tableau de bord</h1>
    
    <!-- Alertes -->
    <div v-if="alertesStock.length > 0" class="alert alert-warning">
      <h3>⚠️ Alertes Stock</h3>
      <ul>
        <li v-for="alerte in alertesStock" :key="alerte.id">
          {{ alerte.message_alerte }} pour {{ alerte.type_aliment }}
        </li>
      </ul>
    </div>
    
    <div v-if="alertesVaccins.length > 0" class="alert alert-warning">
      <h3>💉 Alertes Vaccins</h3>
      <ul>
        <li v-for="alerte in alertesVaccins" :key="alerte.id">
          {{ alerte.message }}
        </li>
      </ul>
    </div>
    
    <!-- Résumé -->
    <div class="dashboard-grid">
      <div class="card stat-card">
        <h3>Lots actifs</h3>
        <p class="stat-number">{{ resume.lots_actifs }}</p>
      </div>
      
      <div class="card stat-card">
        <h3>Total volailles</h3>
        <p class="stat-number">{{ resume.total_volailles }}</p>
      </div>
      
      <div class="card stat-card">
        <h3>Alertes stock</h3>
        <p class="stat-number">{{ resume.alertes_stock }}</p>
      </div>
      
      <div class="card stat-card">
        <h3>Vaccins à venir</h3>
        <p class="stat-number">{{ resume.vaccins_programmes }}</p>
      </div>
    </div>
    
    <!-- Lots récents -->
    <div class="card">
      <h2>Lots récents</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Nom du lot</th>
            <th>Race</th>
            <th>Nombre initial</th>
            <th>Âge (jours)</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lot in lotsRecents" :key="lot.id">
            <td>{{ lot.nom_lot }}</td>
            <td>{{ lot.race }}</td>
            <td>{{ lot.nombre_initial }}</td>
            <td>{{ lot.age }}</td>
            <td>
              <span :class="lot.statut === 'actif' ? 'badge-actif' : 'badge-cloture'">
                {{ lot.statut }}
              </span>
            </td>
            <td>
              <button class="btn" @click="voirLot(lot.id)">Voir</button>
            </td>
          </tr>
        </tbody>
      </table>
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
      alertesVaccins: []
    }
  },
  mounted() {
    this.loadDashboard()
    this.loadLotsRecents()
    this.loadAlertes()
  },
  methods: {
    async loadDashboard() {
      try {
        const response = await api.get('/dashboard')
        this.resume = response.data
      } catch (error) {
        console.error('Erreur chargement dashboard:', error)
      }
    },
    
    async loadLotsRecents() {
      try {
        const response = await api.get('/lots')
        this.lotsRecents = response.data.slice(0, 5)
      } catch (error) {
        console.error('Erreur chargement lots:', error)
      }
    },
    
    async loadAlertes() {
      try {
        const stockResponse = await api.get('/stock')
        this.alertesStock = stockResponse.data.filter(s => s.alerte)
        
        const vaccinsResponse = await api.get('/vaccins/alertes')
        this.alertesVaccins = vaccinsResponse.data
      } catch (error) {
        console.error('Erreur chargement alertes:', error)
      }
    },
    
    voirLot(id) {
      this.$router.push(`/lots/${id}`)
    }
  }
}
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.stat-card {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-top: 0.5rem;
}

.badge-actif {
  background: #27ae60;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.badge-cloture {
  background: #7f8c8d;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}
</style>