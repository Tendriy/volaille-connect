<template>
  <div class="container">
    <div class="header-actions">
      <h1>{{ $t('stock') }}</h1>
      <button class="btn btn-success" @click="showAddModal = true">
        + {{ $t('add_stock') }}
      </button>
    </div>
    
    <!-- Alertes stock -->
    <div v-if="stockAlerte.length > 0" class="alert alert-warning">
      <h3>⚠️ {{ $t('stock_alerts') }}</h3>
      <ul>
        <li v-for="item in stockAlerte" :key="item.id">
          {{ item.type_aliment }}: {{ item.quantite }} {{ item.unite }} 
          ({{ $t('alert_threshold') }}: {{ item.seuil_alerte }} {{ item.unite }})
        </li>
      </ul>
    </div>
    
    <!-- Liste du stock -->
    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>{{ $t('feed_type') }}</th>
            <th>{{ $t('quantity') }}</th>
            <th>{{ $t('unit') }}</th>
            <th>{{ $t('alert_threshold') }}</th>
            <th>{{ $t('purchase_date') }}</th>
            <th>{{ $t('status') }}</th>
            <th>{{ $t('actions') }}</th>
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
                {{ item.alerte ? $t('low_stock') : $t('normal') }}
              </span>
            </td>
            <td>
              <button class="btn" @click="editerStock(item)">{{ $t('edit') }}</button>
              <button class="btn btn-danger" @click="supprimerStock(item.id)">{{ $t('delete') }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Modal Ajout Stock -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h2>{{ editingStock ? $t('edit_stock') : $t('add_stock') }}</h2>
        
        <form @submit.prevent="saveStock">
          <div class="form-group">
            <label>{{ $t('feed_type') }} *</label>
            <input type="text" v-model="stockForm.type_aliment" required>
          </div>
          
          <div class="form-group">
            <label>{{ $t('quantity') }} *</label>
            <input type="number" step="0.01" v-model="stockForm.quantite" required min="0">
          </div>
          
          <div class="form-group">
            <label>{{ $t('unit') }}</label>
            <select v-model="stockForm.unite">
              <option value="kg">{{ $t('kg') }}</option>
              <option value="sac">{{ $t('sac') }}</option>
              <option value="tonne">{{ $t('tonne') }}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>{{ $t('alert_threshold') }}</label>
            <input type="number" step="0.01" v-model="stockForm.seuil_alerte" min="0">
          </div>
          
          <div class="form-group">
            <label>{{ $t('purchase_date') }}</label>
            <input type="date" v-model="stockForm.date_achat">
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-danger" @click="showAddModal = false">
              {{ $t('delete') }}
            </button>
            <button type="submit" class="btn btn-success">
              {{ editingStock ? $t('edit') : $t('add_stock') }}
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
      if (confirm(this.$t('confirm_delete'))) {
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

.form-group input,
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

.alert {
  background: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.alert-warning {
  color: #856404;
}

.alert ul {
  margin-left: 1.5rem;
  margin-top: 0.5rem;
}
</style>