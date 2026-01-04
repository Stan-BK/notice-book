import PXD from 'pxd'
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import 'pxd/styles.css'

const app = createApp(App)

app.use(PXD)
app.mount('#app')
