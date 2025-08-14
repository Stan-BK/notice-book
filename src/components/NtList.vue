<script setup lang="ts">
import { NoticeType } from '../data'

const props = defineProps<{ notices: NoticeType[] }>()

function handleItem(notice: NoticeType) {
  notice.isChosen = !notice.isChosen
}

function validNum(type: 'hour' | 'minute', notice: NoticeType, e: Event) {
  const num = type === 'hour' ? 23 :  59
  const tar = e.target as HTMLInputElement
  const val = parseInt(tar.value)
  if (val < 0) {
    tar.value = '0'
    notice[type] = 0
  } else if (val > num) {
    tar.value = String(num)
    notice[type] = num
  }
}

function blur(e: Event) {
  const tar = e.target as HTMLInputElement
  tar.value = tar.value.padStart(2, '0')
}
</script>
<template>
  <TransitionGroup
    name="list"
    tag="ul"
    class="notice-list w-full"
  >
    <li
      v-for="(notice, index) in props.notices"
      :key="index"
      class="notice-list-item flex items-center"
    >
      <div
        class="drag-btn-wrap"
        :class="notice.isChosen ? 'chosen' : ''"
        @click="handleItem(notice)"
      >
        <span class="drag-btn" />
      </div>
      <input
        v-model="notice.noticeName"
        class="notice-input noticeName"
      >
      <textarea
        v-model="notice.description"
        class="notice-input description"
        style="resize: none;"
      />
      <div class="notice-input timestamp">
        <input
          v-model="notice.hour"
          type="number"
          min="0"
          max="23"
          @input="validNum('hour', notice, $event)"
          @blur="blur"
        >:<input
          v-model="notice.minute"
          type="number"
          min="0"
          max="59"
          @input="validNum('minute', notice, $event)"
          @blur="blur"
        >
      </div>
    </li>
  </TransitionGroup>
</template>
<style scoped lang="less">
.notice-list {
  flex: 1;
  list-style: none;
  overflow-x: hidden;
  overflow-y: auto;

  .notice-list-item {
    width: 100%;
    padding: 4px;
    min-height: 50px;
    margin-bottom: 5px;
    border-radius: 8px;
    white-space: nowrap;

    .drag-btn-wrap {
      display: inline-flex;
      width: 6%;
      height: 50px;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      .drag-btn {
        position: relative;
        display: inline-block;
        width: 15px;
        height: 15px;
        border: 1px solid var(--color-gray-600);
        transition: background-position .2s;
        overflow: hidden;
        transition: .2s;

        &::after {
          display: block;
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          background-color: var(--color-gray-600);
          left: -200%;
          top: 200%;
          transition: .2s;
          transform: rotate(-135deg);
        }

      }

      &.chosen .drag-btn::after, &:hover .drag-btn::after {
        left: -50%;
        top: -50%;
      }

      &.chosen .drag-btn::after {
        background-color: var(--hover-color);
      }

      &.chosen .drag-btn, &:hover .drag-btn {
        transform: rotate(45deg);
      }
    }

    .notice-input {
      height: 50px;
      line-height: 50px;
      padding: 4px;
      background-color: transparent;
      outline: none;
      border: 2px dashed transparent;
      border-radius: 4px;
      transition: border-color .4s, height .2s;
      &:hover {
        border-color: var(--hover-color);
      }

      &:focus {
        border-color: var(--color-gray-600);
      }

      &.noticeName {
        width: 20%;
      }

      &.timestamp {
        width: 20%;
        display: flex;
        justify-content: space-around;
        align-items: center;

        input {
          width: 48%;
          height: 100%;
          outline: none;
          border: none;
          text-align: center;
          border-radius: 4px;
        }
      }

      &.description {
        width: 50%;
        margin: auto 2%;
        line-height: 32px;
        &:focus {
          height: 150px;
        }
      }
    }

  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

</style>
