<template>
  <div class="paying-order">
    <div class="container">
      <header>{{ $t('authorize.paying.title') }}</header>
      <div class="container-header">
        <div class="price">{{ amount }} {{ $unit }}</div>
        <!-- <div class="amount">≈ 0.0000000024ETH</div> -->
      </div>
      <div class="container-line"></div>

      <main class="main" v-loading="isLoading">
        <div class="confirm-wrap">
          <div class="text">
            <div class="left">{{ $t('authorize.paying.label1') }}</div>
            <div class="right">
              <div class="ellipsis">{{ orderId }}</div>
            </div>
          </div>
          <div class="text">
            <div class="left">{{ $t('authorize.form.label2') }}</div>
            <div class="right">
              <img :src="require(`@/assets/images/recharge/${network || 'TRC20'}.png`)" alt="" />
              <p>{{ network }}</p>
            </div>
          </div>
          <div class="text">
            <div class="left">{{ $t('authorize.paying.label2') }}</div>
            <div class="right">
              <div class="right">
                <div class="ellipsis">{{ formatAddress(address) || '--' }}</div>
                <svg
                  @click="copyText(address)"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M12.9167 5.83333C13.2482 5.83333 13.5661 5.96503 13.8006 6.19945C14.035 6.43387 14.1667 6.75181 14.1667 7.08333V17.0833C14.1667 17.4149 14.035 17.7328 13.8006 17.9672C13.5661 18.2016 13.2482 18.3333 12.9167 18.3333H3.75C3.58585 18.3333 3.4233 18.301 3.27165 18.2382C3.11999 18.1754 2.98219 18.0833 2.86612 17.9672C2.75004 17.8511 2.65797 17.7133 2.59515 17.5617C2.53233 17.41 2.5 17.2475 2.5 17.0833V7.08333C2.5 6.75181 2.6317 6.43387 2.86612 6.19945C3.10054 5.96503 3.41848 5.83333 3.75 5.83333H12.9167ZM12.5 7.5H4.16667V16.6667H12.5V7.5ZM16.2467 2.5C16.5575 2.49981 16.8573 2.61547 17.0875 2.8244C17.3177 3.03334 17.4618 3.32056 17.4917 3.63L17.4967 3.75V13.3275C17.4964 13.5399 17.4151 13.7442 17.2693 13.8986C17.1235 14.0531 16.9242 14.146 16.7122 14.1585C16.5001 14.1709 16.2914 14.1019 16.1285 13.9656C15.9656 13.8293 15.8609 13.6359 15.8358 13.425L15.83 13.3275V4.16667H7.5C7.29589 4.16664 7.09889 4.0917 6.94636 3.95607C6.79383 3.82044 6.69638 3.63354 6.6725 3.43083L6.66667 3.33333C6.66669 3.12922 6.74163 2.93222 6.87726 2.77969C7.0129 2.62716 7.19979 2.52971 7.4025 2.50583L7.5 2.5H16.2467Z"
                    fill="#459675"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <PayQrcode class="pay-code" :text="address || '--'" :size="155" />
        <div class="tips">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12.5 4L22 20H3L12.5 4ZM6.5 18H18.5L12.5 7.5L6.5 18ZM11.5 11H13.5V14H11.5V11ZM11.5 15H13.5V17H11.5V15Z"
              fill="#FF9413"
            />
          </svg>
          {{ $t('authorize.paying.tips') }}
        </div>
        <div class="main__submit">
          <div class="timer-down" v-if="timeToPay">
            {{ $t('authorize.paying.timerTips') }}
            <van-count-down :time="timeToPay * 1000" format="HH:mm:ss" />
          </div>
          <a-button class="default-btn" @click="connectWalletType">{{ $t('authorize.paying.btn') }}</a-button>
        </div>
        <div class="main__tips">
          {{ errorMessage }}
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { orderDetailApi } from '@/api/auth.js'
import useUserInfoStore from '@/store/modules/userInfo'
import { copyText } from '@/utils'
import { defineExpose, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import PayQrcode from './components/PayQrcode.vue'
/** ***引入相关包end*****/

/** ***ref、reactive、props，等……start*****/
const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const userInfoStore = useUserInfoStore()
const show = ref(false)

defineExpose({
  show,
})

const isLoading = ref(false)

const orderId = ref(route.query?.id)
const memberId = ref('')
const walletType = ref(route.query?.walletType)
const network = ref('')
const address = ref('')
const contractAddress = ref('')
const amount = ref('')
const createTime = ref('')
const withdrawalFee = ref('')
const timeToPay = ref(0)

const errorMessage = ref('')

const openPopover = ref(false)

/** ***ref、reactive、props，等……end*****/

/** ***函数 start*****/

const connectWalletType = async () => {
  router.replace('home')
}

const getChainDetails = async (id) => {
  isLoading.value = true
  try {
    const { data } = await orderDetailApi({ orderId: id })
    memberId.value = data.memberId
    network.value = data.network
    address.value = data.paymentAddress
    contractAddress.value = data.contract
    amount.value = data.payAmount
    createTime.value = data.createTime
    withdrawalFee.value = data.feeAmount
    timeToPay.value = data.timeToPay
    console.log(data)
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const formatAddress = (addr) => {
  if (!addr) return ''
  const start = addr.slice(0, 10)
  const end = addr.slice(-10)
  return `${start}...${end}`
}

const init = async () => {
  walletType.value = route.query?.walletType
  orderId.value = route.query?.id

  if (!orderId.value) {
    router.replace('/home')
  }

  await getChainDetails(orderId.value)

  userInfoStore.getwalletTypes(network.value)
}

/** ***函数 end*****/

/** ***生命周期start*****/
onMounted(() => {
  init()
})
/** ***生命周期end*****/
</script>

<style lang="less" scoped>
.paying-order {
  height: 100%;
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: flex-start;
    height: 100%;
    header {
      padding-top: 16px;
      color: var(--adm-color-textLv1);
      text-align: center;
      font-family: 'SF Pro';
      font-size: 16px;
      font-style: normal;
      font-weight: 590;
      line-height: normal;
    }
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
  }

  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
    padding: 12px 20px 30px 20px;

    .confirm-wrap {
      width: 100%;
      &.result-wrap {
        padding: 16px 0;
        border: none;
        background: transparent;
      }

      .text {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
      }

      .left {
        margin-right: 10px;
        flex-shrink: 0;
        color: var(--adm-color-textLv1);
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 18px; /* 128.571% */
      }

      .right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: var(--adm-color-textLv1);
        text-align: right;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 18px; /* 128.571% */
        overflow: hidden;
        text-overflow: ellipsis;

        .ellipsis {
          margin-right: 6px;
          display: inline-block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: right;
        }

        img {
          margin-right: 10px;
          width: 20px;
          height: auto;
        }
      }

      .amount {
        color: var(--adm-color-primary);
        font-size: 14px;
        font-weight: 600;
      }
    }

    .pay-code {
      margin: 12px 0;
    }

    .tips {
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

    &__submit {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      width: 100%;

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

      button {
        width: 442px;
        height: 50px;
        font-size: 16px;
      }
    }

    .animate-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px 0;
      text-align: center;
      border-bottom: 1px dashed var(--color-border);

      .loader {
        width: 50px;
        aspect-ratio: 1;
        display: grid;
        -webkit-mask: conic-gradient(from 15deg, #0000, #000);
        animation: l26 1s infinite steps(12);
      }
      .loader,
      .loader:before,
      .loader:after {
        background: radial-gradient(closest-side at 50% 12.5%, var(--adm-color-primary) 96%, #0000) 50% 0/20% 80%
            repeat-y,
          radial-gradient(closest-side at 12.5% 50%, var(--adm-color-primary) 96%, #0000) 0 50%/80% 20% repeat-x;
      }
      .loader:before,
      .loader:after {
        content: '';
        grid-area: 1/1;
        transform: rotate(30deg);
      }
      .loader:after {
        transform: rotate(60deg);
      }
      @keyframes l26 {
        100% {
          transform: rotate(1turn);
        }
      }

      .amount {
        padding: 12px 0;
        color: var(--color-auxiliary);
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }

      .text {
        color: var(--adm-color-white);
        font-size: 24px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }
    }
  }
}

html[data-device='mobile'] {
  .paying-order {
    .header {
      padding: 0 14px;

      &__nav {
        width: 100%;
        height: 40px;

        &__back {
          position: absolute;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 20px;
          height: 20px;
          cursor: pointer;

          i {
            color: var(--adm-color-white);
            font-size: 18px;
          }
        }

        h3 {
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    .connect-wallet {
      background: var(--adm-bg-light);

      .address {
        background: var(--adm-bg-light);
      }
    }

    .main {
      padding: 12px 14px;

      .confirm-wrap {
        &.result-wrap {
          padding: 16px 0;
        }

        .text {
          margin-bottom: 12px;
          &:last-child {
            margin-bottom: 0;
          }
        }

        .left {
          margin-right: 10px;
          font-size: 12px;
        }

        .right {
          font-size: 12px;

          p {
            font-size: 12px;
          }
        }

        .amount {
          font-size: 12px;
        }
      }

      .tips {
        padding: 12px 0;
        font-size: 12px;
      }

      &__submit {
        margin-top: 66px;
        button {
          width: 100%;
          height: 35px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
