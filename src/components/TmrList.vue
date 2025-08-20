<script setup lang="ts">
import NtCard from './NtCard.vue'
import NtList from './NtList.vue'
import { tmrList, toggleItems } from '../libs'

</script>

<template>
  <nt-card
    :is-need-port="true"
    class="TmrList"
    @toggle="() => toggleItems(tmrList)"
  >
    <template #title>
      Tomorrow
    </template>

    <PScrollable class="w-full">
      <nt-list :notices="tmrList" />
    </PScrollable>
  </nt-card>
</template>

<style scoped>
.TmrList {
  height: calc(48% - 40px);
  padding: 45px 20px 20px;
  background: linear-gradient(rgb(var(--card-bg-color), .4), rgb(var(--card-bg-color)));
}
</style>
