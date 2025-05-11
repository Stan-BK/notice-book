const SW =
  import.meta.env.MODE === 'production' ? '/notice-book/sw.js' : '/src/sw.ts'

const SCOPE = import.meta.env.MODE === 'production' ? '/notice-book/' : '/src/'

export const SUBSCRIPTION_PATH = 'https://notice.geminikspace.com/worker'

let swr: ServiceWorkerRegistration
let temporaryId: number | null

export async function SWR() {
  try {
    swr = (await navigator.serviceWorker.getRegistration(SW))!
  } catch (e) {
    console.error('Service worker registration failed:', e)
  } finally {
    if (!swr)
      await navigator.serviceWorker
        .register(SW, {
          type: 'module',
          scope: SCOPE,
        }).then((registration) => {
          swr = registration
          
          subscribe().catch((e) => {
            console.error('Service worker registration failed:', e)
          })
        })
  }
}

export async function subscribe() {
  const publicKey = await generateVAPIDKeys()

  swr.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicKey,
  }).then((sub) => {
    fetch(SUBSCRIPTION_PATH + '/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        temporaryId,
        subscription: sub,
      }),
    })
  })
}

async function generateVAPIDKeys() {
  return await fetch(SUBSCRIPTION_PATH + '/generateVAPIDKeys', { body: JSON.stringify(temporaryId = Date.now()), method: 'POST' }).then((res) => {
    return res.json()
  })
}
