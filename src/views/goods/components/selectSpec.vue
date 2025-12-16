<template>
  <MyPopup
    v-model="show"
    :closeShow="false"
    @close="close"
    position="bottom"
    :zIndex="getMaxZIndex() + 1000"
    overlayClass="my__spec--overlay"
    class="my__spec"
    :close-on-click-overlay="true"
  >
    <div class="content" v-loading="loading">
      <div class="main-wap">
        <!-- 规格产品信息 -->
        <div class="spec-info">
          <div class="spec-pro-img">
            <MyImage
              v-if="$imgBaseUrl + (state.selectedSkuPrice.pic || props.goodsInfo.product.pic)"
              :src="$imgBaseUrl + (state.selectedSkuPrice.pic || props.goodsInfo.product.pic)"
              alt=""
              fit="initial"
            />
          </div>

          <div class="spec-info-center">
            <div class="spec-title">
              {{ props.goodsInfo?.product?.name }}
            </div>

            <div class="spec-info-box">
              <div class="spec-price">{{ $unit }} {{ goodsPrice.price }}</div>

              <div class="spec-stock">
                {{
                  state.selectedSkuPrice.stock || state.selectedSkuPrice.stock === 0
                    ? formatStock('exact', state.selectedSkuPrice.stock)
                    : formatStock('exact', goodsInfo.totalStock)
                }}
              </div>
            </div>
          </div>
        </div>

        <!-- 规格颜色 -->
        <div class="spec-color" v-for="sku1 in productAttrList" :key="sku1.id">
          <p>{{ sku1.name }}</p>
          <div class="option-selector">
            <div
              v-for="sku2 in sku1.options.filter((i) => i.name)"
              :key="sku2.id"
              class="option-item"
              @click="onSelectSku(sku2.name, sku1.name)"
              :class="[
                {
                  active: state.currentSkuMap[sku1.name] === sku2.name,
                },
              ]"
            >
              <!-- 文本类型 -->
              <a-button
                class="option-item-text"
                :class="{
                  'default-btn-ghost': state.currentSkuMap[sku1.name] !== sku2.name,
                  'default-btn': state.currentSkuMap[sku1.name] === sku2.name,
                }"
              >
                {{ sku2.name }}
              </a-button>
            </div>
          </div>
        </div>

        <!-- 规格数量 -->
        <div class="spec-qua">
          <div class="left">
            <p>{{ $t('cart.Quantity') }}</p>
          </div>
          <Stepper
            v-model="state.selectedSkuPrice.buyNum"
            :max="state.selectedSkuPrice.stock"
            @change="changeStepper"
          ></Stepper>
        </div>
      </div>

      <!-- 购买按钮 -->
      <div class="buy-box">
        <a-button class="default-btn-ghost buy-button" @click="buttonhandle('cart')">{{ $t('good.button1') }}</a-button>
        <a-button class="default-btn add-cart" @click="buttonhandle('buy')">{{ $t('good.button2') }}</a-button>
      </div>
    </div>
  </MyPopup>
</template>

<script setup>
/** ***引入相关包start*****/
import MyPopup from '@/components/MyPopup/index.vue'
import { customToast } from '@/utils'
import { getMaxZIndex } from '@/utils/index'

import { formatStock } from '@/hooks/useDict/useGoods'
import { isEmpty } from 'lodash'
import { computed, defineEmits, defineExpose, defineProps, onMounted, reactive, ref, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

/** ***引入相关包end*****/

/** ***ref、reactive、props，等……start*****/
const { t } = useI18n()

const show = ref(false)

const props = defineProps({
  goodsInfo: {
    type: Object,
    default() {},
  },
  show: {
    type: Boolean,
    default: false,
  },
  isScore: {
    type: Boolean,
    default: false,
  },
  selectedSku: {
    type: Object,
    default() {},
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

defineExpose({
  show,
})
const emit = defineEmits(['change', 'handleFun', 'close'])

const loading = computed(() => props.isLoading)

const state = reactive({
  selectedSkuPrice: { buyNum: 1 },
  currentSkuArray: [],
  currentSkuMap: {},
})
const skuList = ref()

// 默认单规格 todo
if (props.goodsInfo.skus.length < 2 && props.goodsInfo.skus.length > 0) {
  state.selectedSkuPrice = { ...props.goodsInfo.skus[0], buyNum: 1, productName: props.goodsInfo.product.name }
  console.log(state.selectedSkuPrice)
  state.currentSkuMap = JSON.parse(state.selectedSkuPrice?.spData)
}

watch(
  () => props.selectedSku,
  (val) => {
    if (val && val.spData) {
      state.selectedSkuPrice = val
      state.currentSkuMap = JSON.parse(val.spData || '{}')
    }
  },
  { immediate: true }
)

watch(
  () => state.selectedSkuPrice,
  (newVal) => {
    emit('change', newVal)
  },
  {
    immediate: true, // 立即执行
    deep: true, // 深度监听
  }
)
// 可选择款式对象
const productAttrList = computed(() => {
  return JSON.parse(props.goodsInfo.product.productAttr)
})

const goodsPrice = computed(() => {
  let price, score
  if (isEmpty(state.selectedSkuPrice)) {
    price = props.goodsInfo.product.price
    score = props.goodsInfo.score || 0
  } else {
    price = state.selectedSkuPrice.price
    score = state.selectedSkuPrice.score || 0
  }
  return { price, score }
})

/** ***ref、reactive、props，等……end*****/

/** ***函数 start*****/

//关闭
const close = () => {
  show.value = false
  emit('close')
}

const changeStepper = (val) => {
  state.selectedSkuPrice.buyNum = val
}
const buttonhandle = (val) => {
  if (state.selectedSkuPrice.id) {
    if (state.selectedSkuPrice.stock < 1) {
      // 没有库存
      customToast(t('goodIndex.noStock'))
    } else {
      emit('handleFun', state.selectedSkuPrice, val)
    }
  } else {
    customToast(t('goodIndex.selectTip'))
  }
}

// 选择规格
const onSelectSku = (childName, pname) => {
  const dbChildName = state.currentSkuMap[pname]
  if (!dbChildName || dbChildName !== childName) {
    state.currentSkuMap[pname] = childName
  } else {
    delete state.currentSkuMap[pname]
  }
  //判断是否符合选中sku
  for (let i = 0; i < skuList.value.length; i++) {
    const skus = JSON.parse(skuList.value[i].spData)
    if (Object.keys(skus).length !== Object.keys(state.currentSkuMap).length) {
      state.selectedSkuPrice = {}
      return
    }
    const list = Object.keys(skus).filter((item) => skus[item] !== state.currentSkuMap[item])
    if (!list || list.length < 1) {
      state.selectedSkuPrice = { ...skuList.value[i], buyNum: 1, productName: props.goodsInfo.product.name }
      return
    }
  }
}
/** ***函数 end*****/

/** ***生命周期start*****/
onMounted(() => {
  skuList.value = props.goodsInfo.skus
})
// 组件销毁时局部状态自然回收，无需父组件清空 goodsInfo
onUnmounted(() => {
  state.selectedSkuPrice.buyNum = 1
  state.currentSkuArray = []
  state.currentSkuMap = {}
})
/** ***生命周期end*****/
</script>

<style lang="less">
.my__spec {
  &.my-popup {
    height: 80%;
    border-radius: 12px 12px 0 0;
    background: linear-gradient(336deg, rgba(201, 255, 207, 0) 57.38%, rgba(69, 150, 117, 0.45) 123.57%), #fff;
    font-size: 16px;

    .my-popup__container {
      background: transparent;
      border-radius: 0;
      box-shadow: none;
    }
    .content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      height: 100%;

      .main-wap {
        flex: 1;
        width: 100%;

        .spec-info {
          display: flex;
          padding: 16px;
          .spec-pro-img {
            border-radius: 6px;
            img {
              width: 72px;
              height: 72px;
            }
          }

          .spec-info-center {
            flex: 1;
            margin: 0 8px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .spec-title {
              overflow: hidden;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              align-self: stretch;
              text-overflow: ellipsis;
              font-weight: 500;
            }

            .spec-info-box {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .spec-price {
              color: var(--adm-color-primary);
              font-size: 16px;
              font-weight: 600;
            }

            .spec-stock {
              text-align: right;
              font-size: 16px;
            }
          }
        }

        .spec-color {
          margin-bottom: 12px;
          padding: 0 10px;
          p {
            margin-bottom: 12px;
          }
        }
        .spec-type {
          margin-bottom: 12px;
          padding: 0 12px;

          p {
            margin-bottom: 12px;
          }
        }

        .spec-qua {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
          margin-bottom: 20px;
          .left {
            flex: 1;
            .stock {
              font-size: 12px;
              color: var(--color-textlv2);
              margin-top: 4px;
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
        background: #fff;
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
  }
}

.option-selector {
  display: flex;
  //   margin-top: 16px;
  flex-wrap: wrap;
  // justify-content: flex-start;
  // flex-wrap: 2;
  .option-item {
    // flex: 1;
  }

  .option-item-img {
    width: 100px;
    width: 62px;
    height: 62px;
    text-align: center;
    cursor: pointer;
    border: 1px solid #f4f4f4;
    border-radius: 6px;
    transition: all 0.3s;
    // padding: 4px;
    border-radius: 6px;
    margin-right: 8px;
    margin-bottom: 8px;
    position: relative;
    img {
      width: 100%;
      border-radius: 6px;
      width: 62px;
      height: 62px;
    }
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #c8c9cb80;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      .tag {
        border-radius: 24px;
        border: 0 solid #f4f4f4;
        background: #fff;
        font-size: 10px;
        width: 40px;
        height: 18px;
        line-height: 18px;
      }
    }
  }
}

.option-item.active {
  .option-item-img {
    border: 2px solid #4caf50;
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.6);
    background: #17af261a;
  }
}

.option-item:nth-child(5n) .option-item-img {
  margin-right: 0;
}

.option-item.disabled {
  cursor: not-allowed;
  img {
    filter: grayscale(100%) brightness(0.7); /* 图片置灰 */
  }

  .text {
    background: #c8c9cb4d;
  }
}

.option-item-text {
  height: 32px;
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
