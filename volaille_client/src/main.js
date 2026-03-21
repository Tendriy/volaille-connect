import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './locales'

// Création de l'application
const app = createApp(App)

// Utilisation du routeur et de i18n
app.use(router)
app.use(i18n)

// Montage de l'application
app.mount('#app')

console.log('Application VOLAILLE CONNECT démarrée!')
console.log('Langue actuelle:', i18n.global.locale.value)