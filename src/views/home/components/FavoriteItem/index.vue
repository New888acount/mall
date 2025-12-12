<template>
  <div class="game-list-module">
    <div class="game-list-all">
      <commenHeader :title="'畅销商品'" />
      <div class="home-game-swiper">
        <swiper v-bind="swiperOption" :modules="modules" @swiper="onSwiper" class="my-swipe">
          <swiper-slide v-for="item in swiperList" :key="item.id" @click="handleActDetail(item)">
            <baseModule :item="item" />
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>
<script setup>
import baseModule from './baseModule.vue'
import commenHeader from '@/views/home/components/CommonHeader'
import { ref, watch, nextTick, onMounted } from 'vue'
import '@vant/touch-emulator'
import { Navigation, EffectCoverflow, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

const swiperInstance = ref(null)

// 轮播图配置
const modules = [Navigation, EffectCoverflow, Autoplay]
// 轮播图
const swiperOption = {
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  loop: true,
  initialSlide: 0,
  slidesPerView: 3,
  spaceBetween: 8,
  effect: 'faded',
  centeredSlides: false,
  loadPrevNext: false,
  pagination: {
    clickable: true,
  },
}
// import searchGamePop from './components/searchGamePop/index'

const swiperList = ref([
  {
    imgDefault: require('@/assets/images/home/40226.png'),
  },
  {
    imgDefault: require('@/assets/images/home/40226.png'),
  },
  {
    imgDefault: require('@/assets/images/home/40226.png'),
  },
  {
    imgDefault: require('@/assets/images/home/40226.png'),
  },
  {
    imgDefault: require('@/assets/images/home/40226.png'),
  },
  {
    imgDefault: require('@/assets/images/home/40226.png'),
  },
  {
    imgDefault: require('@/assets/images/home/40226.png'),
  },
  {
    imgDefault: require('@/assets/images/home/40226.png'),
  },
])

const onSwiper = (swiper) => {
  swiperInstance.value = swiper
}

onMounted(async () => {
  await nextTick()
  swiperInstance.value?.swipeTo(0)
})

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
  }
}
</style>
