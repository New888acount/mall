<template>
  <baseModule
    class="cube-item"
    @click="handleClick"
    :item="details"
    :showUpdate="true"
    @handleFavorite="handleFavorite"
  />
</template>

<script setup>
import { addFavoriteApi, cancelFavoriteApi } from '@/api/home'
// import MyImage from '@/components/MyImage'
import ShowLogin from '@/componentsFun/login/index.js'
import useUserInfoStore from '@/store/modules/userInfo'
import { customToast } from '@/utils/index.js'
import { defineEmits, defineProps, ref } from 'vue'

import baseModule from '@/views/home/components/FavoriteItem/baseModule.vue'

const userInfoStore = useUserInfoStore()

const props = defineProps({
  item: { type: Object, required: true },
  callback: {
    type: Function,
    default: () => null,
  },
})

const emit = defineEmits(['click'])

const details = ref(props.item)

function handleClick() {
  emit('click', props.item)
}

const handleFavorite = async (obj) => {
  if (!userInfoStore.token) {
    ShowLogin()
    return
  }
  try {
    const { msg } = obj?.isFavorite
      ? await cancelFavoriteApi({ productId: obj?.id })
      : await addFavoriteApi({ productId: obj?.id })
    details.value.isFavorite = !details.value.isFavorite
    customToast(msg)
    props.callback && props.callback(true)
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped lang="less">
.cube-item {
  position: relative;

  .item-img {
    position: relative;
    .tag {
      position: absolute;
      top: 0;
      left: 0;
      padding: 4px;
      color: var(--adm-color-white);
      text-align: center;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: 12px; /* 100% */
      text-transform: uppercase;
      background: #d92211;
      z-index: 2;
    }
  }

  .update {
    display: inline-block;
    margin-top: 2px;
    padding: 1px 6px;
    text-align: center;
    color: var(--adm-color-primary);
    font-family: Inter;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    border-radius: 2px;
    border: 1px solid var(--adm-color-primary);
  }

  .fav-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.6);
    z-index: 2;
    cursor: pointer;
    &.active {
      background: var(--adm-color-primary);
      .iconfont {
        font-size: 14px;
        color: var(--adm-color-white);
      }
    }
    .iconfont {
      font-size: 16px;
      color: var(--adm-color-textLv1);
    }
  }
  :deep(.van-image) {
    width: 100%;
    height: auto;
  }
  :deep(.van-skeleton-image) {
    width: 100%;
    height: 100%;
  }

  .item-info {
    padding: 8px 0;
  }

  .text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    align-self: stretch;
    overflow: hidden;
    color: var(--adm-color-textlv2);
    text-overflow: ellipsis;
    font-family: 'PingFang SC';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 21px */
  }

  .price {
    margin-top: 4px;
    color: var(--color-textlv2);
    font-family: Roboto;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 18px */
  }
}

.cube-item:nth-child(2n) {
  margin-right: 0px;
}
</style>
