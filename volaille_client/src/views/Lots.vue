<template>
  <div class="container">
    <div class="header-actions">
      <h1>Gestion des lots</h1>
      <button class="btn btn-success" @click="showAddModal = true">
        + Nouveau lot
      </button>
    </div>
    
    <!-- Recherche (Algorithme 11.3) -->
    <div class="card">
      <div class="form-group">
        <label>Rechercher un lot</label>
        <input 
          type="text" 
          v-model="recherche" 
          placeholder="Nom, race ou fournisseur..."
          @input="rechercherLots"
        >
      </div>
    </div>
    
    <!-- Liste des lots -->
    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Nom du lot</th>
            <th>Race</th>
            <th>Fournisseur</th>
            <th>Nombre initial</th>
            <th>Date arrivée</th>
            <th>Âge</th>
            <th>Taux mortalité</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lot in lotsFiltres" :key="lot.id">
            <td>{{ lot.nom_lot }}</td>
            <td>{{ lot.race }}</td>
            <td>{{ lot.fournisseur }}</td>
            <td>{{ lot.nombre_initial }}</td>
            <td>{{ formatDate(lot.date_arrivee) }}</td>
            <td>{{ lot.age }} jours</td>
            <td>
              <span :class="getTauxMortaliteClass(lot.taux_mortalite)">
                {{ lot.taux_mortalite || 0 }}%
              </span>
            </td>
            <td>
              <span :class="lot.statut === 'actif' ? 'badge-actif' : 'badge-cloture'">
                {{ lot.statut }}
              </span>
            </td>
            <td>
              <button class="btn" @click="voirLot(lot.id)">Détails</button>
              <button class="btn btn-danger" @click="confirmerSuppression(lot)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Modal Ajout/Modification Lot -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h2>{{ editingLot ? 'Modifier' : 'Ajouter' }} un lot</h2>
        
        <form @submit.prevent="saveLot">
          <div class="form-group">
            <label>Nom du lot *</label>
            <input type="text" v-model="lotForm.nom_lot" required>
          </div>
          
          <div class="form-group">
            <label>Race</label>
            <input type="text" v-model="lotForm.race">
          </div>
          
          <div class="form-group">
            <label>Fournisseur</label>
            <input type="text" v-model="lotForm.fournisseur">
          </div>
          
          <div class="form-group">
            <label>Nombre initial *</label>
            <input type="number" v-model="lotForm.nombre_initial" required min="1">
          </div>
          
          <div class="form-group">
            <label>Date d'arrivée *</label>
            <input type="date" v-model="lotForm.date_arrivee" required>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-danger" @click="showAddModal = false">
              Annuler
            </button>
            <button type="submit" class="btn btn-success">
              {{ editingLot ? 'Modifier' : 'Ajouter' }}
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
    
    // Algorithme 11.3: Recherche de lots
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
      if (confirm(`Voulez-vous vraiment supprimer le lot "${lot.nom_lot}" ?`)) {
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
</style>