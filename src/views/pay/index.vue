<template>
  <div class="my__paymethods">
    <MobileHeader class="cart-header" :leftText="$t('pay.title')" :backicon="true" :callback="close"></MobileHeader>

    <div class="container">
      <div class="container-header">
        <div class="price">{{ state.totalAmount }} {{ $unit }}</div>
        <div class="amount">≈ 0.0000000024ETH</div>
      </div>

      <div class="container-line"></div>

      <div class="container-form">
        <a-form :model="formState" autocomplete="off" class="my-form page-form" :rules="formRules" @finish="onFinish">
          <!-- 网络 -->
          <a-form-item name="payChannel" class="select-item">
            <p class="label-value">选择网络</p>

            <a-radio-group
              v-model:value="formState.payChannel"
              class="my-radios row-radios"
              v-loading="loadingWalletTypes"
            >
              <a-radio :value="item.value" v-for="(item, index) in networkList" :key="index">
                <img :src="require(`@/assets/images/recharge/${item.value}.png`)" class="netwrok-icon" alt="" />
                <p class="value">{{ item.value }}</p>
              </a-radio>
            </a-radio-group>
            <div class="form__tips network__tips">请确认链网络一致，转错地址可能导致资产无法追回</div>
          </a-form-item>

          <!-- <a-form-item class="border-item"></a-form-item> -->

          <a-form-item name="walletType" class="select-item">
            <p class="label-value">选择钱包</p>

            <a-radio-group v-model:value="formState.walletType" class="my-radios" v-loading="loadingWalletTypes">
              <a-radio :value="item.key" v-for="(item, index) in walletTypesList" :key="index">
                <img :src="item.icon" alt="" class="wallet-icon" />
                <p class="wallet-text">{{ item.name }}</p>
              </a-radio>
            </a-radio-group>
            <div class="header__below">
              <div class="header__below__left">
                <span>支付手续费:</span>
                <strong>1%</strong>
              </div>
            </div>
          </a-form-item>

          <!-- <a-form-item class="border-item"></a-form-item> -->

          <a-form-item>
            <div class="form__tips">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12.5 4L22 20H3L12.5 4ZM6.5 18H18.5L12.5 7.5L6.5 18ZM11.5 11H13.5V14H11.5V11ZM11.5 15H13.5V17H11.5V15Z"
                  fill="#FF9413"
                />
              </svg>
              支付金额为您当前订单商品总额，请务必保证支付钱包和网络一致，否则将无法到账！若您未正确操作，导致的资金遗失，无法找回或退款
            </div>
          </a-form-item>

          <a-form-item>
            <div class="timer-down">
              请在倒计时结束前完成支付
              <van-count-down :time="1000 * 1000" format="HH:mm:ss" />
            </div>
            <a-button type="primary" class="default-btn pay-button" html-type="submit" :loading="submitLoading">
              {{ $t('pay.button') }}
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import router from '@/router'
import { onMounted, reactive, ref } from 'vue'
// import { getMaxZIndex } from '@/utils/index'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const { t } = useI18n()
const checked = ref(false)
const route = useRoute()
// 检测支付环境
const state = reactive({
  orderType: 'goods',
  payment: 'wechat',
  totalAmount: '',
  orderInfo: {},
  payStatus: 0, // 0=检测支付环境, -2=未查询到支付单信息， -1=支付已过期， 1=待支付，2=订单已支付
  payMethods: [],
  payId: '',
})

const formState = reactive({
  amount: '',
  payChannel: '',
  address: '',
  walletType: '',
  password: '',
  paymentType: '',
  cardId: '',
  options: [],
})

const loadingType = ref(false)

const submitLoading = ref(false)

const formRules = ref({
  address: [
    {
      required: true,
      message: t('withdraw.address.placeholder'),
      trigger: 'change',
    },
  ],
  password: [
    {
      required: true,
      message: t('withdraw.inputPasswordErrorTip1'),
      trigger: 'change',
    },
    {
      min: 6,
      max: 6,
      message: t('withdraw.inputPasswordErrorTip2'),
      trigger: 'change',
    },
  ],
})

const networkList = ref([
  {
    name: 'Tron (TRC20)',
    value: 'TRC20',
  },
  {
    name: 'Ethereum (ERC20)',
    value: 'ERC20',
  },
  {
    name: 'BNB Smart Chain (BEP20)',
    value: 'BEP20',
  },
])

const walletTypesList = ref([
  {
    country: null,
    id: '6966196d4a9e336613d8d9aa',
    sort: 2,
    networks: ['ERC20', 'TRC20', 'BEP20'],
    key: 'ImToken',
    name: 'ImToken',
    icon: 'https://funtest.one/static/kwai/20260116/940528de3e8645fe8361e64a30ef6a41.jpg',
    status: '0',
  },
  {
    country: null,
    id: '696619884a9e336613d8d9ab',
    sort: 3,
    networks: ['TRC20'],
    key: 'TronLink',
    name: 'Tron Link',
    icon: 'https://funtest.one/static/kwai/20260203/dbfb704b3917481a8a28eaa5884c9634.png',
    status: '0',
  },
  {
    country: null,
    id: '696856cbb7546a3ca4a07cfe',
    sort: 5,
    networks: ['ERC20', 'TRC20', 'BEP20'],
    key: 'TokenPocket',
    name: 'Token Pocket',
    icon: 'https://funtest.one/static/kwai/20260116/d3dc8fb5c1da43fa8c7a3b1f52912758.webp',
    status: '0',
  },
  {
    country: null,
    id: '6981650ed27b470276c21e54',
    sort: 6,
    networks: ['TRC20', 'ERC20', 'BEP20'],
    key: 'OkxWallet',
    name: 'OKX',
    icon: 'https://funtest.one/static/kwai/20260203/36c6e313896449d8866cf99640c162bd.png',
    status: '0',
  },
])

const loadingWalletTypes = ref(false)

/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
//关闭
const close = () => {
  history.back()
}

const onFinish = () => {
  router.push('/authorize?id=69843605d27b470276c78414&walletType=tokenpocket')
}

const changePayChannel = async () => {
  // await walletTypes(true)
}

/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(async () => {
  // 微信平台支付
  // const authInfo = sheep.$store('app').authInfo
  // if (!sheep.$store('user').userInfo.openId && authInfo) {
  //   await sheep.$api.user.setWechatInfo(Base64.encode(JSON.stringify(authInfo)))
  //   sheep.$store('user').userInfo.openId = authInfo.openid
  // }

  // if (
  //   sheep.$platform.name === 'WechatOfficialAccount' &&
  //   sheep.$platform.os === 'ios' &&
  //   !sheep.$platform.landingPage.includes('pages/pay/index')
  // ) {
  //   location.reload()
  //   return
  // }

  if (route.query) {
    console.log(route.query)

    if (route.query.totalAmount) {
      state.totalAmount = route.query.totalAmount
    }

    const id = route.query.orderSN || route.query.id || ''
    state.payId = id

    if (route.query.type === 'recharge') {
      state.orderType = 'recharge'
      // setRechargeOrder(id)
    } else {
      state.orderType = 'goods'
      // setGoodsOrder(id)
    }
  }
})

/** ***生命周期end*****/
</script>

<style lang="less" scoped>
.my__paymethods {
  width: 100%;
  height: 100%;
  background: var(--adm-bg-white);
  .container {
    &-header {
      padding: 24px 0;
      .price {
        padding-bottom: 12px;
        text-align: center;
        color: var(--color-red);
        font-size: 24px;
        font-weight: 600;
      }
      .amount {
        text-align: center;
        color: var(--adm-color-primary);
        font-family: Roboto;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px; /* 100% */
      }
    }
    &-line {
      height: 12px;
      background: var(--adm-bg-light);
    }
    &-form {
      padding: 24px 16px;
      .page-form {
        box-sizing: border-box;
        :deep(.ant-form-item) {
          margin-bottom: 24px;
          &:last-child {
            margin-bottom: 0;
          }
        }

        :deep(.ant-input-prefix) {
          color: var(--color-white) !important;
          font-size: 16px !important;
        }
        :deep(.ant-input-suffix) {
          color: var(--adm-color-primary) !important;
          font-size: 16px !important;
          span {
            cursor: pointer;
            &:active {
              opacity: 0.7;
            }
          }
        }

        .border-item {
          :deep(.ant-form-item-control-input) {
            min-height: 1px;
            background: var(--color-border);
          }
        }

        .label-value {
          margin-bottom: 12px;
          color: var(--color-textlv1);
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: 16px;
          &.address-text {
            margin-top: 6px;
            margin-bottom: 0;
            color: var(--color-red);
          }
        }

        .my-radios {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-end;
          width: 100%;
          .wallet-icon {
            width: 32px;
            height: auto;
          }
          .wallet-text {
            margin-left: 10px;
            color: var(--color-textlv1);
            font-size: 14px;
            font-style: normal;
            font-weight: 600;
            line-height: 18px; /* 150% */
            text-transform: capitalize;
          }
          :deep(.ant-radio-wrapper) {
            width: 100%;
            align-items: center;
            flex-direction: row-reverse;
            padding: 12px 0;
            border-bottom: 1px solid var(--color-border);
            margin-right: 0;
            > span {
              &:nth-child(2) {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: flex-start;
              }
            }

            .ant-radio {
              border: none !important;
              outline: none !important;
              .ant-radio-inner {
                border-color: var(--color-border);
                background: transparent;
                outline: none !important;
                &::after {
                  transform: scale(0.5);
                  opacity: 1;
                  background-color: transparent;
                }
              }
            }

            &.ant-radio-wrapper-checked {
              background: var(--color-lightBg);
              .ant-radio {
                .ant-radio-inner {
                  border-color: var(--adm-color-primary);
                  background: transparent;
                  &::after {
                    background-color: var(--adm-color-primary);
                  }
                }
              }
            }
          }

          &.row-radios {
            flex-direction: row;
            justify-content: flex-start;
            :deep(.ant-radio) {
              display: none;
            }

            :deep(.ant-radio-wrapper) {
              margin-right: 12px;
              width: 100%;
              padding: 6px 0;
              border-radius: 2px;
              border: 1px solid var(--color-border);
              &:last-child {
                margin-right: 0;
              }

              > span {
                &:nth-child(2) {
                  flex: 1;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
              }

              .ant-radio {
                border: none !important;
                outline: none !important;
                .ant-radio-inner {
                  border-color: var(--color-border);
                  background: transparent;
                  outline: none !important;
                  &::after {
                    transform: scale(0.5);
                    opacity: 1;
                    background-color: transparent;
                  }
                }
              }

              &.ant-radio-wrapper-checked {
                border: 1px solid var(--adm-color-primary);
                .ant-radio {
                  .ant-radio-inner {
                    border-color: var(--adm-color-primary);
                    background: transparent;
                    &::after {
                      background-color: var(--adm-color-primary);
                    }
                  }
                }
              }
            }

            .netwrok-icon {
              width: 24px;
              height: 24px;
            }

            .value {
              margin-left: 6px;
              color: var(--adm-color-textLv1);
              font-family: Roboto;
              font-size: 14px;
              font-style: normal;
              font-weight: 600;
              line-height: normal;
            }
          }
        }

        :deep(.ant-select-selector) {
          height: 48px;
          border-radius: 8px !important;
          border: 1.5px solid var(--color-border) !important;
          background: var(--color-lightBg) !important;
          border-radius: 4px !important;

          .ant-select-selection-item {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            color: var(--color-textlv1) !important;
            img {
              margin-right: 12px;
              width: 32px;
              height: auto;
            }
          }
        }

        .header__below {
          margin-top: 12px;
          color: var(--adm-color-textLv1);
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          strong {
            color: var(--adm-color-primary);
          }
        }

        .form__tips {
          &.network__tips {
            margin-top: 12px;
          }
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          color: #ff9413;
          font-family: Roboto;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 18px;

          svg {
            margin-right: 6px;
            flex-shrink: 0;
            // vertical-align: middle;
          }
        }
      }

      .timer-down {
        padding: 12px 0 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--adm-color-textLv1);
        text-align: center;
        font-family: Roboto;
        font-size: 11px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        :deep(.van-count-down) {
          margin-left: 4px;
          font-size: 12px;
          color: var(--color-red);
        }
      }

      .pay-button {
        width: 100%;
        height: 40px;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        color: var(--adm-color-white);
        width: 100%;
        background: var(--adm-color-primary);
      }
    }
  }
}
</style>
