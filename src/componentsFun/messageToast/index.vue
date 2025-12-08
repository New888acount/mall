<template>
  <MyPopup
    v-model="show"
    :closeShow="false"
    @close="unMountComponent"
    position="top"
    :zIndex="getMaxZIndex() + 1000"
    overlayClass="my__message--overlay"
    class="my__message"
    :close-on-click-overlay="false"
  >
  <!-- :closeShow="false" -->
    <div class="content">
      <p class="left" @click="close"><i class="iconfont icon-dengluzhuceguanbi"></i></p>
      <p class="msg">{{ msg }}</p>
      <p class="right">{{ second }}s</p>
    </div>
  </MyPopup>
</template>

<script setup>
/** ***引入相关包start*****/
import { ref, defineExpose, defineProps, onMounted } from 'vue'
import MyPopup from '@/components/MyPopup/index.vue'
import msgTaost from './index.js'
import { getMaxZIndex } from '@/utils/index'
/** ***引入相关包end*****/

/** ***ref、reactive、props，等……start*****/
const show = ref(false)

defineProps({
  msg: {
    type: String,
    default: '',
  },
})

defineExpose({
  show,
})

const second = ref(3)
const timer = ref(null)
const cancelFn = ref(null)
/** ***ref、reactive、props，等……end*****/

/** ***函数 start*****/

//关闭
const close = () => {
  cancelFn.value && cancelFn.value()
  show.value = false
  unMountComponent()
}
// 销毁组件
const unMountComponent = () => {
  msgTaost({ type: 'unmount' })
}

const myInterval = (func, delay) => {
  const interval = () => {
    func()
    timer.value = setTimeout(interval, delay)
  }
  setTimeout(interval, delay)
  return {
    cancel: () => {
      clearTimeout(timer.value)
    },
  }
}
/** ***函数 end*****/

/** ***生命周期start*****/
onMounted(() => {
  const { cancel } = myInterval(() => second.value--, 1000)
  cancelFn.value = cancel

  setTimeout(() => {
    close()
  }, 3000)
})
/** ***生命周期end*****/
</script>

<style lang="less">
.my__message {
  &.my-popup {
    width: calc(100vw - 32px) !important;
    margin: 16px 16px 0;
    border-radius: 5px;

    .my-popup__container {
      background: transparent;
      border-radius: 0;
      box-shadow: none;

    }
    .content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      background: #393732;
      box-shadow: 0px 4px 4px 0px rgba(20, 20, 20, 0.5);
      .left {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        background: #e5564d;
        border-radius: 50%;
        cursor: pointer;
        .iconfont {
          font-size: 12px;
          color: #393732;
        }
      }
      .msg {
        padding: 0 8px;
        flex: 1;
        color: #fffdf9;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 120%; /* 14.4px */
        word-break: keep-all;
        white-space: pre-wrap;
      }

      .right {
        color: #d5b169;

        font-size: 12px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }
  }
}
</style>
