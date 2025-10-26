<script setup lang="ts">
import { NoticeType } from '../libs'
import NtItem from './NtItem.vue'
import { defineModel } from 'vue'

defineProps<{
  hasRepeatProp: boolean
}>()

const notices = defineModel<NoticeType[]>({
  default: []
})
</script>

<template>
  <TransitionGroup
    name="list"
    tag="ul"
    class="notice-list w-full flex-1 list-none outline-none"
  >
    <NtItem
      v-for="(notice, index) in notices"
      :key="notice.id"
      v-model="notices[index]"
      :has-repeat-prop="hasRepeatProp"
    />
  </TransitionGroup>
</template>

<style scoped lang="less">
.notice-list {
  list-style: none;
  overflow-x: hidden;
  overflow-y: auto;
}

.list-enter-active {
  transition: all 0.5s 0.5s ease;
}
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
