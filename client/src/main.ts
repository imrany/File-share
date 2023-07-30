import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import 'primeicons/primeicons.css';
import './assets/main.css'
const app = createApp(App)

app.use(router)

app.mount('#app')

//register service worker
if('serviceWorker' in navigator){
    navigator.serviceWorker.register("./sw.js")
    .then(()=>console.log('sw registered'))
    .catch((err)=>console.log('sw not registerd', err))
}