<template>
  <div class="vertical-item" @click="handleClick">
    <!-- 图片 -->
    <div class="item-img">
      <MyImage :src="$imgBaseUrl + item.pic" alt="" fit="initial" />
    </div>

    <!-- 信息 -->
    <div class="item-info">
      <div class="text">
        <div class="item-name">
          {{ item.name || item.productName }}
        </div>
        <div class="tag" v-if="item.spDataValue">
          {{ item.spDataValue }}
        </div>
      </div>
      <div class="item-price">
        <div class="price padding">
          <span class="unit">USDT</span>
          {{ item.price }}
        </div>
        <div class="buy" v-if="buyButton">{{ $t('goodList.buy') }}</div>

        <div class="right" v-if="quantityButton" @click.stop>
          <van-stepper
            :input-width="size"
            v-model="innerValue"
            :min="1"
            :max="max"
            class="my-stepper"
            @change="onChange"
            @plus="onPlus"
            @minus="onMinus"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MyImage from '@/components/MyImage'
import { defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps({
  // 商品详情
  item: { type: Object, default: () => null },
  // 购买按钮
  buyButton: { type: Boolean, default: false },
  // 记数按钮
  quantityButton: { type: Boolean, default: false },
  // 计数器宽度
  size: { type: Number, default: 32 },
  // 计数器最小值
  min: { type: Number, default: 1 },
  // 计数器最大值
  max: { type: Number, default: 99 },
})

const emit = defineEmits(['click', 'update:modelValue', 'plus', 'minus', 'change'])

function handleClick() {
  // 没有购买按钮不进行详情页面跳转
  if (!props.buyButton) return
  emit('click', props.item)
}
// 计数值
const innerValue = ref(props.modelValue)

// 事件处理
const onChange = (val) => {
  emit('update:modelValue', val)
  emit('change', val)
}
const onPlus = () => emit('plus', innerValue.value)
const onMinus = () => emit('minus', innerValue.value)

watch(
  () => props.item,
  (val) => {
    innerValue.value = val.quantity
  }
)
</script>

<style scoped lang="less">
.vertical-item {
  position: relative;
  padding-bottom: 12px;
  margin-bottom: 8px;
  display: flex;
  width: 100%;
  &::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    transform: scaleY(0.5);
    background: #ededed;
  }
  &:last-child {
    margin-bottom: 0;
  }
  .item-img {
    width: 72px;
    height: 72px;
    margin-right: 8px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .item-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    .text {
      .item-name {
        overflow: hidden;
        color: var(--adm-color-textlv2);
        text-overflow: ellipsis;
        font-family: 'PingFang SC';
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 150%; /* 21px */
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        align-self: stretch;
      }
      .tag {
        padding: 8px 0;
        color: var(--color-textlv2);
        font-family: Roboto;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }
    .item-price {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .price {
        color: var(--color-red);
        font-family: Roboto;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }

      .buy {
        border-radius: 12.5px;
        font-size: 12px;
        color: #ffffff;
        line-height: 26px;
        text-align: center;
        background: linear-gradient(90deg, #fe8900, #ff5e00);
      }

      .right {
        :deep(.my-stepper) {
          padding: 0 2px;
          border-radius: 1px;
          background: rgba(237, 237, 237, 0.4);
          .van-stepper__input {
            min-width: 8px;
            margin: 0 8px;
            height: 14px;
            color: var(--adm-color-textLv1);
            font-family: Roboto;
            font-size: 14px;
            font-style: normal;
            font-weight: 600;
            line-height: 100%; /* 14px */
            background: transparent;
          }

          .van-stepper__minus,
          .van-stepper__plus {
            width: 16px;
            height: 16px;
            color: var(--adm-color-textLv1);
            background: transparent;
            -webkit-tap-highlight-color: transparent;
          }

          .van-stepper__plus:before,
          .van-stepper__minus:before {
            width: 50%;
          }

          .van-stepper__plus:after {
            height: 50%;
          }

          /* 点击高亮（按下时） */
          .van-stepper__plus:active,
          .van-stepper__minus:active {
            background: transparent !important;
            box-shadow: none; /* 去掉点击态阴影 */
          }
          .van-stepper__plus:active:before,
          .van-stepper__minus:active:before {
            color: var(--adm-color-primary);
          }
          .van-stepper__plus:active:after,
          .van-stepper__minus:active:after {
            color: var(--adm-color-primary);
          }

          /* 禁用状态：不高亮 */
          .van-stepper__plus--disabled,
          .van-stepper__minus--disabled {
            background: transparent;
            color: var(--color-textlv2);
            pointer-events: none;
          }
          .van-stepper__plus--disabled .van-icon,
          .van-stepper__minus--disabled .van-icon {
            color: var(--color-textlv2); /* 禁用时符号灰色 */
          }
        }
      }
    }
  }
}
</style>
