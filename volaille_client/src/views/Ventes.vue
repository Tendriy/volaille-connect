<template>
  <div class="ventes-container">

    <!-- ===== HEADER ===== -->
    <div class="page-header">
      <div class="header-left">
        <div class="page-eyebrow">💰 Gestion des revenus</div>
        <h1 class="page-title">{{ $t('ventes') }}</h1>
        <p class="page-sub">{{ ventes.length }} vente{{ ventes.length > 1 ? 's' : '' }} enregistrée{{ ventes.length > 1 ? 's' : '' }}</p>
      </div>
      <button class="btn-new" @click="showAddModal = true">
        ➕ {{ $t('new_sale') }}
      </button>
    </div>

    <!-- ===== CARTE CHIFFRE D'AFFAIRES ===== -->
    <div class="ca-card">
      <div class="ca-icon-wrap">
        <span class="ca-icon">📈</span>
      </div>
      <div class="ca-body">
        <div class="ca-label">{{ $t('total_amount') }}</div>
        <div class="ca-value">{{ formatPrix(chiffreAffaires) }} <span class="ca-currency">Ar</span></div>
      </div>
      <div class="ca-deco"></div>
    </div>

    <!-- ===== TABLEAU DES VENTES ===== -->
    <div class="table-card">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>{{ $t('date') }}</th>
              <th>{{ $t('lot_name') }}</th>
              <th class="text-center">{{ $t('number_sold') }}</th>
              <th class="text-right">{{ $t('unit_price') }}</th>
              <th class="text-right">{{ $t('total_amount') }}</th>
              <th>{{ $t('buyer') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vente in ventes" :key="vente.id" class="table-row">
              <td>
                <span class="date-pill">{{ formatDate(vente.date_vente) }}</span>
              </td>
              <td class="td-lot">
                <span class="lot-icon">🐔</span>
                {{ vente.nom_lot }}
              </td>
              <td class="text-center">
                <span class="num-badge">{{ vente.nombre_vendu }}</span>
              </td>
              <td class="text-right td-price">
                {{ formatPrix(vente.prix_unitaire) }} Ar
              </td>
              <td class="text-right">
                <span class="total-badge">{{ formatPrix(vente.nombre_vendu * vente.prix_unitaire) }} Ar</span>
              </td>
              <td class="td-buyer">
                <span v-if="vente.acheteur" class="buyer-tag">👤 {{ vente.acheteur }}</span>
                <span v-else class="buyer-none">—</span>
              </td>
            </tr>
            <tr v-if="ventes.length === 0">
              <td colspan="6" class="empty-row">
                <div class="empty-state">
                  <span class="empty-icon">📭</span>
                  <p>Aucune vente enregistrée</p>
                  <button class="btn-new-sm" @click="showAddModal = true">
                    ➕ Enregistrer une vente
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===== MODAL AJOUT VENTE ===== -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">

        <div class="modal-header">
          <div class="modal-logo">💰</div>
          <div>
            <h2>{{ $t('new_sale') }}</h2>
            <p>Enregistrer une nouvelle transaction de vente</p>
          </div>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>

        <form @submit.prevent="saveVente" class="modal-form">

          <div class="form-group">
            <label>{{ $t('lot_name') }} <span class="required">*</span></label>
            <div class="input-wrap">
              <span class="input-prefix">🐔</span>
              <select v-model="venteForm.lot_id" required>
                <option value="">Choisir un lot…</option>
                <option v-for="lot in lots" :key="lot.id" :value="lot.id">
                  {{ lot.nom_lot }} — {{ lot.race }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('date') }} <span class="required">*</span></label>
              <div class="input-wrap">
                <span class="input-prefix">📅</span>
                <input type="date" v-model="venteForm.date_vente" required />
              </div>
            </div>
            <div class="form-group">
              <label>{{ $t('number_sold') }} <span class="required">*</span></label>
              <div class="input-wrap">
                <span class="input-prefix">🔢</span>
                <input type="number" v-model="venteForm.nombre_vendu" required min="1" placeholder="Ex: 50" />
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('unit_price') }} (Ar) <span class="required">*</span></label>
              <div class="input-wrap">
                <span class="input-prefix">💵</span>
                <input type="number" step="100" v-model="venteForm.prix_unitaire" required min="0" placeholder="Ex: 15000" />
              </div>
            </div>
            <div class="form-group">
              <label>{{ $t('buyer') }}</label>
              <div class="input-wrap">
                <span class="input-prefix">👤</span>
                <input type="text" v-model="venteForm.acheteur" placeholder="Nom de l'acheteur" />
              </div>
            </div>
          </div>

          <!-- Aperçu total -->
          <div class="total-preview" v-if="venteForm.nombre_vendu && venteForm.prix_unitaire">
            <span class="preview-label">Total estimé</span>
            <span class="preview-value">
              {{ formatPrix(venteForm.nombre_vendu * venteForm.prix_unitaire) }} Ar
            </span>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeModal">{{ $t('cancel') }}</button>
            <button type="submit" class="btn-save">
              💾 {{ $t('new_sale') }}
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
        this.closeModal()
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
    closeModal() {
      this.showAddModal = false
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

  --gold:        #92400E;
  --gold-light:  #FEF3C7;

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

.ventes-container {
  font-family: 'DM Sans', sans-serif;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  color: var(--ink);
}

/* ============================================================
   HEADER — identique Lots
   ============================================================ */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #78350F 0%, #92400E 50%, #A16207 100%);
  border-radius: var(--radius);
  padding: 1.6rem 2rem;
  box-shadow: 0 4px 20px rgba(120,50,10,0.18);
  flex-wrap: wrap;
  gap: 1rem;
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
  align-self: center;
}

.btn-new:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(245,158,11,0.40);
}

/* ============================================================
   CARTE CHIFFRE D'AFFAIRES
   ============================================================ */
.ca-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.4rem 2rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.ca-deco {
  position: absolute;
  right: -30px;
  top: -30px;
  width: 130px;
  height: 130px;
  background: radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.ca-icon-wrap {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #FDE68A, #F59E0B);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(245,158,11,0.30);
}

.ca-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-muted);
  margin-bottom: 4px;
}

.ca-value {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--green);
  line-height: 1;
}

.ca-currency {
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: var(--ink-muted);
  margin-left: 4px;
}

/* ============================================================
   TABLE CARD — identique Lots
   ============================================================ */
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
.text-right  { text-align: right; }

/* Cellules */
.date-pill {
  background: var(--sky-light);
  color: var(--sky);
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid rgba(3,105,161,0.15);
}

.td-lot {
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

.num-badge {
  display: inline-block;
  background: var(--amber-pale);
  color: var(--gold);
  border: 1px solid rgba(217,119,6,0.20);
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
}

.td-price {
  color: var(--ink-soft);
  font-size: 13px;
}

.total-badge {
  display: inline-block;
  background: var(--green-pale);
  color: var(--green);
  border: 1px solid rgba(21,128,61,0.18);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.buyer-tag {
  background: var(--wheat);
  color: var(--ink-soft);
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(180,120,50,0.18);
  white-space: nowrap;
}

.buyer-none {
  color: var(--ink-muted);
  font-size: 13px;
}

/* Empty */
.empty-row { text-align: center; padding: 3rem !important; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.empty-icon  { font-size: 2.5rem; }
.empty-state p { color: var(--ink-muted); font-size: 14px; }

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

/* ============================================================
   MODAL — identique Lots
   ============================================================ */
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

.form-group { margin-bottom: 18px; }

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

.input-wrap input,
.input-wrap select {
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
  appearance: none;
}

.input-wrap input::placeholder,
.input-wrap select::placeholder { color: var(--ink-muted); }

.input-wrap input:focus,
.input-wrap select:focus {
  border-color: var(--amber);
  box-shadow: 0 0 0 3px rgba(217,119,6,0.10);
}

/* Aperçu total */
.total-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--green-pale);
  border: 1px solid rgba(21,128,61,0.18);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  margin-bottom: 12px;
}

.preview-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--green);
}

.preview-value {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--green);
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

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 768px) {
  .ventes-container { padding: 0 1rem; margin: 1rem auto; }
  .page-header { flex-direction: column; align-items: flex-start; }
  .form-row { grid-template-columns: 1fr; }
  .modal-box { max-width: 100%; }
  .td-lot { white-space: normal; }
  .ca-value { font-size: 1.5rem; }
}

@media (max-width: 480px) {
  .page-title { font-size: 1.6rem; }
}
</style>
