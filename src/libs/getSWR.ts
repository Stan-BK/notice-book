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
