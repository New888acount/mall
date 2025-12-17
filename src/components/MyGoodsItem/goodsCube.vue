<template>
  <div class="cube-item" @click="handleClick">
    <!-- 图片 -->
    <div class="item-img">
      <MyImage :src="$imgBaseUrl + details.pic" alt="" fit="initial" />
    </div>

    <!-- 信息 -->
    <div class="item-info">
      <div class="text">{{ details.name || details.productName }}</div>
      <div class="tag" v-if="details.spDataValue">
        {{ details.spDataValue }}
      </div>
      <div class="item-price">
        <div class="price padding">
          <span class="unit">{{ $unit }}</span>
          {{ details.price }}
        </div>
      </div>

      <div
        class="fav-icon"
        :class="{
          active: details.isFavorite,
        }"
        @click.stop="handleFavorite(details)"
      >
        <i
          class="iconfont"
          :class="{
            'icon-collect': !details.isFavorite,
            'icon-collected1': details.isFavorite,
          }"
        ></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import MyImage from '@/components/MyImage'
import { defineEmits, defineProps, ref } from 'vue'
import { addFavoriteApi, cancelFavoriteApi } from '@/api/home'
import ShowLogin from '@/componentsFun/login/index.js'
import useUserInfoStore from '@/store/modules/userInfo'
import { customToast } from '@/utils/index.js'

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
        color: #fff;
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
