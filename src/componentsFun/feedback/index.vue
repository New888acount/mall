<template>
  <MyPopup
    v-model="show"
    :closeShow="false"
    @close="unMountComponent"
    position="center"
    :zIndex="getMaxZIndex() + 1000"
    overlayClass="my__feedback--overlay"
    class="my__feedback"
    :close-on-click-overlay="false"
  >
    <div class="content">
      <div class="title">{{ $t('feedback.title') }}</div>
      <van-field
        v-model="message"
        rows="4"
        autosize
        type="textarea"
        :placeholder="$t('feedback.placeholder')"
        clearable
        show-word-limit
      />
      <div @click="close" class="submit">{{ $t('feedback.submit') }}</div>
    </div>
  </MyPopup>
</template>

<script setup>
/** ***引入相关包start*****/
import { ref, defineExpose, defineProps, onMounted } from 'vue'
import MyPopup from '@/components/MyPopup/index.vue'
import msgTaost from './index.js'
import { customToast, getMaxZIndex } from '@/utils/index'
import { useI18n } from 'vue-i18n'

/** ***引入相关包end*****/

/** ***ref、reactive、props，等……start*****/
const show = ref(false)
const message = ref('')
const { t } = useI18n()

defineProps({
  msg: {
    type: String,
    default: '',
  },
})

defineExpose({
  show,
})

/** ***ref、reactive、props，等……end*****/

/** ***函数 start*****/

//关闭
const close = () => {
  customToast(t('feedback.success'))
  show.value = false
  unMountComponent()
}
// 销毁组件
const unMountComponent = () => {
  msgTaost({ type: 'unmount' })
  message.value = ''
}

/** ***函数 end*****/

/** ***生命周期start*****/
onMounted(() => {})
/** ***生命周期end*****/
</script>

<style lang="less">
.my__feedback {
  &.my-popup {
    width: calc(100vw - 32px) !important;
    margin: 16px 16px 0;
    border-radius: 5px;

    .my-popup__container {
      background: transparent;
      border-radius: 0;
      box-shadow: none;
    }
    .content {
      // display: flex;
      // align-items: center;
      // justify-content: space-between;
      text-align: center;
      padding: 10px;
      background: var(--adm-bg-white);
      color: var(--adm-color-textLv1);
      // box-shadow: 0px 4px 4px 0px rgba(20, 20, 20, 0.5);
      .title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 10px;
      }

      .submit {
        margin-top: 15px;
        background: var(--adm-color-primary);
        color: #fff;
        padding: 10px 0;
        border-radius: 5px;
        font-size: 16px;
      }
    }
  }
}
</style>
