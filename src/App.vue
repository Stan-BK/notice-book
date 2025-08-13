<script setup lang="tsx">
import { isInstalled, initServiceWorker, unsubscribe, checkSubscription } from './src/subscription'
import TodayList from './components/TodayList.vue'
import TmrList from './components/TmrList.vue'
import TodoList from './components/TodoList.vue'
import YdayList from './components/YdayList.vue'
import { onMounted, computed, ref } from 'vue'
import { initData, initNotification } from './src'
import { useMessage, useDelayChange } from 'pxd'

const isVisible = ref(false)
// 延迟更新加载状态, 避免持续时间过短出现状态闪烁
const {
  value: isLoading,
  setValue: setLoading,
  setValueDelay: setLoadingDelay,
} = useDelayChange(false)

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
  setLoadingDelay(true)
  try {
    if (!isInstalled.value) {
      await initServiceWorker()
    } else {
      await unsubscribe()
    }
    init()
    handleClose()
  } catch (e: any) {
    useMessage(e.message, {      type: 'error'    })
  } finally {
    setLoading(false)
  }

}

function handleClose() {
  isVisible.value = false
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
    :class="{
      'pointer-events-none': isLoading
    }"
  >
    <button
      class="outline-none"
      :style="{
        color: isInstalled ? '#42b983' : '#ff4949',
        opacity: isLoading ? 0.2 : 1,
      }"
      @click="isVisible = true"
    >
      {{ installMessages.topStatus }}
    </button>

    <div
      class="loading opacity-0"
      :class="{ 'opacity-100': isLoading }"
    >
      <div class="loading-dot" />
      <div class="loading-dot" />
      <div class="loading-dot" />
    </div>
  </header>

  <div class="page">
    <todo-list />
    <div class="day-list-wrap outline-none">
      <tmr-list />
      <today-list />
      <yday-list />
    </div>
  </div>

  <PModal
    v-model="isVisible"
    title="Subscription"
    header-stylize
    close-on-press-escape
    close-on-click-overlay
    :loading="isLoading"
  >
    <PText> {{ installMessages.modalMsg }} </PText>

    <template #footer>
      <PButton
        :disable="isLoading"
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

<style>
h3 {
  margin: 0 !important;
}
</style>
<style scoped lang="less">
header {
  position: fixed;
  left: 50%;
  top: 0;
  width: 140px;
  height: 32px;
  clip-path: path("M 0 0 C 45 0 0 32 45 32  L 100 32 C 140 32 100 0 140 0 z");
  background: linear-gradient(rgb(var(--card-bg-color)),
      rgb(var(--card-bg-color), 0.5));
  color: var(--color);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
  transform: translateX(-40%);
  font-weight: 700;

  &:hover {
    clip-path: path("M 0 0 C 50 0 0 32 50 32  L 90 32 C 140 32 90 0 140 0 z");

    button {
      width: 100%;
      font-size: 17px;
    }
  }

  button {
    width: 100%;
    height: 100%;
    border: none;
    background: none;
    font-size: 15px;
    transition: 0.3s;
    cursor: pointer;
  }

  .loading {
    position: absolute;
    width: 40px;
    height: 8px;
    right: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    left: 50%;
    height: 100%;
    transform: translateX(-50%);
    translate: .1s;
    pointer-events: none;

    .loading-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #abaaaa;
      animation: loadingDot 0.8s infinite reverse;

      &:nth-child(2) {
        animation-delay: 0.24s;
      }

      &:nth-child(3) {
        animation-delay: 0.48s;
      }
    }

    @keyframes loadingDot {
      0% {
        opacity: 0.3;
        transform: scale(0.8);
      }

      30% {
        opacity: 1;
        transform: scale(1);
      }

      60%,
      100% {
        opacity: 0.3;
        transform: scale(0.8);
      }
    }
  }
}
.page {
  width: 100vw;
  height: 100vh;
  background-color: var(--main-bg-color);
  overflow: hidden;
}

.day-list-wrap {
  float: right;
  width: calc(55% - 120px);
  height: calc(100% - 80px);
  margin-top: 40px;
  margin-right: 40px;
  padding-right: 40px;
  padding-left: 5%;
  overflow-y: scroll;
}
</style>
