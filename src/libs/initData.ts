import { SUBSCRIPTION_PATH, endpoint } from './'
import { todoList, todayList, ydayList, tmrList, NoticeType } from '../data'
import { watch } from 'vue'

const noticeLists = [todoList, todayList, ydayList, tmrList]

const noticePool = new Map<NoticeType[], string>([[todoList, 'all'], [todayList, 'today'], [ydayList, 'yesterday'], [tmrList, 'tomorrow']])

export async function initData() {
  const [todoL, todayL, ydayL, tmrL] = await Promise.all(noticeLists.map(async list =>
    await fetch(`${SUBSCRIPTION_PATH}/noticeList?type=${noticePool.get(list)}`, {
      method: 'POST',
      body: JSON.stringify({
        endPoint: endpoint
      }),
    }).then(res => res.json()) as NoticeType[]
  ))

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

function watchData() {
  watch(tmrList, () => {
    throttleUpdateNoticeList(tmrList)
  }, {
    deep: true
  })

  watch(todayList, () => {
    throttleUpdateNoticeList(todayList)
  }, {
    deep: true,
  })

  watch(todoList, () => {
    throttleUpdateNoticeList(todoList)
  }, {
    deep: true,
  })

  watch(ydayList, () => {
    throttleUpdateNoticeList(ydayList)
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
      if (isNeedUpdate) {
        updateNoticeList(value)
      }
    })
    batchPoll.set(list, false)
  }, 1000)
}