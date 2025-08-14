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
    <div class="w-full">
      <nt-list :notices="tmrList" />
    </div>
  </nt-card>
</template>
<style scoped>
.TmrList {
  height: calc(48% - 40px);
  padding: 40px;
  background: linear-gradient(rgb(var(--card-bg-color), .4), rgb(var(--card-bg-color)));
}
</style>
