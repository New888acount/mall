<!--
    使用方法和vant的popup组件一样
    文档:https://vant-contrib.gitee.io/vant/#/zh/popup
-->
<template>
  <van-popup
    v-model:show="show"
    v-bind="$attrs"
    :duration="duration"
    :safe-area-inset-top="safeAreaInsetTop"
    :safe-area-inset-bottom="safeAreaInsetBottom"
    :transition-appear="transitionAppear"
    :teleport="teleport"
    :zIndex="zIndex"
    class="my-popup"
    :overlay-class="props.overlayClass || 'my-overlay'"
    :close-on-click-overlay="true"
  >
    <div
      :style="containerStyle"
      :class="['my-popup__container', containerClass, show ? enterAnimateClass : leaveAnimateClass]"
    >
      <!-- 整个弹窗加载是否显示 -->
      <div v-if="containerLoadingShow" class="my-popup__loading">
        <MyLoading />
      </div>
      <!-- 头部内容 -->
      <slot v-if="$slots.header || headerText" name="header">
        <header :style="headerStyle" class="my-popup__header">
          <slot name="header-text">{{ headerText }}</slot>
        </header>
      </slot>
      <!-- 主要内容 -->
      <main :style="mainStyle" :class="['my-popup__main', mainClass]">
        <div class="my-popup__main__content">
          <slot></slot>
        </div>
        <!-- 内容加载是否显示 -->
        <div v-if="mainLoadingShow" class="my-popup__loading">
          <MyLoading />
        </div>
      </main>
      <!-- 底部内容 -->
      <slot v-if="$slots.footer || footerText" name="footer">
        <van-button :loading="btnLoadingShow" :style="footerStyle" class="my-popup__footer" @click="handleConfirm">
          <slot name="footer-text">{{ footerText }}</slot>
        </van-button>
      </slot>
    </div>
    <!-- 关闭按钮 -->
    <slot v-if="closeShow" name="close">
      <div :style="closeStyle" class="my-popup__close" @click="handleClose"></div>
    </slot>
    <!-- 需要超出容器的内容都应该写在这里，然后使用position 去操作元素的位置而不是将my-popup__container里面的overflow设为visible -->
    <slot name="other-content"></slot>
    <!-- 蒙层 -->
    <slot name="overlay-content"></slot>
  </van-popup>
</template>

<script setup name="MyPopup">
import MyLoading from '@/components/MyLoading/index.vue'
import { computed, defineProps, defineEmits } from 'vue'
const emit = defineEmits(['update:modelValue', 'close', 'confirm'])
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  overlayClass: {
    //overlay 类名
    type: String,
    default: '',
  },
  //是否开启顶部安全区适配
  safeAreaInsetTop: {
    type: Boolean,
    default: true,
  },
  // 弹窗默认层级
  zIndex: {
    type: Number,
    default: 2000,
  },

  //是否开启底部安全区适配
  safeAreaInsetBottom: {
    type: Boolean,
    default: true,
  },

  //是否在初始渲染时启用过渡动画
  transitionAppear: {
    type: Boolean,
    default: true,
  },

  //指定挂载的节点，等同于 Teleport 组件的 to 属性
  teleport: {
    type: String,
    default: 'body',
  },

  // 动画过渡时间秒
  duration: {
    type: Number,
    default: 0.4,
  },

  // 进入动画class
  enterAnimateClass: {
    type: String,
    default: '',
  },

  // 离开动画class
  leaveAnimateClass: {
    type: String,
    default: '',
  },

  //整个弹窗内容加载是否显示
  containerLoadingShow: {
    type: Boolean,
    default: false,
  },

  // 整个弹窗内容的class样式
  containerClass: {
    type: String,
    default: '',
  },

  //整个弹窗内容style样式
  containerStyle: {
    type: Object,
    default: () => {
      return {}
    },
  },

  //默认头部文本
  headerText: {
    type: [String, Number],
    default: '',
  },

  //默认头部style样式
  headerStyle: {
    type: Object,
    default: () => {
      return {}
    },
  },

  //弹窗内容加载是否显示
  mainLoadingShow: {
    type: Boolean,
    default: false,
  },

  // 主要内容的class样式
  mainClass: {
    type: String,
    default: '',
  },

  //主要内容style样式
  mainStyle: {
    type: Object,
    default: () => {
      return {}
    },
  },

  //默认底部文本
  footerText: {
    type: [String, Number],
    default: '',
  },

  //默认底部style样式
  footerStyle: {
    type: Object,
    default: () => {
      return {}
    },
  },

  //按钮加载是否显示
  btnLoadingShow: {
    type: Boolean,
    default: false,
  },

  //关闭按钮是否显示
  closeShow: {
    type: Boolean,
    default: true,
  },

  //默认关闭按钮样式
  closeStyle: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
let show = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
const handleClose = () => {
  emit('close')
}
const handleConfirm = () => {
  emit('confirm')
}
</script>

<style lang="less"></style>
<style lang="less" scoped>
.my-popup {
  &__container {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #fff;
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.4);
    box-sizing: border-box;
    overflow: hidden;
    // &::before {
    //   content: '';
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   width: 100%;
    //   height: 75px;
    //   background: linear-gradient(var(--agent-color-bottom), var(--desgin-common-bg4));
    // }
  }
  &__header {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    min-height: 35px;
    padding: 6px 20px;
    color: #1f2c3c;
    font-size: 15px;
    font-style: normal;
    font-weight: 800;
    word-break: break-all;
    word-wrap: break-word;
    text-align: center;
    box-sizing: border-box;
    overflow: auto;
  }
  &__main {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    color: #1f2c3c;
    box-sizing: border-box;
    overflow: hidden;
    &__content {
      width: 100%;
      height: 100%;
      overflow: auto;
      &::-webkit-scrollbar-track-piece {
        -webkit-border-radius: 0;
      }

      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }

      &::-webkit-scrollbar-thumb {
        height: 50px;
        background-color: #383527;
        -webkit-border-radius: 6px;
      }

      &::-webkit-scrollbar-thumb:hover {
        height: 50px;
        -webkit-border-radius: 6px;
      }
    }
  }
  &__footer {
    flex-shrink: 0;
    min-height: 35px;
    margin: 10px 20px 20px 20px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    font-style: normal;
    word-break: break-all;
    word-wrap: break-word;
    border: none;
    box-sizing: border-box;
    border-radius: 8px;
    background: #286aff !important;
  }
  &__loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__close {
    // position: relative;

    width: 40px;
    height: 40px;
    cursor: pointer;
    // margin-top: 40px;
    margin: 40px auto 0;
    background: rgba(255, 255, 255, 0.2);

    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    &::after {
      font-family: 'iconfont';
      content: '\e62c';
      font-size: 20px;
      font-weight: 500;
      color: #fff;
    }
  }
}
</style>
