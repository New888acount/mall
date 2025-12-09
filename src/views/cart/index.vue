<template>
  <div class="cart">
    <MobileHeader :title="$t('cart.title', { count: cartStore.cartCount })" class="cart-header">
      <!-- <template #right>
        <div class="cart-header-right" @click="manage">管理</div>
      </template> -->
    </MobileHeader>

    <div v-if="state.list && state.list.length > 0">
      <div class="cart-edit">
        <p>
          {{ $t('cartHeader.title1') }}
          <span class="qua">{{ cartStore.cartCount }}</span>
          {{ $t('cartHeader.title2') }}
        </p>
        <p :class="[state.editMode ? 'edit' : 'cancle']" @click="edithandle">
          {{ state.editMode ? $t('cartHeader.cancel') : $t('cartHeader.edit') }}
        </p>
      </div>
      <!-- 列表 -->
      <div class="cart-box">
        <div class="cart-item" v-for="(item, i) in state.list" :key="item.id">
          <div class="left">
            <!-- <van-checkbox
          :model-value="selectedIds.includes(item.id)"
          shape="square"
          @change="checked => cartStore.selectSingle(item.id, checked)"
        ></van-checkbox> -->
            <van-checkbox-group v-model="selectedIds">
              <van-checkbox
                :model-value="selectedIds.includes(item.id)"
                :name="item.id"
                shape="square"
                icon-size="16px"
                checked-color="var(--ui-BG-Main)"
                @change="(checked) => cartStore.selectSingle(item.id, checked)"
              >
                {{ item.name }}
              </van-checkbox>
            </van-checkbox-group>
          </div>
          <div class="right">
            <div class="cart-info">
              <div>
                <MyImage class="box-img" :src="$imgBaseUrl + item.pic" alt="" fit="initial" />
              </div>
              <div class="box-info">
                <div class="title">
                  {{ item.productName }}
                </div>
                <div class="tag">
                  {{ item.spDataValue }}
                </div>

                <div class="item-price">{{ item.price }}</div>
              </div>
            </div>

            <Stepper
              v-if="!state.editMode"
              class="cart-stepper"
              v-model="item.quantity"
              :min="1"
              @change="onNumberChange($event, item)"
            ></Stepper>
            <!-- <div class="item-price">CNY 80.00</div> -->
          </div>
        </div>
      </div>

      <div class="cart-bottom">
        <div class="cart-bottom-sum">
          <van-checkbox
            v-model="isAllSelected"
            shape="square"
            class="sum-checkbox"
            @change="(checked) => cartStore.selectAll(checked)"
          >
            {{ $t('cart.allSelect') }}
          </van-checkbox>
          <div class="sum-price">合计 {{ state.totalPriceSelected }}</div>
        </div>
        <!-- <div class="cart-sum">
      <div class="sum-freight">{{ $t('cart.freight') }}</div>
    </div> -->

        <div class="sum-submit" @click="onDelete" v-if="state.editMode">删除</div>
        <div class="sum-submit" @click="submitOrder" v-else>
          {{ $t('cart.submit') }}{{ selectedIds?.length ? `(${selectedIds.length})` : '' }}
        </div>
      </div>
    </div>

    <div v-else>
      <MyEmptyData />
    </div>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { onMounted, computed, reactive } from 'vue'
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import MyImage from '@/components/MyImage'
import Stepper from '@/components/Stepper'
import { useCartStore } from '@/store/cart'
import router from '@/router'
import { customToast } from '@/utils'
import i18n from '@/i18n/index'
import useLocalCache from '@/hooks/storage/localStorage.js'
import MyEmptyData from '@/components/MyEmptyData/index.vue'

// const userInfo = useUserInfoStore()
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
// 购物车数据
const cartStore = useCartStore()
const t = i18n.global.t
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
  get: () => cartStore.isAllSelected,
  set: (val) => {
    cartStore.isAllSelected = val
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
    customToast('请选择商品')
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
  cartStore.delete(selectedIds.value)
}

// 闪频数量加减
const onNumberChange = (e, cartItem) => {
  // if (e === 0) {
  //   cartStore.delete(cartItem.id);
  //     return;
  //   }

  cartStore.update({
    id: cartItem.id,
    quantity: e,
  })
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
.cart {
  padding-bottom: 72px;
  .cart-header {
    display: flex;

    .cart-header-right {
      font-size: 14px;
      margin-right: 8px;
    }
  }

  .cart-edit {
    position: sticky;
    top: 45px;
    width: 100%;
    // max-width: 375px; /* 跟 app 一样宽 */
    z-index: 99;

    display: flex;
    justify-content: space-between;
    height: 35px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    background: #f6f6f6;
    .qua,
    .edit {
      color: var(--color-light);
    }

    .cancle {
      color: rgb(48, 48, 48);
    }
  }

  .cart-box {
    background: #fff;
    padding: 0px 15px;

    .cart-item {
      padding: 16px 8px;
      display: flex;
      align-items: center;
      .left {
        margin-right: 8px;
      }
      .right {
        flex: 1;
        text-align: right;
        position: relative;

        .cart-info {
          display: flex;
          justify-content: flex-start;
          align-content: flex-start;
          .box-img {
            width: 82px;
            height: 82px;
          }
          .box-info {
            text-align: left;
            margin-left: 8px;
            .title {
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
            .tag {
              overflow: hidden;
              color: #9d9ea2;
              text-overflow: ellipsis;
              font-size: 12px;
              line-height: 150%;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              align-self: stretch;
            }
          }
        }
        .cart-stepper {
          padding: 8px 0;
          margin-top: -25px;
          position: absolute;
          right: 0;
        }
        .item-price {
          color: var(--color-light);
          font-size: 14px;
          line-height: 150%; /* 21px */
          margin-top: 10px;
        }
      }
    }
  }

  .cart-bottom {
    position: fixed;
    left: 50%;
    transform: translateX(-50%); /* 保证居中 */
    bottom: 50px;
    width: 100%;
    // max-width: 375px; /* 跟 app 一样宽 */
    background: #fff;
    box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.1);

    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 16px;
    align-items: center;
    align-content: center;

    .cart-bottom-sum {
      display: flex;
      align-items: center;
      .sum-price {
        margin-left: 15px;
        font-size: 14px;
      }
    }
    .sum-checkbox {
      flex: 1;
    }
    .cart-sum {
      text-align: right;
      margin-right: 8px;
      .sum-price {
        color: #eb2606;
        font-size: 16px;
      }
      .sum-freight {
        color: #717378;
        font-size: 12px;
      }
    }
    .sum-submit {
      border-radius: 24px;
      background: linear-gradient(90deg, var(--color-light), rgba(255, 96, 0, 0.6));
      width: 90px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      line-height: 40px;
      box-shadow: 0 2.8px 7px rgba(255, 96, 0, 0.45);
    }
  }
}
</style>
