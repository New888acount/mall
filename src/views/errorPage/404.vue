<template>
  <div class="norem err404-module">
    <img :src="require(`@/assets/images/page-empty.png`)" alt="404" />
    <!-- <i18n-t keypath="activity.sign.title2" :plural="state.infoData.reward">
      <template #money>
        <strong>{{ moneyFormat(state.infoData.reward) }}</strong>
      </template>
    </i18n-t> -->
    <div>
      {{ $t('error.tip') }}
      <a href="/home">{{ $t('error.back') }}</a>
    </div>
  </div>
</template>
<script setup>
import router from '@/router'
// import useAppStore from '@/store/modules/app'
import { onMounted, onUnmounted, reactive } from 'vue'

const data = reactive({
  time: 2, // 2s后返回首页
  timer: null, // 定时器
})

// const appStore = useAppStore()
// 跳转到首页
const handleToHome = () => {
  router.push('/home')
}
// 2s后返回首页
const init = () => {
  data.timer = setInterval(() => {
    if (data.time < 1) {
      handleToHome()
      clearInterval(data.timer)
      data.timer = null
    } else {
      data.time--
    }
  }, 1000)
}
// 组件加载
onMounted(() => {
  init()
})
// 组件卸载，清除定时器
onUnmounted(() => {
  if (data.timer) {
    clearInterval(data.timer)
    data.timer = null
  }
})
</script>
<style scoped lang="less">
.norem.err404-module {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #97a8c7;
  text-align: center;
  font-size: 20px;
  img {
    max-height: 100%;
    max-width: 100%;
  }
  a {
    color: #ff7300;
  }
}
.err404-module {
  width: 335px;
  height: 265px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #97a8c7;
  text-align: center;
  font-size: 20px;
  img {
    width: 100%;
  }
  a {
    display: block;
    color: #ff7300;
  }
}
</style>
