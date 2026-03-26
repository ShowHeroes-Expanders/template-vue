import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.config.globalProperties.$shClickUrl = (id) => window.shClickURLs[id || 'main']
app.mount('#app')
