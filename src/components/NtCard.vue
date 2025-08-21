<script setup lang="ts">
import ArrowRightIcon from '@gdsicon/vue/arrow-left-right'

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
    class="notice-card relative"
    direction="vertical"
    :wrap="false"
    gap="1"
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
    >
      <PButton
        size="sm"
        @click="() => emits('toggle')"
      >
        <ArrowRightIcon class="mr-1" />

        Toggle
      </PButton>
    </div>

    <slot />
  </PMaterial>
</template>

<style scoped lang="less">
.notice-card + .notice-card {
  margin-top: 20px;
}

.title {
  font-size: 1.6em;
  font-weight: bold;
}

.port {
  position: absolute;
  left: 15px;
  top: 15px;
}
</style>
