<template>
  <div class="vaccins-container">

    <!-- ===== HEADER ===== -->
    <div class="page-header">
      <div class="header-left">
        <div class="page-eyebrow">💉 Programme sanitaire</div>
        <h1 class="page-title">{{ $t('vaccins') }}</h1>
        <p class="page-sub">{{ vaccins.length }} vaccin{{ vaccins.length > 1 ? 's' : '' }} enregistré{{ vaccins.length > 1 ? 's' : '' }}</p>
      </div>
      <div class="header-right">
        <div class="header-counters">
          <div class="counter-pill counter-pending">
            <span class="counter-num">{{ vaccinsProgrammes }}</span>
            <span class="counter-lbl">⏳ Programmés</span>
          </div>
          <div class="counter-pill counter-done">
            <span class="counter-num">{{ vaccinsEffectues }}</span>
            <span class="counter-lbl">✅ Effectués</span>
          </div>
        </div>
        <button class="btn-new" @click="showAddModal = true">
          ➕ {{ $t('program_vaccine') }}
        </button>
      </div>
      <div class="header-deco">💉</div>
    </div>

    <!-- ===== ALERTES GLASSMORPHISM ===== -->
    <div v-if="alertesVaccins.length > 0" class="alerts-glass-wrap">
      <div class="glass-bg-blob b1"></div>
      <div class="glass-bg-blob b2"></div>

      <div class="glass-card">
        <div class="glass-header">
          <div class="glass-icon-wrap">💉</div>
          <div>
            <h3>{{ $t('vaccine_reminder') }}</h3>
            <p>{{ alertesVaccins.length }} vaccin{{ alertesVaccins.length > 1 ? 's' : '' }} à administrer dans les 3 prochains jours</p>
          </div>
          <span class="glass-count">{{ alertesVaccins.length }}</span>
        </div>
        <div class="glass-items">
          <div v-for="alerte in alertesVaccins" :key="alerte.id" class="glass-item">
            <span class="glass-dot"></span>
            <span class="glass-item-msg">{{ alerte.message }}</span>
            <button class="btn-glass-action" @click="marquerEffectue(alerte.id)">
              ✅ {{ $t('mark_done') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== TABLEAU ===== -->
    <div class="table-card">
      <div class="table-card-header">
        <h2>📋 {{ $t('vaccins') }}</h2>
        <div class="filter-tabs">
          <button
            class="filter-tab"
            :class="{ active: filtreActif === 'tous' }"
            @click="filtreActif = 'tous'"
          >Tous <span class="tab-count">{{ vaccins.length }}</span></button>
          <button
            class="filter-tab"
            :class="{ active: filtreActif === 'programme' }"
            @click="filtreActif = 'programme'"
          >Programmés <span class="tab-count pending">{{ vaccinsProgrammes }}</span></button>
          <button
            class="filter-tab"
            :class="{ active: filtreActif === 'effectue' }"
            @click="filtreActif = 'effectue'"
          >Effectués <span class="tab-count done">{{ vaccinsEffectues }}</span></button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table">
          <thead>
             <tr>
              <th>{{ $t('lot_name') }}</th>
              <th>{{ $t('vaccine_type') }}</th>
              <th>{{ $t('scheduled_date') }}</th>
              <th>{{ $t('performed_date') }}</th>
              <th>{{ $t('status') }}</th>
              <th class="text-center">{{ $t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="vaccin in vaccinsFiltres"
              :key="vaccin.id"
              class="table-row"
              :class="{
                'row-done': vaccin.statut === 'effectue',
                'row-urgent': isUrgent(vaccin.date_programmee) && vaccin.statut === 'programme'
              }"
            >
              <td class="td-lot">
                <span class="lot-chip">🐔</span>
                <strong>{{ vaccin.nom_lot }}</strong>
              </td>
              <td class="td-type">
                <span class="type-pill">{{ vaccin.type_vaccin }}</span>
              </td>
              <td class="td-date">
                <span
                  class="date-val"
                  :class="isUrgent(vaccin.date_programmee) && vaccin.statut === 'programme' ? 'date-urgent' : ''"
                >
                  {{ formatDate(vaccin.date_programmee) }}
                </span>
                <span v-if="isUrgent(vaccin.date_programmee) && vaccin.statut === 'programme'" class="fire-badge">🔥 Urgent</span>
              </td>
              <td class="td-date">
                <span v-if="vaccin.date_effectuee" class="date-done">{{ formatDate(vaccin.date_effectuee) }}</span>
                <span v-else class="text-muted">—</span>
              </td>
              <td>
                <span :class="vaccin.statut === 'effectue' ? 'badge-done' : 'badge-pending'">
                  {{ vaccin.statut === 'effectue' ? '✅ Effectué' : '⏳ Programmé' }}
                </span>
              </td>
              <td class="text-center">
                <div class="action-btns" v-if="vaccin.statut === 'programme'">
                  <button class="btn-check" @click="marquerEffectue(vaccin.id)" title="Marquer effectué">
                    ✅
                  </button>
                  <button class="btn-del" @click="supprimerVaccin(vaccin.id)" title="Supprimer">
                    🗑️
                  </button>
                </div>
                <span v-else class="text-muted">—</span>
              </td>
            </tr>
            <tr v-if="vaccinsFiltres.length === 0">
              <td colspan="6" class="empty-row">
                <div class="empty-state">
                  <span class="empty-icon">💉</span>
                  <p>Aucun vaccin dans cette catégorie</p>
                  <button v-if="filtreActif !== 'effectue'" class="btn-new-sm" @click="showAddModal = true">
                    ➕ Programmer un vaccin
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===== MODAL ===== -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-box">

        <div class="modal-header">
          <div class="modal-logo">💉</div>
          <div>
            <h2>{{ $t('program_vaccine') }}</h2>
            <p>Planifier une vaccination pour un lot actif</p>
          </div>
          <button class="modal-close" @click="showAddModal = false">✕</button>
        </div>

        <form @submit.prevent="saveVaccin" class="modal-form">

          <div class="form-group">
            <label>{{ $t('lot_name') }} <span class="required">*</span></label>
            <div class="input-wrap">
              <span class="input-prefix">🐔</span>
              <select v-model="vaccinForm.lot_id" required>
                <option value="">— {{ $t('select_lot') }} —</option>
                <option v-for="lot in lots" :key="lot.id" :value="lot.id">
                  {{ lot.nom_lot }} — {{ lot.race || 'Race inconnue' }} ({{ lot.nombre_restant || lot.nombre_initial }} restants)
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>{{ $t('vaccine_type') }} <span class="required">*</span></label>
            <div class="input-wrap">
              <span class="input-prefix">🧬</span>
              <input
                type="text"
                v-model="vaccinForm.type_vaccin"
                required
                placeholder="Ex: Newcastle, Gumboro, Bronchite..."
              />
            </div>
          </div>

          <div class="form-group">
            <label>{{ $t('scheduled_date') }} <span class="required">*</span></label>
            <div class="input-wrap">
              <span class="input-prefix">📅</span>
              <input type="date" v-model="vaccinForm.date_programmee" required :min="today" />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="showAddModal = false">{{ $t('cancel') }}</button>
            <button type="submit" class="btn-save">💾 {{ $t('program_vaccine') }}</button>
          </div>

        </form>
      </div>
    </div>

  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'Vaccins',
  data() {
    return {
      vaccins: [],
      lots: [],
      alertesVaccins: [],
      showAddModal: false,
      filtreActif: 'tous',
      today: new Date().toISOString().split('T')[0],
      vaccinForm: {
        lot_id: '',
        type_vaccin: '',
        date_programmee: new Date().toISOString().split('T')[0]
      }
    }
  },
  computed: {
    vaccinsProgrammes() { return this.vaccins.filter(v => v.statut === 'programme').length },
    vaccinsEffectues()  { return this.vaccins.filter(v => v.statut === 'effectue').length },
    vaccinsFiltres() {
      if (this.filtreActif === 'tous') return this.vaccins
      return this.vaccins.filter(v => v.statut === this.filtreActif)
    }
  },
  mounted() {
    this.loadVaccins()
    this.loadLots()
    this.loadAlertes()
  },
  methods: {
    async loadVaccins() {
      try { const r = await api.get('/vaccins'); this.vaccins = r.data }
      catch (e) { console.error(e) }
    },
    async loadLots() {
      try { const r = await api.get('/lots'); this.lots = r.data.filter(l => l.statut === 'actif') }
      catch (e) { console.error(e) }
    },
    async loadAlertes() {
      try { const r = await api.get('/vaccins/alertes'); this.alertesVaccins = r.data }
      catch (e) { console.error(e) }
    },
    async saveVaccin() {
      try {
        await api.post('/vaccins', this.vaccinForm)
        this.showAddModal = false
        this.resetForm()
        this.loadVaccins()
        this.loadAlertes()
        alert('✅ Vaccin programmé avec succès')
      } catch (e) {
        alert(e.response?.data?.error || '❌ Erreur lors de la programmation')
      }
    },
    async marquerEffectue(id) {
      try {
        await api.put(`/vaccins/${id}/effectuer`)
        this.loadVaccins()
        this.loadAlertes()
        alert('✅ Vaccin marqué comme effectué')
      } catch (e) { alert('❌ Erreur lors de la mise à jour') }
    },
    async supprimerVaccin(id) {
      if (confirm('Voulez-vous vraiment supprimer ce vaccin programmé ?')) {
        try {
          await api.delete(`/vaccins/${id}`)
          this.loadVaccins()
          this.loadAlertes()
        } catch (e) { alert('❌ Erreur lors de la suppression') }
      }
    },
    isUrgent(date) {
      const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
      return diff <= 3 && diff >= 0
    },
    formatDate(d) { if (!d) return '—'; return new Date(d).toLocaleDateString('fr-FR') },
    resetForm() {
      this.vaccinForm = { lot_id: '', type_vaccin: '', date_programmee: this.today }
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

.vaccins-container {
  font-family: 'DM Sans', sans-serif;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  color: var(--ink);
}

/* ============================================================
   HEADER — STYLE ORANGE/AMBRÉ (comme Ventes)
   ============================================================ */
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
  position: relative;
  overflow: hidden;
}

.page-header::after {
  content: '💉';
  position: absolute;
  font-size: 160px;
  opacity: 0.06;
  right: 100px;
  top: 50%;
  transform: translateY(-50%) rotate(-20deg);
  pointer-events: none;
  line-height: 1;
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

.header-right {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.header-counters {
  display: flex;
  gap: 10px;
}

.counter-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  min-width: 80px;
}

.counter-pending {
  background: rgba(254,243,199,0.12);
  border-color: rgba(254,243,199,0.18);
}

.counter-done {
  background: rgba(220,252,231,0.15);
  border-color: rgba(34,197,94,0.25);
}

.counter-num {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #FEF3C7;
  line-height: 1;
}

.counter-lbl {
  font-size: 11px;
  color: rgba(254,243,199,0.55);
  margin-top: 2px;
  white-space: nowrap;
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

.btn-new:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(245,158,11,0.40); }

/* ============================================================
   ALERTES GLASSMORPHISM
   ============================================================ */
.alerts-glass-wrap {
  position: relative;
  margin-bottom: 1.8rem;
  border-radius: var(--radius);
  overflow: hidden;
  padding: 2px;
  background: linear-gradient(135deg, rgba(245,158,11,0.35), rgba(217,119,6,0.20), rgba(180,83,9,0.15));
}

.glass-bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  pointer-events: none;
  z-index: 0;
}

.b1 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(245,158,11,0.28), transparent 70%);
  top: -80px; right: 10%;
}

.b2 {
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(217,119,6,0.22), transparent 70%);
  bottom: -60px; left: 5%;
}

.glass-card {
  position: relative;
  z-index: 1;
  background: rgba(255,251,235,0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: calc(var(--radius) - 2px);
  padding: 1.4rem 1.6rem;
  border: 1px solid rgba(245,158,11,0.35);
}

.glass-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 1.2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(217,119,6,0.12);
}

.glass-icon-wrap {
  width: 48px; height: 48px;
  background: rgba(217,119,6,0.10);
  border: 1px solid rgba(217,119,6,0.22);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.glass-header h3 {
  font-size: 15px;
  font-weight: 700;
  color: #92400E;
  margin-bottom: 2px;
}

.glass-header p {
  font-size: 12px;
  color: #B45309;
  font-weight: 400;
}

.glass-count {
  margin-left: auto;
  background: rgba(217,119,6,0.12);
  border: 1px solid rgba(217,119,6,0.22);
  color: #D97706;
  font-size: 13px;
  font-weight: 800;
  width: 34px; height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.glass-items { display: flex; flex-direction: column; gap: 10px; }

.glass-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.50);
  border: 1px solid rgba(245,158,11,0.35);
  border-radius: var(--radius-sm);
  padding: 11px 14px;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
}

.glass-item:hover { background: rgba(255,255,255,0.72); }

.glass-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #F59E0B;
  flex-shrink: 0;
  box-shadow: 0 0 6px rgba(245,158,11,0.40);
}

.glass-item-msg {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: #78350F;
}

.btn-glass-action {
  background: rgba(245,158,11,0.10);
  border: 1px solid rgba(245,158,11,0.22);
  color: #D97706;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  white-space: nowrap;
}

.btn-glass-action:hover { background: rgba(245,158,11,0.20); transform: scale(1.04); }

/* ============================================================
   TABLE CARD
   ============================================================ */
.table-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.table-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.6rem;
  border-bottom: 1px solid var(--border);
  background: var(--parchment);
  flex-wrap: wrap;
  gap: 0.8rem;
}

.table-card-header h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink);
}

.filter-tabs {
  display: flex;
  gap: 6px;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  border: 1.5px solid var(--border);
  color: var(--ink-soft);
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab:hover { border-color: #F59E0B; color: #D97706; }

.filter-tab.active {
  background: var(--wheat);
  border-color: #F59E0B;
  color: #D97706;
  font-weight: 600;
}

.tab-count {
  background: rgba(120,80,20,0.08);
  color: var(--ink-muted);
  font-size: 11px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 20px;
}

.tab-count.pending { background: var(--wheat); color: #92400E; }
.tab-count.done    { background: var(--green-pale); color: var(--green); }

.table-responsive { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; }

.table th {
  background: var(--parchment);
  padding: 11px 14px;
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

.row-done   { opacity: 0.65; }
.row-urgent { background: rgba(254,241,238,0.60); }
.row-urgent:hover { background: rgba(254,241,238,0.90); }

.text-center { text-align: center; }
.text-muted  { color: var(--ink-muted); font-size: 13px; }

.td-lot {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lot-chip {
  width: 30px; height: 30px;
  background: var(--wheat);
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 1px solid rgba(217,119,6,0.15);
  flex-shrink: 0;
}

.type-pill {
  background: var(--wheat);
  color: #92400E;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(217,119,6,0.15);
  white-space: nowrap;
}

.td-date { white-space: nowrap; }

.date-val   { font-size: 13px; color: var(--ink-soft); }
.date-urgent { color: var(--terra); font-weight: 700; }
.date-done  { color: var(--green); font-size: 13px; font-weight: 500; }

.fire-badge {
  display: inline-block;
  background: var(--terra-light);
  color: var(--terra);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  margin-left: 6px;
  border: 1px solid rgba(194,65,12,0.18);
}

.badge-done {
  background: var(--green-pale);
  color: var(--green);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(21,128,61,0.15);
  white-space: nowrap;
}

.badge-pending {
  background: var(--wheat);
  color: #92400E;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(217,119,6,0.20);
  white-space: nowrap;
}

.action-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-check, .btn-del {
  width: 34px; height: 34px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.15s;
}

.btn-check { background: var(--green-light); border: 1px solid rgba(21,128,61,0.15); }
.btn-del   { background: var(--terra-light); border: 1px solid rgba(194,65,12,0.15); }

.btn-check:hover { background: var(--green-pale); transform: scale(1.1); }
.btn-del:hover   { background: #FECACA; transform: scale(1.1); }

.empty-row { text-align: center; padding: 3rem !important; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.empty-icon  { font-size: 2.5rem; opacity: 0.5; }
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
  box-shadow: 0 3px 12px rgba(180,83,9,0.25);
  margin-top: 4px;
  transition: transform 0.2s;
}

.btn-new-sm:hover { transform: translateY(-1px); }

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
  max-width: 500px;
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
  background: linear-gradient(135deg, #78350F 0%, #92400E 50%, #A16207 100%);
  border-radius: var(--radius) var(--radius) 0 0;
}

.modal-logo {
  width: 46px; height: 46px;
  background: rgba(254,243,199,0.15);
  border: 1px solid rgba(254,243,199,0.22);
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
}

.required { color: var(--terra); }

.input-wrap { position: relative; display: flex; align-items: center; }

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

.input-wrap input::placeholder { color: var(--ink-muted); }

.input-wrap input:focus,
.input-wrap select:focus {
  border-color: #F59E0B;
  box-shadow: 0 0 0 3px rgba(245,158,11,0.10);
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
  .vaccins-container { padding: 0 1rem; margin: 1rem auto; }
  .page-header { flex-direction: column; align-items: flex-start; }
  .header-right { width: 100%; justify-content: space-between; }
  .filter-tabs { flex-wrap: wrap; }
  .modal-box { max-width: 100%; }
  .table-card-header { flex-direction: column; align-items: flex-start; }
}
</style>