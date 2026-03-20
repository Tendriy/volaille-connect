import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Création de l'application
const app = createApp(App)

// Utilisation du routeur
app.use(router)

// Montage de l'application
app.mount('#app')

console.log('Application VOLAILLE CONNECT démarrée!')