<template>
  <van-list
    :loading="loading"
    :error="error"
    v-bind="$attrs"
    :loadingText="loadingText || $t('other.loadingText')"
    :finishedText="finishedFlag ? $t('other.finishedText') : finishedText"
    class="my-pull-refresh-list"
  >
    <slot></slot>
  </van-list>
</template>
<script setup>
import { defineProps } from 'vue'
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  //加载过程中的提示文案
  loadingText: {
    type: String,
    default: '',
  },
  //加载完成后的提示文案
  finishedText: {
    type: String,
    default: '',
  },
  finishedFlag: {
    type: Boolean,
    default: true,
  },
})
</script>
<style lang="less" scoped>
.my-pull-refresh-list {
  :deep(.van-list__finished-text),
  :deep(.van-loading__text),
  :deep(.van-loading__circular) {
    color: #777;
    font-size: 14px;
  }
}
</style>
