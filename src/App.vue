<script setup lang="tsx">
import { isInstalled, initServiceWorker, unsubscribe, checkSubscription, initData, initNotification } from './libs'
import TodayList from './components/TodayList.vue'
import TmrList from './components/TmrList.vue'
import TodoList from './components/TodoList.vue'
import YdayList from './components/YdayList.vue'
import { onMounted, computed, ref } from 'vue'
import { useMessage, useDelayChange } from 'pxd'

const isVisible = ref(false)
// 延迟更新加载状态, 避免持续时间过短出现状态闪烁
const {
  value: isLoading,
  setValue: setLoading,
} = useDelayChange(false)

let changeStatusResolver: ((value: boolean | PromiseLike<boolean>) => void) | null

const installMessages = computed(() => {
  return isInstalled.value
    ? {
      topStatus: 'Actived',
      modalMsg: 'Do u want to Unsubscribe offline push?'
    }
    : {
      topStatus: 'Inactived',
      modalMsg: 'Do u want to Subscribe offline push?'
    }
})

async function init() {
  initData()
  initNotification()
}

async function handleConfirm() {
  setLoading(true)
  try {
    if (!isInstalled.value) {
      await initServiceWorker()
    } else {
      await unsubscribe()
    }
    init()
    handleClose()
    changeStatusResolver?.(isInstalled.value)
  } catch (e: any) {
    useMessage(e.message, { type: 'error' })
  } finally {
    setLoading(false, true)
    changeStatusResolver = null
  }

}

function handleClose() {
  isVisible.value = false
}

function onBeforeChangeStatus() {
  return new Promise<boolean>(resolve => {
    changeStatusResolver = resolve
    isVisible.value = true
  })
}

onMounted(async () => {
  const isSubscribed = await checkSubscription()
  if (!isSubscribed) {
    isVisible.value = true
  } else {
    init()
  }
})
</script>

<template>
  <PMessage position="top" />
  <header
    class="fixed top-0 w-full flex items-center justify-center gap-2 p-2"
    :class="{ 'pointer-events-none': isLoading }"
  >
    <PToggle
      v-model="isInstalled"
      :loading="isLoading"
      active-label="Actived"
      inactive-label="Inactived"
      active-color="hsl(var(--color-green-600-value))"
      inactive-color="hsl(var(--color-red-600-value))"
      :before-change="onBeforeChangeStatus"
    />

    <PThemeSwitcher
      size="xs"
      variant="ghost"
    />
  </header>

  <div class="page flex items-center gap-4 flex-col sm:flex-row">
    <todo-list />

    <PScrollable
      class="day-list-wrap flex-1 h-full"
      content-class="p-1"
    >
      <tmr-list />
      <today-list />
      <yday-list />
    </PScrollable>
  </div>

  <PModal
    v-model="isVisible"
    title="Subscription"
    header-stylize
    :loading="isLoading"
  >
    <PText> {{ installMessages.modalMsg }} </PText>

    <template #footer>
      <PButton
        :disabled="isLoading"
        @click="handleClose"
      >
        Cancel
      </PButton>

      <PButton
        variant="primary"
        :loading="isLoading"
        @click="handleConfirm"
      >
        Confirm
      </PButton>
    </template>
  </PModal>
</template>

<style scoped lang="less">
.page {
  width: 100vw;
  height: 100vh;
  padding: 40px 20px 20px;
}

.day-list-wrap {
  width: calc(50% - 10px);
}
</style>
