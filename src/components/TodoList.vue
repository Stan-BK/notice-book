<script setup lang="ts">
import NtCard from './NtCard.vue'
import NtList from './NtList.vue'
import { todoList } from '../libs'
import PlusIcon from '@gdsicon/vue/plus'
import MinusIcon from '@gdsicon/vue/minus'

function addNotice() {
  todoList.push({
    id: Math.random(),
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
    } else {
      i++
    }
  }
}
</script>

<template>
  <nt-card class="todo-list w-full h-full">
    <template #title>
      Todo List
    </template>

    <template #control-bar>
      <div class="flex items-center gap-2">
        <PButton
          icon
          size="sm"
          variant="ghost"
          @click="addNotice"
        >
          <PlusIcon />
        </PButton>

        <PButton
          icon
          size="sm"
          variant="ghost"
          @click="removeNotice"
        >
          <MinusIcon />
        </PButton>
      </div>
    </template>

    <PScrollable class="w-full">
      <nt-list :notices="todoList" />
    </PScrollable>
  </nt-card>
</template>

<style scoped lang="less">
.todo-list {
  width: 50%;
  padding: 16px;
}
</style>
