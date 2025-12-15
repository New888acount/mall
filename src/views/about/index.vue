<template>
  <div class="about-page" v-loading="isLoading">
    <MobileHeader :leftText="$t('about')" class="about-header" :backicon="true"></MobileHeader>
    <main v-if="Object.keys(details)?.length">
      <div class="title">{{ details?.title }}</div>
      <div class="content" v-html="details?.content"></div>
    </main>
    <MyEmptyData v-else-if="!Object.keys(details)?.length && !isLoading" />
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { ref, onMounted } from 'vue'
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import { getAboutApi } from '@/api/common'
import MyEmptyData from '@/components/MyEmptyData'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const isLoading = ref(false)
const details = ref({})
/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
const getAbout = async () => {
  isLoading.value = true
  try {
    const { data } = await getAboutApi()
    details.value = data[0]
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(async () => {
  await getAbout()
})
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

  main {
    padding: 12px 16px;
    .title {
      color: var(--adm-color-textLv1);
      font-family: Roboto;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    .content {
      margin-top: 12px;
      color: var(--color-textlv2);
      font-family: Roboto;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }
}
</style>
