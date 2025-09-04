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
      <nt-list v-model="tmrList" />
    </PScrollable>
  </nt-card>
</template>

<style scoped>
.TmrList {
  height: calc(48% - 40px);
  padding: 50px 16px 16px;
}
</style>
