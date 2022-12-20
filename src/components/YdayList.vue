<script setup lang="ts">
import NtCard from './NtCard.vue'
</script>
<template>
  <nt-card :is-need-port="true" class="YdayList">
    <template #title>Y'day</template>
  </nt-card>
</template>
<style scoped>
.YdayList {
  width: 100%;
  height: calc(48% - 40px);
  float: right;
  margin-top: calc(4vh);
  margin-bottom: 40px;
  border-radius: 20px;
  padding: 40px;
  background: linear-gradient(rgb(var(--card-bg-color), .4), rgb(var(--card-bg-color)));
}
</style>