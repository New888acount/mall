<template>
  <div class="product-list">
    <commenHeader :title="$t('home.recommend')" />
    <MyPullRefreshList v-model:loading="cacheData.loading" :finished="cacheData.finished" @load="cacheData.onLoad">
      <div class="list">
        <GoodCube v-for="(item, i) in cacheData.goodsList" :key="i" :item="item" @click="productHandle" />
      </div>
      <!-- 数据为空 -->
      <div v-if="cacheData.goodsList.length === 0 && cacheData.finished">
        <MyEmptyData />
      </div>
    </MyPullRefreshList>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import commenHeader from '@/views/home/components/CommonHeader'

// import baseModule from '@/views/home/components/FavoriteItem/baseModule.vue'

import GoodCube from '@/components/MyGoodsItem/goodsCube.vue'
import MyPullRefreshList from '@/components/MyPullRefreshList/index.vue'
import router from '@/router'
import useCacheData from '@/store/modules/cacheData.js'
import { onMounted, reactive } from 'vue'

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
onMounted(() => {
  cacheData.onLoad()
})

/** ***生命周期end*****/
</script>

<style scoped lang="less">
.product-list {
  padding: 16px 12px 88px;
  .list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
}
</style>
