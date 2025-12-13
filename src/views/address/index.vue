<template>
  <div class="address">
    <MobileHeader :leftText="$t('addressList.title')" class="cart-header" :backicon="true"></MobileHeader>

    <div class="address-list" v-loading="state.loading">
      <div class="item" v-for="item in state.list" :key="item.id" @click="onSelect(item)">
        <div class="top">
          <div class="person-info">
            <div class="person-text">
              <van-tag color="var(--color-light)" v-if="item.isDefault">
                {{ item.isDefault ? $t('order.index.tag') : '' }}
              </van-tag>
              <div class="name">{{ item.name }}</div>
              <div class="phone">{{ item.phone }}</div>
            </div>
          </div>
          <div class="address-info">
            {{ item.detailAddress }}
          </div>
        </div>
        <div class="operate">
          <div class="delete" @click.stop="deleteAddredd(item)">
            <i class="iconfont icon-lajitong"></i>
            {{ $t('addressList.delete') }}
          </div>
          <div class="edit" @click.stop="editAddredd(item)">
            <i class="iconfont icon-xieru"></i>
            {{ $t('addressList.edit') }}
          </div>
        </div>
      </div>
    </div>
    <MyEmptyData v-if="!state.list.length && !state.loading" />
    <div class="add-address" @click="addAddresshandle">
      <div class="add-button">{{ $t('addressList.button') }}</div>
    </div>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { addressListApi, deteleAddressApi } from '@/api/address'
import MyEmptyData from '@/components/MyEmptyData'
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import router from '@/router'
import { useAddressStore } from '@/store/modules/address'
import { customToast } from '@/utils'
import { showConfirmDialog } from 'vant'
import { onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const { t } = useI18n()
const addressStore = useAddressStore()
const state = reactive({
  list: [],
  loading: false,
})

/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
const deleteAddredd = (item) => {
  showConfirmDialog({
    title: t('pop.ancel.title'),
    message: t('addressDetail.delete.text'),
    confirmButtonText: t('addressDetail.delete.button2'),
    cancelButtonText: t('addressDetail.delete.button1'),
  })
    .then(async () => {
      try {
        state.loading = true
        const res = await deteleAddressApi(item.id)
        customToast(res.msg)
        getAddressList()
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

const editAddredd = (item) => {
  router.push({ path: '/address/edit', query: { id: item.id } })
}

// 新增地址
const addAddresshandle = () => {
  router.push('/address/edit')
}

// 选择收货地址
const onSelect = (addressInfo) => {
  // 保存选中的地址到 store
  addressStore.setSelected(addressInfo)
  router.back()
}

const getAddressList = async () => {
  try {
    state.loading = true
    const { code, data } = await addressListApi()
    if (code === 200) {
      state.list = data || []
    }
  } catch (error) {
    console.log(error)
  } finally {
    state.loading = false
  }
}
/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {
  getAddressList()
})
/** ***生命周期end*****/
</script>

<style scoped lang="less">
.address {
  color: #1f2c3c;
  background: #fff;
  height: 100%;

  .address-list {
    // padding: 16px;
    .item {
      // background: #fff;
      // border-radius: 10px;
      border-bottom: 0.5px solid #e0e0e0;
      .top {
        padding: 12px 12px 0 12px;
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
            :deep(.van-tag) {
              font-size: 12px;
              padding: 2px 5px;
              margin-right: 5px;
            }
            .name {
              font-weight: 500;
              margin-right: 8px;
            }

            .tag .van-tag {
              padding: 0 16px;
              height: 24px;
            }
          }
        }
        .address-info {
          // color: #717378;
          font-size: 16px;
          margin-bottom: 8px;
        }
      }

      .operate {
        border: 0 solid #c3d2cc;
        // background: #f4f4f4;
        padding: 10px 16px;
        display: flex;
        justify-content: end;
        align-items: center;
        border-radius: 0 0 10px 10px;
        color: #717378;
        .edit {
          margin-left: 16px;
        }
      }
    }
  }
  .add-address {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%); /* 保证居中 */
    width: 100%;
    // max-width: 375px; /* 跟 app 一样宽 */
    padding: 10px;

    .add-button {
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: linear-gradient(90deg, var(--color-light), rgba(255, 96, 0, 0.6));
      border-radius: 40px;
      font-size: 15px;
      font-weight: 500;
      color: #fff;
      box-shadow: 0 2.8px 7px rgba(255, 96, 0, 0.45);
    }
  }
}
</style>
