<script setup lang="ts">
import NtCard from './NtCard.vue'
import NtList from './NtList.vue'
import { getTimeRange, isInstalled, todayList, toggleItems } from '../libs'
import SettingsGearIcon from '@gdsicon/vue/settings-gear'
import { computed, onUnmounted, ref } from 'vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

let intervalId: number | null = null
const startOfDay = dayjs().startOf('day')
const timeRange = ref([startOfDay, startOfDay])
const isInTimeRange = ref(true)
const isActive = computed(() =>
  isInstalled.value && isInTimeRange.value && todayList.length
)

getTimeRange().then((range) => {
  if (range && range.length === 2) {
    intervalId = setInterval(() => {
      const startOfDayVal = startOfDay.valueOf()
      timeRange.value = [dayjs(startOfDayVal + range[0]), dayjs(startOfDayVal + range[1])]
      if (dayjs().isBetween(timeRange.value[0], timeRange.value[1])) {
        isInTimeRange.value = true
      } else {
        isInTimeRange.value = false
      }
    }, 1000)
  }
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
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
        :class="isActive && 'scroll'"
        style="font-size: 14px"
      />
      <span
        class="remark"
        :style="{
          color:
            isActive
              ? '#1a9338'
              : 'var(--color-gray-600)',
        }"
      >
        {{
          !isInstalled
            ? `haven't subscription`
            : !isInTimeRange
              ? `Out of time range`
              : `Notice in time range will be noticed`
        }}
        {{
          `(Active time range: ${timeRange[0].format(
            "HH:mm"
          )} - ${timeRange[1].format("HH:mm")})`
        }}
      </span>
    </template>

    <PScrollable class="w-full">
      <nt-list
        v-model="todayList"
        :has-repeat-prop="true"
      />
    </PScrollable>
  </nt-card>
</template>

<style scoped>
.today-list {
  height: calc(33.33vh - 35px);
  border-radius: 16px;
  padding: 50px 16px 16px;
}
.remark {
  font-size: 12px;
  margin-left: 12px;
  opacity: 0.8;
  transition: 0.2s;
}
.scroll {
  /* spin animate from tailwindcss */
  animation: spin 1s linear infinite;
}
</style>
