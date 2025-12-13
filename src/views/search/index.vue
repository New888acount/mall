<template>
  <div class="search-page">
    <MobileHeader :title="$t('search.title')" class="cart-header" :backicon="false"></MobileHeader>

    <div class="search">
      <i class="iconfont icon-searcch"></i>
      <van-field v-model="search" :placeholder="$t('searchInput.placeholder')" clearable @keyup.enter="onSearch" />
    </div>

    <div class="search-tag">
      <div class="tag-title">
        <div>{{ $t('searchTag.title') }}</div>
        <div @click="clearTag">{{ $t('searchTag.clear') }}</div>
      </div>
      <div class="tag-result">
        <p v-for="item in tagList" :key="item.text" @click="gotoGoods(item)">{{ item }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { ref, onMounted } from 'vue'
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import router from '@/router'
import useLocalCache from '@/hooks/storage/localStorage'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const { setSearchHistory, getSearchHistory, removeSearchHistory } = useLocalCache()
const tagList = ref([])
const search = ref()
/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
const gotoGoods = (item) => {
  router.push({
    path: '/goods/list',
    query: { search: item },
  })
}

const clearTag = () => {
  tagList.value = []
  removeSearchHistory()
}

const onSearch = () => {
  // 在这里调用搜索接口
  router.push({
    path: '/goods/list',
    query: {
      search: search.value,
    },
  })

  tagList.value.push(search.value)
  setSearchHistory(tagList.value)
}
/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {
  tagList.value = getSearchHistory() || []
})
/** ***生命周期end*****/
</script>

<style scoped lang="less">
.search-page {
  background: #fff;
  height: 100%;
  .search {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f8f8f8;
    margin: 5px 12px;
    border-radius: 23px;
    height: 36px;
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

  .search-tag {
    margin: 10px 12px;
    .tag-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 15px;
      font-weight: bold;
      line-height: 36px;
      height: 36px;

      div:nth-child(2) {
        font-size: 14px;
        color: #999999;
        font-weight: 500;
      }
    }

    .tag-result {
      display: flex;
      flex-wrap: wrap;

      p {
        padding: 0 19px;
        height: 30px;
        background: #f5f6f8;
        border-radius: 15px;
        font-size: 14px;
        color: #333333;
        max-width: 345px;
        margin: 0 10px 10px 0;
        line-height: 30px;
        overflow: hidden;
      }
    }
  }
}
</style>
