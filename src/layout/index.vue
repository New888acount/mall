<template>
  <Navbar :style="{ backgroundColor: navBg }" v-if="routeInfo.meta.navShow.navbar"></Navbar>

  <div class="main-content" :style="{ paddingBottom: routeInfo.meta.navShow.navigation ? '50px' : '0px' }">
    <router-view v-slot="{ Component }" :key="$route.fullPath">
      <transition name="slide" mode="out-in">
        <div class="router-view-container" :key="$route.fullPath">
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
  </div>

  <!-- 底部导航 -->
  <!-- 移动端底部导航栏 -->
  <TabbarMobileComponent v-if="routeInfo.meta.navShow.navigation" />
</template>

<script setup>
/** ***引入相关包start*****/
import { ref, onMounted, defineAsyncComponent, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import useAppStore from '@/store/modules/app.js'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
// 获取store
const appStore = useAppStore()
// 路由信息
const router = useRouter()
// 路由信息存放
const routeInfo = ref({})
// 响应式变量：导航栏背景色
const navBg = ref('transparent')
// 移动端导航栏
const TabbarMobileComponent = defineAsyncComponent({
  loader: () => import('./components/TabbarMobile/index.vue'),
  timeout: 10000,
  delay: 2000,
  suspensible: true,
})

// 移动端导航栏
const Navbar = defineAsyncComponent({
  loader: () => import('./components/Navbar/index.vue'),
  timeout: 10000,
  delay: 2000,
  suspensible: true,
})

const ele = document.querySelector('#app') //滚动发生在app上

/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
// 滚动事件
const handleScroll = () => {
  const top = ele.scrollTop || document.documentElement.scrollTop
  navBg.value = top > 270 ? 'var(--adm-color-primary)' : 'transparent'
}
/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {
  ele.addEventListener('scroll', handleScroll, { passive: true })
})
onUnmounted(() => {
  ele.removeEventListener('scroll', handleScroll)
})
// 监听路由改变
watch(
  () => router.currentRoute.value,
  (newValue) => {
    routeInfo.value = newValue
  },
  { immediate: true }
)
/** ***生命周期end*****/
</script>

<style scoped lang="less">
.main-content {
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
  height: 100%;
  > div {
    height: 100%;
  }
}
.router-view-container {
  height: 100%;
}
</style>
