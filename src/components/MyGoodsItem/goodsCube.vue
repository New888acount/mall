<template>
  <div class="cube-item" @click="handleClick">
    <!-- 图片 -->
    <div class="item-img">
      <MyImage :src="$imgBaseUrl + item.pic" alt="" fit="initial" />
    </div>

    <!-- 信息 -->
    <div class="item-info">
      <div class="text padding">{{ item.name || item.productName }}</div>
      <div class="tag" v-if="item.spDataValue">
        {{ item.spDataValue }}
      </div>
      <div class="item-price">
        <div class="price padding">
          <span class="unit">￥</span>
          {{ item.price }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import MyImage from '@/components/MyImage'

const props = defineProps({
  item: { type: Object, required: true },
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click', props.item)
}
</script>

<style scoped lang="less">
.cube-item {
  width: calc(50% - 4px);
  flex-wrap: wrap;
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 8px;
  background-color: #ffffff;
  :deep(.van-image) {
    width: 100%;
    height: 174px;
    border-radius: 8px 8px 0 0;
  }
  :deep(.van-skeleton-image) {
    width: 100%;
    height: 174px;
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
  }

  .price {
    color: var(--color-price);
    font-size: 15px;
  }
}

.cube-item:nth-child(2n) {
  margin-right: 0px;
}
</style>
