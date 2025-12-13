<template>
  <div class="cube-item" @click="handleClick">
    <!-- 图片 -->
    <div class="item-img">
      <MyImage :src="$imgBaseUrl + item.pic" alt="" fit="initial" />
    </div>

    <!-- 信息 -->
    <div class="item-info">
      <div class="text">{{ item.name || item.productName }}</div>
      <div class="tag" v-if="item.spDataValue">
        {{ item.spDataValue }}
      </div>
      <div class="item-price">
        <div class="price padding">
          <span class="unit">{{$unit}}</span>
          {{ item.price }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MyImage from '@/components/MyImage'
import { defineEmits, defineProps } from 'vue'

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
  :deep(.van-image) {
    width: 100%;
    height: auto;
  }
  :deep(.van-skeleton-image) {
    width: 100%;
    height: 100%;
  }

  .item-info {
    padding: 8px 0;
  }

  .text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    align-self: stretch;
    overflow: hidden;
    color: var(--adm-color-textlv2);
    text-overflow: ellipsis;
    font-family: 'PingFang SC';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 21px */
  }

  .price {
    margin-top: 4px;
    color: var(--color-textlv2);
    font-family: Roboto;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 18px */
  }
}

.cube-item:nth-child(2n) {
  margin-right: 0px;
}
</style>
