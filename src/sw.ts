import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { clientsClaim } from 'workbox-core'
import { NoticeType } from './libs/data'

declare let self: ServiceWorkerGlobalScope

let endpoint: string | null
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
  if (event.data && event.data.type === 'setup_endpoint') {
    endpoint = event.data.endpoint
  }
  if (event.data && event.data.type === 'get_endpoint') {
    event.source!.postMessage({
      type: 'get_endpoint',
      endpoint
    })
  }
})

export { }