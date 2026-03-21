<template>
  <div class="container">
    <div class="header-actions">
      <h1>{{ $t('ventes') }}</h1>
      <button class="btn btn-success" @click="showAddModal = true">
        + {{ $t('new_sale') }}
      </button>
    </div>
    
    <!-- Résumé ventes -->
    <div class="card">
      <h2>{{ $t('revenue') }}</h2>
      <div class="ca-total">
        <span class="ca-label">{{ $t('total_amount') }}:</span>
        <span class="ca-value">{{ formatPrix(chiffreAffaires) }} Ar</span>
      </div>
    </div>
    
    <!-- Historique ventes -->
    <div class="card">
      <h2>{{ $t('sales') }}</h2>
      <table class="table">
        <thead>
          <tr>
            <th>{{ $t('date') }}</th>
            <th>{{ $t('lot_name') }}</th>
            <th>{{ $t('number_sold') }}</th>
            <th>{{ $t('unit_price') }}</th>
            <th>{{ $t('total_amount') }}</th>
            <th>{{ $t('buyer') }}</th>
           </tr>
        </thead>
        <tbody>
          <tr v-for="vente in ventes" :key="vente.id">
            <td>{{ formatDate(vente.date_vente) }}</td>
            <td>{{ vente.nom_lot }}</td>
            <td>{{ vente.nombre_vendu }}</td>
            <td>{{ formatPrix(vente.prix_unitaire) }} Ar</td>
            <td><strong>{{ formatPrix(vente.nombre_vendu * vente.prix_unitaire) }} Ar</strong></td>
            <td>{{ vente.acheteur || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Modal Ajout Vente -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h2>{{ $t('new_sale') }}</h2>
        
        <form @submit.prevent="saveVente">
          <div class="form-group">
            <label>{{ $t('lot_name') }} *</label>
            <select v-model="venteForm.lot_id" required>
              <option value="">{{ $t('lot_name') }}</option>
              <option v-for="lot in lots" :key="lot.id" :value="lot.id">
                {{ lot.nom_lot }} - {{ lot.race }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>{{ $t('date') }} *</label>
            <input type="date" v-model="venteForm.date_vente" required>
          </div>
          
          <div class="form-group">
            <label>{{ $t('number_sold') }} *</label>
            <input type="number" v-model="venteForm.nombre_vendu" required min="1">
          </div>
          
          <div class="form-group">
            <label>{{ $t('unit_price') }} (Ar) *</label>
            <input type="number" step="100" v-model="venteForm.prix_unitaire" required min="0">
          </div>
          
          <div class="form-group">
            <label>{{ $t('buyer') }}</label>
            <input type="text" v-model="venteForm.acheteur">
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-danger" @click="showAddModal = false">
              {{ $t('delete') }}
            </button>
            <button type="submit" class="btn btn-success">
              {{ $t('new_sale') }}
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
  name: 'Ventes',
  data() {
    return {
      ventes: [],
      lots: [],
      chiffreAffaires: 0,
      showAddModal: false,
      venteForm: {
        lot_id: '',
        date_vente: new Date().toISOString().split('T')[0],
        nombre_vendu: '',
        prix_unitaire: '',
        acheteur: ''
      }
    }
  },
  mounted() {
    this.loadVentes()
    this.loadLots()
  },
  methods: {
    async loadVentes() {
      try {
        const response = await api.get('/ventes')
        this.ventes = response.data.ventes || []
        this.chiffreAffaires = response.data.chiffre_affaires_total || 0
      } catch (error) {
        console.error('Erreur chargement ventes:', error)
      }
    },
    
    async loadLots() {
      try {
        const response = await api.get('/lots')
        this.lots = response.data || []
      } catch (error) {
        console.error('Erreur chargement lots:', error)
      }
    },
    
    async saveVente() {
      try {
        await api.post('/ventes', this.venteForm)
        
        this.showAddModal = false
        this.resetForm()
        this.loadVentes()
        
        alert(this.$t('success'))
      } catch (error) {
        console.error('Erreur enregistrement vente:', error)
        alert(this.$t('error'))
      }
    },
    
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fr-FR')
    },
    
    formatPrix(prix) {
      if (!prix) return '0'
      return new Intl.NumberFormat('fr-FR').format(prix)
    },
    
    resetForm() {
      this.venteForm = {
        lot_id: '',
        date_vente: new Date().toISOString().split('T')[0],
        nombre_vendu: '',
        prix_unitaire: '',
        acheteur: ''
      }
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

.ca-total {
  font-size: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 1rem;
}

.ca-label {
  font-weight: bold;
  margin-right: 1rem;
}

.ca-value {
  color: #27ae60;
  font-weight: bold;
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
  max-height: 90vh;
  overflow-y: auto;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
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

.table tr:hover {
  background: #f5f5f5;
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
</style>