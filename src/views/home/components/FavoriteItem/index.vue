<template>
  <div class="game-list-module">
    <div class="game-list-all">
      <commenHeader :title="$t('home.hot')" @rightEvent="router.push('/goods/list?superDiscount=1')" />
      <div class="home-game-swiper">
        <swiper v-bind="swiperOption" :modules="modules" @swiper="onSwiper" class="my-swipe">
          <swiper-slide v-for="item in cacheData.hotList" :key="item.id" @click="handleActDetail(item)">
            <baseModule :item="item" :showUpdate="true" />
          </swiper-slide>
        </swiper>

        <!-- 数据为空 -->
        <div v-if="cacheData.hotList.length === 0">
          <MyEmptyData />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import router from '@/router'
import useAppStore from '@/store/modules/app'
import useCacheData from '@/store/modules/cacheData.js'
import commenHeader from '@/views/home/components/CommonHeader'
import '@vant/touch-emulator'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import { Autoplay, EffectCoverflow, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { nextTick, onMounted, ref, watch } from 'vue'
import baseModule from './baseModule.vue'

const appStore = useAppStore()
const swiperInstance = ref(null)
const cacheData = useCacheData()
// 轮播图配置
const modules = [Navigation, EffectCoverflow, Autoplay]
// 轮播图
const swiperOption = {
  autoplay: {
    delay: 300000,
    disableOnInteraction: false,
  },
  loop: true,
  initialSlide: 0,
  slidesPerView: 2,
  spaceBetween: 8,
  effect: 'faded',
  centeredSlides: false,
  loadPrevNext: false,
  pagination: {
    clickable: true,
  },
}
// import searchGamePop from './components/searchGamePop/index'

const swiperList = ref([])

const onSwiper = (swiper) => {
  swiperInstance.value = swiper
}

onMounted(async () => {
  await nextTick()
})

const handleActDetail = (n) => {
  appStore.getTracking({
    type: 9,
  })
  router.push({
    path: '/goods/index',
    query: {
      id: n.id,
    },
  })
}
watch(
  () => swiperList,
  () => {
    if (swiperInstance.value) {
      setTimeout(() => {
        swiperInstance.value?.slideTo(1, 1000, false)
      }, 20)
    }
  }
)
</script>

<style lang="less" scoped>
.game-list-module {
  position: relative;
  padding: 0 12px 16px;

  .icon-search {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: var(--desgin-smaller-tab-color);
    cursor: pointer;
  }
}

.game-list-all {
  box-sizing: border-box;
  padding-top: 16px;

  .home-game-swiper {
    width: 100%;
    :deep(.my-swipe) {
      overflow: hidden;
      .van-swipe-item {
        padding-right: 8px;
      }
    }
    :deep(.my-empty-data) {
      margin-top: 0;
    }
  }
}
</style>
