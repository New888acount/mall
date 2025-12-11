<template>
  <div class="goods">
    <MyPullRefreshList v-model:loading="state.loading" :finished="state.finished" @load="onLoad">
      <div class="list">
        <template v-for="(item, i) in state.listData" :key="i">
          <!-- <div class="item" @click="productHandle(item)">
            <MyImage v-if="$imgBaseUrl + item.pic" :src="$imgBaseUrl + item.pic" alt="" fit="initial" />

            <div class="text padding">{{ item.name }}</div>
            <div class="price padding">
              <span class="unit">￥</span>
              {{ item.price }}
            </div>
          </div> -->

          <!-- <ProductItem :item="item" @click="productHandle" /> -->
          <GoodCube :item="item" @click="productHandle" />
        </template>
      </div>

      <!-- 数据为空 -->
      <div v-if="state.listData.length === 0 && state.finished">
        <MyEmptyData />
      </div>
    </MyPullRefreshList>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { goodsListApi } from '@/api/goods'
import GoodCube from '@/components/MyGoodsItem/goodsCube.vue'
import MyPullRefreshList from '@/components/MyPullRefreshList/index.vue'
import router from '@/router'
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
const prolist = async () => {
  loadingDiabled = true
  state.loading = true

  try {
    const data = await goodsListApi({
      pageNum: state.pagination.current,
      pageSize: state.pagination.pageSize,
      orderField: 'sort',
      orderSort: 'asc',
      publishStatus: 1,
    })
    data.rows = data?.rows || []

    state.listData.push(...data.rows)
    state.pagination.current++

    state.pagination.total = data.total
  } finally {
    state.loading = false
    loadingDiabled = false
    if (state.listData.length >= state.pagination.total) {
      state.finished = true
    }
  }
}
let loadingDiabled = false
const onLoad = async () => {
  if (state.finished || loadingDiabled) return false
  prolist()
}

/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {
  // 本地缓存增加一个字段，作为标识；
  // 用户成功注册后，上报首页访问数量+1并将字段值由False 修改为 True，后续登录或注册判断该字段值是否为False，若为False上报+1，若为True不上报。
  // 用户成功注册后，上报首页访问数量+1并将字段值由False 修改为 True
  // if (!userInfo.token) {}
  prolist()
})
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
