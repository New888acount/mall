<template>
  <div class="login-page">
    <van-form @submit="onSubmit" @failed="onFailed">
      <van-cell-group inset>
        <van-field
          v-model="formState.username"
          name="username"
          :label="$t('login.page.username')"
          :placeholder="$t('login.page.username.placeholder')"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="formState.password"
          type="password"
          name="password"
          :label="$t('login.page.password')"
          :placeholder="$t('login.page.password.placeholder')"
          :rules="rulesLogin.password"
        />
        <van-field
          v-model="formState.code"
          type="text"
          name="code"
          :label="$t('login.page.code')"
          :placeholder="$t('login.page.code.placeholder')"
        >
          <template #button>
            <div class="captcha-container">
              <!-- 显示验证码图片 -->
              <MyImage
                :src="captchaSrc"
                style="height: 32px; cursor: pointer"
                :alt="$t('login.page.getCode')"
                @click="refreshCaptcha"
                v-if="!codeLoading"
              ></MyImage>
              <MyLoading v-else style="height: 32px"></MyLoading>
            </div>
          </template>
        </van-field>
      </van-cell-group>

      <van-button
        round
        block
        type="primary"
        v-loading="isLoading"
        class="default-btn submit-button"
        native-type="submit"
      >
        {{ $t('login.page.submit') }}
      </van-button>
    </van-form>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { h, ref, defineProps, reactive, onMounted, defineEmits, onUnmounted, watch } from 'vue'
import useUserInfoStore from '@/store/modules/userInfo'
// import useLocalCache from '@/hooks/storage/localStorage'
import { useI18n } from 'vue-i18n'
import { getCodeApi } from '@/api/user'
import { getEncryptPwd } from '@/utils/encipher'

/** ***引入相关包end*****/

/** ***ref、reactive，等……start*****/
const { t } = useI18n()
// 请求 加载
const isLoading = ref(false)
const codeLoading = ref(false)

// 用户信息
const userInfoStore = useUserInfoStore()
// props 关闭弹出方法
const props = defineProps({
  callback: {
    type: Function, // 成功回调
    default: null,
  },
  resolve: Function,
  reject: Function,
  visible: Boolean, // 父组件传下来的 show
})
// 监听父组件的关闭
watch(
  () => props.visible,
  (val) => {
    if (!val) {
      // 弹窗关闭时清空表单
      formState.username = ''
      formState.password = ''
      formState.code = ''
      formState.uuid = ''
    }
  }
)
// 表单实例
const captchaSrc = ref('')

// 表单数据
const formState = reactive({
  username: '',
  password: '',
  uuid: '',
  code: '',
})

// 登录
const validateCustomName = (value) => {
  const prefix = value.split('@')[0]
  const suffix = value.split('@')[1]
  if (!value) {
    return t('loginAndRegister.CustomName.tips1')
  } else if (value.indexOf('@') === -1) {
    return t('loginAndRegister.CustomName.tips2')
  }
}
// 密码
const validatePassword = async (value) => {
  const reg = /(^[0-9]*$|^[A-Za-z]+$)/
  const reg1 = /^[A-Za-z0-9]+$/
  const reg2 = /(?=.*[0-9])(?=.*[a-zA-Z])/
  if (!value) {
    return t('loginAndRegister.Password.tips1')
  } else if (value.length < 6 || value.length > 18) {
    return t('loginAndRegister.Password.tips2')
  }
}

const rulesLogin = {
  username: [
    {
      required: true,
      message: t('loginAndRegister.CustomName.tips3'),
      validator: validateCustomName,
    },
  ],
  password: [
    { required: true, message: t('loginAndRegister.Password.tips3'), trigger: 'onBlur' },
    { validator: validatePassword, trigger: 'onBlur' },
  ],
}
/** ***ref、reactive，等……end*****/

/** ***函数 start*****/
const refreshCaptcha = async () => {
  codeLoading.value = true
  try {
    const { data } = await getCodeApi()
    captchaSrc.value = `data:image/png;base64,${data.img}`
    formState.uuid = data.uuid
  } catch (err) {
    console.error(err)
  } finally {
    codeLoading.value = false
  }
}

const onSubmit = async (values) => {
  isLoading.value = true

  try {
    const res = await userInfoStore.loginApiFun({
      code: values.code,
      uuid: formState.uuid,
      username: values.username,
      password: getEncryptPwd(formState.password),
    })

    if (res.code === 200) {
      // 登录成功
      props.callback && props.callback(res)
    } else {
      // 登录失败（验证码错误、过期、账号密码错误等）
      refreshCaptcha()
    }
  } catch (error) {
    refreshCaptcha()
  } finally {
    isLoading.value = false
  }
}
const onFailed = (errorInfo) => {
  console.log('failed', errorInfo)
}
/** ***函数 end*****/

/** ***生命周期start*****/
onMounted(() => {
  refreshCaptcha()
})

onUnmounted(() => {
  formState.username = ''
  formState.password = ''
})
/** ***生命周期end*****/
</script>
<style lang="less" scoped>
.login-page {
  .captcha-container {
    height: 32px;
    width: 86px;
    text-align: center;
  }
}
</style>
