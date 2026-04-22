<template>
  <div class="lots-container">

    <!-- ===== HEADER ===== -->
    <div class="page-header">
      <div class="header-left">
        <div class="page-eyebrow">🐔 Gestion des élevages</div>
        <h1 class="page-title">{{ $t('lots') }}</h1>
        <p class="page-sub">{{ lots.length }} lot{{ lots.length > 1 ? 's' : '' }} enregistré{{ lots.length > 1 ? 's' : '' }}</p>
      </div>
      <div class="header-buttons">
        <button class="btn-fusion" @click="fusionnerLots" title="Fusionner les lots en double">
          🔗 Fusionner
        </button>
        <button class="btn-new" @click="openAddModal">
          ➕ {{ $t('new_lot') }}
        </button>
      </div>
    </div>

    <!-- ===== BARRE DE RECHERCHE ===== -->
    <div class="search-bar-wrap">
      <div class="search-input-wrap">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          v-model="recherche"
          :placeholder="$t('search_lot')"
          @input="rechercherLots"
          class="search-input"
        />
        <button v-if="recherche" class="search-clear" @click="recherche = ''; rechercherLots()">✕</button>
      </div>
      <div class="search-meta" v-if="recherche">
        {{ lotsFiltres.length }} résultat{{ lotsFiltres.length > 1 ? 's' : '' }} pour "{{ recherche }}"
      </div>
    </div>

    <!-- ===== TABLEAU DES LOTS ===== -->
    <div class="table-card">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>{{ $t('lot_name') }}</th>
              <th>{{ $t('breed') }}</th>
              <th class="text-center">{{ $t('initial_number') }}</th>
              <th class="text-center">{{ $t('remaining') }}</th>
              <th class="text-center">{{ $t('sold') }}</th>
              <th class="text-center">{{ $t('dead') }}</th>
              <th class="text-center">{{ $t('age') }}</th>
              <th>{{ $t('status') }}</th>
              <th class="text-center">{{ $t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lot in lotsFiltres" :key="lot.id" class="table-row">
              <td class="td-name">
                <span class="lot-icon">🐔</span>
                {{ lot.nom_lot }}
              </td>
              <td class="td-race">{{ lot.race || '—' }}</td>
              <td class="text-center">
                <span class="num-initial">{{ lot.nombre_initial }}</span>
              </td>
              <td class="text-center">
                <span class="num-badge" :class="getRestantClass(lot.nombre_restant)">
                  {{ lot.nombre_restant }}
                </span>
              </td>
              <td class="text-center">
                <span class="num-sold">{{ lot.total_vendus || 0 }}</span>
              </td>
              <td class="text-center">
                <span class="num-dead" :class="(lot.total_morts || 0) > 0 ? 'dead-nonzero' : 'dead-zero'">
                  {{ lot.total_morts || 0 }}
                </span>
              </td>
              <td class="text-center">
                <span class="age-pill">{{ lot.age }}j</span>
              </td>
              <td>
                <span :class="lot.statut === 'actif' ? 'badge-active' : 'badge-closed'">
                  {{ lot.statut === 'actif' ? '🟢 ' + $t('active') : '⚫ ' + $t('closed') }}
                </span>
              </td>
              <td class="text-center">
                <div class="action-btns">
                  <button class="btn-view" @click="voirLot(lot.id)" title="Voir détails">👁️</button>
                  <button class="btn-delete" @click="confirmerSuppression(lot)" title="Supprimer">🗑️</button>
                </div>
              </td>
            </tr>
            <tr v-if="lotsFiltres.length === 0">
              <td colspan="9" class="empty-row">
                <div class="empty-state">
                  <span class="empty-icon">📭</span>
                  <p>{{ recherche ? 'Aucun lot ne correspond à votre recherche' : 'Aucun lot enregistré' }}</p>
                  <button v-if="!recherche" class="btn-new-sm" @click="openAddModal">
                    ➕ Créer le premier lot
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===== MODAL AJOUT / ÉDITION ===== -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">

        <div class="modal-header">
          <div class="modal-logo">🐔</div>
          <div>
            <h2>{{ editingLot ? $t('edit_lot') : $t('new_lot') }}</h2>
            <p>{{ editingLot ? 'Modifier les informations du lot' : 'Enregistrer un nouveau lot de volailles' }}</p>
          </div>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>

        <form @submit.prevent="saveLot" class="modal-form">

          <div class="form-group">
            <label>{{ $t('lot_name') }} <span class="required">*</span></label>
            <div class="input-wrap">
              <span class="input-prefix">🏷️</span>
              <input type="text" v-model="lotForm.nom_lot" :placeholder="$t('lot_name')" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('breed') }}</label>
              <div class="input-wrap">
                <span class="input-prefix">🐓</span>
                <input type="text" v-model="lotForm.race" :placeholder="$t('breed')" />
              </div>
            </div>
            <div class="form-group">
              <label>{{ $t('supplier') }}</label>
              <div class="input-wrap">
                <span class="input-prefix">🏪</span>
                <input type="text" v-model="lotForm.fournisseur" :placeholder="$t('supplier')" />
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('initial_number') }} <span class="required">*</span></label>
              <div class="input-wrap">
                <span class="input-prefix">🔢</span>
                <input type="number" v-model="lotForm.nombre_initial" required min="1" placeholder="Ex: 500" />
              </div>
            </div>
            <div class="form-group">
              <label>{{ $t('arrival_date') }} <span class="required">*</span></label>
              <div class="input-wrap">
                <span class="input-prefix">📅</span>
                <input type="date" v-model="lotForm.date_arrivee" required />
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeModal">{{ $t('cancel') }}</button>
            <button type="submit" class="btn-save">
              💾 {{ editingLot ? $t('edit') : $t('new_lot') }}
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
        const r = await api.get('/lots')
        this.lots = r.data
        this.lotsFiltres = this.lots
      } catch (e) {
        console.error(e)
        alert('Erreur lors du chargement des lots')
      }
    },
    
    getRestantClass(n) {
      if (n <= 0) return 'restant-zero'
      if (n < 10) return 'restant-low'
      return 'restant-ok'
    },
    
    rechercherLots() {
      if (!this.recherche) { 
        this.lotsFiltres = this.lots
        return 
      }
      const kw = this.recherche.toLowerCase()
      this.lotsFiltres = this.lots.filter(l =>
        (l.nom_lot && l.nom_lot.toLowerCase().includes(kw)) ||
        (l.race && l.race.toLowerCase().includes(kw)) ||
        (l.fournisseur && l.fournisseur.toLowerCase().includes(kw))
      )
    },
    
    openAddModal() {
      this.editingLot = null
      this.lotForm = {
        nom_lot: '',
        race: '',
        fournisseur: '',
        nombre_initial: '',
        date_arrivee: new Date().toISOString().split('T')[0]
      }
      this.showAddModal = true
    },
    
    async saveLot() {
      if (!this.lotForm.nom_lot) {
        alert('Veuillez saisir un nom de lot')
        return
      }
      if (!this.lotForm.nombre_initial || this.lotForm.nombre_initial <= 0) {
        alert('Veuillez saisir un nombre initial valide')
        return
      }
      if (!this.lotForm.date_arrivee) {
        alert('Veuillez saisir une date d\'arrivée')
        return
      }

      try {
        const dataToSend = {
          nom_lot: this.lotForm.nom_lot,
          race: this.lotForm.race || null,
          fournisseur: this.lotForm.fournisseur || null,
          nombre_initial: parseInt(this.lotForm.nombre_initial),
          date_arrivee: this.lotForm.date_arrivee
        }

        if (this.editingLot) {
          await api.put(`/lots/${this.editingLot.id}`, dataToSend)
          alert('✅ Lot modifié avec succès')
        } else {
          const response = await api.post('/lots', dataToSend)
          
          if (response.data.updated) {
            alert(`✅ ${response.data.message}`)
          } else {
            alert('✅ Lot ajouté avec succès')
          }
        }
        
        this.closeModal()
        await this.loadLots()
      } catch (e) {
        console.error(e)
        const errorMsg = e.response?.data?.error || '❌ Erreur lors de la sauvegarde'
        alert(errorMsg)
      }
    },
    
    async fusionnerLots() {
      if (confirm('Fusionner tous les lots avec le même nom et la même race ?')) {
        try {
          const response = await api.post('/lots/fusionner')
          alert(response.data.message)
          await this.loadLots()
        } catch (e) {
          console.error(e)
          alert('Erreur lors de la fusion des lots')
        }
      }
    },
    
    async confirmerSuppression(lot) {
      if (confirm(`Supprimer le lot "${lot.nom_lot}" ?`)) {
        try { 
          await api.delete(`/lots/${lot.id}`)
          await this.loadLots()
          alert('✅ Lot supprimé avec succès')
        } catch (e) { 
          console.error(e)
          alert('Erreur lors de la suppression')
        }
      }
    },
    
    voirLot(id) { 
      this.$router.push(`/lots/${id}`) 
    },
    
    closeModal() {
      this.showAddModal = false
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
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --amber:       #D97706;
  --amber-light: #F59E0B;
  --amber-pale:  #FFFBEB;
  --amber-mid:   #FDE68A;
  --wheat:       #FEF3C7;

  --green:       #15803D;
  --green-light: #F0FDF4;
  --green-pale:  #DCFCE7;

  --terra:       #C2410C;
  --terra-light: #FFF1EE;

  --sky:         #0369A1;
  --sky-light:   #E0F2FE;

  --cream:       #FFFDF5;
  --parchment:   #FDF6E3;

  --ink:         #292524;
  --ink-soft:    #78716C;
  --ink-muted:   #A8A29E;

  --border:      rgba(180,120,50,0.14);
  --radius:      16px;
  --radius-sm:   10px;
  --shadow:      0 2px 16px rgba(120,80,20,0.08);
  --shadow-lg:   0 8px 40px rgba(120,80,20,0.16);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

.lots-container {
  font-family: 'DM Sans', sans-serif;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  color: var(--ink);
}

/* ===== HEADER ===== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.8rem;
  background: linear-gradient(135deg, #78350F 0%, #92400E 50%, #A16207 100%);
  border-radius: var(--radius);
  padding: 1.6rem 2rem;
  box-shadow: 0 4px 20px rgba(120,50,10,0.18);
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  flex: 1;
}

.header-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.page-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: rgba(254,243,199,0.60);
  margin-bottom: 5px;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #FEF3C7;
  font-style: italic;
  line-height: 1.1;
  margin-bottom: 4px;
}

.page-sub {
  font-size: 13px;
  color: rgba(254,243,199,0.50);
  font-weight: 300;
}

.btn-new {
  background: var(--amber-light);
  color: #3B1A00;
  border: none;
  padding: 11px 24px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 3px 12px rgba(245,158,11,0.30);
  white-space: nowrap;
}

.btn-new:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(245,158,11,0.40);
}

.btn-fusion {
  background: var(--green);
  color: white;
  border: none;
  padding: 11px 24px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 3px 12px rgba(21,128,61,0.30);
  white-space: nowrap;
}

.btn-fusion:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(21,128,61,0.40);
}

/* ===== BARRE DE RECHERCHE ===== */
.search-bar-wrap {
  margin-bottom: 1.4rem;
}

.search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 100px;
  padding: 0 16px;
  box-shadow: var(--shadow);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input-wrap:focus-within {
  border-color: var(--amber);
  box-shadow: 0 0 0 3px rgba(217,119,6,0.10);
}

.search-icon {
  font-size: 15px;
  margin-right: 10px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 13px 0;
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  color: var(--ink);
  background: transparent;
}

.search-input::placeholder { color: var(--ink-muted); }

.search-clear {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ink-muted);
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.search-clear:hover { background: var(--wheat); color: var(--ink); }

.search-meta {
  margin-top: 8px;
  font-size: 12px;
  color: var(--ink-muted);
  padding-left: 16px;
}

/* ===== TABLE CARD ===== */
.table-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.table-responsive { overflow-x: auto; }

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background: var(--parchment);
  padding: 12px 14px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  border-bottom: 1.5px solid var(--border);
}

.table td {
  padding: 13px 14px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
  vertical-align: middle;
}

.table-row { transition: background 0.15s; }
.table-row:hover { background: var(--amber-pale); }
.table-row:last-child td { border-bottom: none; }

.text-center { text-align: center; }

.td-name {
  font-weight: 600;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.lot-icon {
  width: 30px;
  height: 30px;
  background: var(--wheat);
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 1px solid rgba(217,119,6,0.15);
  flex-shrink: 0;
}

.td-race { color: var(--ink-soft); font-size: 13px; }

.num-initial {
  font-weight: 600;
  color: var(--ink-soft);
  font-size: 14px;
}

.num-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
}

.restant-ok   { background: var(--green-pale); color: var(--green);  border: 1px solid rgba(21,128,61,0.15); }
.restant-low  { background: var(--wheat);      color: #92400E;       border: 1px solid rgba(217,119,6,0.20); }
.restant-zero { background: var(--terra-light); color: var(--terra); border: 1px solid rgba(194,65,12,0.18); }

.num-sold {
  color: var(--sky);
  font-weight: 600;
  font-size: 14px;
}

.num-dead { font-weight: 700; font-size: 14px; }
.dead-zero    { color: var(--green); }
.dead-nonzero { color: var(--terra); }

.age-pill {
  background: var(--sky-light);
  color: var(--sky);
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(3,105,161,0.15);
}

.badge-active {
  background: var(--green-pale);
  color: var(--green);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(21,128,61,0.15);
  white-space: nowrap;
}

.badge-closed {
  background: #F5F5F4;
  color: var(--ink-muted);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.action-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-view,
.btn-delete {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.15s;
}

.btn-view   { background: var(--wheat); }
.btn-delete { background: var(--terra-light); }

.btn-view:hover   { background: var(--amber-mid); transform: scale(1.1); }
.btn-delete:hover { background: #FECACA; transform: scale(1.1); }

.empty-row { text-align: center; padding: 3rem !important; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.empty-icon { font-size: 2.5rem; }

.empty-state p {
  color: var(--ink-muted);
  font-size: 14px;
}

.btn-new-sm {
  background: linear-gradient(135deg, #D97706, #B45309);
  color: white;
  border: none;
  padding: 9px 20px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 3px 12px rgba(180,83,9,0.25);
  margin-top: 4px;
}

.btn-new-sm:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(180,83,9,0.35); }

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(41,37,36,0.45);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-box {
  background: var(--cream);
  border-radius: var(--radius);
  width: 100%;
  max-width: 560px;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 1.4rem 1.6rem 1rem;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(135deg, #78350F, #A16207);
  border-radius: var(--radius) var(--radius) 0 0;
}

.modal-logo {
  width: 46px;
  height: 46px;
  background: rgba(254,243,199,0.15);
  border: 1px solid rgba(254,243,199,0.20);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.modal-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #FEF3C7;
  font-style: italic;
}

.modal-header p {
  font-size: 12px;
  color: rgba(254,243,199,0.55);
  margin-top: 2px;
}

.modal-close {
  margin-left: auto;
  background: rgba(254,243,199,0.12);
  border: 1px solid rgba(254,243,199,0.20);
  color: rgba(254,243,199,0.8);
  width: 32px; height: 32px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.modal-close:hover { background: rgba(254,243,199,0.22); color: white; }

.modal-form { padding: 1.4rem 1.6rem; }

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 7px;
  font-weight: 600;
  font-size: 13px;
  color: var(--ink);
  letter-spacing: 0.02em;
}

.required { color: var(--terra); }

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix {
  position: absolute;
  left: 12px;
  font-size: 14px;
  pointer-events: none;
  z-index: 1;
}

.input-wrap input {
  width: 100%;
  padding: 11px 12px 11px 40px;
  border: 1.5px solid rgba(180,120,50,0.22);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  color: var(--ink);
  background: white;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-wrap input::placeholder { color: var(--ink-muted); }

.input-wrap input:focus {
  border-color: var(--amber);
  box-shadow: 0 0 0 3px rgba(217,119,6,0.10);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.btn-cancel {
  background: white;
  color: var(--ink-soft);
  border: 1.5px solid var(--border);
  padding: 10px 22px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover { border-color: var(--ink-soft); color: var(--ink); }

.btn-save {
  background: linear-gradient(135deg, #D97706, #B45309);
  color: white;
  border: none;
  padding: 10px 26px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 3px 12px rgba(180,83,9,0.28);
}

.btn-save:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(180,83,9,0.38); }

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .lots-container { padding: 0 1rem; margin: 1rem auto; }
  .page-header { flex-direction: column; align-items: flex-start; }
  .header-buttons { margin-top: 10px; width: 100%; }
  .btn-fusion, .btn-new { flex: 1; text-align: center; }
  .form-row { grid-template-columns: 1fr; }
  .modal-box { max-width: 100%; }
  .td-name { white-space: normal; }
}

@media (max-width: 480px) {
  .page-title { font-size: 1.6rem; }
  .action-btns { gap: 4px; }
}
</style>