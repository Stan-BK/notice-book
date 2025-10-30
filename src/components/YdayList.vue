<script setup lang="ts">
import NtCard from './NtCard.vue'
import NtList from './NtList.vue'
import { ydayList, toggleItems } from '../libs'
</script>

<template>
  <nt-card :is-need-port="true" class="YdayList" @toggle="() => toggleItems(ydayList)">
    <template #title> Y'day </template>

    <PScrollable class="w-full">
      <nt-list v-model="ydayList" />
    </PScrollable>
  </nt-card>
</template>

<style scoped>
.YdayList {
  height: calc(33.33vh - 35px);
  padding: 50px 16px 16px;
}
</style>
