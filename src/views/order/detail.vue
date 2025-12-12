<template>
  <div class="order-detail" v-loading="state.isLoading">
    <MobileHeader class="paysuccess-header" :title="$t('order.detail.title')" :backicon="false"></MobileHeader>

    <main>
      <div class="detail-one">
        <div class="detail-status" :style="formatOrderColor(state.status)">{{ getOrderStatusName(state.status) }}</div>

        <div class="detail-address" v-if="state.address">
          <div>
            {{ state.address.receiverName }}
            <span>{{ state.address.receiverPhone }}</span>
          </div>
          <div class="address-text">{{ state.address.fullAddress }}</div>
        </div>
      </div>

      <div class="detail-two">
        <div class="order-item" v-for="item in state.orderInfo.orderItemList" :key="item.id">
          <div class="left">
            <MyImage class="box-img" v-if="$imgBaseUrl + item.pic" :src="$imgBaseUrl + item.pic" alt="" fit="initial" />
            <!-- <div class="good-id">
                  <p>商品ID:</p>
                  <p>DG80000348</p>
                </div> -->
          </div>
          <div class="right">
            <div class="good-title">
              {{ item.productName }}
            </div>
            <div class="good-tag">{{ item.spDataValue }}</div>
            <div class="good-info">
              <div class="good-price">{{ item.salePrice }}</div>
              <div class="good-qua">x {{ item.quantity }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-timeinfo">
        <div class="detail-box">
          <div class="detail-orderid">
            <span>{{ $t('order.detail.orderid') }}</span>
            {{ state.orderInfo.orderSn }}
          </div>
          <div class="copy-button" @click="copyOrder(state.orderId)">{{ $t('order.detail.copy') }}</div>
        </div>
        <div class="detail-time">
          <span>{{ $t('order.detail.ordertime') }}</span>
          {{ formatDateTimer(state.orderInfo.createTime, 'YYYY-MM-DD hh:mm:ss') }}
        </div>
        <div class="detail-time" v-if="state.orderInfo.createTime">
          <span>{{ $t('order.detail.paytime') }}</span>
          {{ state.orderInfo.paymentTime ? formatDateTimer(state.orderInfo.paymentTime, 'YYYY-MM-DD hh:mm:ss') : '--' }}
        </div>
        <div class="detail-time" v-if="state.orderInfo.deliverySn">
          <span>{{ $t('order.detail.deliverySn') }}</span>
          {{ state.orderInfo.deliverySn }}
        </div>
      </div>

      <div class="detail-sum">
        <div class="deatil-total">
          <span>{{ $t('order.detail.sum') }}</span>
          <p>{{ state.orderInfo.totalAmount }}</p>
        </div>
        <div class="detail-required">
          {{ [1, 2, 3].includes(state.status) ? $t('order.detail.paid') : $t('order.detail.required') }}
          <span>{{ state.orderInfo.payAmount }}</span>
        </div>
      </div>
    </main>

    <!-- 根据状态展示这部分的结构  取消状态不展示 -->
    <div class="detail-operate">
      <div
        v-if="state.orderInfo.status === 2 && state.orderInfo.aftersaleStatus === 1"
        @click="onConfirm(state.orderInfo)"
        class="continue-paying"
      >
        {{ $t('order.list.button4') }}
      </div>
      <div @click="canceltip(state.orderId)" v-if="state.orderInfo.status === 0">{{ $t('order.list.button2') }}</div>
      <div
        @click="onPay({ orderSn: state.orderInfo.payId, totalAmount: state.orderInfo.totalAmount })"
        class="continue-paying"
        v-if="state.orderInfo.status === 0"
      >
        {{ $t('order.list.button3') }}
      </div>
      <div
        @click="buyAgain(state.orderInfo)"
        v-if="state.orderInfo.status === 3 && state.orderInfo.aftersaleStatus === 1"
        class="continue-paying"
      >
        {{ $t('order.list.button5') }}
      </div>
      <!-- <div @click="onDelete(state.orderInfo)" v-if="[0, 4, 5].includes(state.orderInfo.status)">删除订单</div> -->
    </div>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { orderCancelApi, orderConfirmApi, orderDeleteApi, orderDetailApi } from '@/api/order'
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import { formatOrderColor, getOrderStatusName } from '@/hooks/useDict/useGoods'
import router from '@/router'
import { copyText, customToast, formatDateTimer } from '@/utils/index'
import { showConfirmDialog } from 'vant'
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const { t } = useI18n()
const minute = ref(0)
const second = ref(0)
function time(endTime) {
  let date = new Date() //现在时间
  let now = date.getTime() //现在时间戳
  let allTime = endTime - now
  let m, s
  if (allTime > 0) {
    m = Math.floor((allTime / 1000 / 60) % 60)
    s = Math.floor((allTime / 1000) % 60)
    minute.value = m < 10 ? '0' + m : m
    second.value = s < 10 ? '0' + s : s
    setTimeout(() => {
      time(endTime)
    }, 1000)
  }
}

const route = useRoute()

const state = reactive({
  orderInfo: {},
  orderId: null,
  address: {},
  status: null,
  isLoading: false,
})
/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
const copyOrder = (item) => {
  copyText(item)
}

// 继续支付
const onPay = (data) => {
  router.push({
    path: '/pay',
    query: {
      orderSN: data.orderSn,
      totalAmount: data.totalAmount,
      orderType: 'memberConsumer',
    },
  })
}

// 取消订单
const canceltip = (item) => {
  // console.log(item)
  // item = {id:1}

  showConfirmDialog({
    title: t('pop.ancel.title'),
    message: t('order.cancel.text'),
    confirmButtonText: t('order.cancel.button2'),
    cancelButtonText: t('order.cancel.button1'),
  })
    .then(async () => {
      // TODO: 调用删除接口
      const idList = [item.payId]
      const res = await orderCancelApi({ idList })

      // showToast('已删除');
    })
    .catch(() => {
      // 用户取消
    })
}

// 确认收货
const onConfirm = (item) => {
  console.log(item)
  // item = {id:1}

  showConfirmDialog({
    title: t('pop.ancel.title'),
    message: t('order.confirm.text'),
    confirmButtonText: t('order.cancel.button2'),
    cancelButtonText: t('order.cancel.button1'),
  })
    .then(async () => {
      // TODO: 调用删除接口
      const res = await orderConfirmApi(item.orderId)
      if (res.code === 200) {
        customToast(res.msg)
        getOrderDetail(item.orderId)
      }
      // showToast('已删除');
    })
    .catch(() => {
      // 用户取消
    })
}

// 再次购买
const buyAgain = (item) => {
  router.push({
    path: '/goods/index',
    query: {
      id: item.orderItemList[0].productId,
    },
  })
}

// 删除订单
const onDelete = (item) => {
  showConfirmDialog({
    title: t('pop.ancel.title'),
    message: t('order.delete.text'),
    confirmButtonText: t('order.cancel.button2'),
    cancelButtonText: t('order.cancel.button1'),
  })
    .then(async () => {
      // TODO: 调用删除接口
      console.log('3333')
      const res = await orderDeleteApi(item.orderId)

      // showToast('已删除');
    })
    .catch(() => {
      // 用户取消
    })
}
const getOrderDetail = async (id) => {
  try {
    state.isLoading = true
    const { data: res } = await orderDetailApi(id)

    res.orderItemList.forEach((item) => {
      let str = ''
      const obj = JSON.parse(item.spData)
      Object.keys(obj).forEach((key) => {
        str += key + '：' + obj[key] + ' '
      })
      item.spDataValue = str
    })
    state.orderInfo = res
    state.orderId = res.orderId
    state.status = res.status
    if (res.status === 0 && res.timeToPay) {
      time(res.timeToPay)
    }
    const { receiverName, receiverPhone, receiverProvince, receiverCity, receiverDistrict, receiverDetailAddress } = res
    state.address = {
      receiverName,
      receiverPhone,
      fullAddress:
        receiverProvince +
        ' ' +
        receiverCity +
        ' ' +
        receiverDistrict +
        ' ' +
        getHiddenDetailAddress(receiverDetailAddress),
    }
  } catch (error) {
    console.log(error)
  } finally {
    state.isLoading = false
  }
}

function getHiddenDetailAddress(data) {
  const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  if (!data || data.length === 0) {
    return ''
  }
  let tempResult = data.replace(/\d/g, '*')
  let result = ''
  for (let i = 0; i < tempResult.length; i++) {
    if (chineseNumbers.includes(tempResult[i])) {
      result += '*'
    } else {
      result += tempResult[i]
    }
  }
  return result
}
/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {
  if (route.query.id) {
    console.log(route.query.id)
    getOrderDetail(route.query.id)
  }
})
/** ***生命周期end*****/
</script>

<style scoped lang="less">
.order-detail {
  font-size: 15px;

  main {
    padding: 8px 10px 58px;
  }

  .detail-one {
    background: #fff;
    border-radius: 5px;
    padding: 22px 17px 21px 10px;
    .detail-status {
      margin: auto 0;
      text-align: center;
      height: 45px;
    }

    .detail-address {
      .address-text {
        color: #999;
        font-size: 13px;
        margin-top: 10px;
      }
    }
  }

  .detail-two {
    background: #fff;
    border-radius: 5px;
    margin-top: 10px;

    .order-item {
      display: flex;
      justify-content: center;
      padding: 10px;
      border-bottom: 1px solid #f2f2f2;
      .left {
        margin-right: 8px;
        .box-img {
          width: 82px;
          height: 82px;
          margin-bottom: 8px;
        }
        .good-id {
          color: #717378;
          font-size: 12px;
        }
      }

      .right {
        flex: 1;
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

          .good-qua {
            color: #999;
            font-size: 12px;
            margin-left: 4px;
          }
        }
      }
    }
  }

  .detail-timeinfo {
    background: #fff;
    border-radius: 5px;
    margin-top: 10px;
    padding: 10px;
    .detail-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      margin-bottom: 12px;
      span {
        color: #999;
      }

      .detail-orderid {
        margin-right: 8px;
        overflow: hidden; /* 超出隐藏 */
        white-space: nowrap; /* 不换行 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
      }
      .copy-button {
        width: 50px;
        line-height: 25px;
        border-radius: 12.5px;
        background: rgb(238, 238, 238);
        font-size: 11px;
        font-weight: 400;
        color: rgb(51, 51, 51);
        text-align: center;
      }
    }

    .detail-time {
      font-size: 14px;
      margin-bottom: 12px;
      span {
        color: #999;
      }
    }
  }

  .detail-sum {
    background: #fff;
    border-radius: 5px;
    margin-top: 10px;
    padding: 10px;
    font-size: 14px;
    .deatil-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 35px;
      span {
        color: #999;
      }
      p {
        color: var(--color-light);
      }
    }
    .detail-required {
      text-align: right;
      margin-top: 10px;
    }
  }

  .detail-operate {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%); /* 保证居中 */
    width: 100%;
    // max-width: 375px; /* 跟 app 一样宽 */
    background: #fff;
    text-align: center;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 50px;
    padding: 10px;
    div {
      width: 80px;
      height: 27.5px;
      border-radius: 15px;
      font-size: 13px;
      border: 1px solid #dcdcdc;
      line-height: normal;
      margin-left: 5px;
      line-height: 27.5px;
    }

    .continue-paying {
      background: linear-gradient(90deg, var(--color-light), rgba(255, 96, 0, 0.6));
      color: #fff;
    }
  }
}
</style>
