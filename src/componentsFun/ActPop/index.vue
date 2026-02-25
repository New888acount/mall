<template>
  <MyPopup v-model="show" @close="handleClose" class="act__pop">
    <div class="content only__content">
      <img :src="$imgBaseUrl + detail.pic" alt="" @click="handleTo(detail)" class="des__img" />
    </div>
    <template #close>
      <i class="iconfont icon-dengluzhuceguanbi active my-popup__close" @click="handleClose"></i>
    </template>
  </MyPopup>
</template>

<script setup>
/** ***引入相关包start*****/
import MyPopup from '@/components/MyPopup/index.vue'
import { computed, defineExpose, defineProps, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import addToDesk from './index'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const show = ref(false)
const checked = ref(false)

const router = useRouter()

const props = defineProps({
  details: {
    type: Object,
    default: () => {},
  },
  callback: {
    type: Function,
    default: null,
  },
})

const detailList = ref(props.details)

const detail = computed(() => detailList.value[0])

defineExpose({
  show,
})
/** ***ref、reactive、props，等……end*****/

/** ***函数 start*****/

const handleTo = ({ jumpUrl }) => {
  router.push(jumpUrl)

  close()
}

const handleClose = () => {
  if (detailList.value.length > 1) {
    detailList.value.shift()
    checked.value = false
  } else {
    close()
  }
}

// 关闭活动弹窗
const closeActpop = ({ jumpUrl, jumpType, id }, { check, onlyClose }) => {
  //有效时间之内不在弹
  // if (check) {
  //   //过期数组
  //   let expireArr = []
  //   //计算后的数组
  //   let computedArr = []
  //   //一天有效时间
  //   const expire = 1
  //   const time = expire * 86400000
  //   const Obj = {
  //     expire: time, //过期时间
  //     time: Date.now(), //存储时间戳
  //     id: id, //活动id
  //   }

  //   expireArr.push(Obj)

  //   computedArr = expireArr

  //   //获取旧的存储信息
  //   const oldObj = JSON.parse(localStorage.getItem('checkedExpireTime') || null)

  //   if (oldObj) computedArr = expireArr.concat(oldObj)

  //   localStorage.setItem('checkedExpireTime', JSON.stringify(computedArr))
  // }

  handleClose()
}

//关闭
const close = () => {
  show.value = false
  unMountComponent()
}

/** ***函数 end*****/

/** ***生命周期start*****/
// 销毁组件
const unMountComponent = () => {
  addToDesk({ type: 'unmount' })
}

watch(
  () => checked.value,
  (val) => {
    if (val) closeActpop(detail.value, { check: true, onlyClose: false })
  }
)
/** ***生命周期end*****/
</script>

<style lang="less">
html[data-device='desktop'] {
  .act__pop {
    &.my-popup {
      width: 343px;
      border-radius: 24px;

      .content {
        overflow-y: scroll;
        &.only__content {
          cursor: pointer;
        }
        &::-webkit-scrollbar-track-piece {
          -webkit-border-radius: 0;
        }

        &::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }

        &::-webkit-scrollbar-thumb {
          height: 50px;
          background-color: var(--color-border);
          -webkit-border-radius: 6px;
        }

        &::-webkit-scrollbar-thumb:hover {
          height: 50px;
          -webkit-border-radius: 6px;
        }
      }

      .my-popup__close {
        position: absolute;
        top: -50px;
        left: 100%;
        width: 40px;
        height: 40px;
        text-align: center;
        font-size: 24px;
        color: var(--adm-color-white);
        transform: translate(0, 0);
        line-height: 40px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.2);
        cursor: pointer;
      }
    }
  }
}
html[data-device='mobile'] {
  .act__pop {
    &.my-popup {
      width: 343px;
      border-radius: 24px;

      .content {
        &.only__content {
          cursor: pointer;
        }
      }

      .my-popup__close {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 30px;
        height: 30px;
        text-align: center;
        font-size: 20px;
        color: var(--adm-color-white);
        line-height: 30px;
        cursor: pointer;
      }
    }
  }
}

.act__pop {
  .content {
    img {
      width: 100%;
      height: auto;
      border-radius: 24px;
    }
  }
}
</style>
