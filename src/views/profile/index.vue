<template>
  <div class="profile">
    <div class="profile-info" @click="gotoLogin">
      <img src="" alt="" />
      <p>{{ userInfoStore?.userInfo?.nickname || '用户名' }}</p>
    </div>
    <div class="profile-order">
      <div v-for="item in orderNav" :key="item.name" @click="orderTabSwitch(item)">
        <i :class="['iconfont', item.icon]" :style="{ color: item?.iconColor }">
          <van-badge :content="numData[item.name]" v-if="numData[item.name]"></van-badge>
        </i>
        <p>{{ item.text }}</p>
      </div>
    </div>

    <div class="profile-list">
      <!-- <div> -->

      <div v-for="item in profileList" :key="item.name" @click="item.fn" class="list-item">
        <div v-show="item?.loginShow">
          <i :class="['iconfont', item.icon]" :style="{ color: item?.iconColor }"></i>
          <p>{{ item.text }}</p>
        </div>
      </div>
      <!-- </div> -->
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
import { ref, onMounted, computed } from 'vue'
import router from '@/router'
import gotoLogin from '@/componentsFun/login/index'
import MyPopup from '@/components/MyPopup/index.vue'
import useLocalCache from '@/hooks/storage/localStorage'
import useUserInfoStore from '@/store/userInfo'
import i18n from '@/i18n/index'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const { setLanguage, getLanguage } = useLocalCache()
const t = i18n.global.t
const { getCacheToken } = useLocalCache()

// 用户信息
const userInfoStore = useUserInfoStore()
const orderNav = [
  {
    text: t('order.tab1'),
    name: 'unpaid',
    value: 1,
    icon: 'icon-qianbao',
  },
  {
    text: t('order.tab2'),
    name: 'nosend',
    value: 2,
    icon: 'icon-liuyan',
  },
  {
    text: t('order.tab3'),
    name: 'noget',
    value: 3,
    icon: 'icon-daishouhuo',
  },
  // {
  //   text: t('order.tab4'),
  //   name: 'aftersale',
  //   value: 4,
  //   icon: 'icon-chaoliu-wodedingdan-shouhoutuikuan',
  // },
  {
    text: t('order.tab5'),
    name: 0,
    value: 0,
    icon: 'icon-dingdan',
    iconColor: 'var(--color-light)',
  },
]

const profileList = [
  {
    text: t('profile.tab1'),
    name: 'Clear cache',
    value: 'Clear cache',
    icon: 'icon-shezhi',
    iconColor: '#5da4f6',
    loginShow: true,
  },
  {
    text: t('profile.tab2'),
    name: 'Shipping address',
    value: 'Shipping address',
    icon: 'icon-shouhuodizhi1',
    iconColor: '#ff6699',
    loginShow: true,
    fn: () => {
      router.push({
        path: '/address/list',
      })
    },
  },
  {
    text: t('profile.tab3'),
    name: 'Language settings',
    value: 'Language settings',
    icon: 'icon-yuyanshezhi',
    iconColor: '#4059ff',
    loginShow: true,
    fn: () => {
      showPicker.value = true
    },
  },
  {
    text: t('profile.tab4'),
    name: 'Log out',
    value: 'Log out',
    icon: 'icon-tuichudenglu',
    iconColor: '#57c7f2',
    fn: () => {
      userInfoStore.removeToken()
    },
    get loginShow() {
      return !!userInfoStore.token
    },
  },
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
.profile {
  background: #f6f6f6;
  .profile-info {
    display: flex;
    align-items: center;
    background: url('@/assets/images/profile.png') center top / 100% no-repeat rgb(246, 246, 246);
    padding: 70px 0 10px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50px;
      margin: 25px 18px 10px;
    }
  }

  .profile-order {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px;
    background: #fff;
    border-radius: 8px;

    div {
      flex: 1;
      height: 80px;
      font-size: 12px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-direction: column;
      padding: 10px 0;
    }

    i {
      font-size: 25px;
      position: relative;
      .van-badge {
        position: absolute;
        width: 15px;
        height: 15px;
        font-size: 13px;
        padding: 0;
      }
    }
  }

  .profile-list {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px;
    background: #fff;
    border-radius: 8px;
    .list-item {
      flex: 1;
      // height: 80px;
      font-size: 12px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-direction: column;
      padding: 10px 0;
    }

    i {
      font-size: 25px;
    }
    p {
      font-size: 14px;
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
