<script setup lang="ts">
import { tmrList, toggleItems } from '../libs'
import NtCard from './NtCard.vue'
import NtList from './NtList.vue'
</script>

<template>
  <NtCard :is-need-port="true" class="TmrList" @toggle="() => toggleItems(tmrList)">
    <template #title>
      Tomorrow
    </template>

    <PScrollable class="w-full">
      <NtList v-model="tmrList" />
    </PScrollable>
  </NtCard>
</template>

<style scoped>
.TmrList {
  height: calc(33.33vh - 35px);
  padding: 50px 16px 16px;
}
</style>
