<template>
  <div class="product">
    <MobileHeader :leftText="$t('goodHeader.tab1')"></MobileHeader>
    <!-- 产品信息 -->
    <div class="load" v-if="state.isLoading">
      <MyLoading />
    </div>
    <!-- </Teleport> -->
    <div v-else>
      <SwiperPro :list="state.goodsSwiper"></SwiperPro>
      <div class="details-wrap">
        <div class="pro-info">
          <div class="price-info">
            <div
              class="price"
              :class="{
                red: state.goodsInfo?.product?.finalPrice,
              }"
            >
              {{ $unit }} {{ state.goodsInfo?.product?.finalPrice }}
            </div>
            <div v-if="state.goodsInfo?.product?.finalPrice" class="discount">
              {{ $unit }} {{ state.goodsInfo?.product?.price }}
            </div>
          </div>
          <div class="title">
            {{ state.goodsInfo?.product?.name }}
          </div>
        </div>

        <!-- 选择规格 -->
        <div class="pro-spec" @click="state.showSelectSku = true">
          <p>{{ $t('goodSpec.title') }}</p>
          <p class="select">
            {{ selectSpecValue }}
          </p>
          <i class="iconfont icon-dayuhao"></i>
        </div>

        <!-- 商品详情 -->
        <div class="pro-detail">
          <div class="detail-title">{{ $t('goodHeader.tab2') }}</div>
          <div class="detail-text" v-html="computedContent"></div>
        </div>
      </div>

      <!-- 购买。购物车 -->
      <div class="buy-box">
        <a-button class="default-btn-ghost buy-button" @click="state.showSelectSku = true">
          {{ $t('good.button1') }}
        </a-button>
        <a-button class="default-btn add-cart" @click="state.showSelectSku = true">{{ $t('good.button2') }}</a-button>
      </div>
    </div>
    <openSpecPopup
      v-if="state.showSelectSku"
      v-model="state.showSelectSku"
      :goodsInfo="state.goodsInfo"
      :selectedSku="state.currentSkuMap"
      :isLoading="state.isLoading"
      @handleFun="handleFunEvent"
      @change="onSkuChange"
      @close="close"
    ></openSpecPopup>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { goodsDetailsApi } from '@/api/goods'
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import router from '@/router'
import useAppStore from '@/store/modules/app'
import { useCartStore } from '@/store/modules/cart'
import useUserInfoStore from '@/store/modules/userInfo.js'
import { customToast } from '@/utils/index'
import { computed, getCurrentInstance, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import openSpecPopup from './components/selectSpec.vue'
import SwiperPro from './components/swiperPro.vue'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const appStore = useAppStore()
const { t } = useI18n()

const route = useRoute()
const enterTime = ref(0)
const { proxy } = getCurrentInstance()
const userInfo = useUserInfoStore()
// 购物车数据
const cartStore = useCartStore()

const state = reactive({
  id: '',
  goodsSwiper: [],
  goodsInfo: {},
  showSelectSku: false,
  currentSkuMap: {},
  isLoading: false,
})

const selectSpecValue = computed(() => {
  let str = ''
  if (state.selectedSkuPrice?.spData) {
    const obj = JSON.parse(state.selectedSkuPrice.spData)
    Object.keys(obj).forEach((key) => {
      str += (appStore.unitLangList[key] || key) + ': ' + obj[key] + ' '
    })
  } else {
    str = t('goodSpec.tip')
  }
  return str
})

// 响应式变量：导航栏背景色
const navShow = ref(true)
const ele = document.querySelector('#app') //滚动发生在app上

/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
// 规格变更
const onSkuChange = (e) => {
  state.selectedSkuPrice = e
  state.currentSkuMap = e
}

const checkLogin = () => {
  if (!userInfo.token) {
    state.showSelectSku = false
    proxy.$showLogin().catch(() => {})
    return false
  }
  return true
}

const handleFunEvent = async (data, val) => {
  state.showSelectSku = true
  // 登录校验，两个操作都需要
  if (!checkLogin()) return

  if (val === 'cart') {
    try {
      state.isLoading = true
      // 加入购物车
      const res = await cartStore.add(data)
      customToast(res.msg)
      state.showSelectSku = false
    } catch (err) {
      customToast(err.msg)
      console.error(err)
    } finally {
      state.isLoading = false
    }
  } else if (val === 'buy') {
    // 进入订单
    router.push({
      path: '/order/list', // 跳转的路径
      query: {
        data: JSON.stringify({
          order_type: 'goods',
          goods_list: [
            {
              goods_id: data.productId,
              goods_num: data.buyNum,
              skuId: data.id,
            },
          ],
        }),
      },
    })
    state.showSelectSku = false
  }
}

// 滚动事件
const handleScroll = () => {
  const top = ele.scrollTop || document.documentElement.scrollTop
  navShow.value = top > 50 ? false : true
}

const scrollTop = () => {
  const duration = 200 // 动画时长（毫秒）
  const start = ele.scrollTop
  const startTime = performance.now()

  const animate = (time) => {
    const progress = Math.min((time - startTime) / duration, 1)
    ele.scrollTop = start * (1 - progress) // 逐步减少
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}

const getDetails = async (val) => {
  if (!val) {
    // 重定向到首页
    router.push('/')
    return
  }
  state.isLoading = true
  try {
    const data = await goodsDetailsApi(val)

    if (data.code === 200) {
      state.goodsInfo = data.data
      state.goodsSwiper = state.goodsInfo.product.albumPics.split(',')

      let totalStock = 0
      data.data.skus.forEach((it) => {
        totalStock += it.stock
      })
      state.goodsInfo.totalStock = totalStock
    } else {
      // 业务错误处理
      console.warn('接口返回错误：', data)
    }
  } catch (err) {
    // 网络错误或接口异常处理
    console.error('请求失败：', err)
  } finally {
    // 无论成功失败都关闭 loading
    state.isLoading = false
  }
}

const close = () => {
  state.showSelectSku = false
}

/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {
  state.id = route.query?.id

  getDetails(state.id)
  ele.addEventListener('scroll', handleScroll, { passive: true })

  appStore.getTracking({
    type: 3,
  })

  enterTime.value = Date.now()
})

onUnmounted(() => {
  ele.removeEventListener('scroll', handleScroll)

  const leaveTime = Date.now()
  const visitTime = Math.floor((leaveTime - enterTime.value) / 1000)

  appStore.getTracking({
    type: 4,
    visitTime,
  })
})

// 计算属性：替换所有相对路径为绝对路径
const computedContent = computed(() => {
  const html = state.goodsInfo?.product?.detailMobileHtml
  if (!html) return '' // 没有内容时返回空
  return html.replace(/src="\/([^"]+)"/g, (match, path) => {
    return `src="${proxy.$imgBaseUrl}/${path}"`
  })
})
/** ***生命周期end*****/
</script>

<style scoped lang="less">
.product {
  padding-bottom: 56px;

  .product-header {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%); /* 保证居中 */
    width: 100%;
    // max-width: 375px; /* 跟 app 一样宽 */
    transition: background-color 0.3s ease; /* 平滑过渡 */
    .pro-header {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      text-align: center;
      div {
        flex: 1;
        font-size: 15px;
      }

      .detail-pointer {
        // display: flex;
        // flex-direction: column;
        // justify-content: center;
        // align-items: center;
        position: relative;
        div {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: block;
          width: 30px;
          height: 3px;
          // border-bottom: 3px solid var(--adm-color-primary);
          background: var(--adm-color-primary);
          border-radius: 3px;
          margin-top: 3px;
          text-align: center;
          color: transparent;
        }
      }
    }
  }

  .load {
    margin: 50px auto 0;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.6); /* 半透明遮罩 */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999; /* 比弹窗更高 */
  }

  .details-wrap {
    padding: 12px 16px;

    .pro-info {
      padding: 12px 16px;
      background: rgba(237, 237, 237, 0.4);
      border-radius: 5px;

      .price-info {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .price {
          color: var(--adm-color-primary);
          text-align: right;
          font-family: Roboto;
          font-size: 20px;
          font-style: normal;
          font-weight: 500;
          line-height: 24px;
          &.red {
            color: var(--color-red);
          }
        }

        .discount {
          margin-left: 8px;
          color: var(--adm-color-textlv3);
          font-family: Roboto;
          font-size: 20px;
          font-style: normal;
          font-weight: 400;
          line-height: 24px;
          text-decoration-line: line-through;
        }
      }

      .title {
        margin-top: 12px;
        overflow: hidden;
        color: #1f2c3c;
        text-overflow: ellipsis;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 150%; /* 27px */
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        align-self: stretch;
      }
    }

    .pro-spec {
      padding: 12px 16px;
      margin-top: 12px;
      background: rgba(237, 237, 237, 0.4);
      display: flex;
      align-items: center;
      height: 40px;
      font-size: 14px;
      color: var(--adm-color-textLv1);
      border-radius: 5px;
      .select {
        flex: 1;
        margin: 0 5px 0 19px;
        color: var(--adm-color-textlv2);
      }
    }

    .pro-detail {
      padding-bottom: 16px;
      margin-top: 12px;
      border-radius: 5px;
      .detail-title {
        padding: 7px 10px;
        font-size: 14px;
        color: var(--adm-color-textlv2);

        margin-bottom: 12px;
        background: rgba(237, 237, 237, 0.4);
        border-left: 3px solid var(--adm-color-primary);
      }

      .detail-line {
        width: 64px;
        margin-left: 16px;
        border-bottom: 2px solid #17af26;
        margin-bottom: 16px;
      }

      :deep(.detail-text) {
        width: 100%;
        img {
          width: 100%;
        }
      }
    }
  }

  .buy-box {
    display: flex;
    width: 100%;
    padding: 8px 16px 8px 16px;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--adm-bg-white);
    box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.1);
    z-index: 6;

    .buy-button {
      flex: 1;
      height: 40px;
      border-radius: 20px 0 0 20px;
    }

    .add-cart {
      flex: 1;
      height: 40px;
      border-radius: 0 20px 20px 0;
    }
  }
}
</style>

<style lang="less">
.my__loading--overlay {
  display: none;
}
.my__loading {
  &.my-popup {
    background: transparent;

    .my-popup__container {
      background: transparent;
      border-radius: 0;
      box-shadow: none;

      .my-loading {
      }
    }
  }
}
</style>
