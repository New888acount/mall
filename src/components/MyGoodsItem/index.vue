<template>
  <div :class="[isVertical ? 'vertical-item' : 'cube-item']" @click="handleClick">
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
        <div v-if="isVertical" class="buy">{{ $t('goodList.buy') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import MyImage from '@/components/MyImage'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  item: { type: Object, required: true },
  isVertical: { type: Boolean, default: true },
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click', props.item)
}

// 闪频数量加减
const onNumberChange = (e, cartItem) => {
  // if (e === 0) {
  //   cartStore.delete(cartItem.id);
  //     return;
  //   }

  cartStore.update({
    id: cartItem.id,
    quantity: e,
  })
}

const { t } = useI18n()
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

.cube-item:nth-child(2n) {
      margin-right: 0px;
    }

.vertical-item {
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
</style>
