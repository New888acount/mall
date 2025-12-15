<template>
  <MyPopup
    v-model="show"
    :closeShow="false"
    @close="close"
    position="right"
    :zIndex="getMaxZIndex() + 1000"
    overlayClass="my__paysuccess--overlay"
    class="my__paysuccess"
  >
    <MobileHeader
      class="paysuccess-header"
      :leftText="$t('order.result.title')"
      :callback="close"
      :backicon="true"
    ></MobileHeader>
    <div class="content">
      <div class="success-icon">
        <i v-if="payResults" class="iconfont icon-chenggong"></i>
        <i v-else class="iconfont icon-shibai"></i>
      </div>
      <h1 v-if="payResults">{{ $t('order.result.success') }}</h1>
      <h1 v-else>{{ $t('order.result.failed') }}</h1>

      <p v-if="payResults">
        {{ $t('order.result.tip1') }}
        <span>{{ $t('order.result.tip2') }}</span>
        {{ $t('order.result.tip3') }}
      </p>

      <!-- <p>
        您的订单将在
        <span>24h</span>
        内进行审核确认,实际价格以下单核定价格为准,您可在订单中查看订单进展,与实际价格的差额将在
        <span>72h</span>
        内通知您补齐运费.
      </p> -->

      <div class="button">
        <div class="back" @click="close">{{ $t('order.result.button1') }}</div>
        <div class="check-btn ss-reset-button" v-if="payResults" @click="gotoOrder">
          {{ $t('order.result.button2') }}
        </div>
      </div>
    </div>
  </MyPopup>
</template>

<script setup>
/** ***引入相关包start*****/
import { ref, onMounted, defineEmits } from 'vue'
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import { getMaxZIndex } from '@/utils/index'
import router from '@/router'

/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const show = ref(false)
const payResults = ref(false)
const emit = defineEmits(['addCart', 'close'])

/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
//关闭
const close = () => {
  // cancelFn.value && cancelFn.value()
  show.value = false
  emit('close')
}

const gotoOrder = () => {
  router.push('/order/list')
}
/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {})
/** ***生命周期end*****/
</script>

<style lang="less">
.my__paysuccess {
  &.my-popup {
    // background: pink;
    width: 100%;
    height: 100%;
    .content {
      text-align: center;
      .success-icon {
        width: 56px;
        height: 56px;
        border-radius: 28px;
        background: var(--adm-color-primary);
        font-size: 33px;
        color: #fff;
        line-height: 56px;
        margin: 48px auto 24px;
        i {
          font-size: 30px;
          color: #fff;
        }
      }

      h1 {
        font-size: 24px;
        margin-bottom: 24px;
        font-weight: 500;
      }

      p {
        font-size: 14px;
        font-weight: 500;
        span {
          color: #f28f1b;
        }
      }

      .button {
        display: flex;
        justify-content: center;
        align-items: center;
        div {
          border-radius: 24px;
          line-height: 40px;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          width: 150px;
          margin: 24px auto;
        }
        .back {
          background: linear-gradient(90deg, var(--adm-color-primary), rgba(255, 96, 0, 0.6));
          // margin-bottom: 10px;
          box-shadow: 0 2.8px 7px rgba(255, 96, 0, 0.45);
        }

        .check-btn {
          border: 2px solid #dfdfdf;
          color: #595959;
        }
      }
    }
  }
}
</style>
