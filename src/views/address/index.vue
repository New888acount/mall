<template>
  <div class="address">
    <MobileHeader :leftText="$t('addressList.title')" class="cart-header" :backicon="true"></MobileHeader>
    <main v-loading="state.loading">
      <div class="address-list">
        <div class="item" v-for="item in state.list" :key="item.id" @click="onSelect(item)">
          <div class="top">
            <div class="person-info">
              <div class="person-text">
                <van-tag color="var(--adm-color-primary)" v-if="item.isDefault">
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
    </main>

    <MyEmptyData v-if="!state.list.length && !state.loading" />
    <div class="add-address" @click="addAddresshandle">
      <a-button class="default-btn add-button">{{ $t('addressList.button') }}</a-button>
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
  color: var(--adm-color-textlv2);
  background: #fff;
  height: 100%;

  main {
    padding: 12px 16px;
  }

  .address-list {
    .item {
      margin-bottom: 12px;
      background: rgba(237, 237, 237, 0.4);
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
            font-size: 14px;
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
          }
        }
        .address-info {
          font-size: 14px;
          margin-bottom: 8px;
        }
      }

      .operate {
        padding: 10px 16px;
        display: flex;
        justify-content: end;
        align-items: center;
        border-radius: 0 0 10px 10px;
        color: var(--color-textlv2);
        .edit {
          margin-left: 16px;
        }
      }
    }
  }
  .add-address {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    padding: 10px;

    .add-button {
      width: 100%;
      height: 40px;
    }
  }
}
</style>
