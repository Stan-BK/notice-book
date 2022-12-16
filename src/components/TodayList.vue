<script setup lang="ts">
import NtCard from './NtCard.vue'
</script>
<template>
  <nt-card class="today-list">
    <template #title>Today</template>
  </nt-card>
</template>
<style scoped>
.today-list {
  width: 40%;
  height: calc(48% - 40px);
  float: right;
  margin-top: 40px;
  margin-right: 80px;
  border-radius: 20px;
  padding: 40px;
  background: linear-gradient(rgb(var(--card-bg-color), .4), rgb(var(--card-bg-color)));
}
</style>