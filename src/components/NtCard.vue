<script setup lang="ts">
defineProps<{
  isNeedPort?: boolean;
}>()

const emits = defineEmits<{
  (e: 'toggle'): void;
}>()
</script>

<template>
  <PMaterial
    variant="large"
    class="notice-card"
    direction="vertical"
    :wrap="false"
  >
    <div class="w-full flex justify-between items-center">
      <span class="title">
        <slot name="title" />
      </span>
      <div class="control-bar">
        <slot name="control-bar" />
      </div>
    </div>

    <div
      v-if="isNeedPort"
      class="port"
      @click="() => emits('toggle')"
    >
      Toggle
    </div>

    <slot />
  </PMaterial>
</template>

<style scoped lang="less">
.notice-card {
  position: relative;
}

.notice-card + .notice-card {
  margin-top: 20px;
}

.title {
  font-size: 1.6em;
  font-weight: bold;
}

.port {
  position: absolute;
  left: 20px;
  top: 10px;
  width: 5%;
  height: 25px;
  transform: translateY(0);
  background-color: var(--color-gray-200);
  font-size: 0.9em;
  text-align: center;
  line-height: 25px;
  border-radius: 2px;
  transition: 0.4s;
  transform-origin: center;
  cursor: pointer;

  &::before,
  &::after {
    position: absolute;
    content: "";
    display: block;
    top: 4px;
    width: 17px;
    height: 17px;
    transform: rotate(45deg);
    background-color: var(--color-gray-200);
    z-index: -1;
    border-top-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }

  &::before {
    left: -8px;
    border-bottom: 1px solid transparent;
    border-left: 1px solid transparent;
    transition: border 0.4s;
  }

  &::after {
    right: -8px;
    border-top: 1px solid transparent;
    border-right: 1px solid transparent;
    transition: border 0.4s;
  }

  &:hover {
    box-shadow: inset 0px 1px 2px var(--hover-color),
      inset 0px -1px 2px var(--hover-color);
    transform: scale(1.1);

    &::before {
      border: 1px solid var(--hover-color);
      border-top: none;
      border-right: none;
    }

    &::after {
      border: 1px solid var(--hover-color);
      border-bottom: none;
      border-left: none;
    }
  }
}
</style>
