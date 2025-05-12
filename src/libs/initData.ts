import { SUBSCRIPTION_PATH, endPoint } from './'
import { todoList, todayList, ydayList, tmrList, NoticeType } from '../data'
import { watch } from 'vue'

const noticeLists = [todoList, todayList, ydayList, tmrList]

const noticePool = new Map<NoticeType[], string>([[todoList, 'all'], [todayList, 'today'], [ydayList, 'yesterday'], [tmrList, 'tomorrow']])

export async function initData() {
  const [todoL, todayL, ydayL, tmrL] = await Promise.all(noticeLists.map(async list =>
    await fetch(`${SUBSCRIPTION_PATH}/noticeList?type=${noticePool.get(list)}`, {
      method: 'POST',
      body: JSON.stringify({
        endPoint
      }),
    }).then(async res => await res.json() as NoticeType[])
  ))

  todoList.splice(0, todoList.length, ...(todoL.map(notice => {
    notice.isChosen = false
    return notice
  })))
  todayList.splice(0, todoList.length, ...(todayL.map(notice => {
    notice.isChosen = false
    return notice
  })))
  ydayList.splice(0, todoList.length, ...(ydayL.map(notice => {
    notice.isChosen = false
    return notice
  })))
  tmrList.splice(0, todoList.length, ...(tmrL.map(notice => {
    notice.isChosen = false
    return notice
  })))

  watchData()
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