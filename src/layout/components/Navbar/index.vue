<template>
  <div class="navbar-module">
    <div class="search" @click="goSearch">
      <i class="iconfont icon-sousuo"></i>
      <van-field v-model="value1" :placeholder="$t('searchInput.placeholder')" clearable readonly />
    </div>

    <div class="right-icon">
      <div class="icon-common">
        <i class="iconfont icon-collect"></i>
      </div>

      <div class="icon-common">
        <i class="iconfont icon-cart"></i>
        <div class="dot">10</div>
      </div>
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
.navbar-module {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  width: 100%;
  height: 56px;
  transition: background-color 0.3s ease;
  z-index: 1000;
  .search {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--adm-bg-white);
    border-radius: 23px;
    height: 32px;
    .icon-sousuo {
      font-size: 19px;
      margin: 0 10px;
    }
    :deep(.van-cell) {
      border-radius: 0 23px 23px 0;
      padding: 0;
    }
  }

  .right-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-common {
      position: relative;
      margin-left: 12px;
      color: var(--adm-color-textLv1);
      .iconfont {
        font-size: 24px;
      }

      .dot {
        position: absolute;
        top: -2px;
        right: -4px;
        width: 18px;
        height: 18px;
        color: var(--adm-color-white);
        text-align: center;
        font-family: Roboto;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 18px;
        border-radius: 50%;
        background: var(--color-red);
      }
    }
  }
}
</style>
