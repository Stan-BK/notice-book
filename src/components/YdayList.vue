<script setup lang="ts">
import { toggleItems, ydayList } from '../libs'
import NtCard from './NtCard.vue'
import NtList from './NtList.vue'
</script>

<template>
  <NtCard :is-need-port="true" class="YdayList" @toggle="() => toggleItems(ydayList)">
    <template #title>
      Y'day
    </template>

    <PScrollable class="w-full">
      <NtList v-model="ydayList" />
    </PScrollable>
  </NtCard>
</template>

<style scoped>
.YdayList {
  height: calc(33.33vh - 35px);
  padding: 50px 16px 16px;
}
</style>
