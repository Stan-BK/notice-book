const SW =
  import.meta.env.MODE === 'production' ? '/notice-book/sw.js' : '/src/sw.ts'
  
const SCOPE = import.meta.env.MODE === 'production' ? '/notice-book/' : '/src/'

let swr: ServiceWorkerRegistration

export async function getSWR() {
  await SWR()
  return swr.active || swr.installing
}

export async function SWR() {
  try {
    swr = (await navigator.serviceWorker.getRegistration(SW))!
  } catch (e) {
    console.error('Service worker registration failed:', e)
  } finally {
    if (!swr) 
      swr = await navigator.serviceWorker
        .register(SW, {
          type: 'module',
          scope: SCOPE,
        })
  }
}

export async function unregisterSW() {
  const registrations = await navigator.serviceWorker.getRegistrations()
  for (const registration of registrations) {
    if (
      registration.scope.includes(SCOPE)
    ) {
      registration.active?.postMessage('close')
      await registration.unregister()
    }
  }
}
