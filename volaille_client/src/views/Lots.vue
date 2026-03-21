<template>
  <div class="container">
    <div class="header-actions">
      <h1>{{ $t('lots') }}</h1>
      <button class="btn btn-success" @click="showAddModal = true">
        + {{ $t('new_lot') }}
      </button>
    </div>
    
    <!-- Recherche -->
    <div class="card">
      <div class="form-group">
        <label>{{ $t('search_lot') }}</label>
        <input 
          type="text" 
          v-model="recherche" 
          :placeholder="$t('search_lot')"
          @input="rechercherLots"
        >
      </div>
    </div>
    
    <!-- Liste des lots -->
    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>{{ $t('lot_name') }}</th>
            <th>{{ $t('breed') }}</th>
            <th>{{ $t('supplier') }}</th>
            <th>{{ $t('initial_number') }}</th>
            <th>{{ $t('arrival_date') }}</th>
            <th>{{ $t('age') }}</th>
            <th>{{ $t('mortality_rate') }}</th>
            <th>{{ $t('status') }}</th>
            <th>{{ $t('actions') }}</th>
           </tr>
        </thead>
        <tbody>
          <tr v-for="lot in lotsFiltres" :key="lot.id">
            <td>{{ lot.nom_lot }}</td>
            <td>{{ lot.race }}</td>
            <td>{{ lot.fournisseur }}</td>
            <td>{{ lot.nombre_initial }}</td>
            <td>{{ formatDate(lot.date_arrivee) }}</td>
            <td>{{ lot.age }} {{ $t('days') }}</td>
            <td>
              <span :class="getTauxMortaliteClass(lot.taux_mortalite)">
                {{ lot.taux_mortalite || 0 }}%
              </span>
            </td>
            <td>
              <span :class="lot.statut === 'actif' ? 'badge-actif' : 'badge-cloture'">
                {{ lot.statut === 'actif' ? $t('active') : $t('closed') }}
              </span>
            </td>
            <td>
              <button class="btn" @click="voirLot(lot.id)">{{ $t('view') }}</button>
              <button class="btn btn-danger" @click="confirmerSuppression(lot)">{{ $t('delete') }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Modal Ajout Lot -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h2>{{ editingLot ? $t('edit_lot') : $t('new_lot') }}</h2>
        
        <form @submit.prevent="saveLot">
          <div class="form-group">
            <label>{{ $t('lot_name') }} *</label>
            <input type="text" v-model="lotForm.nom_lot" required>
          </div>
          
          <div class="form-group">
            <label>{{ $t('breed') }}</label>
            <input type="text" v-model="lotForm.race">
          </div>
          
          <div class="form-group">
            <label>{{ $t('supplier') }}</label>
            <input type="text" v-model="lotForm.fournisseur">
          </div>
          
          <div class="form-group">
            <label>{{ $t('initial_number') }} *</label>
            <input type="number" v-model="lotForm.nombre_initial" required min="1">
          </div>
          
          <div class="form-group">
            <label>{{ $t('arrival_date') }} *</label>
            <input type="date" v-model="lotForm.date_arrivee" required>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-danger" @click="showAddModal = false">
              {{ $t('delete') }}
            </button>
            <button type="submit" class="btn btn-success">
              {{ editingLot ? $t('edit') : $t('new_lot') }}
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
      lots: [],
      recherche: '',
      lotsFiltres: [],
      showAddModal: false,
      editingLot: null,
      lotForm: {
        nom_lot: '',
        race: '',
        fournisseur: '',
        nombre_initial: '',
        date_arrivee: ''
      }
    }
  },
  mounted() {
    this.loadLots()
  },
  methods: {
    async loadLots() {
      try {
        const response = await api.get('/lots')
        this.lots = response.data
        this.rechercherLots()
      } catch (error) {
        console.error('Erreur chargement lots:', error)
      }
    },
    
    rechercherLots() {
      if (!this.recherche) {
        this.lotsFiltres = this.lots
        return
      }
      
      const motCle = this.recherche.toLowerCase()
      this.lotsFiltres = this.lots.filter(lot => {
        return lot.nom_lot.toLowerCase().includes(motCle) ||
               (lot.race && lot.race.toLowerCase().includes(motCle)) ||
               (lot.fournisseur && lot.fournisseur.toLowerCase().includes(motCle))
      })
    },
    
    async saveLot() {
      try {
        if (this.editingLot) {
          await api.put(`/lots/${this.editingLot.id}`, this.lotForm)
        } else {
          await api.post('/lots', this.lotForm)
        }
        
        this.showAddModal = false
        this.resetForm()
        this.loadLots()
      } catch (error) {
        console.error('Erreur sauvegarde lot:', error)
      }
    },
    
    async confirmerSuppression(lot) {
      if (confirm(this.$t('confirm_delete'))) {
        try {
          await api.delete(`/lots/${lot.id}`)
          this.loadLots()
        } catch (error) {
          console.error('Erreur suppression lot:', error)
        }
      }
    },
    
    voirLot(id) {
      this.$router.push(`/lots/${id}`)
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR')
    },
    
    getTauxMortaliteClass(taux) {
      if (!taux) return ''
      if (taux > 10) return 'taux-eleve'
      if (taux > 5) return 'taux-moyen'
      return 'taux-faible'
    },
    
    resetForm() {
      this.lotForm = {
        nom_lot: '',
        race: '',
        fournisseur: '',
        nombre_initial: '',
        date_arrivee: ''
      }
      this.editingLot = null
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
  margin: 0 0.25rem;
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

.form-group input {
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
</style>