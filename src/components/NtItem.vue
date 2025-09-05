<script lang="ts" setup>
import type { NoticeType } from '../libs/data.js'
import { computed, defineModel } from 'vue'

const noticeData = defineModel<NoticeType>({
  default: () => ({}) as NoticeType
})

const noticeTime = computed({
  get() {
    return `${noticeData.value.hour}:${noticeData.value.minute}:00`
  },
  set(value) {
    const [hour, minute] = value.split(':')

    noticeData.value.hour = Number(hour)
    noticeData.value.minute = Number(minute)
  }
})

</script>

<template>
  <li
    class="notice-list-item flex items-center gap-3"
  >
    <PCheckbox v-model="noticeData.isChosen" />

    <PInput
      v-model="noticeData.noticeName"
      class="noticeName"
    />

    <textarea
      v-model="noticeData.description"
      class="notice-input description"
      style="resize: none"
    />

    <PTimePicker
      v-model="noticeTime"
      style="width: 85px"
      :prefix-icon="false"
    />
  </li>
</template>

<style scoped lang="less">
.notice-list-item {
  width: 100%;
  padding: 4px;
  min-height: 50px;
  border-radius: 8px;
  white-space: nowrap;

  & + & {
    margin-bottom: 6px;
  }

  .noticeName {
    width: 25%;
  }

  .notice-input {
    height: 36px;
    line-height: 36px;
    background-color: transparent;
    outline: none;
    border: 2px dashed transparent;
    border-radius: 4px;
    transition: border-color 0.4s, height 0.2s;
    &:hover {
      border-color: var(--hover-color);
    }

    &:focus {
      border-color: var(--color-gray-600);
    }

    &.description {
      flex: 1;
      padding-inline: 8px;
      overflow: hidden;
      line-height: 28px;

      &:focus {
        height: 150px;
      }
    }
  }

  .datetime {
    line-height: 34px;
  }
}
</style>
