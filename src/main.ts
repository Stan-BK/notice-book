import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { getSWR, initData } from './libs'

const app = createApp(App)

app.mount('#app')

initData()
if (import.meta.env.MODE === 'development') {
  getSWR()
}

// navigator.serviceWorker.register('/src/sw.ts', {
//   type: 'module'
// }).then((res) => {
//   console.log(res)
//   navigator.serviceWorker.controller?.postMessage({
//     env: import.meta.env.MODE
//   })
// })
