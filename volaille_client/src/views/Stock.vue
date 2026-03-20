<template>
  <div class="container">
    <div class="header-actions">
      <h1>Gestion du stock d'aliments</h1>
      <button class="btn btn-success" @click="showAddModal = true">
        + Ajouter stock
      </button>
    </div>
    
    <!-- Alertes stock -->
    <div v-if="stockAlerte.length > 0" class="alert alert-warning">
      <h3>⚠️ Alertes stock faible</h3>
      <ul>
        <li v-for="item in stockAlerte" :key="item.id">
          {{ item.type_aliment }}: {{ item.quantite }} {{ item.unite }} 
          (seuil: {{ item.seuil_alerte }} {{ item.unite }})
        </li>
      </ul>
    </div>
    
    <!-- Liste du stock -->
    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Type d'aliment</th>
            <th>Quantité</th>
            <th>Unité</th>
            <th>Seuil d'alerte</th>
            <th>Date d'achat</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in stock" :key="item.id" :class="{'alerte-ligne': item.alerte}">
            <td>{{ item.type_aliment }}</td>
            <td><strong>{{ item.quantite }}</strong></td>
            <td>{{ item.unite }}</td>
            <td>{{ item.seuil_alerte }}</td>
            <td>{{ formatDate(item.date_achat) }}</td>
            <td>
              <span :class="item.alerte ? 'badge-danger' : 'badge-success'">
                {{ item.alerte ? 'Stock faible' : 'Normal' }}
              </span>
            </td>
            <td>
              <button class="btn" @click="editerStock(item)">Modifier</button>
              <button class="btn btn-danger" @click="supprimerStock(item.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Modal Ajout/Modification Stock -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h2>{{ editingStock ? 'Modifier' : 'Ajouter' }} stock</h2>
        
        <form @submit.prevent="saveStock">
          <div class="form-group">
            <label>Type d'aliment *</label>
            <input type="text" v-model="stockForm.type_aliment" required>
          </div>
          
          <div class="form-group">
            <label>Quantité *</label>
            <input type="number" step="0.01" v-model="stockForm.quantite" required min="0">
          </div>
          
          <div class="form-group">
            <label>Unité</label>
            <select v-model="stockForm.unite">
              <option value="kg">Kilogrammes (kg)</option>
              <option value="sac">Sacs</option>
              <option value="tonne">Tonnes</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Seuil d'alerte</label>
            <input type="number" step="0.01" v-model="stockForm.seuil_alerte" min="0">
          </div>
          
          <div class="form-group">
            <label>Date d'achat</label>
            <input type="date" v-model="stockForm.date_achat">
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-danger" @click="showAddModal = false">
              Annuler
            </button>
            <button type="submit" class="btn btn-success">
              {{ editingStock ? 'Modifier' : 'Ajouter' }}
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
      stock: [],
      showAddModal: false,
      editingStock: null,
      stockForm: {
        type_aliment: '',
        quantite: '',
        unite: 'kg',
        seuil_alerte: 50,
        date_achat: new Date().toISOString().split('T')[0]
      }
    }
  },
  computed: {
    stockAlerte() {
      return this.stock.filter(item => item.alerte)
    }
  },
  mounted() {
    this.loadStock()
  },
  methods: {
    async loadStock() {
      try {
        const response = await api.get('/stock')
        this.stock = response.data
      } catch (error) {
        console.error('Erreur chargement stock:', error)
      }
    },
    
    async saveStock() {
      try {
        if (this.editingStock) {
          await api.put(`/stock/${this.editingStock.id}`, this.stockForm)
        } else {
          await api.post('/stock', this.stockForm)
        }
        
        this.showAddModal = false
        this.resetForm()
        this.loadStock()
      } catch (error) {
        console.error('Erreur sauvegarde stock:', error)
      }
    },
    
    async supprimerStock(id) {
      if (confirm('Voulez-vous vraiment supprimer cet aliment ?')) {
        try {
          await api.delete(`/stock/${id}`)
          this.loadStock()
        } catch (error) {
          console.error('Erreur suppression stock:', error)
        }
      }
    },
    
    editerStock(item) {
      this.editingStock = item
      this.stockForm = {
        type_aliment: item.type_aliment,
        quantite: item.quantite,
        unite: item.unite,
        seuil_alerte: item.seuil_alerte,
        date_achat: item.date_achat
      }
      this.showAddModal = true
    },
    
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fr-FR')
    },
    
    resetForm() {
      this.stockForm = {
        type_aliment: '',
        quantite: '',
        unite: 'kg',
        seuil_alerte: 50,
        date_achat: new Date().toISOString().split('T')[0]
      }
      this.editingStock = null
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

.alerte-ligne {
  background: #fff3cd;
}

.badge-success {
  background: #27ae60;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.badge-danger {
  background: #e74c3c;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}
</style>