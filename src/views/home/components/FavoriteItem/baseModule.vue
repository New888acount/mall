<template>
  <div class="base-module" @click="productHandle(item)">
    <i class="iconfont icon-caijin icon-adorn"></i>

    <component class="img-cover" :is="MyImage" fit="cover" :src="$imgBaseUrl + item.pic" />

    <h1 class="header">{{ item.name }}</h1>

    <div class="text">{{ $unit }} {{ item.price }}</div>
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
    margin-top: 2px;
    color: var(--color-textlv2);
    font-family: Roboto;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 18px */
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

  .img-cover {
    width: 100%;
    height: 109px;
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
