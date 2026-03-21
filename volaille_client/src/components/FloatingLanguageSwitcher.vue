<template>
  <div class="floating-lang-switcher">
    <div class="floating-trigger" @click="toggleMenu">
      <span class="globe-icon">🌐</span>
      <span class="current-lang">{{ currentLang }}</span>
    </div>
    
    <transition name="slide">
      <div v-if="isOpen" class="floating-menu">
        <div class="menu-header">
          <span>Choisir la langue / Mifidy fiteny</span>
        </div>
        <div 
          v-for="lang in languages" 
          :key="lang.code"
          @click="changeLanguage(lang.code)"
          class="menu-item"
          :class="{ active: currentLocale === lang.code }"
        >
          <span class="flag">{{ lang.flag }}</span>
          <span class="name">{{ lang.name }}</span>
          <span class="native">{{ lang.nativeName }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'FloatingLanguageSwitcher',
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
      const { locale } = useI18n()
      return locale.value
    },
    currentLang() {
      const lang = this.languages.find(l => l.code === this.currentLocale)
      return lang ? lang.flag : '🇫🇷'
    }
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen
    },
    changeLanguage(langCode) {
      const { locale } = useI18n()
      locale.value = langCode
      localStorage.setItem('locale', langCode)
      this.isOpen = false
      
      const langName = this.languages.find(l => l.code === langCode).name
      const message = langCode === 'fr' ? `Langue changée en ${langName}` : `Nova fiteny: ${langName}`
      
      const toast = document.createElement('div')
      toast.className = 'floating-toast'
      toast.innerHTML = `
        <div class="toast-content">
          <span class="toast-icon">${langCode === 'fr' ? '🇫🇷' : '🇲🇬'}</span>
          <span>${message}</span>
        </div>
      `
      document.body.appendChild(toast)
      
      setTimeout(() => {
        toast.classList.add('show')
      }, 100)
      
      setTimeout(() => {
        toast.classList.remove('show')
        setTimeout(() => {
          document.body.removeChild(toast)
        }, 300)
      }, 2000)
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
.floating-lang-switcher {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
}

.floating-trigger {
  width: 50px;
  height: 50px;
  background: #27ae60;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  color: white;
}

.floating-trigger:hover {
  transform: scale(1.1);
  background: #229954;
}

.globe-icon {
  font-size: 1.2rem;
}

.current-lang {
  font-size: 0.7rem;
  margin-top: 2px;
}

.floating-menu {
  position: absolute;
  bottom: 60px;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 220px;
  overflow: hidden;
}

.menu-header {
  background: #2c3e50;
  color: white;
  padding: 12px 15px;
  font-size: 0.8rem;
  text-align: center;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: #f5f5f5;
  padding-left: 20px;
}

.menu-item.active {
  background: #27ae60;
  color: white;
}

.menu-item .flag {
  font-size: 1.2rem;
}

.menu-item .name {
  font-weight: 500;
  font-size: 0.9rem;
}

.menu-item .native {
  font-size: 0.7rem;
  color: #666;
  margin-left: auto;
}

.menu-item.active .native {
  color: rgba(255, 255, 255, 0.8);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.floating-toast {
  position: fixed;
  bottom: 100px;
  right: 30px;
  z-index: 9999;
  opacity: 0;
  transform: translateX(100px);
  transition: all 0.3s ease;
}

.floating-toast.show {
  opacity: 1;
  transform: translateX(0);
}

.floating-toast .toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #2c3e50;
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  font-size: 0.9rem;
}

.floating-toast .toast-icon {
  font-size: 1.2rem;
}
</style>