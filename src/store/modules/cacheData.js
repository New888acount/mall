// stores/address.js
import { getBannerApi } from '@/api/common'
import { goodsListApi } from '@/api/goods'
import { defineStore } from 'pinia'
let loadingDisabled = false
export const useCacheData = defineStore('useCacheData', {
  state: () => ({
    goodsList: [], //推荐商品列表,
    loading: false,
    orderField: 'sort',
    orderSort: 'desc',
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    hotList: [], // 热门商品列表
    finished: false, // 已经完成所有加载
    bannerList: [], //首页轮播图
  }),
  actions: {
    // 热门商品列表
    async hotlist() {
      try {
        const data = await goodsListApi({
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
          orderField: this.orderField,
          orderSort: this.orderSort,
          // 商品上架状态
          publishStatus: 1,
          hot: 1,
        })
        data.rows = data?.rows || []

        this.hotList = data.rows
        // this.pagination.current++

        // this.pagination.total = data.total
      } finally {
        // this.loading = false
        // loadingDisabled = false
        // if (this.goodsList.length >= this.pagination.total) {
        //   this.finished = true
        // }
      }
    },

    // 推荐商品列表
    async recommendlist() {
      if (this.loading || loadingDisabled) return // 防止并发
      loadingDisabled = true
      this.loading = true

      try {
        const data = await goodsListApi({
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
          orderField: this.orderField,
          orderSort: this.orderSort,
          // 商品上架状态
          publishStatus: 1,
          recommend: 1,
        })
        data.rows = data?.rows || []

        this.goodsList.push(...data.rows)
        this.pagination.current++

        this.pagination.total = data.total
      } finally {
        this.loading = false
        loadingDisabled = false
        if (this.goodsList.length >= this.pagination.total) {
          this.finished = true
        }
      }
    },

    onLoad() {
      if (this.finished || loadingDisabled) return false
      this.prolist()
    },

    async getBanner() {
      if (this.bannerList.length) return
      try {
        const { data } = await getBannerApi()
        this.bannerList = data

        console.log(this.bannerList)
      } catch (error) {
        console.log(error)
      }
    },
  },
})

export default useCacheData
