<script setup lang="tsx">
import LogoGithubSmallIcon from '@gdsicon/vue/logo-github-small'
import RefreshClockwiseIcon from '@gdsicon/vue/refresh-clockwise'
import { useDelayChange, useMessage } from 'pxd'
import { PRESET_MEDIA_QUERIES, useMediaQuery } from 'pxd/composables/use-media-query'
import { computed, onMounted, ref } from 'vue'
import TmrList from './components/TmrList.vue'
import TodayList from './components/TodayList.vue'
import TodoList from './components/TodoList.vue'
import YdayList from './components/YdayList.vue'
import { checkSubscription, initData, initNotification, initServiceWorker, isInstalled, unsubscribe, updateAllNoticeList } from './libs'

const isVisible = ref(false)
// 延迟更新加载状态, 避免持续时间过短出现状态闪烁
const { value: isLoading, setValue: setLoading } = useDelayChange(false)

const isSmUp = useMediaQuery(PRESET_MEDIA_QUERIES.SM_UP)

let changeStatusResolver: ((value: boolean | PromiseLike<boolean>) => void) | null

const installMessages = computed(() => {
  return isInstalled.value
    ? {
        topStatus: 'Actived',
        modalMsg: 'Do u want to Unsubscribe offline push?',
      }
    : {
        topStatus: 'Inactived',
        modalMsg: 'Do u want to Subscribe offline push?',
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
      updateAllNoticeList()
    }
    else {
      await unsubscribe()
    }
    handleClose()
    changeStatusResolver?.(isInstalled.value)
  }
  catch (e: any) {
    useMessage(e.message, { type: 'error' })
  }
  finally {
    setLoading(false, true)
    changeStatusResolver = null
  }
}

function handleClose() {
  isVisible.value = false
}

function tryReload() {
  // eslint-disable-next-line no-alert
  if (confirm('Do you want to refresh the app?'))
    location.reload()
}

function onBeforeChangeStatus() {
  return new Promise<boolean>((resolve) => {
    changeStatusResolver = resolve
    isVisible.value = true
  })
}

onMounted(async () => {
  const isSubscribed = await checkSubscription()
  if (!isSubscribed) {
    isVisible.value = true
  }
  init()
})
</script>

<template>
  <div class="wrapper h-full flex flex-col">
    <PMessage />

    <header
      class="sticky bg-background-100 top-0 w-full flex items-center justify-center gap-2 p-2 z-10"
      :class="{ 'pointer-events-none': isLoading }"
    >
      <PToggle
        v-model="isInstalled"
        :loading="isLoading"
        active-label="Actived"
        inactive-label="Inactived"
        active-color="hsl(var(--color-green-700-value))"
        inactive-color="hsl(var(--color-red-700-value))"
        :before-change="onBeforeChangeStatus"
      />

      <PThemeSwitcher size="xs" variant="ghost" />

      <PLinkButton icon size="xs" align="center" variant="ghost" href="https://github.com/Stan-BK/notice-book-repo" target="_blank">
        <LogoGithubSmallIcon />
      </PLinkButton>

      <PButton icon size="xs" align="center" variant="ghost" @click="tryReload">
        <RefreshClockwiseIcon />
      </PButton>
    </header>

    <PScrollable class="page flex-1 flex mt-2" content-class="flex gap-4 p-px flex-col sm:flex-row">
      <TodoList />

      <Component
        :is="isSmUp ? 'PScrollable' : 'div'"
        style="height: calc(100vh - 70px)"
        class="day-list-wrap flex-1"
        content-class="flex-1"
      >
        <PStack class="p-px">
          <TmrList />
          <TodayList />
          <YdayList />
        </PStack>
      </Component>
    </PScrollable>

    <PModal
      v-model="isVisible"
      title="Subscription"
      :loading="isLoading"
      :subtitle="installMessages.modalMsg"
      close-on-press-escape
      close-on-click-overlay
    >
      <template #footer>
        <PButton :disabled="isLoading" @click="handleClose">
          Cancel
        </PButton>

        <PButton variant="primary" :loading="isLoading" @click="handleConfirm">
          Confirm
        </PButton>
      </template>
    </PModal>
  </div>
</template>

<style scoped lang="less">
.wrapper {
  padding: 1px 16px 16px;
}

@media screen and (max-width: 639px) {
  :deep(.todo-list) {
    width: 100%;
  }
}
</style>
