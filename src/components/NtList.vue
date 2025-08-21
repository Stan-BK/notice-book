<script setup lang="ts">
import { NoticeType } from '../libs'

const props = defineProps<{ notices: NoticeType[] }>()

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
      v-for="notice in props.notices"
      :key="notice.id"
      class="notice-list-item flex items-center gap-3"
    >
      <PCheckbox v-model="notice.isChosen" />

      <PInput
        v-model="notice.noticeName"
        class="noticeName"
      />

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
ul {
  padding: 0;
  margin: 0;
}
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

    .noticeName {
      width: 25%;
    }

    .notice-input {
      height: 36px;
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

      &.timestamp {
        width: 20%;
        display: flex;
        justify-content: space-around;
        align-items: center;

        input {
          width: 45%;
          height: 90%;
          outline: none;
          border: none;
          text-align: center;
          border-radius: 4px;
        }
      }

      &.description {
        flex: 1;
        line-height: 32px;
        &:focus {
          height: 150px;
        }
      }
    }

  }
}

.list-enter-active {
  transition: all .5s .5s ease;
}
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

</style>
