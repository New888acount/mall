<template>
  <div class="pro-list" v-loading="state.loading">
    <MobileHeader class="cart-header" :backicon="true">
      <template #title>
        <div class="search">
          <i class="iconfont icon-searcch"></i>
          <van-field v-model="state.search" placeholder="请输入关键字" clearable @keyup.enter="onSearch" />
        </div>
      </template>
    </MobileHeader>

    <div class="list">
      <div class="list-box">
        <div class="title-box">
          <div @click="recommendHandle('recommend')">
            {{ $t('goodList.tab1') }}
            <MyPopup
              v-model="recommendshow"
              position="top"
              :zIndex="98"
              overlayClass="my__recommends--overlay"
              class="my__recommends"
              :closeShow="false"
            >
              <div class="content">
                <div
                  @click="recommendActivehandle('complex')"
                  :style="{ color: recommendActive == 'complex' ? 'var(--color-light)' : '' }"
                >
                  {{ $t('goodList.tab1.pop1') }}
                </div>
                <div
                  @click="recommendActivehandle('ascending')"
                  :style="{ color: recommendActive == 'ascending' ? 'var(--color-light)' : '' }"
                >
                  {{ $t('goodList.tab1.pop2') }}
                </div>
                <div
                  @click="recommendActivehandle('descending')"
                  :style="{ color: recommendActive == 'descending' ? 'var(--color-light)' : '' }"
                >
                  {{ $t('goodList.tab1.pop3') }}
                </div>
              </div>
            </MyPopup>

            <div class="line" v-if="listActive === 'recommend'"></div>
          </div>
          <div @click="recommendHandle('new')">
            {{ $t('goodList.tab2') }}

            <div class="line" v-if="listActive === 'new'"></div>
          </div>
        </div>
        <div class="icon-box" @click="switchList">
          <i class="iconfont icon-liebiaoqiehuan" v-if="switchListFlag"></i>
          <i class="iconfont icon-liebiaoqiehuan1" v-else></i>
        </div>
      </div>

      <!-- 有数据 -->
      <MyPullRefreshList v-model:loading="state.loading" :finished="state.finished" @load="onLoad">
        <div :class="[switchListFlag ? 'list-data-vertical' : 'list-data-cube']">
          <template v-for="(item, i) in state.listData" :key="i">
            <GoodsVertical v-if="switchListFlag" :item="item" @click="productHandle" :buyButton="true" />
            <GoodsCube v-else :item="item" @click="productHandle" />
          </template>
        </div>

        <!-- 数据为空 -->
        <div v-if="!state.listData.length && state.finished && !state.loading">
          <MyEmptyData />
        </div>
      </MyPullRefreshList>
    </div>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { ref, onMounted, reactive } from 'vue'
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import MyEmptyData from '@/components/MyEmptyData/index.vue'
import MyPopup from '@/components/MyPopup/index.vue'
import { goodsListApi } from '@/api/goods'
import MyImage from '@/components/MyImage'
import MyPullRefreshList from '@/components/MyPullRefreshList/index.vue'
import router from '@/router'
import { useRoute } from 'vue-router'
// import ProductItem from '@/components/MyGoodsItem/index.vue'
// import GoodsVertical from '@/components/MyGoodsItem/goodsVertical.vue'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/

const switchListFlag = ref(true)
const listActive = ref('recommend') // 默认选中综合推荐
const recommendActive = ref('complex') // 默认选中综合推荐

const recommendshow = ref(false)
const route = useRoute()
const state = reactive({
  listData: [], // 列表数据
  loading: false, //分页是否加载中
  finished: false, // 已经完成所有加载
  orderField: 'sort',
  orderSort: 'desc',
  search: '',
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
const onSearch = () => {
  initState()
}

// 切换列表排列方式
const switchList = () => {
  switchListFlag.value = !switchListFlag.value
}

// 进入产品详情页面
const productHandle = (n) => {
  console.log(n)
  router.push({
    path: '/goods/index',
    query: {
      id: n.id,
    },
  })
}
// 综合推荐、新品切换
const recommendHandle = (val) => {
  listActive.value = val
  if (val === 'new') {
    state.orderField = 'create_time'
    state.orderSort = 'desc'
    recommendshow.value = false
    recommendActive.value = 'complex'
    initState()
  } else if (val === 'recommend') {
    state.orderField = 'sort'
    state.orderSort = 'desc'

    recommendshow.value = !recommendshow.value
  }
}

const initState = () => {
  state.finished = false
  state.pagination.current = 1
  state.pagination.pageSize = 10
  state.listData = []
  prolist()
}
// 综合推荐弹窗选择
const recommendActivehandle = (val) => {
  recommendActive.value = val
  // 打开价格升降序选择弹窗

  // 价格升序
  if (val === 'ascending') {
    state.orderField = 'price'
    state.orderSort = 'asc'
  } else if (val === 'descending') {
    state.orderField = 'price'
    state.orderSort = 'desc'
  } else {
    state.orderField = 'sort'
    state.orderSort = 'desc'
  }
  initState()
  recommendshow.value = false
}

let loadingDiabled = false

const onLoad = async () => {
  if (state.finished || loadingDiabled) return false
  prolist()
}
const prolist = async () => {
  loadingDiabled = true
  state.loading = true

  try {
    const data = await goodsListApi({
      pageNum: state.pagination.current,
      pageSize: state.pagination.pageSize,
      orderField: state.orderField,
      orderSort: state.orderSort,
      search: state.search,
      // 商品上架状态
      publishStatus: 1,
    })
    data.rows = data?.rows || []

    if (state.pagination.current === 1) {
      // 首次加载或刷新时，重置列表
      state.listData = data.rows
    } else {
      // 加载更多时，追加
      state.listData = [...state.listData, ...data.rows]
    }
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
/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {
  if (route.query?.search) {
    state.search = route.query?.search
  }
  prolist()
})
/** ***生命周期end*****/
</script>

<style scoped lang="less">
.pro-list {
  .search {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f8f8f8;
    margin: 5px 12px;
    border-radius: 23px;
    height: 36px;
    // flex: 1;
    .icon-searcch {
      font-size: 19px;
      margin: 0 10px;
      color: rgb(192, 196, 204);
    }
    :deep(.van-cell) {
      // height: 32px;
      border-radius: 0 23px 23px 0;
      padding: 0;
      background: #f8f8f8;
      input::placeholder {
        color: gray; /* 改颜色 */
      }
    }
  }

  .list {
    .list-box {
      display: flex;
      align-items: center;
      background: #fff;
      position: sticky;
      top: 45px;
      z-index: 99;
      .title-box {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 40px;
        line-height: 38px;
        color: #303030;
        font-size: 14px;
        div {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          position: relative;

          .line {
            position: absolute;
            bottom: -3px;
            width: 20px;
            height: 3px;
            background: var(--color-light);
            // margin-top: 10px;
            border-radius: 100px;
            margin-bottom: 4px;
          }
        }
      }

      .icon-box {
        margin-right: 20px;
        i {
          font-size: 22px;
        }
      }
    }
  }

  .list-data-cube {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    padding: 0 10px;
    .item {
      width: 48%;
      margin-right: 8px;
      margin-bottom: 8px;
      border-radius: 8px;
      background-color: #ffffff;
      img {
        width: 100%;
        height: 174px;

        border-radius: 8px 8px 0 0;
      }

      .padding {
        margin: 10px 8px;
      }

      .text {
        font-size: 13px;
        display: -webkit-box; /* 弹性伸缩盒子模型 */
        -webkit-box-orient: vertical; /* 垂直排列子元素 */
        -webkit-line-clamp: 2; /* 限制显示 2 行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        // line-height: 13px;
      }

      .price {
        color: var(--color-price);
        font-size: 15px;
      }
    }

    .item:nth-child(2n) {
      margin-right: 0px;
    }
  }
  .list-data-vertical {
    // display: flex;
    // flex-wrap: wrap;
    margin-top: 10px;
    padding: 0 10px;
    .item {
      display: flex;
      width: 100%;
      // margin-right: 8px;
      margin-bottom: 8px;
      border-radius: 8px;
      background-color: #ffffff;

      .item-img {
        width: 140px;
        height: 140px;

        border-radius: 8px 0 0 8px;
        margin-right: 10px;
        img {
          width: 140px;
          height: 140px;
          flex: 1;
        }
      }

      .item-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        .text {
          font-size: 14px;
          display: -webkit-box; /* 弹性伸缩盒子模型 */
          -webkit-box-orient: vertical; /* 垂直排列子元素 */
          -webkit-line-clamp: 2; /* 限制显示 2 行 */
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          // line-height: 13px;
        }
        .item-price {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .price {
            color: var(--color-price);
            font-size: 15px;
          }

          .buy {
            width: 60px;
            height: 25px;
            border-radius: 12.5px;
            font-size: 12px;
            color: #ffffff;
            line-height: 26px;
            text-align: center;
            background: linear-gradient(90deg, #fe8900, #ff5e00);
          }
        }
      }

      .padding {
        margin: 10px 0px;
      }
    }
  }
}
</style>

<style lang="less">
.my__recommends {
  &.my-popup {
    top: 85px;
    background-color: rgb(246, 246, 246);
    border-radius: 0 0 10px 10px;
    padding: 14px 26px;
    .my-popup__container {
      background: transparent;
      border-radius: 0;
      box-shadow: none;
      .content {
        div {
          font-size: 14px;
          font-weight: 500;
          color: #333333;
          margin-bottom: 12px;
        }
      }
    }
  }
}
</style>
