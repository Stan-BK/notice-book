const SW = import.meta.env.MODE === 'production' ? '/notice-book/sw.js' : '/src/sw.ts'

let swr: ServiceWorkerRegistration

export async function getSWR() {
  return swr.active || swr.installing
}

export async function SWR() {
  swr = await navigator.serviceWorker.getRegistration(SW) as ServiceWorkerRegistration

  if (swr) {
    swr.unregister()
  }
  swr = await navigator.serviceWorker.register(SW, {
    type: 'module'
  }).then(serviceWorkerRegistration => {
    return serviceWorkerRegistration
  })
  return swr
}
