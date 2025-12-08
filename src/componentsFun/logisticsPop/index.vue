<template>
  <MyPopup
    v-model="show"
    @close="close"
    position="center"
    class="logistics_pop"
    overlayClass="my-overlay"
    :zIndex="getMaxZIndex() + 1000"
  >
    <div class="content">
      <div class="header">卖家物流</div>
      <div class="text">
        <p>您完成委托和款项支付后，代购商会在</p>
        <p>09：00-18：00（北京时间）代您进行商品采购</p>
      </div>
      <div class="pop-button-ok">确认</div>
    </div>
  </MyPopup>
</template>

<script setup>
/** ***引入相关包start*****/
import { ref, onMounted, defineExpose } from 'vue'
import MyPopup from '@/components/MyPopup/index.vue'

import logisticsPop from './index.js'
import { getMaxZIndex } from '@/utils/index'

/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const show = ref(false)

defineExpose({
  show,
})
/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
//关闭
const close = () => {
  show.value = false
  unMountComponent()
}
// 销毁组件
const unMountComponent = () => {
  logisticsPop({ type: 'unmount' })
}
/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {})
/** ***生命周期end*****/
</script>

<style lang="less">
.logistics_pop {
  text-align: center;

  &.my-popup {
    background: transparent;

    .my-popup__container {
      border-radius: 10px;
    }

    .content {
      color: #46494f;
      font-size: 14px;
      display: flex;
      padding: 24px 16px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .header {
        color: #1f2c3c;
        text-align: center;
        font-size: 18px;
        font-weight: 600;
      }

      .text {
        padding: 16px 0 24px 0;
        font-size: 14px;
        color: #46494f;
      }
    }

    .pop-button-ok {
      width: 175px;
      height: 40px;
      padding: 0 24px;
      color: #fff;
      font-size: 14px;
      line-height: 40px;
      font-weight: 500;
      border-radius: 24px;
      background: #1f2c3c;
    }
  }
}
</style>
