<template>
  <div class="container">
    <div class="header-actions">
      <h1>Programme de vaccination</h1>
      <button class="btn btn-success" @click="showAddModal = true">
        + Programmer vaccin
      </button>
    </div>
    
    <!-- Alertes vaccins (Algorithme 11.9) -->
    <div v-if="alertesVaccins.length > 0" class="alert alert-warning">
      <h3>💉 Rappels vaccins à venir</h3>
      <ul>
        <li v-for="alerte in alertesVaccins" :key="alerte.id">
          {{ alerte.message }}
          <button class="btn btn-small" @click="marquerEffectue(alerte.id)">
            Marquer effectué
          </button>
        </li>
      </ul>
    </div>
    
    <!-- Calendrier des vaccins -->
    <div class="card">
      <h2>Vaccins programmés</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Lot</th>
            <th>Type de vaccin</th>
            <th>Date programmée</th>
            <th>Date effectuée</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vaccin in vaccins" :key="vaccin.id">
            <td>{{ vaccin.nom_lot }}</td>
            <td>{{ vaccin.type_vaccin }}</td>
            <td>{{ formatDate(vaccin.date_programmee) }}</td>
            <td>{{ formatDate(vaccin.date_effectuee) }}</td>
            <td>
              <span :class="vaccin.statut === 'effectue' ? 'badge-success' : 'badge-warning'">
                {{ vaccin.statut }}
              </span>
            </td>
            <td>
              <button 
                v-if="vaccin.statut === 'programme'"
                class="btn btn-small" 
                @click="marquerEffectue(vaccin.id)"
              >
                Effectué
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Modal Ajout Vaccin -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h2>Programmer un vaccin</h2>
        
        <form @submit.prevent="saveVaccin">
          <div class="form-group">
            <label>Lot *</label>
            <select v-model="vaccinForm.lot_id" required>
              <option value="">Sélectionner un lot</option>
              <option v-for="lot in lots" :key="lot.id" :value="lot.id">
                {{ lot.nom_lot }} - {{ lot.race }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Type de vaccin *</label>
            <input type="text" v-model="vaccinForm.type_vaccin" required>
          </div>
          
          <div class="form-group">
            <label>Date programmée *</label>
            <input type="date" v-model="vaccinForm.date_programmee" required>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-danger" @click="showAddModal = false">
              Annuler
            </button>
            <button type="submit" class="btn btn-success">
              Programmer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  data() {
    return {
      vaccins: [],
      lots: [],
      alertesVaccins: [],
      showAddModal: false,
      vaccinForm: {
        lot_id: '',
        type_vaccin: '',
        date_programmee: new Date().toISOString().split('T')[0]
      }
    }
  },
  mounted() {
    this.loadVaccins()
    this.loadLots()
    this.loadAlertes()
  },
  methods: {
    async loadVaccins() {
      try {
        const response = await api.get('/vaccins')
        this.vaccins = response.data
      } catch (error) {
        console.error('Erreur chargement vaccins:', error)
      }
    },
    
    async loadLots() {
      try {
        const response = await api.get('/lots')
        this.lots = response.data.filter(l => l.statut === 'actif')
      } catch (error) {
        console.error('Erreur chargement lots:', error)
      }
    },
    
    async loadAlertes() {
      try {
        const response = await api.get('/vaccins/alertes')
        this.alertesVaccins = response.data
      } catch (error) {
        console.error('Erreur chargement alertes:', error)
      }
    },
    
    async saveVaccin() {
      try {
        await api.post('/vaccins', this.vaccinForm)
        
        this.showAddModal = false
        this.vaccinForm = {
          lot_id: '',
          type_vaccin: '',
          date_programmee: new Date().toISOString().split('T')[0]
        }
        this.loadVaccins()
        this.loadAlertes()
      } catch (error) {
        console.error('Erreur programmation vaccin:', error)
      }
    },
    
    async marquerEffectue(id) {
      try {
        await api.put(`/vaccins/${id}/effectuer`)
        this.loadVaccins()
        this.loadAlertes()
      } catch (error) {
        console.error('Erreur mise à jour vaccin:', error)
      }
    },
    
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fr-FR')
    }
  }
}
</script>

<style scoped>
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.badge-success {
  background: #27ae60;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.badge-warning {
  background: #f39c12;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.btn-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
}
</style>