<template>
    <div class="about-page">
      <MobileHeader :leftText="$t('about')" class="about-header" :backicon="true"></MobileHeader>
  
      暂无内容
    </div>
  </template>
  
  <script setup>
  /** ***引入相关包start*****/
  import { ref, onMounted } from 'vue'
  import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
  
  /** ***引入相关包end*****/
  /** ***ref、reactive、props，等……start*****/
  
  /** ***ref、reactive、props，等……end*****/
  /** ***函数 start*****/
  
  /** ***函数 end*****/
  /** ***生命周期start*****/
  onMounted(() => {})
  /** ***生命周期end*****/
  </script>
  
  <style scoped lang="less">
  .about-page {
    .about-header {
      :deep(.title) {
        color: var(--adm-color-textLv1);
        font-weight: 600;
      }
    }
  }
  </style>
  