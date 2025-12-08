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
    icon: 'icon-shouye1',
    to: '/home',
    bgClass: 'home',
    fn: () => {
      router.push('/home')
    },
  },
  //   {
  //     name: '分类',
  //     to: '/activity',
  //     icon: 'icon-Categories',
  //     iconTransformClass: 'icon-rotate',
  //     bgClass: 'activity',
  //     fn: () => {
  //       router.push('/activity')
  //     },
  //   },
  {
    name: t('tabList.tab2'),
    // iconImg: require('@/assets/images/tabbar/wallet.gif'),
    icon: 'icon-gouwudai',
    to: '/cart',
    tabClass: 'tab-active',
    bgClass: 'cart',
    fn: () => {
      router.push({
        path: '/cart',
      })
    },
  },
  {
    name: t('tabList.tab3'),
    icon: 'icon-wode3',
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
  left: 50%;
  transform: translateX(-50%); /* 保证居中 */
  width: 100%;
  max-width: 375px; /* 跟 app 一样宽 */
  :deep(.van-tabbar) {
    border-top: 1px solid #f4f4f4;
    background: #fff;
    box-shadow: 0 -1px 1px 0 rgba(130, 160, 149, 0.2);
  }
}
.tabbar-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #9d9ea2;
  .iconfont {
    font-size: 20px;
  }

  .icon-gouwudai,
  .icon-wode3 {
    font-size: 24px;
  }

  span {
    font-size: 11px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 16.5px */
  }
}

.active {
  color: #fe771c;
}
</style>
