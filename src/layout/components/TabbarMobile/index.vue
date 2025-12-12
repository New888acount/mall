<template>
  <div class="tabbar">
    <van-tabbar v-model="active">
      <van-tabbar-item v-for="item in tabList" :key="item.name" :name="item.bgClass" @click="item.fn">
        <template #icon="props">
          <div class="tabbar-item">
            <i :class="[item.icon, 'iconfont', props.active ? 'active' : '']"></i>
            <span :class="props.active ? 'active' : ''">{{ item.name }}</span>
          </div>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import router from '@/router'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
/** ***引入相关包end*****/

/** ***ref、reactive、props，等……start*****/
const { t } = useI18n()
const active = ref('home')

const route = useRoute()
const tabList = [
  {
    name: t('tabList.tab1'),
    icon: 'icon-home1',
    to: '/home',
    bgClass: 'home',
    fn: () => {
      router.push('/home')
    },
  },
  {
    name: '订单',
    to: '/order',
    icon: 'icon-Orders',
    bgClass: 'order',
    fn: () => {
      router.push('/order/list?type=0')
    },
  },
  {
    name: t('tabList.tab2'),
    icon: 'icon-cart',
    to: '/cart',
    bgClass: 'cart',
    fn: () => {
      router.push({
        path: '/cart',
      })
    },
  },
  {
    name: t('tabList.tab3'),
    icon: 'icon-mine',
    to: '/profile',
    bgClass: 'profile',
    fn: () => {
      router.push({
        path: '/profile',
      })
    },
  },
]

/** ***ref、reactive、props，等……end*****/

/** ***函数 start*****/

/** ***函数 end*****/

/** ***生命周期start*****/
onMounted(() => {})

// 监听路由改变
watch(
  () => router.currentRoute.value,
  (newValue) => {
    active.value = route.name
  },
  { immediate: true }
)
/** ***生命周期end*****/
</script>
<script>
export default {
  name: 'TabbarMobile',
}
</script>
<style scoped lang="less">
.tabbar {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 56px;
  z-index: 10;
  :deep(.van-tabbar) {
    border-top: 0.5px solid var(--, #ededed);
    background: var(--adm-bg-white);
  }
}
.tabbar-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: var(--color-textlv2);
  .iconfont {
    font-size: 24px;
  }

  span {
    margin-top: 4px;
    font-family: Roboto;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
}

.active {
  color: var(--adm-color-textLv1);
}
</style>
