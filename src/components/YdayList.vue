<script setup lang="ts">
import NtCard from './NtCard.vue'
import NtList from './NtList.vue'
import { ydayList, toggleItems } from '../libs'
</script>
<template>
  <nt-card
    :is-need-port="true"
    class="YdayList"
    @toggle="() => toggleItems(ydayList)"
  >
    <template #title>
      Y'day
    </template>
    <div class="w-full">
      <nt-list :notices="ydayList" />
    </div>
  </nt-card>
</template>
<style scoped>
.YdayList {
  height: calc(48% - 40px);
  padding: 40px;
  background: linear-gradient(rgb(var(--card-bg-color), .4), rgb(var(--card-bg-color)));
}
</style>
