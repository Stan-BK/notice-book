import { toValue } from 'vue'
import { todayList, todoList, ydayList, tmrList } from './data'
import { NoticeListCollection } from './initData'

const storageKey = 'noticeList'

export function setStorage() {
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      todayList: toValue(todayList),
      todoList: toValue(todoList),
      ydayList: toValue(ydayList),
      tmrList: toValue(tmrList),
    })
  )
}

export function loadFromStorage() {
  const noticeList = localStorage.getItem(storageKey)
  if (noticeList) {
    return JSON.parse(noticeList) as NoticeListCollection
  }
}

export function clearStorage() {
  localStorage.removeItem(storageKey)
}