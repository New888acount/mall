<template>
  <div class="base-module" @click="productHandle(item)">
    <div class="tag" v-if="item.superDiscount">SALE</div>
    <i class="iconfont icon-caijin icon-adorn"></i>

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
// import handleGameDetailsComposation from '@/hooks/handleGameDetails/index'
// import useAppStore from '@/store/modules/app.js'
// import useCacheData from '@/store/modules/cacheData'
// import useUserInfoStore from '@/store/modules/userInfo.js'
import { defineEmits, defineProps, getCurrentInstance, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  item: {
    type: Object,
    default: () => null,
  },
})

const { proxy } = getCurrentInstance()
// const userInfo = useUserInfoStore()
// const cacheData = useCacheData()

const detalis = ref(props.details)

const isFavoriteFlag = ref(props.item?.isFavorite)

// const appStore = useAppStore()

const emit = defineEmits(['close'])

const router = useRouter()

// const { favoriteAddFun, startCheck } = handleGameDetailsComposation()

const goGameBaseFun = (item) => {
  // if (!startCheck(item)) return
  router.push({
    path: '/game/details',
    query: {
      id: item.id,
      type: item?.isFavoriteTab ? 'favorite' : 'unfavorite',
    },
  })
  emit('close')
}

const productHandle = (item) => {
  router.push({
    path: '/goods/index',
    query: {
      id: item.id,
    },
  })
}

const getFavorite = async (obj) => {
  // if (!userInfo.token) {
  //   proxy.$showLogin({ type: 'login' }).catch(() => {})
  //   return false
  // }
  detalis.value = obj
  //收藏
  // favoriteAddFun(detalis.value)
  isFavoriteFlag.value = !isFavoriteFlag.value
  setTimeout(async () => {
    // await cacheData.favoriteInit() //更新收藏列表
  }, 500)
}

const hasHttpDomain = (url) => {
  // 判断是否以 http:// 或 https:// 开头
  const regex = /^https?:\/\/[^/]+(\/.*)?$/
  const match = url.match(regex)

  if (match) {
    return url // 返回路径部分
  } else {
    // return appStore.preFix + url // 原样返回
  }
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
  height: 100%;
  cursor: pointer;

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

  .icon-adorn {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 20px;
    color: var(--adm-color-light);
    z-index: 2;
    opacity: 0.8;
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
