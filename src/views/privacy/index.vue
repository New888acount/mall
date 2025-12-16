<template>
  <div class="privacy-page" v-loading="isLoading">
    <MobileHeader :leftText="$t('privacy')" class="privacy-header" :backicon="true"></MobileHeader>
    <main v-if="details?.length">
      <div class="items" v-for="item in details" :key="item?.title">
        <div class="title">{{ item?.title }}</div>
        <div class="content" v-html="item?.content"></div>
      </div>
    </main>
    <MyEmptyData v-else-if="!details?.length && !isLoading" />
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { ref, onMounted } from 'vue'
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import { getPrivacyApi } from '@/api/common'
import MyEmptyData from '@/components/MyEmptyData'

/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const details = ref({})
const isLoading = ref(false)
/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
const getPrivacy = async () => {
  isLoading.value = true
  try {
    const { data } = await getPrivacyApi()
    details.value = data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(async () => {
  await getPrivacy()
})
/** ***生命周期end*****/
</script>

<style scoped lang="less">
.privacy-page {
  .privacy-header {
    :deep(.title) {
      color: var(--adm-color-textLv1);
      font-weight: 600;
    }
  }

  main {
    padding: 12px 16px;
    .items {
      margin-bottom: 12px;
    }
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
