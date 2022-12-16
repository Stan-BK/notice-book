<script setup lang="ts">
import { onMounted } from 'vue'
import TodayList from './components/TodayList.vue'
import TodoList from './components/TodoList.vue'
import YdayList from './components/YdayList.vue'
import { getStorage } from './utils/storage'
import { todoList, todayList, ydayList, NoticeType } from './data'

onMounted(() => {
  todoList.splice(0, todoList.length, ...getStorage('notice-list-todo-list'))
  todayList.splice(0, todoList.length, ...getStorage('notice-list-today-list'))
  ydayList.splice(0, todoList.length, ...getStorage('notice-list-yday-list'))
})
</script>

<template>
  <div class="page">
    <todo-list />
    <today-list />
    <yday-list />
  </div>
</template>

<style scoped>
.page {
  width: 100vw;
  height: 100vh;
  background-color: var(--main-bg-color);
  overflow: hidden;
}

</style>
