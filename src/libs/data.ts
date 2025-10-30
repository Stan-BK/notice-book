import { reactive } from 'vue'

export interface NoticeType {
  id: number | string
  noticeName: string
  description: string
  isChosen: boolean
  hour: number
  minute: number
  isRepeat?: boolean
}

export const todoList = reactive<NoticeType[]>([])
export const tmrList = reactive<NoticeType[]>([])
export const todayList = reactive<NoticeType[]>([])
export const ydayList = reactive<NoticeType[]>([])
