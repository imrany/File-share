import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import 'primeicons/primeicons.css';
import './assets/main.css'
import 'vue-toast-notification/dist/theme-bootstrap.css'
import VueLazyload from 'vue3-lazyload'
import './index'
const app = createApp(App)
app.use(router)
app.use(VueLazyload,{
    
})
app.mount('#app')