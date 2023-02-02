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
    if (getTime(item.hour, item.minute) > Date.now()) {
      noticePool[notices.key].push(item)
    }
  })
})
self.addEventListener('install', () => {
  let lastDate = new Date()

  setInterval(() => {
    const date = new Date()
    const todayTodo = noticePool.todayList.reduce((prev, cur) => `\n--${prev + cur.noticeName}`, '')
    console.log(`%cNotice book: There have ${ noticePool.todayList.length } notices wait for posting today. ${ todayTodo }`, 'color: green')
    if (lastDate.getDate() !== date.getDate()) {
      lastDate = date
      noticePool.todayList = noticePool.tmrList
      noticePool.tmrList = []
    }
    const t = Date.now()
    noticePool.todayList.forEach((n, idx) => {
      if (t >= getTime(n.hour, n.minute)) {
        self.registration.showNotification('Hello', {
          body: n.noticeName
        })
        console.log('Notice book: \"', n.noticeName, '\"通知已到时效')
        noticePool.todayList.splice(idx, 1)
      }
    })
  }, 1000)
})

function getTime(hour: number, minute: number) {
  const date = new Date()
  date.setHours(hour)
  date.setMinutes(minute)
  return date.getTime()
}

export {}