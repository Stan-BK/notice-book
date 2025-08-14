<script setup lang="ts">
import NtCard from './NtCard.vue'
import NtList from './NtList.vue'
import { todayList } from '../data'
import { toggleItems } from '../src'
</script>
<template>
  <nt-card
    :is-need-port="true"
    class="today-list"
    @toggle="() => toggleItems(todayList)"
  >
    <template #title>
      Today
    </template>
    <div class="notice-list-wrap">
      <nt-list :notices="todayList" />
    </div>
  </nt-card>
</template>
<style scoped>
.today-list {
  height: calc(48% - 40px);
  border-radius: 20px;
  padding: 40px;
  background: linear-gradient(rgb(var(--card-bg-color), .4), rgb(var(--card-bg-color)));
}
</style>
