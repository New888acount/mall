<template>
  <div class="title-module">
    <div class="game-title">
      <h1>{{ title }}</h1>
    </div>

    <a-button type="primary" class="all" @click="router.push('/goods/list')">
      {{$t('home.all')}}
      <i class="iconfont icon-arrow_b"></i>
    </a-button>
  </div>
</template>

<script setup>
import router from '@/router'
import { defineProps } from 'vue'

defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>
<style lang="less" scoped>
.title-module {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;

  .game-title {
    display: flex;
    align-items: center;

    h1 {
      word-break: keep-all;
      white-space: nowrap;
      color: var(--adm-color-textLv1);
      font-family: 'SF Pro';
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: 150%; /* 27px */
    }
  }

  .all-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 4px 4px 8px;
    margin-left: auto;
    color: var(--adm-color-textLv1);
    font-family: 'PingFang SC';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    box-shadow: none;
    outline: none;
    border: none;
    border-radius: 1px;
    background: rgba(237, 237, 237, 0.4);
    cursor: pointer;

    .iconfont {
      display: flex;
      transform: rotate(-90deg);
      margin-left: 4px;
      vertical-align: middle;
    }
  }
}
</style>
