<template>
  <div class="notice-card">
    <span class="title">
      <slot name="title" />
    </span>
    <div class="control-bar">
      <slot name="control-bar" />
    </div>
    <slot />
  </div>
</template>
<style scoped lang="less">
.notice-card {
  background: linear-gradient(rgb(var(--card-bg-color), .5), rgb(var(--card-bg-color)), rgb(var(--card-bg-color), 0));
}
.control-bar {
  float: right;
}
.title {
  font-size: 1.6em;
  font-weight: bold;
}
</style>