const SW =
  import.meta.env.MODE === 'production' ? '/notice-book/sw.js' : '/src/sw.ts'

let swr: ServiceWorkerRegistration

export async function getSWR() {
  swr.active?.postMessage('close')
  return swr.active || swr.installing
}

export async function SWR() {
  await unregisterSW()

  swr = await navigator.serviceWorker
    .register(SW, {
      type: 'module',
      scope: `./sw?${Date.now()}`,
    })
    .then((serviceWorkerRegistration) => {
      return serviceWorkerRegistration
    })
}

export async function unregisterSW() {
  const registrations = await navigator.serviceWorker.getRegistrations()
  for (const registration of registrations) {
    if (
      registration.scope.startsWith('https://stan-bk.github.io/notice-book/sw')
    ) {
      registration.active?.postMessage('close')
      await registration.unregister()
    }
  }
}
