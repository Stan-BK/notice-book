<script setup lang="ts">
import NtCard from './NtCard.vue'
import NtList from './NtList.vue'
import { tmrList } from '../data'
import { toggleItems } from '../src'

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
    <div class="notice-list-wrap">
      <nt-list :notices="tmrList" />
    </div>
  </nt-card>
</template>
<style scoped>
.TmrList {
  width: 100%;
  height: calc(48% - 40px);
  float: right;
  margin-top: calc(4vh);
  border-radius: 20px;
  padding: 40px;
  background: linear-gradient(rgb(var(--card-bg-color), .4), rgb(var(--card-bg-color)));
}

.notice-list-wrap {
  height: 100%;
  padding-bottom: 20px;
}
</style>