<template>
  <div class="home-page">
    <banner />
    <Favorite />
    <ProductList />
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import actPop from '@/componentsFun/ActPop/index.js'
import useAppStore from '@/store/modules/app'
import { onMounted } from 'vue'
import banner from './components/Banner'
import Favorite from './components/FavoriteItem/index.vue'
import ProductList from './components/ProductList'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const appStore = useAppStore()
/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/

/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {
  appStore.popList.length &&
    actPop({
      props: {
        details: appStore.popList,
      },
    })
})
/** ***生命周期end*****/
</script>

<style scoped lang="less"></style>
