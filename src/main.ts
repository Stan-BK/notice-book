import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PXD from 'pxd'
import 'pxd/styles.css'

const app = createApp(App)

app.use(PXD)
app.mount('#app')