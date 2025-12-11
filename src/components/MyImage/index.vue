<!--
    使用方法和vant的image组件一样
    文档:https://vant-contrib.gitee.io/vant/#/zh-CN/image#slots
-->
<template>
  <!-- 当src为''会一直显示加载 -->
  <van-image
    :class="['my-image', loadingShow && 'my-image--loading']"
    :fit="fit"
    :lazy-load="lazyLoad"
    v-bind="$attrs"
    :src="computedSrc"
    @load="handleLoadingComplete"
    @error="handleLoadingComplete"
  >
    <slot></slot>
    <!-- loading 自定义加载中的提示内容 -->
    <template v-slot:loading>
      <slot name="loading">
        <!-- <div class="my-image__loading-skeleton">
        </div> -->
        <van-skeleton-image />

        <!-- <i class="iconfont icon-jiazai" :style="{ fontSize: `${iconSize}px` }"></i> -->
      </slot>
    </template>
    <!-- error 自定义加载失败时的提示内容 -->
    <template v-slot:error>
      <slot name="error">
        <div class="my-image__error-default">
          <i class="iconfont icon-Defaultmap" :style="{ fontSize: `${iconSize}px` }"></i>
          <span>{{ $attrs.alt }}</span>
        </div>
      </slot>
    </template>
  </van-image>
</template>
<script setup name="MyImage">
import { computed, defineProps, ref } from 'vue'
const props = defineProps({
  fit: {
    type: String,
    default: 'cover',
  },
  src: {
    type: String,
    default: '', // 本地占位图
  },
  iconSize: {
    type: String,
    default: '',
  },
  // 是否图片懒加载
  lazyLoad: {
    type: Boolean,
    default: true,
  },
})
const loadingShow = ref(true)

const computedSrc = computed(() => {
  // 1. 如果 props.src 有值，则使用它
  if (props.src) {
    return props.src
  }
  // 2. 如果 props.src 为空，则返回一个本地的有效占位图
  //    注意: require('@/assets/images/empty.png') 应该是一个真实存在的、不会加载失败的本地图片路径。
  //    如果它不存在，依然会导致加载失败。
  return require('@/assets/images/empty.png')
})
// 加载完成
const handleLoadingComplete = () => {
  loadingShow.value = false
}
</script>
<style lang="less" scoped>
.my-image {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  &--loading {
    padding: 8px;
    box-sizing: border-box;
  }
  :deep(.van-skeleton-image) {
    color: #fe771c;
    background-color: #f7f8fa;
  }
  &__loading-skeleton {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #1b1b1b;
    background-image: linear-gradient(90deg, #1b1b1b, #000, #1b1b1b);
    background-repeat: no-repeat;
    background-size: 200% 100%;
    animation: my-image-skeleton-loading 1s infinite ease-in-out;
    overflow: hidden;
    @keyframes my-image-skeleton-loading {
      0% {
        background-position: 200% 0;
      }
      50% {
        background-position: 0 0;
      }
      100% {
        background-position: -100% 0;
      }
    }
    i {
      font-size: 30px;
      color: #fff;
    }
  }

  &__error-default {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #ffffff;
    background-color: #fff;
    span {
      width: 100%;
      padding: 0 6px;
      font-size: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      box-sizing: border-box;
      text-align: center;
    }
    i {
      font-size: 30px;
      color: #fe771c;
    }
  }

  :deep(.van-image__loading),
  :deep(.van-image__error) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: #f7f8fa;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
