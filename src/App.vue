<script setup lang="ts">
import TodayList from './components/TodayList.vue'
import TmrList from './components/TmrList.vue'
import TodoList from './components/TodoList.vue'
import YdayList from './components/YdayList.vue'
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
