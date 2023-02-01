import { NoticeType, todoList } from '../data'
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

export function setStorage(key: string, value: object) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getStorage(): {
  todayList: any[],
  todoList: any[],
  tmrList: any[],
  ydayList: any[]
  } {

  return {
    todayList: JSON.parse(localStorage.getItem('todayList') ?? '[]'),
    todoList: JSON.parse(localStorage.getItem('todoList') ?? '[]'),
    ydayList: JSON.parse(localStorage.getItem('ydayList') ?? '[]'),
    tmrList: JSON.parse(localStorage.getItem('tmrList') ?? '[]')
  }
}