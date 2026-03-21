<template>
  <div class="language-selector">
    <div class="lang-dropdown" @click="toggleDropdown">
      <div class="lang-selected">
        <span class="lang-flag">{{ currentFlag }}</span>
        <span class="lang-name">{{ currentLangName }}</span>
        <span class="dropdown-icon">▼</span>
      </div>
      
      <transition name="dropdown">
        <div v-if="isOpen" class="lang-options">
          <div 
            v-for="lang in languages" 
            :key="lang.code"
            @click.stop="changeLanguage(lang.code)"
            class="lang-option"
            :class="{ active: currentLocale === lang.code }"
          >
            <span class="lang-flag">{{ lang.flag }}</span>
            <span class="lang-name">{{ lang.name }}</span>
            <span v-if="currentLocale === lang.code" class="check-icon">✓</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'LanguageSwitcher',
  setup() {
    const { locale, t } = useI18n()
    return { locale, t }
  },
  data() {
    return {
      isOpen: false,
      languages: [
        { code: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
        { code: 'mg', name: 'Malagasy', flag: '🇲🇬', nativeName: 'Malagasy' }
      ]
    }
  },
  computed: {
    currentLocale() {
      return this.locale
    },
    currentLang() {
      return this.languages.find(lang => lang.code === this.currentLocale) || this.languages[0]
    },
    currentFlag() {
      return this.currentLang.flag
    },
    currentLangName() {
      return this.currentLang.nativeName
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    changeLanguage(langCode) {
      console.log('Changement de langue vers:', langCode)
      this.locale = langCode
      localStorage.setItem('locale', langCode)
      this.isOpen = false
      
      // Afficher un message de confirmation
      const message = langCode === 'fr' ? 'Langue changée en Français' : 'Nova fiteny: Malagasy'
      alert(message)
      
      // Forcer le rechargement de la page pour appliquer tous les changements
      window.location.reload()
    }
  },
  mounted() {
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.isOpen = false
      }
    })
  }
}
</script>

<style scoped>
.language-selector {
  position: relative;
  z-index: 1000;
}

.lang-dropdown {
  position: relative;
  cursor: pointer;
}

.lang-selected {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.lang-selected:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.lang-flag {
  font-size: 1.2rem;
}

.lang-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
}

.dropdown-icon {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
}

.lang-options {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 160px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1000;
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #2c3e50;
}

.lang-option:hover {
  background: #f5f5f5;
  padding-left: 20px;
}

.lang-option.active {
  background: #27ae60;
  color: white;
}

.lang-option.active .lang-name {
  color: white;
}

.lang-option .lang-flag {
  font-size: 1.2rem;
}

.lang-option .lang-name {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  color: inherit;
}

.check-icon {
  font-size: 0.9rem;
  font-weight: bold;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .lang-name {
    display: none;
  }
  
  .lang-selected {
    padding: 8px;
  }
  
  .dropdown-icon {
    display: none;
  }
}
</style>