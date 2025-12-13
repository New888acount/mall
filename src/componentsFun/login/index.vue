<template>
  <MyPopup
    v-model="show"
    :closeShow="false"
    @close="unMountComponent"
    position="bottom"
    :zIndex="getMaxZIndex() + 1000"
    overlayClass="my__login-register--overlay"
    class="my__login-register"
  >
    <div class="content">
      <van-tabs v-model:active="active" color="var(--color-light)">
        <van-tab :title="item.title" v-for="item in tabsList" :key="item.name">
          <component
            class="login-register-container"
            :is="item.com"
            :callback="handleLoginSuccess"
            :key="active + '-' + item.name"
          />
        </van-tab>
      </van-tabs>
    </div>
  </MyPopup>
</template>

<script setup>
/** ***引入相关包start*****/
import MyPopup from '@/components/MyPopup/index.vue'
import { getMaxZIndex } from '@/utils/index'
import { defineExpose, defineProps, onMounted, reactive, ref, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import Login from './components/Login/index.vue'
import Register from './components/Register/index.vue'
import msgTaost from './index.js'

/** ***引入相关包end*****/

/** ***ref、reactive、props，等……start*****/
const show = ref(false)
const active = ref('login')
const { t } = useI18n()

const props = defineProps({
  resolve: Function,
  reject: Function,
  show: {
    type: Boolean,
    default: false,
  },
  callback: Function,
})
defineExpose({
  show,
})

const tabsList = reactive([
  {
    com: shallowRef(Login),
    title: t('login.page.tab1'),
    id: '1',
    iconClass: 'icon-denglu',
  },
  { com: shallowRef(Register), title: t('login.page.tab2'), id: '0', iconClass: 'icon-zhucetianjiahaoyou' },
])
/** ***ref、reactive、props，等……end*****/

/** ***函数 start*****/

//关闭
const close = () => {
  show.value = false
  // active.value = 'login' // 关闭时重置到登录页
  unMountComponent()
}
// 销毁组件
const unMountComponent = () => {
  msgTaost({ type: 'unmount' })
}
const handleLoginSuccess = (res) => {
  // 登录成功逻辑
  close()
  props.resolve && props.resolve(res) // ✅ 通知路由守卫登录成功
}
/** ***函数 end*****/

/** ***生命周期start*****/
onMounted(() => {})

// 监听显示的消失，需要移除dom

/** ***生命周期end*****/
</script>

<style lang="less">
.my__login-register {
  &.my-popup {
    padding: 25px 0px;
    min-height: 400px;
    border-radius: 20px 20px 0 0;
    .my-popup__container {
      background: transparent;
      border-radius: 0;
      box-shadow: none;
    }
    .content {
      .van-tab {
        font-size: 16px;
      }

      .van-form {
        .van-cell {
          padding: 10px 16px;

          .van-field__error-message {
            font-size: 12px;
            line-height: 12px;
          }
        }

        .submit-button {
          position: fixed;
          bottom: 20px;
          width: 90%;
          left: 50%;
          transform: translate(-50%);
          background: #fff;
          border: 0;
          height: 50px;
          .van-button__text {
            border-radius: 24px;
            line-height: 50px;
            text-align: center;
            font-size: 20px;
            font-weight: 500;
            color: #fff;
            width: 100%;
            background: linear-gradient(90deg, var(--color-light), rgba(255, 96, 0, 0.6));
            margin-bottom: 10px;
            box-shadow: 0 2.8px 7px rgba(255, 96, 0, 0.45);
          }

          .submit-loading {
            height: 50px;
            .loader {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
