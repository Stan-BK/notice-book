import { reactive } from 'vue'

export interface NoticeType {
  id: number | string
  noticeName: string
  description: string
  isChosen: boolean
  hour: number
  minute: number
  isRepeat: boolean
}

export const todoList: NoticeType[] = reactive([])
export const tmrList: NoticeType[] = reactive([])
export const todayList: NoticeType[] = reactive([])
export const ydayList: NoticeType[] = reactive([])
