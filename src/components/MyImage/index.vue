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
    :src="src || ''"
    @load="handleLoadingComplete"
    @error="handleLoadingComplete"
  >
    <slot></slot>
    <!-- loading 自定义加载中的提示内容 -->
    <template v-slot:loading>
      <slot name="loading">
        <div v-if="loadingType === 'game'" class="my-image__loading-game">
          <i class="iconfont icon-jiazai" :style="{ fontSize: `${iconSize}px` }"></i>
        </div>
        <div v-else class="my-image__loading-skeleton"></div>
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
import { defineProps, ref } from 'vue'
defineProps({
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

  // 加载类型，
  loadingType: {
    type: String,
    default: 'default', // 默认default加载是一闪一闪，game是游戏加载
  },
  // 是否图片懒加载
  lazyLoad: {
    type: Boolean,
    default: true,
  },
})
const loadingShow = ref(true)
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
  :deep(.van-image__error) {
    background: none;
  }
  :deep(.van-image__loading) {
    background: none;
  }
  &__loading-skeleton {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fe771c;
    background-image: linear-gradient(
      90deg,
      #fe771c,
      rgb(230, 67, 67)71c,
      #fe771c
    );
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
  }
  &__loading-game {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #fff;
    i {
      font-size: 50px;
      color: #fe771c;
    }
  }

  &__error-default {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #fe771c;
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
      font-size: 50px;
      color: #fe771c;
    }
  }
}
</style>
