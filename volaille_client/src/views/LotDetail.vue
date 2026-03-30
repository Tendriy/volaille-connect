<template>
  <div class="lot-container" v-if="lot">

    <!-- ===== HEADER ===== -->
    <div class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="$router.push('/lots')">← {{ $t('back') }}</button>
        <div>
          <div class="page-eyebrow">📋 {{ $t('lot_details') }}</div>
          <h1 class="page-title">{{ lot.nom_lot }}</h1>
        </div>
      </div>
      <div class="header-badges">
        <span :class="lot.statut === 'actif' ? 'badge-active' : 'badge-closed'">
          {{ lot.statut === 'actif' ? '🟢 ' + $t('active') : '⚫ ' + $t('closed') }}
        </span>
        <span class="badge-age">{{ lot.age }} {{ $t('days') }}</span>
      </div>
    </div>

    <!-- ===== INFOS GÉNÉRALES ===== -->
    <div class="info-card">
      <div class="card-title-row">
        <h2>ℹ️ {{ $t('general_info') }}</h2>
        <div class="actions" v-if="lot.statut === 'actif'">
          <button class="btn-primary" @click="showSuiviModal = true">
            ➕ {{ $t('add_followup') }}
          </button>
          <button class="btn-warn" @click="cloturerLot">
            🔒 {{ $t('close_lot') }}
          </button>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">{{ $t('breed') }}</span>
          <span class="info-value">{{ lot.race || '—' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{ $t('supplier') }}</span>
          <span class="info-value">{{ lot.fournisseur || '—' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{ $t('initial_number') }}</span>
          <span class="info-value highlight-amber">{{ lot.nombre_initial }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{ $t('arrival_date') }}</span>
          <span class="info-value">{{ formatDate(lot.date_arrivee) }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{ $t('age') }}</span>
          <span class="info-value">{{ lot.age }} {{ $t('days') }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{ $t('mortality_rate') }}</span>
          <span class="info-value" :class="getTauxMortaliteClass(lot.taux_mortalite)">
            {{ lot.taux_mortalite || 0 }}%
          </span>
        </div>
      </div>
    </div>

    <!-- ===== SUIVI QUOTIDIEN ===== -->
    <div class="table-card">
      <div class="card-title-row">
        <h2>📈 {{ $t('daily_followup') }}</h2>
        <span class="chart-badge">{{ suivis.length }} entrées</span>
      </div>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>{{ $t('date') }}</th>
              <th>{{ $t('temperature') }}</th>
              <th>{{ $t('consumption') }} (kg)</th>
              <th>{{ $t('consumption_details') }}</th>
              <th>{{ $t('mortality') }}</th>
              <th>{{ $t('observations') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="suivi in suivis" :key="suivi.id">
              <td class="td-date">{{ formatDate(suivi.date_suivi) }}</td>
              <td>
                <span v-if="suivi.temperature" class="temp-pill">
                  🌡️ {{ suivi.temperature }}°C
                </span>
                <span v-else class="text-muted">—</span>
              </td>
              <td class="text-center">
                <strong>{{ suivi.consommation_aliment || 0 }} kg</strong>
              </td>
              <td class="consumption-details-cell">
                <div v-if="suivi.consommations" class="consumption-details">
                  <span v-for="(c, idx) in JSON.parse(suivi.consommations)" :key="idx" class="consumption-badge">
                    {{ c.type_aliment }}: {{ c.quantite }} kg
                  </span>
                </div>
                <span v-else class="text-muted">—</span>
              </td>
              <td class="text-center">
                <span :class="suivi.mortalite_jour > 0 ? 'mort-nonzero' : 'mort-zero'">
                  {{ suivi.mortalite_jour || 0 }}
                </span>
              </td>
              <td class="td-obs">{{ suivi.observations || '—' }}</td>
            </tr>
            <tr v-if="suivis.length === 0">
              <td colspan="6" class="empty-row">
                <span>📭 Aucun suivi enregistré</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===== MODAL AJOUT SUIVI ===== -->
    <div v-if="showSuiviModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">

        <div class="modal-header">
          <div class="modal-logo">📈</div>
          <div>
            <h2>{{ $t('add_followup') }}</h2>
            <p>{{ lot.nom_lot }}</p>
          </div>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>

        <form @submit.prevent="saveSuivi" class="modal-form">

          <!-- Date -->
          <div class="form-group">
            <label>{{ $t('date') }} <span class="required">*</span></label>
            <div class="input-wrap">
              <span class="input-prefix">📅</span>
              <input type="date" v-model="suiviForm.date_suivi" required />
            </div>
          </div>

          <!-- Température + Mortalité -->
          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('temperature') }} (°C)</label>
              <div class="input-wrap">
                <span class="input-prefix">🌡️</span>
                <input type="number" step="0.1" v-model="suiviForm.temperature" placeholder="Ex: 28.5" />
              </div>
            </div>
            <div class="form-group">
              <label>{{ $t('mortality') }}</label>
              <div class="input-wrap">
                <span class="input-prefix">📉</span>
                <input type="number" v-model="suiviForm.mortalite_jour" min="0" placeholder="0" />
              </div>
            </div>
          </div>

          <!-- Consommations -->
          <div class="form-group">
            <label>{{ $t('consumptions') }}</label>
            <div class="consumptions-container">
              <div v-if="suiviForm.consumptions.length === 0" class="empty-consumptions">
                Cliquez sur "Ajouter un aliment" pour enregistrer les consommations.
              </div>
              <div
                v-for="(item, index) in suiviForm.consumptions"
                :key="index"
                class="consumption-row"
              >
                <select v-model="item.type_aliment" class="consumption-select" required>
                  <option value="">— {{ $t('select_feed') }} —</option>
                  <option
                    v-for="stock in stocks"
                    :key="stock.id"
                    :value="stock.type_aliment"
                    :class="{ 'stock-low': stock.quantite <= stock.seuil_alerte }"
                  >
                    {{ stock.type_aliment }} ({{ stock.quantite }} {{ stock.unite }})
                  </option>
                </select>
                <input
                  type="number"
                  step="0.01"
                  v-model="item.quantite"
                  placeholder="kg"
                  min="0"
                  class="consumption-qty"
                />
                <button type="button" class="btn-remove" @click="removeConsumption(index)" title="Supprimer">✕</button>
              </div>
            </div>
            <button type="button" class="btn-add-row" @click="addConsumption">
              ➕ {{ $t('add_feed') }}
            </button>
          </div>

          <!-- Alertes stock -->
          <div v-if="stockWarnings.length > 0" class="alert-warning-box">
            <div v-for="warning in stockWarnings" :key="warning.type" class="warning-row">
              ⚠️ {{ warning.message }}
            </div>
          </div>

          <!-- Observations -->
          <div class="form-group">
            <label>{{ $t('observations') }}</label>
            <textarea v-model="suiviForm.observations" rows="3" placeholder="Notes, remarques..."></textarea>
          </div>

          <!-- Actions -->
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeModal">{{ $t('cancel') }}</button>
            <button type="submit" class="btn-save">💾 {{ $t('save') }}</button>
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
      stocks: [],
      showSuiviModal: false,
      suiviForm: {
        date_suivi: new Date().toISOString().split('T')[0],
        temperature: '',
        consumptions: [],
        mortalite_jour: 0,
        observations: ''
      }
    }
  },
  computed: {
    canSubmit() { return true },
    stockWarnings() {
      const warnings = []
      for (let item of this.suiviForm.consumptions) {
        if (!item.type_aliment || !item.quantite || item.quantite <= 0) continue
        const stock = this.stocks.find(s => s.type_aliment === item.type_aliment)
        if (stock) {
          if (stock.quantite < item.quantite) {
            warnings.push({ type: item.type_aliment, message: `Stock insuffisant pour "${item.type_aliment}" ! Reste : ${stock.quantite} ${stock.unite}` })
          } else if (stock.quantite - item.quantite <= stock.seuil_alerte) {
            warnings.push({ type: item.type_aliment, message: `Après consommation, "${item.type_aliment}" sera en stock faible (${stock.quantite - item.quantite} ${stock.unite})` })
          }
        } else if (item.type_aliment) {
          warnings.push({ type: item.type_aliment, message: `"${item.type_aliment}" n'existe pas dans le stock.` })
        }
      }
      return warnings
    }
  },
  mounted() {
    this.loadLot()
    this.loadSuivis()
    this.loadStocks()
  },
  methods: {
    async loadLot() {
      try { const r = await api.get(`/lots/${this.$route.params.id}`); this.lot = r.data }
      catch (e) { console.error(e) }
    },
    async loadSuivis() {
      try { const r = await api.get(`/suivi/lot/${this.$route.params.id}`); this.suivis = r.data }
      catch (e) { console.error(e) }
    },
    async loadStocks() {
      try { const r = await api.get('/stock'); this.stocks = r.data }
      catch (e) { console.error(e) }
    },
    addConsumption() { this.suiviForm.consumptions.push({ type_aliment: '', quantite: '' }) },
    removeConsumption(i) { this.suiviForm.consumptions.splice(i, 1) },
    async saveSuivi() {
      const valid = this.suiviForm.consumptions.filter(c => c.type_aliment && c.quantite > 0)
      const total = valid.reduce((s, c) => s + (parseFloat(c.quantite) || 0), 0)
      try {
        await api.post('/suivi', {
          lot_id: this.$route.params.id,
          date_suivi: this.suiviForm.date_suivi,
          temperature: this.suiviForm.temperature,
          consommation_aliment: total,
          consommations: JSON.stringify(valid),
          mortalite_jour: this.suiviForm.mortalite_jour,
          observations: this.suiviForm.observations
        })
        this.closeModal(); this.loadSuivis(); this.loadLot(); this.loadStocks()
        alert('✅ Suivi ajouté avec succès')
      } catch (e) {
        alert(e.response?.data?.error || '❌ Erreur lors de la sauvegarde')
      }
    },
    async cloturerLot() {
      if (confirm('Voulez-vous vraiment clôturer ce lot ?')) {
        try { await api.put(`/lots/${this.$route.params.id}/cloturer`); this.loadLot() }
        catch (e) { console.error(e) }
      }
    },
    formatDate(d) { return new Date(d).toLocaleDateString('fr-FR') },
    getTauxMortaliteClass(t) {
      if (!t) return 'taux-faible'
      if (t > 10) return 'taux-eleve'
      if (t > 5) return 'taux-moyen'
      return 'taux-faible'
    },
    closeModal() {
      this.showSuiviModal = false
      this.suiviForm = { date_suivi: new Date().toISOString().split('T')[0], temperature: '', consumptions: [], mortalite_jour: 0, observations: '' }
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

.lot-container {
  font-family: 'DM Sans', sans-serif;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  color: var(--ink);
}

/* ============================================================
   HEADER
   ============================================================ */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.6rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.btn-back {
  background: white;
  border: 1.5px solid var(--border);
  color: var(--ink-soft);
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
  white-space: nowrap;
  margin-top: 6px;
}

.btn-back:hover {
  border-color: var(--amber);
  color: var(--ink);
  background: var(--amber-pale);
}

.page-eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--ink-muted);
  margin-bottom: 4px;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--ink);
  font-style: italic;
}

.header-badges {
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge-active {
  background: var(--green-pale);
  color: var(--green);
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid rgba(21,128,61,0.18);
}

.badge-closed {
  background: #F5F5F4;
  color: var(--ink-muted);
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
}

.badge-age {
  background: var(--wheat);
  color: #92400E;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid rgba(217,119,6,0.18);
}

/* ============================================================
   CARD BASE
   ============================================================ */
.info-card,
.table-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.6rem;
  box-shadow: var(--shadow);
  margin-bottom: 1.4rem;
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
  gap: 0.8rem;
}

.card-title-row h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink);
}

.chart-badge {
  background: var(--wheat);
  color: #92400E;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(217,119,6,0.15);
}

/* Actions row */
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-primary {
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
  box-shadow: 0 2px 10px rgba(180,83,9,0.25);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(180,83,9,0.35);
}

.btn-warn {
  background: white;
  color: var(--terra);
  border: 1.5px solid rgba(194,65,12,0.25);
  padding: 9px 20px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-warn:hover {
  background: var(--terra-light);
  border-color: var(--terra);
}

/* ============================================================
   INFO GRID
   ============================================================ */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  background: var(--parchment);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
}

.info-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--ink-muted);
  margin-bottom: 5px;
}

.info-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
}

.highlight-amber { color: var(--amber); font-family: 'Playfair Display', serif; font-size: 18px; }

.taux-faible { color: var(--green);  font-weight: 700; }
.taux-moyen  { color: var(--amber);  font-weight: 700; }
.taux-eleve  { color: var(--terra);  font-weight: 700; }

/* ============================================================
   TABLE
   ============================================================ */
.table-responsive { overflow-x: auto; }

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem 0.85rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
  font-size: 0.84rem;
}

.table th {
  background: var(--parchment);
  font-weight: 600;
  color: var(--ink-muted);
  font-size: 0.70rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.table tr:hover { background: var(--amber-pale); }

.td-date { font-weight: 600; color: var(--ink); white-space: nowrap; }
.td-obs { max-width: 200px; color: var(--ink-soft); font-size: 13px; }

.text-center { text-align: center; }
.text-muted { color: var(--ink-muted); font-size: 13px; }

.temp-pill {
  background: var(--sky-light, #E0F2FE);
  color: #0369A1;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.mort-zero    { color: var(--green); font-weight: 600; }
.mort-nonzero { color: var(--terra); font-weight: 700; }

.consumption-details-cell { max-width: 200px; }

.consumption-details {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.consumption-badge {
  background: var(--green-pale);
  color: var(--green);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  border: 1px solid rgba(21,128,61,0.12);
}

.empty-row {
  text-align: center;
  padding: 2.5rem !important;
  color: var(--ink-muted);
  font-size: 14px;
}

/* ============================================================
   MODAL
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
  max-width: 580px;
  max-height: 90vh;
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
  width: 44px;
  height: 44px;
  background: rgba(254,243,199,0.15);
  border: 1px solid rgba(254,243,199,0.2);
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
  color: rgba(254,243,199,0.6);
  margin-top: 2px;
}

.modal-close {
  margin-left: auto;
  background: rgba(254,243,199,0.12);
  border: 1px solid rgba(254,243,199,0.2);
  color: rgba(254,243,199,0.8);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.modal-close:hover { background: rgba(254,243,199,0.2); color: white; }

.modal-form { padding: 1.4rem 1.6rem; }

/* Form elements */
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

.input-wrap input:focus {
  border-color: var(--amber);
  box-shadow: 0 0 0 3px rgba(217,119,6,0.10);
}

.form-group textarea {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid rgba(180,120,50,0.22);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  color: var(--ink);
  background: white;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s;
}

.form-group textarea:focus {
  border-color: var(--amber);
  box-shadow: 0 0 0 3px rgba(217,119,6,0.10);
}

/* Consommations */
.consumptions-container {
  background: var(--parchment);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 10px;
  max-height: 220px;
  overflow-y: auto;
}

.empty-consumptions {
  text-align: center;
  color: var(--ink-muted);
  font-size: 13px;
  padding: 1rem;
}

.consumption-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}

.consumption-row:last-child { margin-bottom: 0; }

.consumption-select {
  flex: 2;
  padding: 9px 10px;
  border: 1.5px solid rgba(180,120,50,0.20);
  border-radius: var(--radius-sm);
  background: white;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  color: var(--ink);
  outline: none;
  transition: border-color 0.2s;
}

.consumption-select:focus { border-color: var(--amber); }

.consumption-qty {
  flex: 1;
  padding: 9px 10px;
  border: 1.5px solid rgba(180,120,50,0.20);
  border-radius: var(--radius-sm);
  background: white;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  text-align: right;
  outline: none;
  transition: border-color 0.2s;
}

.consumption-qty:focus { border-color: var(--amber); }

.btn-remove {
  background: var(--terra-light);
  color: var(--terra);
  border: 1px solid rgba(194,65,12,0.18);
  border-radius: 8px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
}

.btn-remove:hover { background: #FECACA; }

.btn-add-row {
  width: 100%;
  margin-top: 8px;
  padding: 9px;
  background: var(--green-light);
  color: var(--green);
  border: 1.5px dashed rgba(21,128,61,0.30);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.btn-add-row:hover { background: var(--green-pale); border-color: var(--green); }

.stock-low { color: var(--terra); font-weight: 600; }

/* Alertes */
.alert-warning-box {
  background: var(--wheat);
  border: 1.5px solid rgba(217,119,6,0.25);
  color: #92400E;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  margin-bottom: 16px;
}

.warning-row {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.warning-row:last-child { margin-bottom: 0; }

/* Modal actions */
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
  .lot-container { padding: 0 1rem; margin: 1rem auto; }
  .page-header { flex-direction: column; align-items: flex-start; }
  .form-row { grid-template-columns: 1fr; }
  .consumption-row { flex-wrap: wrap; }
  .consumption-select { flex: 100%; }
  .modal-box { max-width: 100%; }
}
</style>