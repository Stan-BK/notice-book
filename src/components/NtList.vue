<script setup lang="ts">
import { NoticeType } from '../libs'

const props = defineProps<{ notices: NoticeType[] }>()

function onDateTimeUpdate(ev: Event, data: NoticeType) {
  const [hours, minute] = (ev.target as HTMLInputElement).value.split(':')

  data.hour = Number(hours)
  data.minute = Number(minute)
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

      <input
        required
        type="time"
        name="expiration-time"
        class="datetime h-full bg-transparent border-none outline-none"
        pattern="[0-9]{2}:[0-9]{2}"
        @change="onDateTimeUpdate($event, notice)"
      >
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
      transition: border-color .4s, height .2s;
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
