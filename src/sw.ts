import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { NoticeType } from './data'

declare let self: ServiceWorkerGlobalScope
interface NoticeEvent extends ExtendableMessageEvent {
  data: { 
          key: 'tmrList' | 'todayList',
          value: NoticeType[]
        }
}

if (import.meta.env.MODE === 'production') {
  // self.__WB_MANIFEST is default injection point
  precacheAndRoute(self.__WB_MANIFEST)
  
  // clean old assets
  cleanupOutdatedCaches()
  
  // to allow work offline
  registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))
}

const noticePool: {
  todayList: NoticeType[]
  tmrList: NoticeType[]
} = {
  todayList: [],
  tmrList: []
}

self.addEventListener('message', (e: NoticeEvent) => {
  const notices = e.data
  noticePool[notices.key] = []
  notices.value.forEach(item => {
    if (item.timestamp > Date.now()) {
      noticePool[notices.key].push(item)
    }
  })
})
self.addEventListener('install', () => {
  let lastDate = new Date()

  setInterval(() => {
    const date = new Date()

    if (lastDate.getDate() !== date.getDate()) {
      lastDate = date
      noticePool.todayList = noticePool.tmrList
      noticePool.tmrList = []
    }
    const t = Date.now()
    noticePool.todayList.forEach((n, idx) => {
      if (t >= n.timestamp) {
        self.registration.showNotification('Hello', {
          body: n.noticeName
        })
        noticePool.todayList.splice(idx, 1)
      }
    })
  }, 1000)
})

export {}