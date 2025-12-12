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

      <van-button round block type="primary" class="submit-button" native-type="submit">
        <p v-if="!isLoading">
          {{ $t('login.page.submit') }}
        </p>
        <MyLoading v-else class="submit-loading" style="margin-left: 8px" />
      </van-button>
    </van-form>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { h, ref, defineProps, reactive, onMounted, defineEmits } from 'vue'
import useUserInfoStore from '@/store/userInfo'
// import useLocalCache from '@/hooks/storage/localStorage'
import { useI18n } from 'vue-i18n'
// import { getCodeApi } from '@/api/loginRegister/index'
// import { LoadingOutlined } from '@ant-design/icons-vue'
// import router from '@/router'
// import useCopyWriter from '@/store/modules/copywriter'
// import useAppStore from '@/store/modules/app.js'
// import { myWindowOpen } from '@/utils'
import { getCodeApi } from '@/api/user'
/** ***引入相关包end*****/

/** ***ref、reactive，等……start*****/
const { t } = useI18n()
// 请求 加载
const isLoading = ref(false)
const codeLoading = ref(false)

// const tearmService = copyWriter.copyWriterMap?.['tearm-service']?.langData[`${appStore.language}`][0].text
// const { getAccountInfo } = useLocalCache()
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

// 表单实例
// const formRef = ref()
// const imgLoading = ref(false)
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
    return '请输入您的电子邮件地址'
  } else if (value.indexOf('@') === -1) {
    return '* 输入您的电子邮件地址'
  }
  // else if (!prefix.length || !suffix.length) {
  //   return '输入您的电子邮件地址'
  // } else if (/[A-Z]/.test(value.slice(0, 1))) {
  //   return '小写首字母'
  // } else if (/[`~!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/.test(value)) {
  //   return '包含特殊字符'
  // }

  // else if (!(/\d/.test(prefix) && /[a-zA-Z]/.test(prefix)) && !/^[A-Za-z]*$/.test(prefix)) {
  //   return '数字和字母 | 字母'
  // }
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

  // else if (value.match(reg)) {
  //   checkedValue.value = 1
  //   return Promise.resolve()
  // } else if (value.match(reg1)) {
  //   checkedValue.value = 2
  //   return Promise.resolve()
  // } else if (value.match(reg2)) {
  //   checkedValue.value = 3
  //   return Promise.resolve()
  // } else {
  //   return Promise.resolve()
  // }
}

const rulesLogin = {
  username: [
    {
      required: true,
      message: 'Please input your name!',
      validator: validateCustomName,
    },
  ],
  password: [
    { required: true, message: '请填写密码', trigger: 'onBlur' },
    { validator: validatePassword, trigger: 'onBlur' },
  ],
}
/** ***ref、reactive，等……end*****/

/** ***函数 start*****/
const refreshCaptcha = async () => {
  codeLoading.value = true
  try {
    const { data } = await getCodeApi()
    // console.log(data)
    // 假设后端返回结构是 { uuid: '...', img: 'base64字符串' }
    captchaSrc.value = `data:image/png;base64,${data.img}`
    // 如果需要保存 uuid，用来提交时校验
    formState.uuid = data.uuid
  } catch (err) {
    console.error('获取验证码失败', err)
  } finally {
    codeLoading.value = false
  }
}

const onSubmit = async (values) => {
  isLoading.value = true
  try {
    const result = await userInfoStore.loginApiFun({
      code: Number(values.code), // 转成数字
      uuid: formState.uuid,
      username: values.username,
      password: values.password,
    })
    isLoading.value = false

    props.callback && props.callback(result)
  } catch (error) {
    if (error.msg === '验证码错误.') {
      refreshCaptcha()
    }
    isLoading.value = false
  }
}
const onFailed = (errorInfo) => {
  console.log('failed', errorInfo)
}
/** ***函数 end*****/

/** ***生命周期start*****/
onMounted(async () => {
  // await getCode()
  // if (getAccountInfo()) {
  //   const { customName, password } = getAccountInfo()
  //   formState.customName = customName
  //   formState.password = password
  // }
  // 初始化时加载一次
  refreshCaptcha()
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
