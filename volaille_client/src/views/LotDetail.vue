<template>
  <div class="container" v-if="lot">
    <div class="header-actions">
      <h1>{{ $t('lot_details') }}: {{ lot.nom_lot }}</h1>
      <button class="btn" @click="$router.push('/lots')">{{ $t('back') }}</button>
    </div>
    
    <div class="card">
      <h2>{{ $t('general_info') }}</h2>
      <div class="info-grid">
        <div><strong>{{ $t('breed') }}:</strong> {{ lot.race }}</div>
        <div><strong>{{ $t('supplier') }}:</strong> {{ lot.fournisseur }}</div>
        <div><strong>{{ $t('initial_number') }}:</strong> {{ lot.nombre_initial }}</div>
        <div><strong>{{ $t('arrival_date') }}:</strong> {{ formatDate(lot.date_arrivee) }}</div>
        <div><strong>{{ $t('age') }}:</strong> {{ lot.age }} {{ $t('days') }}</div>
        <div><strong>{{ $t('mortality_rate') }}:</strong> 
          <span :class="getTauxMortaliteClass(lot.taux_mortalite)">
            {{ lot.taux_mortalite || 0 }}%
          </span>
        </div>
        <div><strong>{{ $t('status') }}:</strong> 
          <span :class="lot.statut === 'actif' ? 'badge-actif' : 'badge-cloture'">
            {{ lot.statut === 'actif' ? $t('active') : $t('closed') }}
          </span>
        </div>
      </div>
      
      <div class="actions" v-if="lot.statut === 'actif'">
        <button class="btn btn-success" @click="showSuiviModal = true">
          {{ $t('add_followup') }}
        </button>
        <button class="btn btn-warning" @click="cloturerLot">
          {{ $t('close_lot') }}
        </button>
      </div>
    </div>
    
    <!-- Suivi quotidien -->
    <div class="card">
      <h2>{{ $t('daily_followup') }}</h2>
      <table class="table">
        <thead>
          <tr>
            <th>{{ $t('date') }}</th>
            <th>{{ $t('temperature') }}</th>
            <th>{{ $t('consumption') }} (kg)</th>
            <th>{{ $t('mortality') }}</th>
            <th>{{ $t('observations') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="suivi in suivis" :key="suivi.id">
            <td>{{ formatDate(suivi.date_suivi) }}</td>
            <td>{{ suivi.temperature }}°C</td>
            <td>{{ suivi.consommation_aliment }} kg</td>
            <td>{{ suivi.mortalite_jour }}</td>
            <td>{{ suivi.observations }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Modal Ajout Suivi -->
    <div v-if="showSuiviModal" class="modal">
      <div class="modal-content">
        <h2>{{ $t('add_followup') }}</h2>
        
        <form @submit.prevent="saveSuivi">
          <div class="form-group">
            <label>{{ $t('date') }} *</label>
            <input type="date" v-model="suiviForm.date_suivi" required>
          </div>
          
          <div class="form-group">
            <label>{{ $t('temperature') }} (°C)</label>
            <input type="number" step="0.1" v-model="suiviForm.temperature">
          </div>
          
          <div class="form-group">
            <label>{{ $t('consumption') }} (kg)</label>
            <input type="number" step="0.01" v-model="suiviForm.consommation_aliment">
          </div>
          
          <div class="form-group">
            <label>{{ $t('mortality') }}</label>
            <input type="number" v-model="suiviForm.mortalite_jour" min="0">
          </div>
          
          <div class="form-group">
            <label>{{ $t('observations') }}</label>
            <textarea v-model="suiviForm.observations" rows="3"></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-danger" @click="showSuiviModal = false">
              {{ $t('cancel') }}
            </button>
            <button type="submit" class="btn btn-success">
              {{ $t('save') }}
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
      lot: null,
      suivis: [],
      showSuiviModal: false,
      suiviForm: {
        date_suivi: new Date().toISOString().split('T')[0],
        temperature: '',
        consommation_aliment: '',
        mortalite_jour: 0,
        observations: ''
      }
    }
  },
  mounted() {
    this.loadLot()
    this.loadSuivis()
  },
  methods: {
    async loadLot() {
      try {
        const response = await api.get(`/lots/${this.$route.params.id}`)
        this.lot = response.data
      } catch (error) {
        console.error('Erreur chargement lot:', error)
      }
    },
    
    async loadSuivis() {
      try {
        const response = await api.get(`/suivi/lot/${this.$route.params.id}`)
        this.suivis = response.data
      } catch (error) {
        console.error('Erreur chargement suivis:', error)
      }
    },
    
    async saveSuivi() {
      try {
        await api.post('/suivi', {
          lot_id: this.$route.params.id,
          ...this.suiviForm
        })
        
        this.showSuiviModal = false
        this.loadSuivis()
        this.loadLot()
      } catch (error) {
        console.error('Erreur sauvegarde suivi:', error)
      }
    },
    
    async cloturerLot() {
      if (confirm(this.$t('confirm_close'))) {
        try {
          await api.put(`/lots/${this.$route.params.id}/cloturer`)
          this.loadLot()
        } catch (error) {
          console.error('Erreur clôture lot:', error)
        }
      }
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR')
    },
    
    getTauxMortaliteClass(taux) {
      if (!taux) return ''
      if (taux > 10) return 'taux-eleve'
      if (taux > 5) return 'taux-moyen'
      return 'taux-faible'
    }
  }
}
</script>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
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
  z-index: 1000;
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

.taux-faible {
  color: #27ae60;
  font-weight: bold;
}

.taux-moyen {
  color: #f39c12;
  font-weight: bold;
}

.taux-eleve {
  color: #e74c3c;
  font-weight: bold;
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

.btn-warning {
  background: #f39c12;
  color: white;
}

.btn-warning:hover {
  background: #e67e22;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.table th,
.table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  background: #f8f9fa;
  font-weight: bold;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
</style>