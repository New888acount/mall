<template>
  <div class="base-module" @click="productHandle(item)">
    <div class="tag" v-if="item.superDiscount">SALE</div>

    <div
      class="favorite"
      :class="{
        active: isFavoriteFlag,
      }"
      @click.stop="getFavorite(item)"
    >
      <i
        class="iconfont"
        :class="{
          'icon-collect': !isFavoriteFlag,
          'icon-collected1 active': isFavoriteFlag,
        }"
      ></i>
    </div>

    <component class="img-cover" :is="MyImage" fit="cover" :src="$imgBaseUrl + item.pic" />

    <h1 class="header">{{ item.name }}</h1>

    <div class="text">
      <div
        class="precent"
        :class="{
          red: item.superDiscount,
        }"
      >
        {{ $unit }} {{ item.finalPrice }}
      </div>
      <div class="discount">{{ $unit }} {{ item.price }}</div>
    </div>

    <div class="update">{{ $t('order.list.save') }} {{ $unit }} {{ item.discountPrice }}</div>
  </div>
</template>
<script setup>
import MyImage from '@/components/MyImage'
import { defineEmits, defineProps, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  item: {
    type: Object,
    default: () => null,
  },
})

const isFavoriteFlag = ref(props.item?.isFavorite)

const emit = defineEmits(['close', 'handleFavorite'])

const router = useRouter()

const productHandle = (item) => {
  router.push({
    path: '/goods/index',
    query: {
      id: item.id,
    },
  })
}

const getFavorite = async (obj) => {
  isFavoriteFlag.value = !isFavoriteFlag.value
  emit('handleFavorite', obj)
}

watch(
  () => props.item,
  (val) => {
    isFavoriteFlag.value = val?.isFavorite
  }
)
</script>
<style lang="less" scoped>
.base-module {
  position: relative;
  width: 100%;
  height: auto;
  cursor: pointer;

  :deep(.van-image) {
    width: 100%;
    height: auto;
  }

  :deep(.van-skeleton-image) {
    width: 100%;
    height: 100%;
  }

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

  .header {
    margin-top: 8px;
    width: 100%;
    color: var(--adm-color-textLv1);
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .text {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 2px;

    .precent {
      color: var(--adm-color-textLv1);
      font-family: Roboto;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 18px;
      &.red {
        color: var(--color-red);
      }
    }

    .discount {
      margin-left: 2px;
      color: var(--adm-color-textlv3);
      font-family: Roboto;
      font-size: 10px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px;
      text-decoration-line: line-through;
    }
  }

  .favorite {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 2;
    width: 24px;
    height: 24px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    &.active {
      background: var(--adm-color-primary);
      .iconfont {
        color: var(--adm-bg-white);
      }
    }
    .iconfont {
      font-size: 16px;
      color: var(--adm-color-textLv1);
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
  .img-cover {
    width: 100%;
    // height: 109px;
    opacity: 1;
  }
}

html[data-device='mobile'] {
  .base-module {
    width: 100%;

    .header {
      font-size: 12px;
    }

    .icon-adorn {
      right: 4px;
      font-size: 12px;
    }
  }
}
</style>
