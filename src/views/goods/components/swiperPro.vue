<template>
  <div class="pro-swiper">
    <van-swipe class="my-swipe" :autoplay="3000" @change="onChange">
      <van-swipe-item v-for="(item,i) in props.list" :key="'swiper' + i">
        <MyImage v-if="$imgBaseUrl + item" :src="$imgBaseUrl + item" alt="" fit="initial" />
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }} / {{ total }}</div>
      </template>
    </van-swipe>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { ref, onMounted, defineProps} from 'vue'
import MyImage from '@/components/MyImage'

/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const current = ref(0)

const props = defineProps({
  list: {
    type: Array,
    default: () => {
      return []
    },
  },
})

const total = ref(0)

/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
const onChange = (index) => {
  current.value = index
}
/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {
  total.value = props.list.length
})
/** ***生命周期end*****/
</script>

<style scoped lang="less">
.pro-swiper {
  height: 375px;
  // width: 375px;
  position: relative;
  .my-swipe {
    // width: 375px;
    height: 375px;
    .van-swipe-item {
      color: #fff;
      font-size: 20px;
      line-height: 150px;
      text-align: center;
      background-color: #969494;
    }
    .custom-indicator {
      position: absolute;
      right: 5px;
      bottom: 5px;
      padding: 8px 18px;
      background: rgba(0, 0, 0, 0.4);
      color: #fff;
      font-size: 18px;
      border-radius: 20px;
      text-align: center;
      transform: scale(0.7);
      line-height: 18px;
    }
  }
}
</style>
