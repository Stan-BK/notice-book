import { ref } from 'vue'

const SW = import.meta.env.MODE === 'production' ? '/sw.js' : '/src/sw.ts'

const SCOPE = import.meta.env.MODE === 'production' ? '/' : '/src/'

let SUBSCRIPTION_PATH = ''

export async function getSubscriptionPath() {
  if (!SUBSCRIPTION_PATH)
    SUBSCRIPTION_PATH = await fetch('/getVars').then(res => res.text())
  return SUBSCRIPTION_PATH
}

export async function getTimeRange() {
  return await fetch('/getTimeRange').then(res => res.json()) as number[]
}

let swr: ServiceWorkerRegistration | undefined
let temporaryId: number
export let endpoint: string | null
export const isInstalled = ref(false)
const intervalMS = 1000 * 60 * 5
let isIntervalRunning = false

// Process:
// 1. `checkSubscription`
// 2. if not installed, `registerServiceWorker`
// 3. if installed, `initPushManager`
// 4. if not subscribed, `subscribe`
// 5. if subscribed, `getEndpointFromStorage`
// 6. update service worker at intervals

export async function checkSubscription() {
  swr = await navigator.serviceWorker.getRegistration(SW)
  if (swr) {
    const sub = await swr!.pushManager.getSubscription()
    if (sub) {
      getEndpointFromStorage()
      isInstalled.value = true
      updateServiceWorker()
    }
    return !!sub
  }
  return !!swr
}

export async function initServiceWorker(): Promise<void> {
  if (!swr) {
    await registerServiceWorker()
  } else {
    await initPushManager()
  }
}

async function initPushManager() {
  const sub = await swr!.pushManager.getSubscription()

  if (sub) {
    getEndpointFromStorage()
    isInstalled.value = true
  } else {
    await subscribe()
  }
}

export async function registerServiceWorker() {
  await navigator.serviceWorker
    .register(SW, {
      type: 'module',
      scope: SCOPE,
    })
    .then(async (registration) => {
      swr = registration
      updateServiceWorker()
      return await subscribe()
    })
    .catch((err) => {
      throw err
    })
}

export async function subscribe() {
  const publicKey = urlBase64ToUint8Array(await generateVAPIDKeys())

  return swr!.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKey,
    })
    .then(async (sub) =>
      fetch(await getSubscriptionPath() + '/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          temporaryId,
          subscription: sub,
        }),
      })
        .then(() => {
          endpoint = sub.endpoint
          setEndpointToStorage()

          isInstalled.value = true
        })
        .catch(() => {
          throw new Error('subscribe from server error')
        })
    )
    .catch((err) => {
      throw err
    })
}

export async function unsubscribe() {
  return swr!.pushManager
    .getSubscription()
    .then(async (sub) =>
      fetch(await getSubscriptionPath() + '/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({
          endpoint: sub?.endpoint,
        }),
      })
        .then(() => {
          endpoint = null
          isInstalled.value = false
          sub!.unsubscribe()
          setEndpointToStorage()
        })
        .catch(() => {
          throw new Error('unsubscribe from server error')
        })
    )
    .catch((err) => {
      throw err
    })
}

async function generateVAPIDKeys() {
  return await fetch(await getSubscriptionPath() + '/generateVAPIDKeys', {
    body: JSON.stringify((temporaryId = Date.now())),
    method: 'POST',
  })
    .then(async (res) => await res.text())
    .catch(() => {
      throw new Error('Generate vapid key from server error')
    })
}

function getEndpointFromStorage() {
  endpoint = localStorage.getItem('endpoint')
}

function setEndpointToStorage() {
  localStorage.setItem('endpoint', endpoint!)
}

function updateServiceWorker() {
  if (isIntervalRunning) return
  isIntervalRunning = true

  setInterval(() => {
    if (swr && swr.active) swr.update()
  }, intervalMS)
}

// This function is needed because Chrome doesn't accept a base64 encoded string
// as value for applicationServerKey in pushManager.subscribe yet
// https://bugs.chromium.org/p/chromium/issues/detail?id=802280
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
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
