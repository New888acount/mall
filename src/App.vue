<template>
  <router-view></router-view>
</template>

<script setup>
/** ***引入相关包start*****/
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useLocalCache from '@/hooks/storage/localStorage'
import useAppStore from './store/app.js'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const router = useRouter()
const { setCacheToken, getCacheToken } = useLocalCache()
// 获取store
const appStore = useAppStore()
/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/

/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {
  const token = getCacheToken()
  if (token) {
    setCacheToken(token)
  }

  appStore.initApp()

})
/** ***生命周期end*****/
</script>

<style scoped lang="less"></style>
