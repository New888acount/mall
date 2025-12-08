<!--
    公共移动端页面头部导航栏
-->
<template>
  <!-- getMaxZIndex() -->
  <div class="my-page-header" :style="{ zIndex: 99 }">
    <!-- 左边内容 -->
    <slot name="left">
      <div class="left">
        <div class="icon-box" v-if="backicon">
          <i class="iconfont icon-home" @click="handleHome"></i>
          <div class="line"></div>
          <i class="iconfont icon-sidebar-toggle" @click.stop="quickmenu"></i>
        </div>

        <div class="icon-box" v-else>
          <i class="iconfont icon-dayuhao" @click.stop="handleLeft"></i>
          <div class="line"></div>
          <i class="iconfont icon-sidebar-toggle" @click.stop="quickmenu"></i>
        </div>

        <!-- <div v-if="leftText"> -->
        <!-- <i class="iconfont icon-dayuhao"></i>
          <span v-if="leftText">{{ leftText }}</span> -->
        <!-- </div> -->
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
  height: 45px;
  padding: 0 16px 0 8px;
  background: #fff;
  // background: transparent;
  color: #000;
  .left {
    // position: absolute;
    // left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #000;
    .icon-dayuhao {
      // font-size: 18px;
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

    .icon-box {
      width: 80px;
      background: #ffffff;
      box-shadow: 0px 0px 2px rgba(51, 51, 51, 0.08), 0px 2px 3px 1px rgba(102, 102, 102, 0.12);
      border-radius: 15px;
      width: 67px;
      height: 28px;
      margin-left: 0.25rem;
      display: flex;
      // flex-direction: row;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      line-height: 28px;

      .line {
        height: 12px;
        width: 1px;
        background: #e5e5e7;
      }
      i {
        padding: 0 8px;
      }
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
    color: #000;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 150% */
    text-transform: capitalize;
  }
  .text {
    font-size: 14px;
    color: #000;
  }
}
</style>
