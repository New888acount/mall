<template>
  <div class="navbar">
    <div class="search" @click="goSearch">
      <i class="iconfont icon-sousuo"></i>
      <van-field v-model="value1" :placeholder="$t('searchInput.placeholder')" clearable readonly />
    </div>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { ref, onMounted, onUnmounted } from 'vue'
import router from '@/router'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const value1 = ref()
/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
const goSearch = () => {
  // 跳转到搜索页面
  router.push('/search')
}
/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {})

/** ***生命周期end*****/
</script>

<style scoped lang="less">
.navbar {
  height: 44px;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%); /* 保证居中 */
  width: 100%;
  max-width: 375px; /* 跟 app 一样宽 */
  transition: background-color 0.3s ease; /* 平滑过渡 */
  z-index: 1000;
  .search {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    margin: 5px 10px;
    border-radius: 23px;
    height: 32px;
    .icon-sousuo {
      font-size: 19px;
      margin: 0 10px;
    }
    :deep(.van-cell) {
      // height: 32px;
      border-radius: 0 23px 23px 0;
      padding: 0;
    }
  }
}
</style>
