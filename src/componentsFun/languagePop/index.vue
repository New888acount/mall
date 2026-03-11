<template>
  <MyPopup
    v-model="show"
    :closeShow="false"
    @close="unMountComponent"
    position="bottom"
    :zIndex="getMaxZIndex() + 1000"
    overlayClass="my__language--overlay"
    class="my__language"
  >
    <van-picker
      :title="$t('selectlanguage.title')"
      :confirm-button-text="$t('selectlanguage.confirm')"
      :cancel-button-text="$t('selectlanguage.cancel')"
      :columns="columns"
      @confirm="onConfirm"
      @cancel="close"
      @change="onChange"
      v-model="lang"
    />
  </MyPopup>
</template>

<script setup>
/** ***引入相关包start*****/
import MyPopup from '@/components/MyPopup/index.vue'
import { getMaxZIndex } from '@/utils/index'
import { defineExpose, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import closePop from './index.js'

/** ***引入相关包end*****/

/** ***ref、reactive、props，等……start*****/
const show = ref(false)
const { t } = useI18n()

defineExpose({
  show,
})

const props = defineProps({
  columns: {
    type: Array,
    default: null,
  },
  onConfirm: {
    type: Function,
    default: null,
  },
  onCancel: {
    type: Function,
    default: null,
  },
  onChange: {
    type: Function,
    default: null,
  },
  currentLang: {
    type: [Array, String],
    default: '',
  },
})

const lang = ref(props.currentLang)

/** ***ref、reactive、props，等……end*****/

/** ***函数 start*****/

//关闭
const close = () => {
  show.value = false
  unMountComponent()
}
// 销毁组件
const unMountComponent = () => {
  closePop({ type: 'unmount' })
}

const onConfirm = () => {
  console.log(lang.value, 'lang.value')
  props.onConfirm && props.onConfirm(lang.value[0])
}

const onChange = () => {
  props.onChange && props.onChange(lang.value[0])
}

/** ***函数 end*****/

/** ***生命周期start*****/
onMounted(() => {})
/** ***生命周期end*****/
</script>

<style lang="less"></style>
