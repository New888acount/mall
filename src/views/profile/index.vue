<template>
  <div class="profile-page">
    <div class="profile-info" @click="gotoLogin">
      <MyImage
        :src="
          userInfoStore.token
            ? userInfoStore.userInfo?.avatar
              ? $imgBaseUrl + userInfoStore.userInfo?.avatar
              : require('@/assets/images/mine/default-avatar.png')
            : require('@/assets/images/mine/no-login.png')
        "
        alt=""
        fit="initial"
        class="profile-img"
        :class="{
          'login-avatar': userInfoStore.token,
        }"
      ></MyImage>

      <div class="user-name">
        <div class="nickname">{{ userInfoStore?.userInfo?.nickname || $t('profile.username') }}</div>
        <div v-if="userInfoStore.token" class="number">账号/ID: {{ userInfoStore?.userInfo?.id }}</div>
      </div>

      <div class="code-icon">
        <i class="iconfont icon-QR"></i>
      </div>
    </div>
    <div class="profile-order">
      <div class="order-item" v-for="item in orderNav" :key="item.name" @click="orderTabSwitch(item)">
        <i :class="['iconfont', item.icon]">
          <van-badge :content="numData[item.name]" v-if="numData[item.name]"></van-badge>
        </i>
        <p>{{ item.text }}</p>
      </div>
    </div>

    <div class="profile-list">
      <div v-for="item in profileList" :key="item.name" @click="item.fn" class="list-item">
        <div class="left">
          <i :class="['iconfont', item.icon]"></i>
          <p>{{ item.text }}</p>
        </div>
        <div class="right">
          <p v-if="item.rightText">{{ item.rightText }}</p>
          <i class="iconfont icon-arrow_s"></i>
        </div>
      </div>
    </div>
  </div>

  <!-- 底部弹出 Picker -->
  <MyPopup v-model="showPicker" position="bottom" class="my__language">
    <van-picker
      :title="$t('selectlanguage.title')"
      :columns="columns"
      @confirm="onConfirm"
      @cancel="onCancel"
      @change="onChange"
      v-model="currentLang"
    />
  </MyPopup>
</template>

<script setup>
/** ***引入相关包start*****/
import MyPopup from '@/components/MyPopup/index.vue'
import gotoLogin from '@/componentsFun/login/index'
import useLocalCache from '@/hooks/storage/localStorage'
import router from '@/router'
import useUserInfoStore from '@/store/modules/userInfo'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const { setLanguage, getLanguage } = useLocalCache()
const { t } = useI18n()
const { getCacheToken, clearCache } = useLocalCache()

// 用户信息
const userInfoStore = useUserInfoStore()
const orderNav = [
  {
    text: t('order.tab1'),
    name: 'unpaid',
    value: 1,
    icon: 'icon-unpaid',
  },
  {
    text: t('order.tab2'),
    name: 'nosend',
    value: 2,
    icon: 'icon-Shipment',
  },
  {
    text: t('order.tab3'),
    name: 'noget',
    value: 3,
    icon: 'icon-a-InTransit',
  },
  // {
  //   text: t('order.tab4'),
  //   name: 'aftersale',
  //   value: 4,
  //   icon: 'icon-After-Sales',
  // },
  {
    text: t('order.tab5'),
    name: 0,
    value: 0,
    icon: 'icon-Orders',
  },
]

const profileList = [
  {
    text: t('profile.tab1'),
    name: 'Clear cache',
    value: 'Clear cache',
    icon: 'icon-collect',
    fn: () => {
      console.log('我的收藏')
    },
  },
  {
    text: t('profile.tab2'),
    name: 'Clear cache',
    value: 'Clear cache',
    icon: 'icon-Feedback',
    fn: () => {
      console.log('意见反馈')
    },
  },
  {
    text: t('profile.tab3'),
    name: 'Clear cache',
    value: 'Clear cache',
    icon: 'icon-FAQ',
    fn: () => {
      console.log('常见问题')
    },
  },
  {
    text: t('profile.tab4'),
    name: 'Clear cache',
    value: 'Clear cache',
    icon: 'icon-Address',
    fn: () => {
      router.push({
        path: '/address/list',
      })
    },
  },
  {
    text: t('profile.tab5'),
    name: 'Clear cache',
    value: 'Clear cache',
    icon: 'icon-support',
    fn: () => {
      console.log('联系客服')
    },
  },
  {
    text: t('profile.tab6'),
    name: 'Clear cache',
    value: 'Clear cache',
    icon: 'icon-About',
    fn: () => {
      console.log('关于我们')
    },
  },
  {
    text: t('profile.tab7'),
    name: 'Clear cache',
    value: 'Clear cache',
    icon: 'icon-Policy',
    fn: () => {
      console.log('隐私协议')
    },
  },
  {
    text: t('profile.tab8'),
    name: 'Language settings',
    value: 'Language settings',
    icon: 'icon-Language',
    rightText: 'EN',
    fn: () => {
      showPicker.value = true
    },
  },

  // {
  //   text: t('profile.tab1'),
  //   name: 'Clear cache',
  //   value: 'Clear cache',
  //   icon: 'icon-shezhi',
  //   loginShow: true,
  //   fn: () => {
  //     clearCache()
  //     window.location.reload()
  //   },
  // },
  // {
  //   text: t('profile.tab2'),
  //   name: 'Shipping address',
  //   value: 'Shipping address',
  //   icon: 'icon-shouhuodizhi1',
  //   loginShow: true,
  //   fn: () => {
  //     router.push({
  //       path: '/address/list',
  //     })
  //   },
  // },
  // {
  //   text: t('profile.tab3'),
  //   name: 'Language settings',
  //   value: 'Language settings',
  //   icon: 'icon-yuyanshezhi',
  //   loginShow: true,
  //   fn: () => {
  //     showPicker.value = true
  //   },
  // },
  // {
  //   text: t('profile.tab9'),
  //   name: 'Log out',
  //   value: 'Log out',
  //   icon: 'icon-tuichudenglu',
  //   fn: () => {
  //     userInfoStore.removeToken()
  //   },
  //   get loginShow() {
  //     return !!userInfoStore.token
  //   },
  // },
]
// 语言选项
const columns = [
  { text: '中文（简体）', value: 'zh-CN' },
  { text: 'English', value: 'en-US' },
]
const showPicker = ref(false)
const currentLang = ref([getLanguage() || 'zh-CN'])
const numData = computed(() => userInfoStore.numData)

// console.log(numData, 'numData')
/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
// tab 切换事件
const orderTabSwitch = (item) => {
  // 跳转到 /order/list，并带上当前 tab 参数
  router.push({
    path: '/order/list',
    query: { type: item.value },
  })
}
// 确认选择
const onConfirm = ({ selectedOptions }) => {
  const lang = selectedOptions[0].value
  currentLang.value = lang
  // console.log(lang,'lang')
  setLanguage(lang)
  showPicker.value = false
  // 如果部分文案不刷新，可以强制刷新页面
  location.reload()
}

// 取消选择
const onCancel = () => {
  showPicker.value = false
}

// 实时预览选中的语言
const onChange = ({ selectedOptions }) => {
  console.log('当前选择:', selectedOptions[0].text)
}
/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {
  getCacheToken() && userInfoStore.getCustomInfo()
})
/** ***生命周期end*****/
</script>

<style scoped lang="less">
.profile-page {
  padding-bottom: 64px;
  background: url('@/assets/images/mine/mine-bg.png') center top / 100% no-repeat var(--adm-bg-white);
  .profile-info {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 64px 24px 24px;
    .profile-img {
      margin-right: 12px;
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: #ededed;

      &.login-avatar {
        padding: 1px;
        border: 2px solid rgba(#459675, 0.2);
        :deep(img) {
          display: inline-flex;
          box-shadow: 0 4px 10px 0 rgba(69, 150, 117, 0.3);
        }
      }
    }

    .user-name {
      flex: 1;

      .nickname {
        overflow: hidden;
        color: var(--adm-color-textLv1);
        text-overflow: ellipsis;
        font-family: 'SF Pro';
        font-size: 18px;
        font-style: normal;
        font-weight: 590;
        line-height: 150%; /* 27px */
      }
      .number {
        margin-top: 4px;
        color: var(--color-textlv2);
        font-family: Roboto;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }

    .code-icon {
      .iconfont {
        font-size: 24px;
        color: var(--adm-color-dark);
        cursor: pointer;
      }
    }
  }

  .profile-order {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 12px 0;
    padding: 16px 8px;
    background: var(--adm-bg-white);

    .order-item {
      flex: 1;
      font-size: 12px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      align-self: stretch;
      flex-direction: column;
    }

    p {
      margin-top: 4px;
      color: var(--adm-color-textLv1);
      font-family: Roboto;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    i {
      color: var(--adm-color-textLv1);
      font-size: 24px;
      position: relative;
      .van-badge {
        position: absolute;
        width: 15px;
        height: 15px;
        font-size: 10px;
        padding: 0;
      }
    }
  }

  .profile-list {
    padding: 8px 16px;
    background: #fff;
    .list-item {
      flex: 1;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      cursor: pointer;
    }

    .left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: var(--adm-color-textLv1);
      font-family: Roboto;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      .iconfont {
        font-size: 24px;
        margin-right: 8px;
      }
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: var(--color-textlv2);
      font-family: Roboto;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      .iconfont {
        font-size: 16px;
        margin-left: 8px;
      }
    }
  }
}
</style>
<styel lang="less">
.my__language {
  &.my-popup {
    .my-popup__container {
      background: transparent;
      border-radius: 0;
      box-shadow: none;
    }
  }
}
</styel>
