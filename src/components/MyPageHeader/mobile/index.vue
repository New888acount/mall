<!--
    公共移动端页面头部导航栏
-->
<template>
  <!-- getMaxZIndex() -->
  <div class="my-page-header" :style="{ zIndex: 99 }">
    <!-- 左边内容 -->
    <slot name="left">
      <div class="left">
        <div v-if="leftText" @click.stop="handleLeft">
          <i class="iconfont icon-arrow_s" v-if="backicon"></i>
          <span v-if="leftText">{{ leftText }}</span>
        </div>
      </div>
    </slot>
    <!-- 标题内容 -->
    <slot name="title">
      <h3 v-if="title" class="title">{{ title }}</h3>
    </slot>
    <!-- 右边内容 -->
    <slot name="right">
      <h3 v-if="text" class="text">{{ text }}</h3>
    </slot>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import router from '@/router'
import quickmenu from '@/componentsFun/quickMenu/index.js'
const props = defineProps({
  leftText: {
    type: [Number, String],
    default: '',
  },
  title: {
    type: [Number, String],
    default: '',
  },
  text: {
    type: [Number, String],
    default: '',
  },
  // 在页面返回之前执行的函数
  callback: {
    type: Function,
    default: null,
  },
  backicon: {
    type: Boolean,
    default: true,
  },
})
// 点击左边的箭头默认是返回上一路由,可以传递回调函数进行阻止，并操作回调函数里面的内容
const handleLeft = () => {
  if (props.callback) {
    props.callback()
    return false
  }
  history.back()
}

const handleHome = () => {
  router.replace('/home')
}
</script>
<style lang="less" scoped>
.my-page-header {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  height: 48px;
  padding: 9px 12px;
  background: var(--adm-bg-white);
  .left {
    // position: absolute;
    // left: 10px;
    color: var(--adm-color-textlv2);
    font-family: 'SF Pro';
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%; /* 27px */
    cursor: pointer;
    .iconfont {
      display: inline-flex;
      transform: rotate(180deg);
      font-weight: 800;
    }
    span {
      padding-left: 4px;
      text-align: center;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px; /* 150% */
      text-transform: capitalize;
    }
  }
  .title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // flex: 1;
    // max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    // padding: 0 10px;
    text-align: center;
    color: var(--color-textlv2);
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 150% */
    text-transform: capitalize;
  }
  .text {
    color: var(--color-textlv2);
    font-family: 'PingFang SC';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 100%; /* 12px */
  }
}
</style>
