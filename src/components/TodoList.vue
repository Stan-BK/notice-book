<script setup lang="ts">
import NtCard from './NtCard.vue'
import NtList from './NtList.vue'
import { todoList } from '../data'

function addNotice() {
  todoList.push({
    noticeName: '待办事项',
    description: '',
    isChosen: false,
    hour: 0,
    minute: 0
  })
}

function removeNotice() { 
  for (let i = 0; i < todoList.length;) {
    if (todoList[i].isChosen) {
      todoList.splice(i, 1)
    } else 
      i++
  }
}
</script>
<template>
  <nt-card class="todo-list">
    <template #title>
      Todo List
    </template>
    <template #control-bar>
      <span
        class="addition"
        @click="addNotice"
      >+</span>
      <span
        class="remove"
        @click="removeNotice"
      >-</span>
    </template>
    <nt-list :notices="todoList" />
  </nt-card>
</template>
<style scoped lang="less">
.todo-list {
  width: 45%;
  height: calc(100% - 40px);
  float: left;
  margin-top: 40px;
  margin-left: 80px;
  border-radius: 20px;
  padding: 40px;
}

.addition {
  font-size: 2em;
  margin-right: 1em;
  cursor: pointer;
}

.addition:hover, .remove:hover {
  color: var(--hover-color);
}

.remove {
  font-size: 2em;
  cursor: pointer;
}
</style>