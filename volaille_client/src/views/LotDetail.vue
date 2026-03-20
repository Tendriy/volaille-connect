<template>
  <div class="container" v-if="lot">
    <div class="header-actions">
      <h1>Détail du lot: {{ lot.nom_lot }}</h1>
      <button class="btn" @click="$router.push('/lots')">Retour</button>
    </div>
    
    <div class="card">
      <h2>Informations générales</h2>
      <div class="info-grid">
        <div><strong>Race:</strong> {{ lot.race }}</div>
        <div><strong>Fournisseur:</strong> {{ lot.fournisseur }}</div>
        <div><strong>Nombre initial:</strong> {{ lot.nombre_initial }}</div>
        <div><strong>Date arrivée:</strong> {{ formatDate(lot.date_arrivee) }}</div>
        <div><strong>Âge:</strong> {{ lot.age }} jours</div>
        <div><strong>Taux mortalité:</strong> 
          <span :class="getTauxMortaliteClass(lot.taux_mortalite)">
            {{ lot.taux_mortalite || 0 }}%
          </span>
        </div>
        <div><strong>Statut:</strong> 
          <span :class="lot.statut === 'actif' ? 'badge-actif' : 'badge-cloture'">
            {{ lot.statut }}
          </span>
        </div>
      </div>
      
      <div class="actions" v-if="lot.statut === 'actif'">
        <button class="btn btn-success" @click="showSuiviModal = true">
          Ajouter suivi quotidien
        </button>
        <button class="btn btn-warning" @click="cloturerLot">
          Clôturer le lot
        </button>
      </div>
    </div>
    
    <!-- Suivi quotidien -->
    <div class="card">
      <h2>Suivi quotidien</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Température</th>
            <th>Consommation (kg)</th>
            <th>Mortalité</th>
            <th>Observations</th>
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
        <h2>Ajouter suivi quotidien</h2>
        
        <form @submit.prevent="saveSuivi">
          <div class="form-group">
            <label>Date *</label>
            <input type="date" v-model="suiviForm.date_suivi" required>
          </div>
          
          <div class="form-group">
            <label>Température (°C)</label>
            <input type="number" step="0.1" v-model="suiviForm.temperature">
          </div>
          
          <div class="form-group">
            <label>Consommation alimentaire (kg)</label>
            <input type="number" step="0.01" v-model="suiviForm.consommation_aliment">
          </div>
          
          <div class="form-group">
            <label>Mortalité du jour</label>
            <input type="number" v-model="suiviForm.mortalite_jour" min="0">
          </div>
          
          <div class="form-group">
            <label>Observations</label>
            <textarea v-model="suiviForm.observations" rows="3"></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-danger" @click="showSuiviModal = false">
              Annuler
            </button>
            <button type="submit" class="btn btn-success">
              Enregistrer
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
        this.loadLot() // Recharger pour mettre à jour le taux de mortalité
      } catch (error) {
        console.error('Erreur sauvegarde suivi:', error)
      }
    },
    
    async cloturerLot() {
      if (confirm('Voulez-vous vraiment clôturer ce lot ?')) {
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
}

.btn-warning:hover {
  background: #e67e22;
}
</style>