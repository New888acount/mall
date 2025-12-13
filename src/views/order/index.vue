<template>
  <div class="order-list" v-loading="state.tabLoading">
    <header>
      <MobileHeader class="paysuccess-header" :leftText="$t('order.list.title')" :backicon="false"></MobileHeader>

      <MyTabs
        v-model:active="activeName"
        line-fill
        wrapTopLineShow
        wrapBottomLineShow
        class="tabs"
        @change="onTabChange"
      >
        <van-tab v-for="item in orderNav" :key="item.name" :title="item.text"></van-tab>
      </MyTabs>
    </header>

    <div class="line"></div>

    <MyPullRefreshList v-model:loading="state.loading" :finished="state.finished" @load="onLoad">
      <div class="data-list">
        <div class="data-item" v-for="item in state.list" :key="item.orderId">
          <div class="data-top">
            <!-- <div class="data-id">{{ $t('order.list.id') }}{{ item.orderId }}</div> -->

            <div
              class="data-status"
              :class="{
                active: item.status === 0,
              }"
            >
              {{ getOrderStatusName(item.status) }}
            </div>
            <div class="data-timer">{{ formatDateTimer(item.createTime, 'YYYY-MM-DD hh:mm:ss') }}</div>
          </div>
          <div class="data-center">
            <div class="order-item">
              <div class="left">
                <MyImage
                  class="box-img"
                  v-for="obj in item.orderItemList.slice(0, 4)"
                  :key="obj.id"
                  :src="$imgBaseUrl + obj.pic"
                  alt=""
                  fit="initial"
                />
              </div>
              <div class="right">
                <div class="data-sum">
                  <p class="amount">{{ $unit }} {{ item.payAmount }}</p>
                  <p class="text">{{ $t('order.list.sum', { count: item.orderItemList.length }) }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="data-operate">
            <a-button
              class="default-btn-ghost operate-item"
              @click="detailHandle(item)"
              v-if="item.aftersaleStatus === 1"
            >
              {{ $t('order.list.button1') }}
            </a-button>
            <a-button
              v-if="item.status === 2 && item.aftersaleStatus === 1"
              @click="onConfirm(item)"
              class="default-btn-solidgrey operate-item"
            >
              {{ $t('order.list.button4') }}
            </a-button>
            <a-button class="default-btn-solidgrey operate-item" @click="canceltip(item)" v-if="item.status === 0">
              {{ $t('order.list.button2') }}
            </a-button>
            <a-button
              @click="onPay({ orderSn: item.payId, totalAmount: item.totalAmount })"
              class="default-btn operate-item"
              v-if="item.status === 0"
            >
              {{ $t('order.list.button3') }}
            </a-button>
            <a-button
              @click="buyAgain(item)"
              v-if="item.status === 3 && item.aftersaleStatus === 1"
              class="default-btn operate-item"
            >
              {{ $t('order.list.button5') }}
            </a-button>
            <a-button
              class="default-btn-solidgrey operate-item"
              @click="onDelete(item)"
              v-if="[0, 4, 5].includes(item.status)"
            >
              {{ $t('order.list.button6') }}
            </a-button>
          </div>
        </div>
      </div>

      <div v-if="!state.list.length && !state.loading && !state.tabLoading">
        <MyEmptyData />
      </div>
    </MyPullRefreshList>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { orderCancelApi, orderConfirmApi, orderDeleteApi, orderListApi } from '@/api/order'
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import { getOrderStatusName } from '@/hooks/useDict/useGoods'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import { customToast, formatDateTimer } from '@/utils/index'
import { showConfirmDialog } from 'vant'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const { t } = useI18n()
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
    state.tabLoading = false

    // ✅ 路由同步：把当前 tab 写到 query 或 params
    router.replace({
      path: '/order',          // 你的订单页路径
      query: { type: tab.name } // 或者用 tab.name，看你需求
    })
  }
  activeName.value = tab?.name
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
      try {
        state.tabLoading = true
        const idList = [item.orderId]
        const res = await orderCancelApi({ idList })
        if (res.code === 200) {
          customToast(res.msg)
          await getOrderList(true)
        }
      } catch (error) {
        console.log(error)
      } finally {
        state.tabLoading = false
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
        state.tabLoading = true
        const res = await orderConfirmApi(item.orderId)
        if (res.code === 200) {
          customToast(res.msg)
          await getOrderList(true)
        }
      } catch (error) {
        console.log(error)
      } finally {
        state.tabLoading = false
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
        state.tabLoading = true
        const res = await orderDeleteApi(item.orderId)
        if (res.code === 200) {
          customToast(res.msg)
          await getOrderList(true)
        }
      } catch (error) {
        console.log(error)
      } finally {
        state.tabLoading = false
      }
    })
    .catch(() => {
      // 用户取消
    })
}

let loadingDiabled = false

const onLoad = async () => {
  if (state.finished || loadingDiabled) return false

  await getOrderList()
}

const getOrderList = async (flag) => {
  loadingDiabled = true
  state.loading = true

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

    if (flag) {
      state.list = data.rows
    } else {
      state.list.push(...data.rows)
    }

    state.pagination.current++
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
  }
})
/** ***生命周期end*****/
// 监听路由参数 type 的变化
watch(
  () => route.query.type,
  (newVal) => {
    if (newVal !== undefined) {
      activeName.value = Number(newVal)
    onTabChange(activeName.value)

    }
    //  else {
    //   activeName.value = Number(orderNav[0].name)
    // }
  },
  { immediate: true } // 页面加载时立即执行一次
)
</script>

<style scoped lang="less">
.order-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  height: 100dvh;
  background: #fbfbfb;
  header {
    width: 100%;
  }

  .tabs {
    :deep(.van-tabs__wrap) {
      height: 32px;
    }
    :deep(.van-tabs__nav) {
      .van-tab {
        padding: 0;
        margin-right: 24px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  .line {
    width: 100%;
    height: 12px;
    background: #fbfbfb;
  }

  .my-pull-refresh-list {
    flex: 1;
    overflow: scroll;
    width: 100%;
  }
  .data-list {
    padding-bottom: 64px;
    width: 100%;

    .data-item {
      padding: 12px 12px 0;
      margin-bottom: 12px;
      background: #fff;
      &:last-child {
        margin-bottom: 0;
      }

      .data-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .data-status {
          flex: 1;
          overflow: hidden;
          color: var(--adm-color-textLv1);
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: 'PingFang SC';
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: 150%; /* 21px */
          &.active {
            color: var(--adm-color-primary);
          }
        }

        .data-timer {
          color: var(--color-textlv2);
          font-family: Roboto;
          font-size: 10px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }

      .order-item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 0;
        border-bottom: 1px solid #f2f2f2;
        .left {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex: 1;
          .box-img {
            margin-right: 4px;
            width: 56px;
            height: 56px;
          }
        }
      }

      .data-sum {
        text-align: right;
        .amount {
          color: var(--color-red);
          font-family: Roboto;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
        }
        .text {
          margin-top: 4px;
          color: var(--adm-color-dark);
          font-family: Roboto;
          font-size: 10px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }

      .data-operate {
        text-align: center;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-wrap: wrap;
        padding: 12px 0;

        .operate-item {
          height: 26px;
          padding: 0 12px;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 12px;
        }

        .operate-item + .operate-item {
          margin-left: 8px;
        }
      }
    }
  }

  :deep(.my-empty-data) {
    margin-top: 0;
    background: transparent;
  }
}
</style>
