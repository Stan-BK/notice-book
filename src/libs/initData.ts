import { SUBSCRIPTION_PATH, endPoint, getStorage } from './'
import { todoList, todayList, ydayList, tmrList, NoticeType } from '../data'
import { watch } from 'vue'

const noticeLists = [todoList, todayList, ydayList, tmrList]

const noticePool = new Map<NoticeType[], string>([[todoList, 'all'], [todayList, 'today'], [ydayList, 'yesterday'], [tmrList, 'tomorrow']])
type DateList = Omit<ReturnType<typeof getStorage>, 'lastTime'>

const ONE_DAY = 1000 * 60 * 60 * 24

export async function initData() {
  const [todoL, todayL, ydayL, tmrL] = await Promise.all(noticeLists.map(async list =>
    await fetch(`${SUBSCRIPTION_PATH}/noticeList?type=${noticePool.get(list)}`, {
      method: 'POST',
      body: JSON.stringify({
        endPoint
      }),
    }).then(async res => await res.json())
  ))

  const {
    todoList: todo,
    todayList: today,
    ydayList: yday,
    tmrList: tmr
  } = validDate({
    todoList: todoL,
    todayList: todayL,
    ydayList: ydayL,
    tmrList: tmrL,
    lastTime: parseInt(localStorage.getItem('lastTime')!)
  })

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
    updateNoticeList(tmrList)
  }, {
    deep: true
  })

  watch(todayList, () => {
    updateNoticeList(todayList)
  }, {
    deep: true,
  })

  watch(todoList, () => {
    updateNoticeList(todoList)
  }, {
    deep: true,
  })

  watch(ydayList, () => {
    updateNoticeList(ydayList)
  }, {
    deep: true,
  })
}

function updateNoticeList(list: NoticeType[]) {
  fetch(`${SUBSCRIPTION_PATH}/update?type=${noticePool.get(list)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      endPoint,
      noticeList: list
    })
  })
} 