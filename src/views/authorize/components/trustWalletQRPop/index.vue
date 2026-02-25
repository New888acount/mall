<template>
  <MyPopup v-model="show" @close="unMountComponent" position="center" class="addto__desk">
    <div class="content">
      <PayQrcode :text="props.details || ''" :size="155" />
      <div class="text">
        {{ props.details }}
        <i class="iconfont icon-Frame-1" @click="copyText(props.details)"></i>
      </div>
    </div>
    <template #close>
      <i class="iconfont icon-31guanbi my-popup__close" @click="close"></i>
    </template>
  </MyPopup>
</template>

<script setup>
/** ***引入相关包start*****/
import MyPopup from '@/components/MyPopup/index.vue'
import { copyText } from '@/utils'
import PayQrcode from '@/views/rechargeWithdraw/rechargePopup/components/PayQrcode.vue'
import { defineExpose, defineProps, ref } from 'vue'
import closePop from './index.js'
/** ***引入相关包end*****/

/** ***ref、reactive、props，等……start*****/
const props = defineProps({
  details: {
    type: String,
    default: '',
  },
})
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

/** ***函数 end*****/

/** ***生命周期start*****/
// 销毁组件
const unMountComponent = () => {
  closePop({ type: 'unmount' })
}
/** ***生命周期end*****/
</script>

<style lang="less">
html[data-device='desktop'] {
  .addto__desk {
    &.my-popup {
      width: 600px;
      .my-popup__header {
        padding: 30px 30px 0;
        color: var(--adm-color-primary);
      }
    }
    .content {
      padding: 40px 30px;
      font-size: 16px;
    }
  }
}
html[data-device='mobile'] {
  .addto__desk {
    &.my-popup {
      .my-popup__header {
        padding: 0 48px;
        color: var(--adm-color-white);
        font-size: 12px;
      }
    }
    .content {
      position: relative;
      padding: 0 14px 16px 20px;
      font-size: 16px;
      text-align: left;
      .des {
        margin-top: 17px;
        color: var(--color-textlv1);
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 20px; /* 166.667% */
        &__img {
          margin: 17px auto 0;
          width: 260px;
          height: auto;
          background: var(--color-lightBg);
          border-radius: 8px;
        }
      }
      .pointer {
        width: 37px;
        height: 46px;
        margin: 0 auto;
      }
    }

    .my-popup__close {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 18px;
      height: 18px;
      transform: translate(0, 0);
      z-index: 2;
    }
  }
}
.addto__desk {
  .content {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    padding: 17px 12px;
    color: var(--adm-color-white);
    text-align: center;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px; /* 125% */
  }

  .my-popup {
    &__cancale {
      flex: 1;
      height: 100%;
      color: var(--adm-color-primary);
      border-radius: 10px;
      background: transparent;
      border: 1px solid var(--adm-color-primary);
      &:hover {
        opacity: 0.8;
      }
    }
    &__confirm {
      flex: 1;
      height: 100%;
      color: var(--color-globalBg);
      border-radius: 10px;
      background: var(--adm-color-primary);
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
