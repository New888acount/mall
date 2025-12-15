<template>
  <div class="register-page">
    <van-form @submit="handleFinish" @failed="onFailed">
      <van-cell-group inset>
        <van-field
          v-model="formState.username"
          name="username"
          :label="$t('login.page.username')"
          :placeholder="$t('login.page.username.placeholder')"
          :rules="rulesRegister.username"
        />
        <van-field
          v-model="formState.password"
          type="password"
          name="password"
          :label="$t('login.page.password')"
          :placeholder="$t('login.page.password.placeholder')"
          :rules="rulesRegister.password"
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
      <van-button round block type="primary" class="default-btn submit-button" native-type="submit">
        {{ $t('login.page.submit') }}
      </van-button>
    </van-form>
  </div>
</template>
<script setup lang="jsx">
/** ***引入相关包start*****/
import useUserInfoStore from '@/store/modules/userInfo'
import { h, ref, defineProps, reactive, defineEmits, onMounted } from 'vue'
// 加密、
import { getEncryptPwd } from '@/utils/encipher'
import { useI18n } from 'vue-i18n'
import { myWindowOpen } from '@/utils'
import { getCodeApi } from '@/api/user'

/** ***引入相关包end*****/

/** ***ref、reactive，等……start*****/
const { t } = useI18n()
// 注册请求 加载
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
})

const formState = reactive({
  username: '',
  password: '',
  uuid: '',
  code: '',
})
const captchaSrc = ref('')

// 注册
const validateCustomName = (value) => {
  const prefix = value.split('@')[0]
  const suffix = value.split('@')[1]
  if (!value) {
    return '请输入您的电子邮件地址'
  } else if (value.indexOf('@') === -1) {
    return '* 输入您的电子邮件地址'
  }
}
// 密码
const validatePassword = async (value) => {
  const reg = /(^[0-9]*$|^[A-Za-z]+$)/
  const reg1 = /^[A-Za-z0-9]+$/
  const reg2 = /(?=.*[0-9])(?=.*[a-zA-Z])/
  if (!value) {
    return '请输入密码'
  } else if (value.length < 6 || value.length > 18) {
    return '* 密码格式不正确'
  }
}
const rulesRegister = {
  username: [
    {
      required: true,
      message: '请填写邮箱',
    },
    { validator: validateCustomName, trigger: 'onBlur' },
  ],
  password: [
    { required: true, message: '请填写密码', trigger: 'onBlur' },
    { validator: validatePassword, trigger: 'onBlur' },
  ],
}

/** ***ref、reactive，等……end*****/

/** ***函数 start*****/
// 获取验证码图片
const refreshCaptcha = async () => {
  codeLoading.value = true
  try {
    const { data } = await getCodeApi()
    captchaSrc.value = `data:image/png;base64,${data.img}`
    // 如果需要保存 uuid，用来提交时校验
    formState.uuid = data.uuid
  } catch (err) {
    console.error('获取验证码失败', err)
  } finally {
    codeLoading.value = false
  }
}

// 提交注册
const handleFinish = async () => {
  isLoading.value = true
  try {
    const registerParams = {
      ...formState,
      // phoneCode: formState.phone ? phoneCode.value : '',
      // encryptPwd: getEncryptPwd(formState.password),
      password: getEncryptPwd(formState.password),
      // encryptPwd: formState.password,
    }
    // 密码加密，不需要原来的password字段
    // delete registerParams.password
    const res = await userInfoStore.registerApiFun(registerParams)

    if (res.code != 200) {
      refreshCaptcha()
    }

    isLoading.value = false
    props.callback && props.callback(res)
  } catch (error) {
    if (error.msg === '验证码错误.') {
      refreshCaptcha()
    }
    isLoading.value = false
    // getCode()
  }
}

const onFailed = (errorInfo) => {
  console.log('failed', errorInfo)
}

/** ***函数 end*****/

/** ***生命周期start*****/
onMounted(async () => {
  refreshCaptcha()
  // await getCode()
})

/** ***生命周期end*****/
</script>
<style lang="less" scoped>
.register-page {
  .captcha-container {
    height: 32px;
    width: 86px;
    text-align: center;
  }
}
</style>
