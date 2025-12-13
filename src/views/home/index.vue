<template>
  <div class="home-page">
    <banner />
    <Favorite />
    <ProductList />
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import GoodCube from '@/components/MyGoodsItem/goodsCube.vue'
import MyPullRefreshList from '@/components/MyPullRefreshList/index.vue'
import router from '@/router'
import { onMounted, reactive } from 'vue'
import useCacheData from '@/store/modules/cacheData.js'

import banner from './components/Banner'
import Favorite from './components/FavoriteItem/index.vue'
import ProductList from './components/ProductList'

/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/

const state = reactive({
  listData: [], // 列表数据
  loading: false, //分页是否加载中
  finished: false, // 已经完成所有加载
  // 分页
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  // 类型
  // status: 0,
})

const cacheData = useCacheData()
/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
const productHandle = (n) => {
  router.push({
    path: '/goods/index',
    query: {
      id: n.id,
    },
  })
}

/** ***函数 end*****/
/** ***生命周期start*****/

/** ***生命周期end*****/
</script>

<style scoped lang="less"></style>
