<template>
  <div class="cart-page" v-loading="cartStore.loading">
    <MobileHeader
      :backicon="false"
      :leftText="
        $t('cart.title', { count: cartStore.list && cartStore.list.length > 0 ? `(${cartStore.list.length})` : '' })
      "
      class="cart-header"
    >
      <template #right>
        <div class="cart-header-right">
          <p :class="[state.editMode ? 'edit' : 'cancle']" @click="edithandle">
            {{ state.editMode ? $t('cartHeader.cancel') : $t('cartHeader.edit') }}
          </p>
        </div>
      </template>
    </MobileHeader>

    <div class="line"></div>

    <div class="cart-wrap" v-if="state.list.length > 0">
      <!-- 列表 -->
      <van-checkbox-group v-model="selectedIds">
        <div class="cart-box">
          <div class="cart-item" v-for="(item, i) in state.list" :key="item.id">
            <div class="left">
              <van-checkbox :name="item.id" shape="square" icon-size="14px" checked-color="var(--adm-color-primary)">
                {{ item.name }}
              </van-checkbox>
            </div>
            <GoodsVertical :item="item" :quantityButton="!state.editMode" @change="onNumberChange($event, item)" />
          </div>
        </div>
      </van-checkbox-group>

      <div class="cart-bottom">
        <div class="cart-bottom-sum">
          <van-checkbox
            v-model="isAllSelected"
            shape="square"
            class="sum-checkbox"
            icon-size="14px"
            checked-color="var(--adm-color-primary)"
          >
            {{ $t('cart.allSelect') }}
          </van-checkbox>
          <div class="sum-price">{{ $t('cart.sum') }} {{ $unit }} {{ state.totalPriceSelected }}</div>
        </div>

        <div class="right">
          <div class="sum-price">USDT {{ state.totalPriceSelected }}</div>
          <a-button class="default-btn-solid sum-submit" @click="onDelete" v-if="state.editMode">
            {{ $t('cart.delete') }}
          </a-button>

          <a-button class="default-btn-solid sum-submit" @click="submitOrder" v-else>
            {{ $t('cart.submit') }}{{ selectedIds?.length ? `(${selectedIds.length})` : '' }}
          </a-button>
        </div>
      </div>
    </div>

    <div v-if="!cartStore.loading && !state.list.length">
      <MyEmptyData>
        <template #text>
          {{ $t('cart.emptyText') }}
        </template>
      </MyEmptyData>
    </div>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import MyEmptyData from '@/components/MyEmptyData/index.vue'
import GoodsVertical from '@/components/MyGoodsItem/goodsVertical.vue'
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import useLocalCache from '@/hooks/storage/localStorage.js'
import router from '@/router'
import { useCartStore } from '@/store/modules/cart'
import { customToast } from '@/utils'
import { computed, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

// const userInfo = useUserInfoStore()
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
// 购物车数据
const cartStore = useCartStore()
const { t } = useI18n()
const { getCacheToken } = useLocalCache()

const state = reactive({
  editMode: false,
  list: computed(() => cartStore.list),
  selectedList: [],

  //  computed(() => cartStore.isAllSelected),
  totalPriceSelected: computed(() => cartStore.totalPriceSelected),
})

const selectedIds = computed({
  get: () => cartStore.selectedIds,
  set: (val) => {
    cartStore.selectedIds = val
  },
})

const isAllSelected = computed({
  get: () => selectedIds.value.length === cartStore.list.length,
  set: (val) => {
    if (val) {
      cartStore.selectedIds = cartStore.list.map((item) => item.id)
    } else {
      cartStore.selectedIds = []
    }
  },
})

/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
const edithandle = () => {
  state.editMode = !state.editMode
}

const submitOrder = () => {
  let goods_list = []
  state.selectedList = state.list.filter((item) => selectedIds.value.includes(item.id))
  state.selectedList.map((item) => {
    goods_list.push({
      goods_id: item.productId,
      goods_num: item.quantity,
      skuId: item.skuId,
    })
  })
  if (goods_list.length === 0) {
    customToast(t('cart.submitTip'))
    return
  }

  // 进入订单
  router.push({
    path: '/order', // 跳转的路径
    query: {
      // 如果你想用 query 参数
      data: JSON.stringify({
        order_type: 'goods',
        goods_list,
        from: 'cart',
      }),
    },
  })
}

// 删除购物车
const onDelete = async () => {
  try {
    const res = await cartStore.delete(selectedIds.value)
    customToast(res.msg)
  } catch (error) {
    console.log(error)
  }
}

// 闪频数量加减
const onNumberChange = async (e, cartItem) => {
  // if (e === 0) {
  //   cartStore.delete(cartItem.id);
  //     return;
  //   }
  try {
    const res = await cartStore.update({
      id: cartItem.id,
      quantity: e,
    })
    customToast(res.msg)
  } catch (error) {
    console.log(error)
  }
}
/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {
  // 获取购物车数据
  getCacheToken() && cartStore.getList()
})
/** ***生命周期end*****/
</script>

<style scoped lang="less">
.cart-page {
  padding-bottom: 122px;
  height: 100%;

  .cart-header {
    display: flex;

    .cart-header-right {
      color: var(--color-textlv2);
      font-family: 'PingFang SC';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 100%; /* 12px */
      cursor: pointer;
    }
  }

  .line {
    width: 100%;
    height: 12px;
    background: #fbfbfb;
  }

  .cart-wrap {
    padding: 16px 0;
    .cart-box {
      padding: 0px 12px;

      .cart-item {
        display: flex;
        align-items: center;
        :deep(.van-checkbox-group) {
          width: 100%;
          .van-checkbox__label {
            flex: 1;
          }
        }
      }
    }
  }

  .cart-bottom {
    position: fixed;
    right: 0;
    bottom: 56px;
    width: 100%;
    border-top: 0.5px solid var(--, #ededed);
    background: #fbfbfb;

    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 8px 12px;
    align-items: center;
    align-content: center;

    .cart-bottom-sum {
      display: flex;
      align-items: center;
    }
    .sum-checkbox {
      flex: 1;
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .sum-price {
        color: var(--color-red);
        text-align: right;
        font-family: Roboto;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }

      .sum-submit {
        margin-left: 6px;
        height: 32px;
      }
    }
  }

  :deep(.van-checkbox) {
    .van-checkbox__icon {
      .van-icon {
        border-radius: 1px;
      }
    }

    .van-checkbox__icon--checked .van-icon {
      border-radius: 1px;
      border: 1px solid var(--adm-color-primary);
      background: transparent;
      color: var(--adm-color-white);
    }
  }
}
</style>
