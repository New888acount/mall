<template>
  <div class="order-list" v-loading="state.tabLoading">
    <MobileHeader class="paysuccess-header" :title="$t('order.list.title')" :backicon="false"></MobileHeader>

    <van-tabs v-model:active="activeName" @change="onTabChange">
      <van-tab v-for="item in orderNav" :key="item.name" :title="item.text" :name="item.name">
        <!-- {{ item.text }} -->
        <MyPullRefreshList v-model:loading="state.loading" :finished="state.finished" @load="onLoad">
          <div class="data-list">
            <div class="data-item" v-for="item in state.list" :key="item.orderId">
              <div class="data-top">
                <div class="data-id">{{ $t('order.list.id') }}{{ item.orderId }}</div>

                <div class="data-status">{{ getOrderStatusName(item.status) }}</div>
              </div>
              <div class="data-center">
                <div class="order-item" v-for="obj in item.orderItemList" :key="obj.id">
                  <div class="left">
                    <MyImage
                      class="box-img"
                      v-if="$imgBaseUrl + obj.pic"
                      :src="$imgBaseUrl + obj.pic"
                      alt=""
                      fit="initial"
                    />
                  </div>
                  <div class="right">
                    <div class="good-title">
                      {{ obj.productName }}
                    </div>
                    <div class="good-tag">{{ obj.spDataValue }}</div>
                    <div class="good-info">
                      <div class="good-price">{{ obj.salePrice }}</div>
                      <div class="good-qua">x {{ obj.quantity }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="data-sum">
                {{ $t('order.list.sum', { count: item.orderItemList.length }) }}{{ item.payAmount }}
              </div>

              <div class="data-operate">
                <div @click="detailHandle(item)" v-if="item.aftersaleStatus === 1">{{ $t('order.list.button1') }}</div>
                <div
                  v-if="item.status === 2 && item.aftersaleStatus === 1"
                  @click="onConfirm(item)"
                  class="continue-paying"
                >
                  {{ $t('order.list.button4') }}
                </div>
                <div @click="canceltip(item)" v-if="item.status === 0">{{ $t('order.list.button2') }}</div>
                <div
                  @click="onPay({ orderSn: item.payId, totalAmount: item.totalAmount })"
                  class="continue-paying"
                  v-if="item.status === 0"
                >
                  {{ $t('order.list.button3') }}
                </div>
                <div
                  @click="buyAgain(item)"
                  v-if="item.status === 3 && item.aftersaleStatus === 1"
                  class="continue-paying"
                >
                  {{ $t('order.list.button5') }}
                </div>
                <div @click="onDelete(item)" v-if="[0, 4, 5].includes(item.status)">{{ $t('order.list.button6') }}</div>
              </div>
            </div>
          </div>

          <!-- 数据为空 -->
          <div v-if="!state.list.length && !state.loading && !state.tabLoading">
            <MyEmptyData />
          </div>
        </MyPullRefreshList>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { orderCancelApi, orderConfirmApi, orderDeleteApi, orderListApi } from '@/api/order'
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import { getOrderStatusName } from '@/hooks/storage/useGoods'
import i18n from '@/i18n/index'
import router from '@/router'
import { customToast } from '@/utils/index'
import { showConfirmDialog } from 'vant'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const t = i18n.global.t
const route = useRoute()
const selectItem = ref({})
const orderNav = [
  {
    text: t('order.tab6'),
    name: 0,
    value: -1,
  },
  {
    text: t('order.tab1'),
    name: 1,
    value: 0,
  },
  {
    text: t('order.tab2'),
    name: 2,
    value: 1,
  },
  {
    text: t('order.tab3'),
    name: 3,
    value: 2,
  },
  // {
  //   text: t('order.tab4'),
  //   name: 4,
  //   value: -2,
  // },
]
const activeName = ref(orderNav[0].name)

const state = reactive({
  list: [],
  loading: false,
  tabLoading: false,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  status: 0,
})
/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
// 切换事件
const onTabChange = async (name) => {
  const tab = orderNav.find((item) => item.name === name)

  if (tab) {
    state.status = tab.value
    // 在这里可以根据 value 去请求对应订单列表
    state.list = []
    state.pagination.current = 1
    state.pagination.pageSize = 10
    state.pagination.total = 0
    state.tabLoading = true
    await getOrderList()
    state.tabLoading = false
  }
}

const detailHandle = (item) => {
  // 传参数
  router.push({ path: '/order/detail', query: { id: item.orderId } })
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
  selectItem.value = item

  showConfirmDialog({
    title: t('pop.ancel.title'),
    message: t('order.cancel.text'),
    confirmButtonText: t('order.cancel.button2'),
    cancelButtonText: t('order.cancel.button1'),
  })
    .then(async () => {
      const idList = [item.orderId]
      const res = await orderCancelApi({ idList })
      if (res.code === 200) {
        customToast(res.msg)
        await getOrderList()
      }
    })
    .catch(() => {
      // 用户取消
    })
}

// 确认收货
const onConfirm = (item) => {
  console.log(item)
  // item = {id:1}
  selectItem.value = item

  showConfirmDialog({
    title: t('pop.ancel.title'),
    message: t('order.confirm.text'),
    confirmButtonText: t('order.cancel.button2'),
    cancelButtonText: t('order.cancel.button1'),
  })
    .then(async () => {
      try {
        state.loading = true
        const res = await orderConfirmApi(item.orderId)
        if (res.code === 200) {
          customToast(res.msg)
          await getOrderList()
        }
      } catch (error) {
        console.log(error)
      } finally {
        state.loading = false
      }
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
      try {
        state.loading = true
        const res = await orderDeleteApi(item.orderId)
        if (res.code === 200) {
          customToast(res.msg)
          await getOrderList()
        }
      } catch (error) {
        console.log(error)
      } finally {
        state.loading = false
      }
    })
    .catch(() => {
      // 用户取消
    })
}

let loadingDiabled = false

const onLoad = async () => {
  if (state.finished || loadingDiabled) return false

  state.pagination.current++
  await getOrderList()
}

const getOrderList = async () => {
  loadingDiabled = true
  state.loading = true
  console.log(state.loading, 'state.loading')

  try {
    const data = await orderListApi({
      pageNum: state.pagination.current,
      pageSize: state.pagination.pageSize,
      status: state.status,
    })

    data.rows = data?.rows || []

    if (data.rows && data.rows.length > 0) {
      data.rows.forEach((it) => {
        it.orderItemList.forEach((item) => {
          let str = ''
          const obj = JSON.parse(item.spData)
          Object.keys(obj).forEach((key) => {
            str += key + '：' + obj[key] + ' '
          })
          item.spDataValue = str
        })
      })
    }

    state.list.push(...data.rows)

    state.pagination.total = data.total
  } finally {
    state.loading = false
    loadingDiabled = false
    if (state.list.length >= state.pagination.total) {
      state.finished = true
    }
  }
}
/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {
  if (route.query.type) {
    activeName.value = Number(route.query.type)
    onTabChange(activeName.value)
  }
})
/** ***生命周期end*****/
// 监听路由参数 type 的变化
watch(
  () => route.query.type,
  (newVal) => {
    if (newVal !== undefined) {
      activeName.value = Number(newVal)
    }
  },
  { immediate: true } // 页面加载时立即执行一次
)
</script>

<style scoped lang="less">
.data-list {
  .data-item {
    margin: 10px;
    background: #fff;
    padding: 0 10px;
    border-radius: 5px;

    .data-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      line-height: 40px;
      font-size: 13px;
      .data-status {
        color: #999;
      }
    }

    .order-item {
      display: flex;
      justify-content: center;
      padding: 10px 0;
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

    .data-sum {
      text-align: right;
      margin-top: 15px;
      font-size: 12px;
      margin-bottom: 5px;
    }

    .data-operate {
      text-align: center;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      min-height: 50px;
      flex-wrap: wrap;
      div {
        width: 80px;
        height: 27.5px;
        border-radius: 15px;
        font-size: 13px;
        border: 1px solid #dcdcdc;
        line-height: normal;
        margin-left: 5px;
        margin-bottom: 5px;
        line-height: 27.5px;
      }

      .continue-paying {
        background: linear-gradient(90deg, var(--color-light), rgba(255, 96, 0, 0.6));
        color: #fff;
      }
    }
  }
}
</style>
