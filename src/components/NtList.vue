<script setup lang="ts">
import { NoticeType } from '../data'

const props = defineProps<{ notices: NoticeType[] }>()

function handleItem(notice: NoticeType) {
  notice.isChosen = !notice.isChosen
  console.log(notice.isChosen)
}
</script>
<template>
  <ul class="notice-list">
    <li
      v-for="notice of props.notices"
      :key="notice.noticeName"
      class="notice-list-item"
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
      <input
        v-model="notice.timestamp"
        class="notice-input timestamp"
      >
    </li>
  </ul>
</template>
<style scoped lang="less">
.notice-list {
  padding: 0;
  list-style: none;
  height: 100%;
  overflow: auto;

  .notice-list-item {
    width: 100%;
    min-height: 50px;
    white-space: nowrap;
    border: 2px dashed transparent;
    padding: 0 4px;

    .drag-btn-wrap {
      float: left;
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
        border: 1px solid var(--color);
        transition: background-position .2s;
        overflow: hidden;
        transition: .2s;

        &::after {
          display: block;
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          background-color: var(--color);
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
        border-color: var(--color);
      }

      &.noticeName {
        float: left;
        width: 20%;
      }

      &.timestamp {
        float: right;
        width: 20%;
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
</style>
