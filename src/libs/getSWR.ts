import { registerSW } from 'virtual:pwa-register'

const intervalMS = 60 * 60 * 1000
let firstLoad = true
const SW = import.meta.env.MODE === 'production' ? '/notice-book/sw.js' : '/src/sw.ts'

let swr: ServiceWorkerRegistration

export async function getSWR() {
  swr.active?.postMessage('close')
  return swr.active || swr.installing
}

export async function SWR() {
  swr = await navigator.serviceWorker.getRegistration(SW) as ServiceWorkerRegistration
  
  if (swr) {
    await unregisterSW()
  }

  swr = await navigator.serviceWorker.register(SW, {
    type: 'module',
    scope: `./?${Date.now()}`
  }).then(serviceWorkerRegistration => {
    return serviceWorkerRegistration
  })
}

export async function unregisterSW() {
  swr.active?.postMessage('close')
  await swr.unregister()
}