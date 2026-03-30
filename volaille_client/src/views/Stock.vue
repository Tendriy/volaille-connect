<template>
  <div class="stock-container">

    <!-- ===== HEADER ===== -->
    <div class="page-header">
      <div class="header-left">
        <div class="page-eyebrow">📦 Gestion des ressources</div>
        <h1 class="page-title">{{ $t('stock') }}</h1>
        <p class="page-sub">{{ stock.length }} article{{ stock.length > 1 ? 's' : '' }} en stock</p>
      </div>
      <button class="btn-new" @click="showAddModal = true">
        ➕ {{ $t('add_stock') }}
      </button>
    </div>

    <!-- ===== ALERTES GLASSMORPHISM ===== -->
    <div v-if="stockAlerte.length > 0" class="alerts-glass-wrap">
      <!-- Fond flou décoratif -->
      <div class="glass-bg-blob b1"></div>
      <div class="glass-bg-blob b2"></div>

      <div class="glass-card">
        <div class="glass-header">
          <div class="glass-icon-wrap">⚠️</div>
          <div>
            <h3>{{ $t('stock_alerts') }}</h3>
            <p>{{ stockAlerte.length }} aliment{{ stockAlerte.length > 1 ? 's' : '' }} en dessous du seuil</p>
          </div>
          <span class="glass-count">{{ stockAlerte.length }}</span>
        </div>
        <div class="glass-items">
          <div
            v-for="item in stockAlerte"
            :key="item.id"
            class="glass-item"
          >
            <span class="glass-dot"></span>
            <span class="glass-item-name">{{ item.type_aliment }}</span>
            <span class="glass-item-qty">{{ item.quantite }} {{ item.unite }}</span>
            <span class="glass-item-seuil">seuil : {{ item.seuil_alerte }} {{ item.unite }}</span>
            <span class="glass-item-bar-wrap">
              <span
                class="glass-item-bar"
                :style="{ width: Math.min((item.quantite / item.seuil_alerte) * 100, 100) + '%' }"
              ></span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== TABLEAU STOCK ===== -->
    <div class="table-card">
      <div class="table-card-header">
        <h2>🌾 Inventaire complet</h2>
        <span class="stock-summary">
          <span class="sum-ok">{{ stockNormal.length }} normaux</span>
          <span class="sum-sep">·</span>
          <span class="sum-low">{{ stockAlerte.length }} en alerte</span>
        </span>
      </div>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>{{ $t('feed_type') }}</th>
              <th class="text-center">{{ $t('quantity') }}</th>
              <th class="text-center">{{ $t('unit') }}</th>
              <th class="text-center">{{ $t('alert_threshold') }}</th>
              <th class="text-center">Niveau</th>
              <th>{{ $t('purchase_date') }}</th>
              <th>{{ $t('status') }}</th>
              <th class="text-center">{{ $t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in stock"
              :key="item.id"
              class="table-row"
              :class="{ 'row-alert': item.alerte }"
            >
              <td class="td-name">
                <span class="feed-icon">🌾</span>
                {{ item.type_aliment }}
              </td>
              <td class="text-center">
                <span class="qty-val" :class="item.alerte ? 'qty-low' : 'qty-ok'">
                  {{ item.quantite }}
                </span>
              </td>
              <td class="text-center">
                <span class="unit-pill">{{ item.unite }}</span>
              </td>
              <td class="text-center">
                <span class="seuil-val">{{ item.seuil_alerte }}</span>
              </td>
              <td class="text-center td-level">
                <div class="level-bar-wrap">
                  <div
                    class="level-bar"
                    :class="item.alerte ? 'level-danger' : 'level-ok'"
                    :style="{ width: Math.min((item.quantite / (item.seuil_alerte * 2)) * 100, 100) + '%' }"
                  ></div>
                </div>
              </td>
              <td class="td-date">{{ formatDate(item.date_achat) }}</td>
              <td>
                <span :class="item.alerte ? 'badge-alert' : 'badge-normal'">
                  {{ item.alerte ? '⚠️ ' + $t('low_stock') : '✅ ' + $t('normal') }}
                </span>
              </td>
              <td class="text-center">
                <div class="action-btns">
                  <button class="btn-edit" @click="editerStock(item)" title="Modifier">✏️</button>
                  <button class="btn-del" @click="supprimerStock(item.id)" title="Supprimer">🗑️</button>
                </div>
              </td>
            </tr>
            <tr v-if="stock.length === 0">
              <td colspan="8" class="empty-row">
                <div class="empty-state">
                  <span class="empty-icon">📦</span>
                  <p>Aucun stock enregistré</p>
                  <button class="btn-new-sm" @click="showAddModal = true">➕ Ajouter un aliment</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===== MODAL ===== -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">

        <div class="modal-header">
          <div class="modal-logo">📦</div>
          <div>
            <h2>{{ editingStock ? $t('edit_stock') : $t('add_stock') }}</h2>
            <p>{{ editingStock ? 'Modifier les informations du stock' : 'Enregistrer un nouvel aliment' }}</p>
          </div>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>

        <form @submit.prevent="saveStock" class="modal-form">

          <div class="form-group">
            <label>{{ $t('feed_type') }} <span class="required">*</span></label>
            <div class="input-wrap">
              <span class="input-prefix">🌾</span>
              <input type="text" v-model="stockForm.type_aliment" placeholder="Ex: Maïs concassé" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('quantity') }} <span class="required">*</span></label>
              <div class="input-wrap">
                <span class="input-prefix">⚖️</span>
                <input type="number" step="0.01" v-model="stockForm.quantite" placeholder="0.00" required min="0" />
              </div>
            </div>
            <div class="form-group">
              <label>{{ $t('unit') }}</label>
              <div class="input-wrap">
                <span class="input-prefix">📏</span>
                <select v-model="stockForm.unite">
                  <option value="kg">Kilogramme (kg)</option>
                  <option value="sac">Sac</option>
                  <option value="tonne">Tonne</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('alert_threshold') }}</label>
              <div class="input-wrap">
                <span class="input-prefix">⚠️</span>
                <input type="number" step="0.01" v-model="stockForm.seuil_alerte" placeholder="50" min="0" />
              </div>
            </div>
            <div class="form-group">
              <label>{{ $t('purchase_date') }}</label>
              <div class="input-wrap">
                <span class="input-prefix">📅</span>
                <input type="date" v-model="stockForm.date_achat" />
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeModal">{{ $t('cancel') }}</button>
            <button type="submit" class="btn-save">
              💾 {{ editingStock ? $t('edit') : $t('add_stock') }}
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
    stockAlerte() { return this.stock.filter(i => i.alerte) },
    stockNormal() { return this.stock.filter(i => !i.alerte) }
  },
  mounted() { this.loadStock() },
  methods: {
    async loadStock() {
      try { const r = await api.get('/stock'); this.stock = r.data }
      catch (e) { console.error(e) }
    },
    async saveStock() {
      try {
        if (this.editingStock) {
          await api.put(`/stock/${this.editingStock.id}`, this.stockForm)
        } else {
          await api.post('/stock', this.stockForm)
        }
        this.closeModal(); this.loadStock()
      } catch (e) { console.error(e) }
    },
    async supprimerStock(id) {
      if (confirm(this.$t('confirm_delete'))) {
        try { await api.delete(`/stock/${id}`); this.loadStock() }
        catch (e) { console.error(e) }
      }
    },
    editerStock(item) {
      this.editingStock = item
      this.stockForm = { type_aliment: item.type_aliment, quantite: item.quantite, unite: item.unite, seuil_alerte: item.seuil_alerte, date_achat: item.date_achat }
      this.showAddModal = true
    },
    formatDate(d) { if (!d) return '—'; return new Date(d).toLocaleDateString('fr-FR') },
    closeModal() {
      this.showAddModal = false
      this.stockForm = { type_aliment: '', quantite: '', unite: 'kg', seuil_alerte: 50, date_achat: new Date().toISOString().split('T')[0] }
      this.editingStock = null
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

.stock-container {
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
  margin-bottom: 1.8rem;
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

.btn-new:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(245,158,11,0.40); }

/* ============================================================
   ALERTES GLASSMORPHISM
   ============================================================ */
.alerts-glass-wrap {
  position: relative;
  margin-bottom: 1.8rem;
  border-radius: var(--radius);
  overflow: hidden;
  padding: 2px; /* border trick */
  background: linear-gradient(135deg, rgba(217,119,6,0.35), rgba(194,65,12,0.25), rgba(217,119,6,0.15));
}

/* Blobs décoratifs derrière le verre */
.glass-bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  pointer-events: none;
  z-index: 0;
}

.b1 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(245,158,11,0.30), transparent 70%);
  top: -80px; right: 10%;
}

.b2 {
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(194,65,12,0.22), transparent 70%);
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
  border: 1px solid rgba(254,243,199,0.60);
}

.glass-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 1.2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(217,119,6,0.15);
}

.glass-icon-wrap {
  width: 48px;
  height: 48px;
  background: rgba(217,119,6,0.12);
  border: 1px solid rgba(217,119,6,0.25);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  backdrop-filter: blur(8px);
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
  background: rgba(194,65,12,0.12);
  border: 1px solid rgba(194,65,12,0.22);
  color: var(--terra);
  font-size: 13px;
  font-weight: 800;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  backdrop-filter: blur(4px);
}

.glass-items { display: flex; flex-direction: column; gap: 10px; }

.glass-item {
  display: grid;
  grid-template-columns: 10px 1fr auto auto 140px;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.45);
  border: 1px solid rgba(217,119,6,0.12);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
}

.glass-item:hover { background: rgba(255,255,255,0.65); }

.glass-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--terra);
  flex-shrink: 0;
  box-shadow: 0 0 6px rgba(194,65,12,0.40);
}

.glass-item-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}

.glass-item-qty {
  font-size: 13px;
  font-weight: 700;
  color: var(--terra);
  white-space: nowrap;
  background: var(--terra-light);
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid rgba(194,65,12,0.15);
}

.glass-item-seuil {
  font-size: 11px;
  color: var(--ink-muted);
  white-space: nowrap;
}

.glass-item-bar-wrap {
  height: 6px;
  background: rgba(194,65,12,0.12);
  border-radius: 10px;
  overflow: hidden;
}

.glass-item-bar {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #C2410C, #FB923C);
  border-radius: 10px;
  transition: width 0.6s ease;
}

/* ============================================================
   TABLEAU
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
}

.table-card-header h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink);
}

.stock-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.sum-ok  { color: var(--green); font-weight: 600; }
.sum-sep { color: var(--ink-muted); }
.sum-low { color: var(--terra); font-weight: 600; }

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
.row-alert { background: rgba(255,241,238,0.55); }
.row-alert:hover { background: rgba(255,241,238,0.85); }

.text-center { text-align: center; }

.td-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap;
}

.feed-icon {
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

.qty-val { font-weight: 700; font-size: 15px; }
.qty-ok  { color: var(--green); }
.qty-low { color: var(--terra); }

.unit-pill {
  background: var(--sky-light, #E0F2FE);
  color: #0369A1;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(3,105,161,0.12);
}

.seuil-val { color: var(--ink-soft); font-weight: 500; font-size: 13px; }

.td-level { min-width: 100px; }

.level-bar-wrap {
  height: 8px;
  background: var(--parchment);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.level-bar {
  height: 100%;
  border-radius: 10px;
  transition: width 0.6s ease;
  min-width: 4px;
}

.level-ok     { background: linear-gradient(90deg, #15803D, #22C55E); }
.level-danger { background: linear-gradient(90deg, #C2410C, #FB923C); }

.td-date { color: var(--ink-soft); font-size: 13px; white-space: nowrap; }

.badge-normal {
  background: var(--green-pale);
  color: var(--green);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(21,128,61,0.15);
  white-space: nowrap;
}

.badge-alert {
  background: var(--terra-light);
  color: var(--terra);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(194,65,12,0.18);
  white-space: nowrap;
}

.action-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-edit, .btn-del {
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

.btn-edit { background: var(--wheat); }
.btn-del  { background: var(--terra-light); }

.btn-edit:hover { background: var(--amber-mid); transform: scale(1.1); }
.btn-del:hover  { background: #FECACA; transform: scale(1.1); }

.empty-row { text-align: center; padding: 3rem !important; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.empty-icon { font-size: 2.5rem; }
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
  max-width: 540px;
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
  width: 46px; height: 46px;
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
}

.required { color: var(--terra); }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

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

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 768px) {
  .stock-container { padding: 0 1rem; margin: 1rem auto; }
  .page-header { flex-direction: column; align-items: flex-start; }
  .form-row { grid-template-columns: 1fr; }
  .glass-item { grid-template-columns: 10px 1fr auto; }
  .glass-item-seuil, .glass-item-bar-wrap { display: none; }
  .modal-box { max-width: 100%; }
}
</style>