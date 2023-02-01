import { toRaw, reactive, watch } from 'vue'
import { getSWR, setStorage } from './libs'

export interface NoticeType {
  noticeName: string
  description: string
  isChosen: boolean
  hour: number
  minute: number
}

export const todoList: NoticeType[] = reactive([])
export const tmrList: NoticeType[] = reactive([])
export const todayList: NoticeType[] = reactive([])
export const ydayList: NoticeType[] = reactive([])

watch(tmrList, () => {
  getSWR().then(swr => {
    swr.active?.postMessage({
      key: 'tmrList', 
      value: toRaw(tmrList)
    })
  })

  setStorage()
}, {
  deep: true
})

watch(todayList, () => {
  getSWR().then(swr => {
    swr.active?.postMessage({
      key: 'todayList', 
      value: toRaw(todayList)
    })
  })

  setStorage()
}, {
  deep: true
})

watch(todoList, () => {
  setStorage()
}, {
  deep: true
})

watch(ydayList, () => {
  setStorage()
}, {
  deep: true
})