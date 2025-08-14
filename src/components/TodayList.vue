<script setup lang="ts">
import NtCard from './NtCard.vue'
import NtList from './NtList.vue'
import { todayList, toggleItems } from '../libs'
import SettingsGearIcon from '@gdsicon/vue/settings-gear'
</script>
<template>
  <nt-card
    :is-need-port="true"
    class="today-list"
    @toggle="() => toggleItems(todayList)"
  >
    <template #title>
      Today
      <settings-gear-icon
        :class="todayList.length && 'scroll'"
        style="font-size: 14px;"
      />
      <span
        class="remark"
        :style="{
          color: todayList.length ? '#1a9338' : 'var(--color-gray-600)'

        }"
      >
        {{ todayList.length }} notice today
      </span>
    </template>
    <div class="w-full">
      <nt-list :notices="todayList" />
    </div>
  </nt-card>
</template>
<style scoped>
.today-list {
  height: calc(48% - 40px);
  border-radius: 20px;
  padding: 40px;
  background: linear-gradient(rgb(var(--card-bg-color), .4), rgb(var(--card-bg-color)));
}
.remark {
  font-size: 12px;
  margin-left: 12px;
  opacity: 0.8;
  transition: .2s;
}
.scroll {
  animation: scroll 1s linear infinite;
}
@keyframes scroll {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
