// stores/cart.js
import { addCartApi, cartListApi, deleteCartApi, updateCartApi } from '@/api/cart'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    list: [], // 购物车列表
    selectedIds: [], // 已选列表
    cartSelectedTotalPrice: '0.00', // 选中项总金额
    loading: false,
  }),
  getters: {
    // 选择总价格
    totalPriceSelected: (state) => {
      let price = 0
      if (!state.selectedIds.length) return price.toFixed(2)
      state.list.forEach((item) => {
        price += state.selectedIds.includes(item.id) ? Number(item.price) * item.quantity : 0
      })
      return price.toFixed(2)
    },
  },
  actions: {
    // 获取购物车列表
    async getList() {
      try {
        this.loading = true
        const { data: list } = await cartListApi()

        list.forEach((it) => {
          let str = ''
          const obj = JSON.parse(it.spData)
          Object.keys(obj).forEach((key) => {
            str += key + '：' + obj[key] + ' '
          })
          it.spDataValue = str
        })
        this.list = list
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    // 添加购物车
    async add(goodsInfo) {
      try {
        this.loading = true
        const res = await addCartApi({
          productId: goodsInfo.productId,
          skuId: goodsInfo.id,
          productName: goodsInfo.productName,
          pic: goodsInfo.pic,
          quantity: goodsInfo.buyNum,
          spData: goodsInfo.spData,
        })
        if (res.code === 200) {
          this.getList()
        }
        return res
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    // 更新购物车
    async update(goodsInfo) {
      try {
        this.loading = true
        const res = await updateCartApi(goodsInfo)
        if (res.code === 200) {
          this.getList()
        }
        return res
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    // 移除购物车
    async delete(ids) {
      if (Array.isArray(ids)) {
        ids = ids.join(',')
      }
      try {
        this.loading = true
        const res = await deleteCartApi(ids)
        if (res.code === 200) {
          this.selectedIds = [] // ✅ 删除后清空选择
          this.getList()
        }
        return res
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    // 清空购物车
    emptyList() {
      this.list = []
      this.selectedIds = []
      this.cartSelectedTotalPrice = '0.00'
    },
  },
})
