<template>
  <div class="goods">
    <MyPullRefreshList v-model:loading="cacheData.loading" :finished="cacheData.finished" @load="cacheData.onLoad">
      <div class="list">
        <template v-for="(item, i) in cacheData.goodsList" :key="i">
          <GoodCube :item="item" @click="productHandle" />
        </template>
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
import GoodCube from '@/components/MyGoodsItem/goodsCube.vue'
import MyPullRefreshList from '@/components/MyPullRefreshList/index.vue'
import router from '@/router'
import { onMounted, reactive } from 'vue'
import useCacheData from '@/store/cacheData.js'

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
  // 本地缓存增加一个字段，作为标识；
  // 用户成功注册后，上报首页访问数量+1并将字段值由False 修改为 True，后续登录或注册判断该字段值是否为False，若为False上报+1，若为True不上报。
  // 用户成功注册后，上报首页访问数量+1并将字段值由False 修改为 True
})

// watch(
//   () => cacheData.goodsList,
//   (newVal) => {
//     console.log()
//     state.listData = newVal
//   }
// )
/** ***生命周期end*****/
</script>

<style scoped lang="less">
.goods {
  padding: 45px 10px 58px;
  .list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 8px;
  }
}
</style>
