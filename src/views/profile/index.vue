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
      <div class="order-item" v-for="(item, index) in orderNav" :key="item.name" @click="orderTabSwitch(item)">
        <i :class="['iconfont', item.icon]">
          <van-badge :content="numData[item.name]" v-if="numData[item.name]"></van-badge>
          <svg
            v-if="!index && numData[item.name]"
            class="icon-cicle"
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="6"
            viewBox="0 0 11 6"
            fill="none"
          >
            <path d="M0 0H11L0 6V0Z" fill="#459675" />
          </svg>
        </i>
        <p>{{ item.text }}</p>
      </div>
    </div>

    <div class="profile-list">
      <div v-for="item in profileList" :key="item.text" @click="item.fn" class="list-item">
        <div class="left" v-if="item.loginShow">
          <i :class="['iconfont', item.icon]"></i>
          <p>{{ item.text }}</p>
        </div>
        <div class="right" v-if="item.loginShow">
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
import { getLanguagesListApi } from '@/api/user'
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
    icon: 'icon-collect',
    loginShow: true,
    fn: () => {
      console.log('我的收藏')
    },
  },
  {
    text: t('profile.tab2'),
    icon: 'icon-Feedback',
    loginShow: true,
    fn: () => {
      console.log('意见反馈')
    },
  },
  {
    text: t('profile.tab3'),
    icon: 'icon-FAQ',
    loginShow: true,
    fn: () => {
      console.log('常见问题')
    },
  },
  {
    text: t('profile.tab4'),
    icon: 'icon-Address',
    loginShow: true,
    fn: () => {
      router.push({
        path: '/address/list',
      })
    },
  },
  {
    text: t('profile.tab5'),
    icon: 'icon-support',
    loginShow: true,
    fn: () => {
      console.log('联系客服')
    },
  },
  {
    text: t('profile.tab6'),
    icon: 'icon-About',
    loginShow: true,
    fn: () => {
      console.log('关于我们')
    },
  },
  {
    text: t('profile.tab7'),
    icon: 'icon-Policy',
    loginShow: true,
    fn: () => {
      console.log('隐私协议')
    },
  },
  {
    text: t('profile.tab8'),
    icon: 'icon-Language',
    rightText: getLanguage()?.toUpperCase(),
    loginShow: true,
    fn: async () => {
      await getLanguagesList()
    },
  },
  {
    text: t('profile.tab9'),
    icon: 'icon-tuichudenglu',
    loginShow: true,
    fn: () => {
      userInfoStore.removeToken()
    },
    get loginShow() {
      return !!userInfoStore.token
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
const columns = ref([])
const showPicker = ref(false)
const currentLang = ref([getLanguage() || 'zh'])
const numData = computed(() => userInfoStore.numData)

// console.log(numData, 'numData')
/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
// tab 切换事件
const orderTabSwitch = (item) => {
  router.push({
    path: '/order',
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

const getLanguagesList = async () => {
  try {
    const { data } = await getLanguagesListApi()
    columns.value = data.map((item) => {
      item.text = item.name
      item.value = item.code
      return item
    })
    console.log(data)
  } catch (error) {
    console.log(error)
  } finally {
    showPicker.value = true
  }
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
        padding: 2px 4px;
        height: 20px;
        color: var(--adm-color-white);
        font-family: Roboto;
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        background: var(--adm-color-primary);
        border-radius: 0;
      }

      .icon-cicle {
        position: absolute;
        top: 9px;
        left: 69%;
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
