<template>
  <div class="right">
    <van-stepper
      :input-width="size"
      v-model="innerValue"
      :min="min"
      :max="max"
      class="my-stepper"
      @change="onChange"
      @plus="onPlus"
      @minus="onMinus"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
//   const modelValue = ref(5)
// 接收父组件传入的 props
const props = defineProps({
  modelValue: { type: Number, default: 1 },
  size: { type: Number, default: 32 },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 99 },
})
// 向父组件回传事件
const emit = defineEmits(['update:modelValue', 'plus', 'minus', 'change'])
// 内部值
const innerValue = ref(props.modelValue)

//   const emit = defineEmits(['update:modelValue'])
// 监听 props 变化
watch(
  () => props.modelValue,
  (val) => {
    innerValue.value = val
  }
)

// 事件处理
const onChange = (val) => {
  emit('update:modelValue', val)
  emit('change', val)
}
const onPlus = () => emit('plus', innerValue.value)
const onMinus = () => emit('minus', innerValue.value)
</script>

<style lang="less" scoped>
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
</style>
