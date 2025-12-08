<template>
  <div class="my__paymethods">
    <MobileHeader class="cart-header" :title="$t('pay.title')" :backicon="false" :callback="close"></MobileHeader>
    <div class="content">
      <div class="price">{{ state.totalAmount }}</div>
      <h2>{{ $t('pay.methods') }}</h2>
      <div class="list">
        <!-- 支付列表 -->
        <div class="item">
          <van-checkbox v-model="checked" label-position="left">微信支付</van-checkbox>
        </div>
      </div>

      <div class="pay-button">
        <p>{{ $t('pay.button') }}</p>
      </div>
      <!-- <p>
          请在
          <span>
            倒计时
            13:25:32
          </span>
  
          之前完成支付,否则订单将自动关闭
        </p> -->
    </div>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { ref, onMounted, defineEmits, reactive } from 'vue'
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
// import { getMaxZIndex } from '@/utils/index'
import { useRoute } from 'vue-router'

/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const checked = ref(false)
const route = useRoute()
// 检测支付环境
const state = reactive({
  orderType: 'goods',
  payment: 'wechat',
  totalAmount: '',
  orderInfo: {},
  payStatus: 0, // 0=检测支付环境, -2=未查询到支付单信息， -1=支付已过期， 1=待支付，2=订单已支付
  payMethods: [],
  payId: '',
})
/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
//关闭
const close = () => {
  history.back()
}

/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(async () => {
  // 微信平台支付
  // const authInfo = sheep.$store('app').authInfo
  // if (!sheep.$store('user').userInfo.openId && authInfo) {
  //   await sheep.$api.user.setWechatInfo(Base64.encode(JSON.stringify(authInfo)))
  //   sheep.$store('user').userInfo.openId = authInfo.openid
  // }

  // if (
  //   sheep.$platform.name === 'WechatOfficialAccount' &&
  //   sheep.$platform.os === 'ios' &&
  //   !sheep.$platform.landingPage.includes('pages/pay/index')
  // ) {
  //   location.reload()
  //   return
  // }

  if (route.query) {
    console.log(route.query)

    if (route.query.totalAmount) {
      state.totalAmount = route.query.totalAmount
    }

    const id = route.query.orderSN || route.query.id || ''
    state.payId = id

    if (route.query.type === 'recharge') {
      state.orderType = 'recharge'
      // setRechargeOrder(id)
    } else {
      state.orderType = 'goods'
      // setGoodsOrder(id)
    }
  }
})

/** ***生命周期end*****/
</script>

<style lang="less">
.my__paymethods {
  width: 100%;
  height: 100%;
  background: #fff;

  .content {
    .price {
      padding: 30px 10px 20px;
      text-align: center;
      color: var(--color-price);
      font-size: 1.4375rem;
      font-weight: bold;
    }
    h2 {
      font-size: 0.8125rem;
      font-weight: 500;
      color: #333333;
      padding: 15px;
    }

    .list {
      .item {
        height: 43px;
        line-height: 43px;

        padding: 0 15px;

        .van-checkbox {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #f2f2f2;
          height: 43px;

          .van-checkbox__icon--checked .van-icon {
            background: var(--color-light);
            color: #fff;
            border: 0;
          }
          .van-checkbox__label {
            font-size: 0.8125rem;
            font-weight: 500;
            color: #333333;
          }
        }
      }
    }

    .pay-button {
      margin: 40px 10px 20px;
      p {
        border-radius: 24px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        color: #fff;
        width: 100%;
        background: linear-gradient(90deg, var(--color-light), rgba(255, 96, 0, 0.6));
        margin-bottom: 10px;
        box-shadow: 0 2.8px 7px rgba(255, 96, 0, 0.45);
      }
    }
  }
}
</style>
