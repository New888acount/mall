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

<style lang="less" scoped></style>
