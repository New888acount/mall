<template>
  <MyPopup
    v-model="show"
    :closeShow="false"
    @close="unMountComponent"
    position="top"
    :zIndex="getMaxZIndex() + 1000"
    overlayClass="my__quickmenu--overlay"
    class="my__quickmenu"
  >
    <div class="content">
      <p class="title">{{ $t('quick.title') }}</p>

      <div class="quick-list">
        <div class="quick-item" v-for="item in quickList" :key="item.name" @click="item.fn">
          <div class="icon">
            <i :class="['iconfont', item.icon]"></i>
          </div>
          <p>{{ item.text }}</p>
        </div>
        <!-- <div class="quick-item" @click="gotosearch" >
          <div class="icon">
            <i class="iconfont icon-sousuo"></i>
          </div>

          <p>搜索</p> -->
        <!-- </div> -->
      </div>
    </div>
  </MyPopup>
</template>

<script setup>
/** ***引入相关包start*****/
import MyPopup from '@/components/MyPopup/index.vue'
import router from '@/router/index.js'
import { getMaxZIndex } from '@/utils/index'
import { defineExpose, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import quickmenu from './index.js'

/** ***引入相关包end*****/

/** ***ref、reactive、props，等……start*****/
const show = ref(false)
const { t } = useI18n()

const quickList = [
  {
    text: t('quick.tab1'),
    name: 'home',
    value: 'home',
    icon: 'icon-home',
    fn: () => {
      router.push('/')
      close()
    },
  },
  {
    text: t('quick.tab2'),
    name: 'sousuo',
    value: 'sousuo',
    icon: 'icon-sousuo',
    fn: () => {
      router.push('/search')
      close()
    },
  },
]
defineExpose({
  show,
})

/** ***ref、reactive、props，等……end*****/

/** ***函数 start*****/
const gotohome = () => {
  router.push('/')
  close()
}
//关闭
const close = () => {
  show.value = false
  unMountComponent()
}
// 销毁组件
const unMountComponent = () => {
  quickmenu({ type: 'unmount' })
}

/** ***函数 end*****/

/** ***生命周期start*****/
onMounted(() => {})
/** ***生命周期end*****/
</script>

<style lang="less">
.my__quickmenu {
  &.my-popup {
    border-radius: 0 0 20px 20px;
    background-color: rgb(240, 240, 240);
    .my-popup__container {
      background: transparent;
      border-radius: 0;
      box-shadow: none;
    }
    .content {
      padding: 10px 15px 8px;
      box-shadow: 0px 4px 4px 0px rgba(20, 20, 20, 0.5);
      .title {
        font-size: 18px;
        font-weight: bold;
        color: #333333;
        margin-bottom: 17px;
      }

      .quick-list {
        display: flex;
        align-items: center;

        .quick-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 15px;
          font-size: 14px;

          .icon {
            width: 52px;
            height: 52px;
            background: #ffffff;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
            i {
              font-size: 38px;
              text-align: center;
              line-height: 35px;
            }
          }
        }
      }
    }
  }
}
</style>
