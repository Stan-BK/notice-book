<script setup lang="ts">
import { NoticeType } from '../data'

const props = defineProps<{ notices: NoticeType[] }>()
</script>
<template>
  <ul class="notice-list">
    <li
      v-for="notice of props.notices"
      :key="notice.noticeName"
      class="notice-list-item"
    >
      <input v-model="notice.noticeName" class="notice-input noticeName">
      <textarea v-model="notice.description" class="notice-input description" style="resize: none;"/>
      <input v-model="notice.timestamp" class="notice-input timestamp">
    </li>
  </ul>
</template>
<style scoped lang="less">
.notice-list {
  padding: 0;
  list-style: none;
  .notice-list-item {
    width: 100%;
    min-height: 50px;
    white-space: nowrap;
    border: 2px dashed transparent;
    padding: 0 4px;

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
        width: 56%;
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
