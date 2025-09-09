import { endpoint, getSubscriptionPath, isInstalled } from '.'
import { todoList, todayList, ydayList, tmrList, NoticeType } from './data'
import { watch } from 'vue'
import { loadFromStorage, setStorage } from './storage'

export type NoticeListCollection = {
  todayList: NoticeType[]
  todoList: NoticeType[]
  ydayList: NoticeType[]
  tmrList: NoticeType[]
}

const noticeLists = [todoList, todayList, ydayList, tmrList]

const noticePool = new Map<NoticeType[], string>([[todoList, 'all'], [todayList, 'today'], [ydayList, 'yesterday'], [tmrList, 'tomorrow']])

function initFromStorage() {
  const {
    todayList = [],
    todoList = [],
    tmrList = [],
    ydayList = []
  } = loadFromStorage() ?? {}

  initDataList({
    todoList,
    todayList,
    ydayList,
    tmrList
  })
}

async function initFromServer() {
  const [todoList, todayList, ydayList, tmrList] = await Promise.all(noticeLists.map(async list =>
    await fetch(`${await getSubscriptionPath()}/noticeList?type=${noticePool.get(list)}`, {
      method: 'POST',
      body: JSON.stringify({
        endPoint: endpoint
      }),
    }).then(res => res.json()) as NoticeType[]
  ))
  initDataList({
    todoList,
    todayList,
    ydayList,
    tmrList
  })
}

export async function initDataList({
  todayList: todayL,
  tmrList: tmrL,
  todoList: todoL,
  ydayList: ydayL
}: NoticeListCollection) {
  todoList.splice(0, todoList.length, ...(todoL.map(notice => {
    notice.isChosen = false
    return notice
  })))
  todayList.splice(0, todayList.length, ...(todayL.map(notice => {
    notice.isChosen = false
    return notice
  })))
  ydayList.splice(0, ydayList.length, ...(ydayL.map(notice => {
    notice.isChosen = false
    return notice
  })))
  tmrList.splice(0, tmrList.length, ...(tmrL.map(notice => {
    notice.isChosen = false
    return notice
  })))

  watchData()
}

export async function initData() {
  if (isInstalled.value) {
    await initFromServer()
  } else {
    initFromStorage()
  }
}

function watchData() {
  watch(tmrList, () => {
    throttleUpdateNoticeList(tmrList)
  }, {
    deep: true,
    immediate: true,
  })

  watch(todayList, () => {
    throttleUpdateNoticeList(todayList)
  }, {
    deep: true,
    immediate: true,
  })

  watch(todoList, () => {
    throttleUpdateNoticeList(todoList)
  }, {
    deep: true,
    immediate: true,
  })

  watch(ydayList, () => {
    throttleUpdateNoticeList(ydayList)
  }, {
    deep: true,
    immediate: true,
  })
}

export function updateAllNoticeList() {
  updateNoticeList(todayList)
  updateNoticeList(todoList)
  updateNoticeList(ydayList)
  updateNoticeList(todoList)
}

async function updateNoticeList(list: NoticeType[]) {
  fetch(`${await getSubscriptionPath()}/update?type=${noticePool.get(list)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      endPoint: endpoint,
      noticeList: list
    })
  })
}

let timer: number
const batchPoll = new Map<NoticeType[], boolean>()
function throttleUpdateNoticeList(list: NoticeType[]) {
  clearTimeout(timer)
  batchPoll.set(list, true)
  timer = setTimeout(() => {
    batchPoll.forEach((isNeedUpdate, value) => {
      if (isNeedUpdate && isInstalled.value) {
        updateNoticeList(value)
      }
    })
    batchPoll.set(list, false)

    setStorage()
  }, 1000)
}