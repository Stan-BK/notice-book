const SW =
  import.meta.env.MODE === 'production' ? '/sw.js' : '/src/sw.ts'

const SCOPE = import.meta.env.MODE === 'production' ? '/' : '/src/'

export const SUBSCRIPTION_PATH = 'https://notice.geminikspace.com/worker'

let swr: ServiceWorkerRegistration
let temporaryId: number | null
export let endPoint: string | null

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
      onmessage = (event) => {
        if (event.data && event.data.type === 'get_subscription') {
          endPoint = event.data.subscription.endpoint
        }
        resolve()
      }
      swr.active!.postMessage({ type: 'get_subscription' })
    })
  }
}

export async function subscribe() {
  const publicKey = await generateVAPIDKeys()

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
      endPoint = sub.endpoint
      ;(swr.installing || swr.active)!.postMessage({
        type: 'setup_subscription',
        subscription: sub,
      })
    })
  )
}

async function generateVAPIDKeys() {
  return await fetch(SUBSCRIPTION_PATH + '/generateVAPIDKeys', { body: JSON.stringify(temporaryId = Date.now()), method: 'POST' }).then(async (res) =>
    await res.text()
  )
}
