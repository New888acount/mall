<template>
  <div class="favorite-page">
    <MobileHeader :leftText="$t('profile.tab1')"></MobileHeader>

    <MyPullRefreshList v-model:loading="state.loading" :finished="state.finished" @load="onLoad" class="my-list">
      <div class="list">
        <template v-for="(item, i) in state.listData" :key="i">
          <GoodCube :item="item" @click="productHandle" :callback="onLoad" />
        </template>
      </div>
      <!-- 数据为空 -->
      <div v-if="!state.listData.length && state.finished">
        <MyEmptyData />
      </div>
    </MyPullRefreshList>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import commenHeader from '@/views/home/components/CommonHeader'
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import { getFavoriteListApi } from '@/api/home'
import GoodCube from '@/components/MyGoodsItem/goodsCube.vue'
import MyPullRefreshList from '@/components/MyPullRefreshList/index.vue'
import router from '@/router'
import { onMounted, reactive, nextTick, ref } from 'vue'
import useCacheData from '@/store/modules/cacheData.js'

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

let loadingDisabled = false

const getFavoriteList = async () => {
  if (state.loading || loadingDisabled) return // 防止并发
  loadingDisabled = true
  state.loading = true

  try {
    const data = await getFavoriteListApi({
      pageNum: state.pagination.current,
      pageSize: state.pagination.pageSize,
    })
    data.rows = data?.rows || []

    state.listData.push(...data.rows)
    state.pagination.current++

    state.pagination.total = data.total
  } finally {
    state.loading = false
    loadingDisabled = false
    if (state.listData.length >= state.pagination.total) {
      state.finished = true
    }
  }
}

const reset = () => {
  state.finished = false
  loadingDisabled = false
  state.pagination.current = 1
  state.listData = []
}

const onLoad = (flag) => {
  if (flag) {
    reset()
  }
  if (state.finished || loadingDisabled) return false
  getFavoriteList()
}

/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {
  onLoad()
})
/** ***生命周期end*****/
</script>

<style scoped lang="less">
.favorite-page {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  padding-bottom: 88px;

  .my-list {
    padding: 4px 12px 0;
    width: 100%;
    flex: 1;
    overflow-y: scroll;
  }
  .list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 8px;
  }
}
</style>
