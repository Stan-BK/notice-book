import { toRaw } from 'vue'
import { NoticeType, todoList, todayList, ydayList, tmrList } from '../data'
export * from './initData'
export * from './getSWR'
export * from './notification'

export function toggleItems(targetList: NoticeType[]) {
  const todoChosenList = todoList.reduce((prev: NoticeType[], cur) => cur.isChosen ? prev.concat(cur) : prev, [])
  const targetChosenList = targetList.reduce((prev: NoticeType[], cur) => cur.isChosen ? prev.concat(cur) : prev, [])

  for (let i = 0; i < todoList.length; ) {
    if (todoList[i].isChosen) {
      todoList.splice(i, 1)
      continue
    }
    i++
  }

  for (let i = 0; i < targetList.length; ) {
    if (targetList[i].isChosen) {
      targetList.splice(i, 1)
      continue
    }
    i++
  } 
  
  todoList.push(...targetChosenList)
  targetList.push(...todoChosenList)
}

export function setStorage() {
  const todo = toRaw(todoList)
  const today = toRaw(todayList)
  const tmr = toRaw(tmrList)
  const yday = toRaw(ydayList)
  const storage = getStorage()

  if (storage.todoList.toString() !== todo.toString() ||
      storage.tmrList.toString() !== tmr.toString() ||
      storage.todayList.toString() !== today.toString() ||
      storage.ydayList.toString() !== yday.toString()) {

    localStorage.setItem('lastTime', String(Date.now()))
  }

  localStorage.setItem('todoList', JSON.stringify(todo))
  localStorage.setItem('todayList', JSON.stringify(today))
  localStorage.setItem('tmrList', JSON.stringify(tmr))
  localStorage.setItem('ydayList', JSON.stringify(yday))

}

export function getStorage(): {
  todayList: any[],
  todoList: any[],
  tmrList: any[],
  ydayList: any[],
  lastTime: number
  } {

  return {
    todayList: JSON.parse(localStorage.getItem('todayList') ?? '[]'),
    todoList: JSON.parse(localStorage.getItem('todoList') ?? '[]'),
    ydayList: JSON.parse(localStorage.getItem('ydayList') ?? '[]'),
    tmrList: JSON.parse(localStorage.getItem('tmrList') ?? '[]'),
    lastTime: parseInt(localStorage.getItem('lastTime')!)
  }
}