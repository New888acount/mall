// stores/address.js
import { defineStore } from 'pinia'

// store/address.js
export const useAddressStore = defineStore('address', {
  state: () => ({
    defaultAddress: null,
    selectedAddress: null
  }),
  getters: {
    // 当前的地址信息
    currentAddress: (state) => state.selectedAddress || state.defaultAddress
  },
  actions: {
    // 默认的地址信息
    setDefault(address) {
      this.defaultAddress = address
    },
    // 选择的地址信息
    setSelected(address) {
      this.selectedAddress = address
    }
  }
})
