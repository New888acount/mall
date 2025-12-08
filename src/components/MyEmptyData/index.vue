<template>
  <div class="my-empty-data">
    <slot name="img">
      <img :src="img || data[type]['img']" />
    </slot>
    <slot name="text">
      <span>{{ text || data[type]['text'] }}</span>
    </slot>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
// import useAppStore from '@/store/modules/app.js'
// const appStore = useAppStore()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps({
  img: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'order', // 默认数据类型为order
  },
})
// 空数据类型，其他空数据类型可以这边定义方便以后更改
const data = {
  order: {
    img: require(`@/assets/images/data-empty.png`),
    text: t('empty.text'),
  },
}
</script>

<style lang="less" scoped>
.my-empty-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  img {
    width: 260px;
    height: auto;
  }
  span {
    margin-top: 10px;
    color: #999;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
  }
}

html[data-device='mobile'] {
  .my-empty-data {
    img {
      width: 180px;
    }
    span {
      margin-top: 0;
      font-size: 12px;
    }
  }
}
</style>
