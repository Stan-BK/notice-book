import { getStorage } from './'
import { todoList, todayList, ydayList, tmrList } from '../data'

export function initData() {
  const { 
    todoList: todo,
    todayList: today,
    ydayList: yday,
    tmrList: tmr
  } = getStorage()

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