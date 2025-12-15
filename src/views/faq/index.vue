<template>
  <div class="faq-page" v-loading="isLoading">
    <MobileHeader :leftText="$t('faq')" class="faq-header" :backicon="true"></MobileHeader>

    <div class="faq-list">
      <a-collapse class="my-collapse faq-item" v-model:activeKey="showVipListFlag" v-if="list?.length">
        <a-collapse-panel :show-arrow="false" v-for="(item, index) in list" :key="index">
          <template #header>
            <div class="item-title">
              <h1>{{ item.title }}</h1>
              <i class="iconfont icon-arrow_s"></i>
            </div>
          </template>
          <div class="item-text" v-html="item?.content"></div>
        </a-collapse-panel>
      </a-collapse>

      <MyEmptyData v-else-if="!list?.length && !isLoading" />
    </div>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { ref, onMounted } from 'vue'
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import { getFaqApi } from '@/api/common'
import MyEmptyData from '@/components/MyEmptyData'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const showVipListFlag = ref([])
const list = ref([])
const isLoading = ref(false)
/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
const getFaq = async () => {
  isLoading.value = true
  try {
    const { data } = await getFaqApi()
    console.log(data)
    list.value = data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(async () => {
  await getFaq()
})
/** ***生命周期end*****/
</script>

<style scoped lang="less">
.faq-page {
  .faq-header {
    :deep(.title) {
      color: var(--adm-color-textLv1);
      font-weight: 600;
    }
  }

  .faq-list {
    padding: 8px;

    .faq-item {
      margin-bottom: 10px;
      color: var(--adm-color-textLv1);
      .item-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        padding: 10px 0;
        .iconfont {
          transform: rotate(90deg);
        }
      }
      .item-text {
        font-size: 16px;
        color: var(--adm-color-textlv2);
      }
    }

    .my-collapse {
      border: none;
      background: transparent;
      :deep(.ant-collapse-item) {
        border: none;
        margin-bottom: 10px;
        border-radius: 5px;
        &:last-child {
          margin-bottom: 0;
        }

        &.ant-collapse-item-active {
          .ant-collapse-header {
            border-radius: 5px 5px 0px 0px;
            background: var(--adm-color-light);
            h1 {
              color: var(--adm-color-primary);
              font-weight: 700;
            }
          }

          .iconfont {
            transform: rotate(-90deg);
            transition: 0.3s;
          }
        }

        .ant-collapse-header {
          padding: 0px 15px;
          background: rgba(237, 237, 237, 0.4);
          border-radius: 5px;
        }

        .ant-collapse-content {
          border-radius: 0px 0px 5px 5px;
          border: 0.5px solid var(--adm-color-light);
          border-top: none;
          background: rgba(237, 237, 237, 0.4);

          .ant-collapse-content-box {
            padding: 8px 15px;
          }
        }
      }

      .my-collapse_header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 3px 0;
        line-height: 35px;
        h1 {
          color: var(--adm-color-light);
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }

        .iconfont {
          color: var(--adm-color-textLv1);
          font-size: 6px;
          font-style: normal;
          font-weight: 700;
        }
      }

      .my-collapse_content {
        .content-item {
          color: var(--adm-color-light);
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }
    }
  }
}
</style>
