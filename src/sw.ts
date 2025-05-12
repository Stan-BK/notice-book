import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { clientsClaim } from 'workbox-core'
import { NoticeType } from './data'

declare let self: ServiceWorkerGlobalScope

let subscription: PushSubscription | null
self.skipWaiting()
clientsClaim()

if (import.meta.env.MODE === 'production') {
  // self.__WB_MANIFEST is default injection point
  precacheAndRoute(self.__WB_MANIFEST)
  
  // clean old assets
  cleanupOutdatedCaches()
  
  // to allow work offline
  registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))
}

self.addEventListener('push', (event) => {
  const data = event.data?.json() as NoticeType
  if (data) {
    const { noticeName, description } = data
    event.waitUntil(
      self.registration.showNotification(noticeName, {
        body: description,
      })
    )
  }
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'setup_subscription') {
    subscription = event.data.subscription
  }
  if (event.data && event.data.type === 'get_subscription') {
    postMessage({
      type: 'get_subscription',
      subscription
    })
  }
})

export {}