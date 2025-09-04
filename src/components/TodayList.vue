<script setup lang="ts">
import NtCard from './NtCard.vue'
import NtList from './NtList.vue'
import { isInstalled, todayList, toggleItems } from '../libs'
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
        :class="todayList.length && isInstalled && 'scroll'"
        style="font-size: 14px;"
      />
      <span
        class="remark"
        :style="{
          color: todayList.length && isInstalled ? '#1a9338' : 'var(--color-gray-600)'
        }"
      >
        {{ 
          isInstalled ? 
            `${todayList.length} notice today` : `haven't subscription`
        }}
      </span>
    </template>

    <PScrollable class="w-full">
      <nt-list :notices="todayList" />
    </PScrollable>
  </nt-card>
</template>

<style scoped>
.today-list {
  height: calc(48% - 40px);
  border-radius: 16px;
  padding: 50px 16px 16px;
}
.remark {
  font-size: 12px;
  margin-left: 12px;
  opacity: 0.8;
  transition: .2s;
}
.scroll {
  /* spin animate from tailwindcss */
  animation: spin 1s linear infinite;
}
</style>
