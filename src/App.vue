<script setup lang="ts">
import { onMounted } from 'vue'
import TodayList from './components/TodayList.vue'
import TmrList from './components/TmrList.vue'
import TodoList from './components/TodoList.vue'
import YdayList from './components/YdayList.vue'
import { getStorage } from './utils/storage'
import { todoList, todayList, ydayList, tmrList } from './data'

onMounted(() => {
  todoList.splice(0, todoList.length, ...(getStorage('notice-list-todo-list').map(notice => {
    notice.isChosen = false
    return notice
  })))
  todayList.splice(0, todoList.length, ...(getStorage('notice-list-today-list').map(notice => {
    notice.isChosen = false
    return notice
  })))
  ydayList.splice(0, todoList.length, ...(getStorage('notice-list-yday-list').map(notice => {
    notice.isChosen = false
    return notice
  })))
  tmrList.splice(0, todoList.length, ...(getStorage('notice-list-yday-list').map(notice => {
    notice.isChosen = false
    return notice
  })))
})
</script>

<template>
  <div class="page">
    <todo-list />
    <div class="day-list-wrap">
      <tmr-list />
      <today-list />
      <yday-list />
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 100vw;
  height: 100vh;
  background-color: var(--main-bg-color);
  overflow: hidden;
}

.day-list-wrap {
  float: right;
  width: calc(55% - 120px);
  height: calc(100% - 80px);
  margin-top: 40px;
  margin-right: 40px;
  padding-right: 40px;
  padding-left: 5%;
  overflow-y: scroll;
}
</style>
