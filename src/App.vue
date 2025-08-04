<script setup lang="ts">
import { initServiceWorker, isInstalled, isOperating, unsubscribe } from "./src/subscription";
import TodayList from "./components/TodayList.vue";
import TmrList from "./components/TmrList.vue";
import TodoList from "./components/TodoList.vue";
import YdayList from "./components/YdayList.vue";
</script>

<template>
  <header
    :style="{
      pointerEvents: isOperating ? 'none' : 'auto',
    }"
  >
    <button
      :style="{
        color: isInstalled ? '#42b983' : '#ff4949',
        opacity: isOperating ? 0.2 : 1,
      }"
      @click="isInstalled ? unsubscribe() : initServiceWorker()"
    >
      {{ isInstalled ? "Actived" : "Inactived" }}
    </button>
    <div class="loading" :style="{
      opacity: isOperating ? 1 : 0,
    }">
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
    </div>
  </header>
  <div class="page">
    <todo-list />
    <div class="day-list-wrap">
      <tmr-list />
      <today-list />
      <yday-list />
    </div>
  </div>
</template>

<style scoped lang="less">
header {
  position: fixed;
  left: 50%;
  top: 0;
  width: 140px;
  height: 32px;
  clip-path: path("M 0 0 C 45 0 0 32 45 32  L 100 32 C 140 32 100 0 140 0 z");
  background: linear-gradient(
    rgb(var(--card-bg-color)),
    rgb(var(--card-bg-color), 0.5)
  );
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
