const SW =
  import.meta.env.MODE === 'production' ? '/sw.js' : '/src/sw.ts'

const SCOPE = import.meta.env.MODE === 'production' ? '/' : '/src/'

export const SUBSCRIPTION_PATH = 'https://notice.geminikspace.com/worker'

let swr: ServiceWorkerRegistration
let temporaryId: number | null
export let endpoint: string | null

export async function SWR(): Promise<void> {
  swr = (await navigator.serviceWorker.getRegistration(SW))!

  if (!swr)
    await navigator.serviceWorker
      .register(SW, {
        type: 'module',
        scope: SCOPE,
      }).then(async (registration) => {
        swr = registration

        return await subscribe().catch((e) => {
          console.error('Service worker registration failed:', e)
        })
      })
  else {
    return new Promise((resolve) => {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'get_endpoint') {
          endpoint = event.data.endpoint
        }
        resolve()
      })
      swr.active!.postMessage({ type: 'get_endpoint' })
    })
  }
}

export async function subscribe() {
  const publicKey = urlBase64ToUint8Array(await generateVAPIDKeys())

  return swr.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicKey,
  }).then(async (sub) => 
    fetch(SUBSCRIPTION_PATH + '/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        temporaryId,
        subscription: sub,
      }),
    }).then(() => {
      endpoint = sub.endpoint
      ;(swr.installing || swr.active)!.postMessage({
        type: 'setup_endpoint',
        endpoint: sub.endpoint,
      })
    })
  )
}

async function generateVAPIDKeys() {
  return await fetch(SUBSCRIPTION_PATH + '/generateVAPIDKeys', { body: JSON.stringify(temporaryId = Date.now()), method: 'POST' }).then(async (res) =>
    await res.text()
  )
}

// This function is needed because Chrome doesn't accept a base64 encoded string
// as value for applicationServerKey in pushManager.subscribe yet
// https://bugs.chromium.org/p/chromium/issues/detail?id=802280
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')
 
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

