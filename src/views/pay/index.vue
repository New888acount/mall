<template>
  <div class="my__paymethods" v-loading="state.isLoading">
    <MobileHeader class="cart-header" :leftText="$t('pay.title')" :backicon="true" :callback="close"></MobileHeader>

    <div class="container">
      <div class="container-header">
        <div class="price">{{ state.details.payAmount }} {{ $unit }}</div>
        <div class="amount">{{ $t('authorize.feePercent', [state.details.feePercent]) }}</div>
      </div>

      <div class="container-line"></div>

      <div class="container-form">
        <a-form :model="formState" autocomplete="off" class="my-form page-form" @finish="onFinish">
          <!-- 网络 -->
          <a-form-item name="payChannel" class="select-item">
            <p class="label-value">{{ $t('authorize.pay.label1') }}</p>

            <a-radio-group
              v-model:value="formState.payChannel"
              class="my-radios row-radios"
              @change="changeRadio(formState.payChannel)"
            >
              <a-radio :value="item.value" v-for="(item, index) in networkList" :key="index">
                <img :src="require(`@/assets/images/recharge/${item.value}.png`)" class="netwrok-icon" alt="" />
                <p class="value">{{ item.value }}</p>
              </a-radio>
            </a-radio-group>
            <div class="form__tips network__tips">
              {{ $t('authorize.pay.label1.tips') }}
            </div>
          </a-form-item>

          <!-- <a-form-item class="border-item"></a-form-item> -->

          <a-form-item name="walletType" class="select-item">
            <p class="label-value">{{ $t('authorize.pay.label2') }}</p>

            <a-radio-group v-model:value="formState.walletType" class="my-radios" v-loading="loadingWalletTypes">
              <a-radio :value="item.key" v-for="(item, index) in userInfoStore.walletTypesList" :key="index">
                <img :src="$imgBaseUrl + item.icon" alt="" class="wallet-icon" />
                <p class="wallet-text">{{ item.name }}</p>
              </a-radio>
            </a-radio-group>
            <div class="header__below">
              <div class="header__below__left">
                <span>{{ $t('authorize.pay.label3') }}:</span>
                <strong>{{ state.details.feePercent }}%</strong>
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
              {{ $t('authorize.pay.label3.tips') }}
            </div>
          </a-form-item>

          <a-form-item>
            <div class="timer-down" v-if="state.details.timeToPay">
              {{ $t('authorize.paying.timerTips') }}
              <van-count-down :time="(state.details.timeToPay || 0) * 1000" format="HH:mm:ss" />
            </div>
            <a-button type="primary" class="default-btn pay-button" html-type="submit" :loading="state.submitLoading">
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
import { orderDetailApi } from '@/api/order'
import useUserInfoStore from '@/store/modules/userInfo'
import { useRoute } from 'vue-router'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const userInfoStore = useUserInfoStore()

const route = useRoute()
// 检测支付环境
const state = reactive({
  isLoading: false,
  details: {},
  orderId: '',
  submitLoading: false,
})

const formState = reactive({
  payChannel: 'TRC20',
  address: '',
  walletType: '',
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

const loadingWalletTypes = ref(false)

/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
//关闭
const close = () => {
  history.back()
}

const onFinish = async () => {
  router.push(`/authorize?id=${state.orderId}&walletType=${formState.walletType}`)
}

const changeRadio = async () => {
  await walletTypes(true)
}

const walletTypes = async (flag) => {
  if (flag) loadingWalletTypes.value = true
  try {
    await userInfoStore.getwalletTypes(formState.payChannel)
    formState.walletType = userInfoStore.walletTypesList[0]?.key
  } catch (error) {
    console.log(error)
  } finally {
    if (flag) loadingWalletTypes.value = false
  }
}
const getOrderDetail = async (id) => {
  try {
    state.isLoading = true
    const { data } = await orderDetailApi(id)
    state.details = data
  } catch (error) {
    console.log(error)
  } finally {
    state.isLoading = false
  }
}

/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(async () => {
  if (route.query) {
    state.orderId = route.query.orderId || route.query.id || ''

    await walletTypes()

    await getOrderDetail(state.orderId)
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
          color: var(--adm-color-white) !important;
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
