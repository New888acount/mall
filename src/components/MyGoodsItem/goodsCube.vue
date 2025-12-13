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
          <span class="unit">{{ $unit }}</span>
          {{ item.price }}
        </div>
      </div>

      <div
        class="fav-icon"
        :class="{
          active: item.name,
        }"
      >
        <i
          class="iconfont"
          :class="{
            'icon-collect': !item.name,
            'icon-collected1': item.name,
          }"
        ></i>
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
  position: relative;

  .fav-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    z-index: 2;
    &.active {
      background: var(--adm-color-primary);
      .iconfont {
        font-size: 14px;
        color: #fff;
      }
    }
    .iconfont {
      font-size: 16px;
      color: var(--adm-color-textLv1);
    }
  }
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
