<script setup lang="ts">
defineProps<{
  isNeedPort?: boolean
}>()
</script>
<template>
  <div class="notice-card">
    <span class="title">
      <slot name="title" />
    </span>
    <div class="control-bar">
      <slot name="control-bar" />
    </div>
    <div
      v-if="isNeedPort"
      class="port"
    >
      TOG
    </div>
    <slot />
  </div>
</template>
<style scoped lang="less">
.notice-card {
  position: relative;
  background: linear-gradient(rgb(var(--card-bg-color), .5), rgb(var(--card-bg-color)), rgb(var(--card-bg-color), 0));
}

.control-bar {
  float: right;
}

.title {
  font-size: 1.6em;
  font-weight: bold;
}

.port {
  position: absolute;
  left: -9%;
  top: calc(50% - 12px);
  width: 5%;
  height: 25px;
  transform: translateY(0);
  background-color: rgb(var(--card-bg-color));
  font-size: .9em;
  text-align: center;
  line-height: 25px;
  border-radius: 2px;
  transition: .4s;
  transform-origin: center;
  cursor: pointer;

  &::before, &::after {
    position: absolute;
    content: "";
    display: block;
    top: 4px;
    width: 17px;
    height: 17px;
    transform: rotate(45deg);
    background-color: rgb(var(--card-bg-color));
    z-index: -1;
    border-top-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }

  &::before {
    left: -8px;
  }

  &::after {
    right: -8px;
  }

  &:hover {
    box-shadow: inset 0px 1px 3px var(--hover-color), inset 0px -1px 3px var(--hover-color);
    transform: scale(1.1);
  }
}
</style>