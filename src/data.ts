import { reactive } from 'vue'

export interface NoticeType {
  noticeName: string
  description: string
  timestamp: number
  isChosen: boolean
}

export const todoList: NoticeType[] = reactive([])
export const todayList: NoticeType[] = reactive([])
export const ydayList: NoticeType[] = reactive([])