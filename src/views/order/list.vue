<template>
  <div class="order" v-loading="state.isLoading">
    <MobileHeader :leftText="$t('order.index.title')" class="cart-header" :backicon="true"></MobileHeader>

    <!-- 收货地址   -->
    <div class="shipping-address" @click="onSelectAddress">
      <div class="title" v-if="!Object.keys(state.addressInfo).length">
        <p>
          {{ $t('order.index.address') }}
        </p>
        <div class="update">
          <i class="iconfont icon-dayuhao"></i>
        </div>
      </div>
      <div class="top" v-else>
        <div class="person-info">
          <div class="person-text">
            <div class="tag">
              <van-tag color="var(--adm-color-primary)" class="spec-info-tag" v-if="state.addressInfo?.isDefault">
                {{ state.addressInfo?.isDefault ? $t('order.index.tag') : '' }}
              </van-tag>
            </div>
            <div class="name">{{ state.addressInfo?.name }}</div>
            <div class="phone">{{ state.addressInfo?.phone }}</div>
          </div>
          <div></div>
        </div>
        <div class="address-info">
          {{ state.addressInfo?.detailAddress }}
        </div>
      </div>
    </div>
    <div class="order-list">
      <div class="order-item" v-for="item in state.orderInfo.skuList" :key="item.skuId">
        <div class="left">
          <MyImage class="box-img" v-if="$imgBaseUrl + item.pic" :src="$imgBaseUrl + item.pic" alt="" fit="initial" />
          <div class="tag" v-if="item.superDiscount">SALE</div>
        </div>
        <div class="right">
          <div class="good-title">
            {{ item.productName }}
          </div>
          <div class="good-tag">{{ item.spDataValue }}</div>
          <div class="good-info">
            <div class="good-price">
              <div
                class="price"
                :class="{
                  red: item.superDiscount,
                }"
              >
                {{ $unit }} {{ item.finalPrice }}
              </div>
              <div class="discount">{{ $unit }} {{ item.price }}</div>
            </div>
            <div class="good-qua">x {{ item.quantity }}</div>
          </div>
          <div class="update">{{ $t('order.list.save') }} {{ $unit }} {{ item.discountPrice }}</div>
        </div>
      </div>
    </div>

    <div class="order-message">
      <van-field
        v-model="state.orderPayload.remark"
        :label="$t('order.index.message.title')"
        clearable
        :placeholder="$t('order.index.message.placeholder')"
      />

      <div class="transport">
        <div class="lebal">{{ $t('order.index.message.title1') }}</div>

        <div class="tag">{{ $t('order.index.message.value1') }}</div>
      </div>
    </div>

    <div class="list-sum">
      <div class="sum-total">
        <span>{{ $t('order.index.amount', [state.totalNumber]) }}</span>
        <!-- <p>{{ $unit }} {{ state.orderPayload.payAmount }}</p> -->
        <p>{{ $unit }} {{ state.orderInfo.saleProductTotalAmount }}</p>
      </div>
      <div class="sum-total">
        <span>{{ $t('order.index.freight') }}</span>
        <p>{{ $unit }} 0</p>
      </div>
      <div class="sum-total total">
        <span>{{ $t('order.index.total') }}</span>
        <!-- <p>{{ $unit }} {{ state.orderPayload.payAmount }}</p> -->
        <p>{{ $unit }} {{ state.orderInfo.saleProductTotalAmount }}</p>
      </div>
    </div>

    <div class="order-sum">
      <!-- <div class="sum-price">{{ $unit }} {{ state.orderPayload.payAmount }}</div> -->
      <div class="sum-submit" @click="submitOrder">{{ $t('order.index.submit') }}</div>
    </div>
  </div>

  <!-- 支付结果 -->
  <PaySuccess v-model="paysuccessShow" @close="paysuccessShow = false"></PaySuccess>
</template>

<script setup>
/** ***引入相关包start*****/
import { getAddressDefaultApi } from '@/api/address'
import { orderCalcApi, orderCreateApi } from '@/api/order'
import MyImage from '@/components/MyImage'
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import messageToast from '@/componentsFun/messageToast'
import router from '@/router'
import { useAddressStore } from '@/store/modules/address'
import useAppStore from '@/store/modules/app'
import { useCartStore } from '@/store/modules/cart'
import { onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import PaySuccess from './components/payResult.vue'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const appStore = useAppStore()

const { t } = useI18n()
const paysuccessShow = ref(false)
const route = useRoute()
const addressStore = useAddressStore()
// 购物车数据
const cartStore = useCartStore()
const state = reactive({
  orderPayload: {},
  orderInfo: {},
  addressInfo: {},
  invoiceInfo: {},
  totalNumber: 0,
  showCoupon: false,
  couponInfo: [],
  showDiscount: false,
  isLoading: false,
})

/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
const submitOrder = async () => {
  if (!state.orderPayload.address_id) {
    messageToast({
      props: {
        msg: t('order.index.address'),
      },
    })
    return
  }
  try {
    state.isLoading = true
    const params = {
      addressId: state.orderPayload.address_id,
      note: state.orderPayload.remark,
      from: state.orderPayload.from,
      payType: 2,
      skuList: state.orderInfo.skuList,
      memberCouponId: state.orderPayload.memberCouponId,
    }

    const { data } = await orderCreateApi(params)
    // 初始化当前的地址
    addressStore.selectedAddress = null
    // 更新购物车列表
    if (state.orderPayload.from === 'cart') {
      cartStore.getList()
    }
    if (state.orderPayload.payAmount == 0) {
      // 支付金额为 0，直接跳转到支付结果页
      router.replace({
        path: '/pages/pay/result',
        query: {
          orderSN: data,
        },
      })
    }
    appStore.getTracking({
      type: 7,
    })
    // 跳转到支付页面
    router.replace({
      path: '/pay',
      query: {
        orderId: data,
      },
    })
  } catch (error) {
    console.log(error)
  } finally {
    state.isLoading = false
  }
}
// 选择地址
const onSelectAddress = () => {
  router.push({ path: '/address/list', query: { from: 'order' } })
}

const changeConsignee = async (addressInfo) => {
  state.isLoading = true
  try {
    let finalAddress = addressInfo

    // 如果没有传入用户选择的地址，就去拿默认地址
    if (!finalAddress) {
      const { data } = await getAddressDefaultApi()
      finalAddress = data
    }

    if (finalAddress) {
      state.addressInfo = finalAddress
      state.orderPayload.address_id = finalAddress.id
      await getOrderInfo()
      // console.log('当前收货地址:', finalAddress)
    }
  } catch (error) {
    console.log(error)
  } finally {
    state.isLoading = false
  }
}

// 检查库存&计算订单价格
const getOrderInfo = async () => {
  try {
    const skuList = state.orderPayload.goods_list.map((it) => {
      return { skuId: it.skuId, quantity: it.goods_num }
    })
    let { code, data } = await orderCalcApi({ skuList })
    if (!data) {
      setTimeout(() => {
        router.back()
      }, 2000)
      return
    }
    state.totalNumber = 0
    state.orderInfo = data
    state.orderInfo.skuList.forEach((item) => {
      let str = ''
      const obj = JSON.parse(item.spData)
      Object.keys(obj).forEach((key) => {
        str += key + ': ' + obj[key] + '  '
      })
      item.spDataValue = str
      state.totalNumber += item.quantity
    })
    state.orderPayload.payAmount = state.orderInfo.skuList.reduce((acc, curr) => {
      acc += curr.quantity * curr.finalPrice.toFixed(2)
      return acc.toFixed(2)
    }, 0)
  } catch (error) {
    console.log(error)
  }
}
/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(async () => {
  // 初始化当前的地址
  if (route.query.data) {
    state.orderPayload = JSON.parse(route.query.data)
    if (!addressStore.selectedAddress) {
      changeConsignee()
    } else {
      changeConsignee(addressStore.selectedAddress)
    }

    await getOrderInfo()
  }
})
/** ***生命周期end*****/
// 监听地址变化
watch(
  () => addressStore.selectedAddress,
  (newVal, oldVal) => {
    if (newVal) {
      // console.log('地址更新了:', newVal)
      state.addressInfo = newVal
    }
  },
  { immediate: true } // 页面加载时也执行一次
)
</script>

<style scoped lang="less">
.order {
  padding-bottom: 56px;
  color: var(--adm-color-textlv2);
  background: #f5f5f5;
  overflow-y: scroll;
  .shipping-address {
    border: 1px solid #f4f4f4;
    background: var(--adm-bg-white);
    padding: 12px 15px;
    margin-bottom: 7px;
    .title {
      display: flex;
      justify-content: space-between;
      p {
        color: #1f2c3c;
        font-size: 16px;
        font-weight: 500;
        span {
          color: #eb2606;
        }
      }

      .update {
        color: #1f2c3c;
        font-size: 12px;

        // .icon-dayuhao {
        //   color: #9d9ea2;
        // }
      }
    }

    .top {
      margin-top: 10px;
      // padding: 12px 12px 0 12px;
      .person-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .person-text {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          align-items: center;
          .name {
            font-weight: 500;
            margin-right: 8px;
          }

          .tag .van-tag {
            font-size: 12px;
            padding: 2px 5px;
            margin-right: 5px;
          }
        }

        :deep(.van-checkbox) {
          width: 20px;
          height: 20px;
          border-radius: 10px;
          border: 0.5px solid #e0e0e0;
          background: #17af26;
        }
      }

      .number {
        display: flex;
        //   justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        color: var(--color-textlv2);
        .line {
          width: 1px;
          height: 12px;
          background: #c3d2cc;
          margin: 0 8px;
        }
      }
      .address-info {
        // color: var(--color-textlv2);
        font-size: 16px;
        margin-bottom: 8px;
      }

      .code {
        color: #999;
        font-size: 14px;
      }
    }
  }

  .order-list {
    // margin: 8px 10px;/
    // border-bottom: 1px solid #f4f4f4;
    // border-radius: 10px;
    // padding: 0 16px;

    background: var(--adm-bg-white);
    .order-item {
      display: flex;
      // justify-content: center;
      // justify-content: space-between;
      // align-items: center;
      // border-bottom: 1px solid #f4f4f4;

      padding: 10px;

      margin-bottom: 5px;
      .left {
        position: relative;
        margin-right: 8px;
        .box-img {
          width: 82px;
          height: 82px;
          margin-bottom: 8px;
        }
        .tag {
          position: absolute;
          top: 0;
          left: 0;
          padding: 4px;
          color: var(--adm-color-white);
          text-align: center;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          line-height: 12px; /* 100% */
          text-transform: uppercase;
          background: #d92211;
          z-index: 2;
        }
      }

      .right {
        .good-title {
          overflow: hidden;
          color: #1f2c3c;
          text-overflow: ellipsis;
          font-size: 14px;
          font-weight: 500;
          line-height: 150%;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          align-self: stretch;
          margin-bottom: 4px;
        }

        .good-tag {
          color: #9d9ea2;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 12px;
          font-weight: 500;
          line-height: 150%;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          align-self: stretch;
          margin-bottom: 4px;
        }

        .good-info {
          font-size: 14px;
          display: flex;
          align-items: center;
          .good-price {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .price {
              color: var(--adm-color-textLv1);
              font-family: Roboto;
              font-size: 12px;
              font-style: normal;
              font-weight: 500;
              line-height: 18px;
              &.red {
                color: var(--color-red);
              }
            }
            .discount {
              margin-left: 2px;
              color: var(--adm-color-textlv3);
              font-family: Roboto;
              font-size: 10px;
              font-style: normal;
              font-weight: 400;
              line-height: 18px;
              text-decoration-line: line-through;
            }
          }

          .good-qua {
            color: #999;
            font-size: 12px;
            margin-left: 4px;
          }
        }

        .update {
          display: inline-block;
          margin-top: 2px;
          padding: 1px 6px;
          text-align: center;
          color: var(--adm-color-primary);
          font-family: Inter;
          font-size: 10px;
          font-style: normal;
          font-weight: 400;
          line-height: 150%;
          border-radius: 2px;
          border: 1px solid var(--adm-color-primary);
        }
      }
    }
  }
  .order-message {
    margin: 7px 0;
    padding: 16px;
    background: var(--adm-bg-white);
    :deep(.van-field) {
      padding: 0;
      border: none;
      box-shadow: none;
    }
    :deep(.van-cell:after) {
      display: none;
    }
    :deep(.van-field__control) {
      text-align: right;
    }

    .transport {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 16px;
      .lebal {
        color: var(--adm-color-textLv1);
        font-family: Roboto;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }

      .tag {
        padding: 1px 6px;
        color: var(--adm-color-primary);
        font-family: Inter;
        font-size: 10px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%; /* 15px */
        border-radius: 2px;
        border: 1px solid var(--adm-color-primary);
      }
    }
  }
  .list-sum {
    background: var(--adm-bg-white);
    padding: 16px;
    .sum-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      color: #46494f;
      font-size: 12px;
      p {
        font-weight: 500;
      }
    }

    .sum-total {
      padding-bottom: 16px;
      color: #1f2c3c;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // border-bottom: 1px solid #f2f2f2;
      &:last-child {
        padding-bottom: 0;
      }

      span {
        color: #1a1a1a;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }

      p {
        color: #2b3033;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }

      &.total {
        padding-top: 12px;
        border-top: 1px solid var(--color-border);
        span {
          color: var(--adm-color-textLv1);
          font-family: Roboto;
          font-size: 20px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }

        p {
          color: var(--color-red);
          text-align: right;
          font-family: Roboto;
          font-size: 18px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
        }
      }
    }

    .sum-amount {
      color: #1f2c3c;
      font-size: 14px;
      // font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 40px;
      // margin-top: 32px;
      p {
        margin-left: 10px;
        span {
          color: var(--color-price);
        }
      }
    }
  }

  .order-sum {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%); /* 保证居中 */
    width: 100%;
    // max-width: 375px; /* 跟 app 一样宽 */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background: var(--adm-bg-white);
    box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.1);

    .sum-price {
      color: #eb2606;
      font-size: 16px;
      font-weight: 600;
    }

    .sum-submit {
      width: 100%;
      height: 40px;
      padding: 0 24px;
      gap: 8px;
      flex-shrink: 0;
      border-radius: 2px;
      background: linear-gradient(90deg, var(--adm-color-primary), var(--adm-color-primary-op6));
      color: var(--adm-color-white);
      font-size: 14px;
      font-weight: 500;
      line-height: 40px;
      text-align: center;
    }
  }
}
</style>
