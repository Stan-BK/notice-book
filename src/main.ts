import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { SWR, getSWR, initData, initNotification } from './libs'

const app = createApp(App)

app.mount('#app')

async function init() {
  await SWR()
  initData()
  initNotification()
}

init()