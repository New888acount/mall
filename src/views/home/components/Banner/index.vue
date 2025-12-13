<template>
  <div class="van-swiper-module">
    <swiper v-bind="swiperOption" :modules="modules" @swiper="onSwiper" class="my-swipe">
      <swiper-slide v-for="item in bannerList" :key="item.id" @click="handleActDetail(item)">
        <component :is="MyImage" fit="initial" :src="item.bannerUrl" :lazyLoad="false" />
        <div class="text-container" @mousedown.prevent>
          <div class="title">航行家系列发布</div>
          <div class="desc">
            <p>震撼新品上市</p>
            <p>最高优惠25%</p>
          </div>
          <a-button class="buy-btn default-btn">立即购买</a-button>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script setup>
import '@vant/touch-emulator'
import { defineComponent, ref, watch, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MyImage from '@/components/MyImage'
import { myWindowOpen } from '@/utils'

import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

/** ***ref、reactive、props，等……start*****/
// 绑定路由
const router = useRouter()

const swiperInstance = ref(null)
// 轮播图配置
const modules = [Navigation, Pagination, EffectCoverflow, Autoplay]
// 轮播图
const swiperOption = {
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  loop: true,
  initialSlide: 0,
  slidesPerView: 1,
  spaceBetween: 0,
  effect: 'faded',
  centeredSlides: true,
  loadPrevNext: false,
  pagination: {
    clickable: true,
  },
}

const bannerList = ref([
  {
    bannerUrl: require('@/assets/images/home/swiper.png'),
  },
  {
    bannerUrl: require('@/assets/images/home/swiper.png'),
  },
  {
    bannerUrl: require('@/assets/images/home/swiper.png'),
  },
  {
    bannerUrl: require('@/assets/images/home/swiper.png'),
  },
  {
    bannerUrl: require('@/assets/images/home/swiper.png'),
  },
  {
    bannerUrl: require('@/assets/images/home/swiper.png'),
  },
])
/** ***ref、reactive、props，等……end*****/

/** ***函数 start*****/
// 点击轮播图跳转页面
const handleActDetail = async (item) => {
  console.log(item)
}
const onSwiper = (swiper) => {
  swiperInstance.value = swiper
}
/** ***函数 end*****/

/** ***生命周期start*****/
onMounted(async () => {
  await nextTick()
})
watch(
  () => bannerList,
  () => {
    if (swiperInstance.value) {
      setTimeout(() => {
        swiperInstance.value?.slideTo(1, 1000, false)
      }, 20)
    }
  }
)
/** ***生命周期end*****/
</script>
<style lang="less" scoped>
.van-swiper-module {
  box-sizing: border-box;
  .my-swipe {
    width: 100%;
    height: 300px;

    .text-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 280px;
      padding-top: 54px;
      padding-left: 24px;
      padding-right: 24px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      z-index: 2;

      .title {
        color: rgba(37, 40, 52, 0.6);
        font-family: 'PingFang SC';
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%; /* 21px */
      }

      .desc {
        margin-top: 4px;
        overflow: hidden;
        color: var(--adm-color-textlv2);
        text-overflow: ellipsis;
        font-family: 'PingFang SC';
        font-size: 24px;
        font-style: normal;
        font-weight: 600;
        line-height: 150%; /* 36px */
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        align-self: stretch;
      }

      .buy-btn {
        margin-top: 12px;
        padding: 4px 24px;
      }
    }

    &:deep(.swiper-pagination) {
      bottom: 14px;
    }
    &:deep(.swiper-pagination-bullet) {
      position: relative;
      width: 6px;
      height: 6px;
      border-radius: 5px;
      transition: 0.3s;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 3px;
        background: rgba(237, 237, 237, 0.6);
      }
    }
    &:deep(.swiper-pagination-bullet-active) {
      width: 16px;
      background: transparent;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 6px;
        border-radius: 3px;
        animation: banner-full 3s forwards;
        background: rgba(37, 40, 52, 0.6);
        @keyframes banner-full {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }
      }
    }
  }

  :deep(.van-swipe__indicators) {
    bottom: 0;
  }

  .indicator-list {
    position: absolute;
    bottom: 8px;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateX(-50%);
    .custom-indicator {
      margin-right: 5px;
      &:last-child {
        margin-right: 0;
      }
      &.active {
        .dot {
          position: relative;
          width: 16px;
          opacity: 1;
          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 6px;
            border-radius: 3px;
            animation: banner-full 3s forwards;
            background: rgba(37, 40, 52, 0.6);
            opacity: 0.5;
            @keyframes banner-full {
              0% {
                width: 0;
              }
              100% {
                width: 100%;
              }
            }
          }
        }
      }
    }
    .dot {
      position: relative;
      width: 6px;
      height: 6px;
      border-radius: 3px;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 3px;
        background: rgba(237, 237, 237, 0.6);
      }
    }
  }
}
</style>
