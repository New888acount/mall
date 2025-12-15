<template>
  <div class="product">
    <MobileHeader class="product-header" :backicon="true" :style="{ backgroundColor: navShow ? 'transparent' : '' }">
      <template #title>
        <div class="pro-header" v-if="!navShow" @click="scrollTop">
          <div>{{ $t('goodHeader.tab1') }}</div>
          <div class="detail-pointer">
            {{ $t('goodHeader.tab2') }}
            <div></div>
          </div>
        </div>
      </template>
    </MobileHeader>
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
            <div class="price">{{ $unit }} {{ state.goodsInfo?.product?.price }}</div>
          </div>
          <div class="title">
            {{ state.goodsInfo?.product?.name }}
          </div>
        </div>

        <!-- 发货信息 -->
        <div class="shipping-info" v-if="false">
          <van-steps direction="vertical" :active="active">
            <van-step>
              <!-- 已激活图标 -->
              <template #active-icon>
                <div class="custom-icon active">1</div>
              </template>
              <!-- 未激活图标 -->
              <template #inactive-icon>
                <div class="custom-icon">1</div>
              </template>
              <!-- 完成步骤图标 -->
              <template #finish-icon>
                <div class="custom-icon active">1</div>
              </template>

              <div class="step-info">
                商家发货
                <i class="iconfont icon-wenhao" @click="logisticsPop"></i>
                <div class="triangle-right"></div>
                <div class="text">
                  Fishbuy认证仓库,运费
                  <span class="freight">10.00</span>
                  <span class="unit">CNY</span>
                </div>
              </div>
            </van-step>

            <van-step>
              <!-- 已激活图标 -->
              <template #active-icon>
                <div class="custom-icon active">2</div>
              </template>
              <!-- 未激活图标 -->
              <template #inactive-icon>
                <div class="custom-icon">2</div>
              </template>
              <!-- 完成步骤图标 -->
              <template #finish-icon>
                <div class="custom-icon active">2</div>
              </template>
              <!-- <template #default> -->
              <div class="step-info">
                Fishbuy认证仓库
                <div class="triangle-right"></div>
                <div class="text">
                  你的地址,
                  <span class="freight-cost">国际运费估算</span>
                </div>
              </div>
              <!-- </template> -->
            </van-step>
          </van-steps>
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
        <div class="buy-button" @click="state.showSelectSku = true">{{ $t('good.button1') }}</div>
        <div class="add-cart" @click="state.showSelectSku = true">{{ $t('good.button2') }}</div>
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
import logisticsPop from '@/componentsFun/logisticsPop'
import router from '@/router'
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
const { t } = useI18n()

const route = useRoute()
const active = ref(1)
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
      str += key + '：' + obj[key] + ' '
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
})

onUnmounted(() => {
  ele.removeEventListener('scroll', handleScroll)
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
    padding: 7px 10px;

    .pro-info {
      padding: 16px;
      background: #fff;
      border-radius: 5px;
      .title {
        overflow: hidden;
        color: #1f2c3c;
        text-overflow: ellipsis;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: 150%; /* 27px */
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        align-self: stretch;
      }
      .price-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 8px 0;
        .price {
          color: var(--adm-color-primary);
          font-size: 24px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .price-tag {
          border-radius: 3px;
          border: 0.5px solid #f28f1b;
          background: rgba(242, 143, 27, 0.1);
          padding: 0 8px;
          margin-left: 5px;
        }
      }

      .pro-stats {
        display: flex;
        align-items: center;
        height: 21px;
        color: #1f2c3c;

        .icon-yuanrunwujiaoxing {
          color: #f2bc1b;
        }
        .rate {
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 150%; /* 21px */
          margin-left: 6px;
        }
        .line {
          width: 1px;
          height: 12px;
          border: 1px solid #c3d2cc;
          margin: 0 12px;
        }
        .m-sales {
          font-size: 14px;
          span {
            color: #9d9ea2;
          }
        }
      }
    }

    .shipping-info {
      background: #fff;
      padding: 12px 5px;
      margin-top: 7px;
      border-radius: 5px;
      .van-steps {
        width: 100%;
      }

      .custom-icon {
        width: 20px;
        height: 20px;
        border-radius: 50%; /* 圆形 */
        background-color: #ccc; /* 默认灰色底 */
        color: #fff; /* 字体白色 */
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      }

      .custom-icon.active {
        background-color: var(--adm-color-primary); /* 激活时绿色底 */
      }

      :deep(.van-step__line) {
        border-left: 1px dashed var(--adm-color-primary); /* 垂直方向虚线 */
      }

      :deep(.van-step:last-child .van-step__line) {
        display: none; /* 隐藏最后一个步骤的线条 */
      }

      // 覆盖完成状态下的线条，让它保持虚线
      :deep(.van-step--finish .van-step__line) {
        border-left: 1px dashed var(--adm-color-primary) !important; /* 垂直方向虚线 */
        background-color: #dbedf0; /* 去掉激活的底色 */
      }

      .step-info {
        color: #1f2c3c; /* 默认灰色 */
        display: flex;
        align-items: center;
        font-size: 12px;
        .icon-wenhao {
          color: #c8c9cb;
          margin: 0 2px;
        }

        .triangle-right {
          width: 0;
          height: 0;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 7px solid var(--adm-color-primary);
          // padding: 0 5px;
          margin: 0 5px;
        }
        .text {
          margin-left: 5px;

          .freight-cost {
            color: var(--adm-color-primary);
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
            line-height: 150%; /* 18px */
            text-decoration-line: underline;
          }
          .freight {
            border-radius: 6px;
            border: 1px solid #f4f4f4;
            background: #f9f9f9;
            padding: 4px 8px;
            font-size: 14px;
            font-weight: 600;
            line-height: 14px;
            margin: 0 4px;
          }

          .unit {
            color: #717378;
          }
        }
      }
    }

    .pro-spec {
      padding: 5px 16px;
      margin-top: 7px;
      background: #fff;
      display: flex;
      align-items: center;
      height: 35px;
      font-size: 14px;
      color: #999;
      border-radius: 5px;
      .select {
        flex: 1;
        margin: 0 5px 0 19px;
        color: #666;
      }
    }

    .pro-detail {
      background: #ffffff;
      padding: 16px 0;
      margin-top: 7px;
      border-radius: 5px;
      .detail-title {
        font-size: 16px;
        padding: 0 10px;
        border-left: 3px solid var(--color-price);
        margin-bottom: 15px;
        margin-left: 10px;
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
    background: #fff;
    box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.1);
    z-index: 6;
    text-align: center;
    font-size: 14px;
    line-height: 40px;
    div {
      width: 50%;
    }

    .buy-button {
      height: 40px;
      color: var(--adm-color-primary);
      box-shadow: 0 2.8px 7px rgba(255, 96, 0, 0.45);
      border-radius: 20px 0 0 20px;
      background: rgba(255, 96, 0, 0.2);
    }

    .add-cart {
      background: linear-gradient(90deg, var(--adm-color-primary), rgba(255, 96, 0, 0.6));
      color: #fff;
      box-shadow: 0 2.8px 7px rgba(255, 96, 0, 0.45);
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
