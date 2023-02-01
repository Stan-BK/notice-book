import { getStorage, setStorage } from './'
import { todoList, todayList, ydayList, tmrList, NoticeType } from '../data'

type DateList = ReturnType<typeof getStorage>

const ONE_DAY = 1000 * 60 * 60 * 24

export function initData() {
  const { 
    todoList: todo,
    todayList: today,
    ydayList: yday,
    tmrList: tmr
  } = validDate(getStorage())

  todoList.splice(0, todoList.length, ...(todo.map(notice => {
    notice.isChosen = false
    return notice
  })))
  todayList.splice(0, todoList.length, ...(today.map(notice => {
    notice.isChosen = false
    return notice
  })))
  ydayList.splice(0, todoList.length, ...(yday.map(notice => {
    notice.isChosen = false
    return notice
  })))
  tmrList.splice(0, todoList.length, ...(tmr.map(notice => {
    notice.isChosen = false
    return notice
  })))
}

function validDate(dateList: ReturnType<typeof getStorage>) {
  let offset = 0
  if (tmrList.length > 0) {
    offset = calOffset(tmrList)    
  } else if (todayList.length > 0) {
    offset = calOffset(todayList)
  } else if (ydayList.length > 0) {
    offset = calOffset(ydayList)
  }

  return modifyDateList(offset, dateList)
}

function modifyDateList(offset: number, {
  todoList,
  todayList,
  ydayList,
  tmrList
}: DateList): DateList {
  if (offset === 1) {
    ydayList = todayList
    todayList = tmrList
    tmrList = []
  } else if (offset === 2) {
    ydayList = tmrList
    todayList = []
    tmrList = []
  } else if (offset > 2) {
    ydayList = tmrList = todayList = []
  }

  return {
    todoList,
    ydayList,
    todayList,
    tmrList
  }
}

function calOffset(arr: NoticeType[]) {
  let offset = (Date.now() - arr[0].timestamp) / ONE_DAY
  if (offset === 0) {
    offset = new Date().getDate() !== new Date(arr[0].timestamp).getDate() ? 1 : 0
  }

  return offset
}