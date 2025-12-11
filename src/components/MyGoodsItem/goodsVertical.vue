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
          <span class="unit">￥</span>
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
  padding: 10px 10px 10px 0;
  display: flex;
  width: 100%;
  // margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 8px;
  background-color: #ffffff;

  .item-img {
    width: 82px;
    height: 82px;

    border-radius: 8px 0 0 8px;
    margin-right: 10px;
    img {
      width: 82px;
      height: 82px;
      flex: 1;
    }
  }

  .item-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    .text {
      .item-name {
        font-size: 14px;
        display: -webkit-box; /* 弹性伸缩盒子模型 */
        -webkit-box-orient: vertical; /* 垂直排列子元素 */
        -webkit-line-clamp: 2; /* 限制显示 2 行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        // line-height: 13px;
      }
      .tag {
        overflow: hidden;
        color: #9d9ea2;
        text-overflow: ellipsis;
        font-size: 12px;
        line-height: 150%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        align-self: stretch;
        margin-top: 10px;
      }
    }
    .item-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 25px;

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

      .right {
        :deep(.my-stepper) {
          --van-stepper-input-width: auto;
          .van-stepper__input {
            font-size: 14px;
            min-width: 32px;
            max-width: 64px;
            background: transparent;
            margin: 0 8px;
            text-align: center; /* 保证数字居中 */
          }

          .van-stepper__minus,
          .van-stepper__plus {
            border-radius: 6px;
            border: 1px solid var(--color-light);
            background: var(--color-light);
            color: #fff;
            border-radius: 50%;
            width: 16px;
            height: 16px;
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
            border-radius: 6px;
            border: 1px solid var(--color-light) !important;
            background: var(--color-light) !important;
            border-radius: 50%;
            box-shadow: none; /* 去掉点击态阴影 */
          }
          .van-stepper__plus:active:before,
          .van-stepper__minus:active:before {
            color: #fff; /* 符号变绿色 */
          }
          .van-stepper__plus:active:after,
          .van-stepper__minus:active:after {
            color: #fff; /* 符号变绿色 */
            //   width: 30%;
          }

          /* 禁用状态：不高亮 */
          .van-stepper__plus--disabled,
          .van-stepper__minus--disabled {
            background: #c0c0c0;
            border-color: #ddd;
            color: #fff;
            pointer-events: none;
          }
          .van-stepper__plus--disabled .van-icon,
          .van-stepper__minus--disabled .van-icon {
            color: #999; /* 禁用时符号灰色 */
          }
        }
      }
    }
  }
}
</style>
