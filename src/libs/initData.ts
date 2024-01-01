import { getSWR, getStorage, setStorage } from './'
import { todoList, todayList, ydayList, tmrList, NoticeType } from '../data'
import { toRaw, watch } from 'vue'

type DateList = Omit<ReturnType<typeof getStorage>, 'lastTime'>

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

  watchData()
}

function validDate(dateList: ReturnType<typeof getStorage>) {
  const offset = calOffset(dateList.lastTime)

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

function calOffset(time: number) {
  let offset = (Date.now() - time) / ONE_DAY
  if (offset === 0) {
    offset = new Date().getDate() !== new Date(time).getDate() ? 1 : 0
  }

  return offset
}

function watchData() {
  watch(tmrList, () => {
    getSWR().then(sw => {
      sw!.postMessage({
        key: 'tmrList', 
        value: toRaw(tmrList)
      })
    })

    setStorage()
  }, {
    deep: true,
    immediate: true
  })

  watch(todayList, () => {
    getSWR().then(sw => {
      sw!.postMessage({
        key: 'todayList', 
        value: toRaw(todayList)
      })
    })

    setStorage()
  }, {
    deep: true,
    immediate: true
  })

  watch(todoList, () => {
    setStorage()
  }, {
    deep: true,
    immediate: true
  })

  watch(ydayList, () => {
    setStorage()
  }, {
    deep: true,
    immediate: true
  })
}