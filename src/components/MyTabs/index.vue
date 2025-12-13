<!--
  使用方法和vant的tab标签页组件一样
  文档:https://vant-ui.github.io/vant/#/zh-CN/tab
-->
<template>
  <div
    :class="[
      'my-tabs',
      arrowShow && `my-tabs--arrow my-tabs--arrow--${arrowShowType}`,
      lineFill && 'my-tabs--line-fill',
      wrapTopLineShow && 'my-tabs--wrap-top-line',
      wrapBottomLineShow && 'my-tabs--wrap-bottom-line',
    ]"
  >
    <van-tabs
      v-bind="$attrs"
      :shrink="shrink"
      :color="color"
      :titleInactiveColor="titleInactiveColor"
      :titleActiveColor="titleActiveColor"
      :lineWidth="lineWidth"
      :lineHeight="lineHeight"
      ref="myTabs"
    >
      <slot></slot>
      <!-- 下面这几个slot是tabs本身就有的 -->
      <slot name="nav-left"></slot>
      <slot name="nav-right"></slot>
      <slot name="nav-bottom"></slot>
    </van-tabs>

    <!-- 左边箭头 -->
    <div class="my-tabs__arrow my-tabs__arrow--left" @click="handleTabsNavScroll('0')">
      <slot name="arrow-left">
        <i class="iconfont icon-xiangzuo1"></i>
      </slot>
    </div>
    <!-- 右边箭头 -->
    <div class="my-tabs__arrow my-tabs__arrow--right" @click="handleTabsNavScroll('10000')">
      <slot name="arrow-right">
        <i class="iconfont icon-kongxin-right-copy"></i>
      </slot>
    </div>
  </div>
</template>
<script setup>
import { defineProps, onBeforeUnmount, onMounted, ref } from 'vue'
const props = defineProps({
  color: {
    type: String,
    default: 'var(--adm-color-primary)',
  },
  // 标题颜色
  titleInactiveColor: {
    type: String,
    default: 'var(--color-textlv2)',
  },
  // 选中时候标题颜色
  titleActiveColor: {
    type: String,
    default: 'var(--adm-color-textLv1)',
  },
  // 选中时候线的宽度
  lineWidth: {
    type: String,
    default: '20px',
  },
  // 选中时候线的高度
  lineHeight: {
    type: String,
    default: '2px',
  },
  // 默认设置为收缩默认
  shrink: {
    type: Boolean,
    default: true,
  },
  // 选中时候线是否铺满tab底部（新增）
  lineFill: {
    type: Boolean,
    default: false,
  },
  // 容器头部线是否显示(新增)
  wrapTopLineShow: {
    type: Boolean,
    default: false,
  },
  // 容器底部线是否显示(新增)
  wrapBottomLineShow: {
    type: Boolean,
    default: false,
  },
  // 是否显示箭头点击进行滚动（新增）
  arrowShow: {
    type: Boolean,
    default: false,
  },
})
const myTabs = ref(null)

onMounted(() => {
  let tabsEl = myTabs.value.$el
  let tabsNav = tabsEl.querySelector('.van-tabs__nav')
  arrowShowFn(tabsNav)
  tabsNav.addEventListener('scroll', onTabsNavScroll, true)
  addEventListener('resize', onResize, true)
})

onBeforeUnmount(() => {
  let tabsEl = myTabs.value.$el
  let tabsNav = tabsEl.querySelector('.van-tabs__nav')
  tabsNav.removeEventListener('scroll', onTabsNavScroll, true)
  removeEventListener('resize', onResize, true)
})

/* 监听van-tabs__nav滚动条用于判断辅助箭头如何显示 */
const onTabsNavScroll = (e) => {
  arrowShowFn(e.target)
}

/* 监听屏幕改变用于屏幕变化的时候van-tabs__nav滚动条可以滚动到选中的tab */
let resizeTimer = null
const onResize = () => {
  if (resizeTimer) {
    clearTimeout(resizeTimer)
    resizeTimer = null
  }
  resizeTimer = setTimeout(() => {
    if (!myTabs.value) return
    let tabsEl = myTabs.value.$el
    let tabsNav = tabsEl.querySelector('.van-tabs__nav')
    let tabActive = tabsEl.querySelector('.van-tab--active')
    tabsNav.scrollLeft = tabActive.offsetLeft
  }, 100)
}

/* 点击箭头滚动条用于快速滚动到左边或右边*/
const handleTabsNavScroll = (value) => {
  if (!myTabs.value) return
  let tabsEl = myTabs.value.$el
  let tabsNav = tabsEl.querySelector('.van-tabs__nav')
  tabsNav.scrollTo({ left: value, behavior: 'smooth' })
}

/* none 不显示箭头，right显示右边箭头,left显示左边箭头，both显示两边箭头 */
const arrowShowType = ref('none')
let arrowShowTimer = null
const arrowShowFn = (tabsNav) => {
  if (!props.arrowShow) return
  if (arrowShowTimer !== null) {
    clearTimeout(arrowShowTimer)
    arrowShowTimer = null
  }
  arrowShowTimer = setTimeout(() => {
    if (tabsNav.scrollWidth === tabsNav.clientWidth) {
      arrowShowType.value = 'none'
    } else if (tabsNav.scrollLeft === 0) {
      arrowShowType.value = 'right'
    } else if (tabsNav.scrollLeft === tabsNav.scrollWidth - tabsNav.clientWidth) {
      arrowShowType.value = 'left'
    } else {
      arrowShowType.value = 'both'
    }
  }, 100)
}
</script>

<style lang="less" scoped>
html[data-device='mobile'] {
  .my-tabs {
    position: relative;
    width: 100%;
    &--arrow {
      :deep(.van-tabs__nav) {
        padding: 0;
        .van-tab {
          font-size: 12px;
          font-weight: 500;
        }
      }
    }
  }
}
.my-tabs {
  position: relative;
  width: 100%;

  &__arrow {
    position: absolute;
    z-index: 9;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    cursor: pointer;
    &--left {
      display: none;
      top: 12px;
      left: 2px;
    }
    &--right {
      display: none;
      top: 12px;
      right: 2px;
    }
  }
  &--arrow {
    i {
      font-size: 18px;
    }
    :deep(.van-tabs__wrap) {
      padding: 0 24px;
    }
    &--none {
      .van-tabs__wrap {
        padding: 0;
      }
    }
    &--left {
      .my-tabs__arrow--left {
        display: flex;
      }
    }
    &--right {
      .my-tabs__arrow--right {
        display: flex;
      }
    }
    &--both {
      .my-tabs__arrow--left {
        display: flex;
      }
      .my-tabs__arrow--right {
        display: flex;
      }
    }
  }
  :deep(.van-tab) {
    font-weight: 400;
    padding: 0 24px;
  }
  :deep(.van-tab--active) {
    font-weight: 400;
  }

  :deep(.van-tabs__nav--line) {
    padding-bottom: 0;
  }
  &--line-fill {
    // :deep(.van-tab--active) {
    //   &::after {
    //     display: none;
    //     content: '';
    //     position: absolute;
    //     left: 0;
    //     left: 8px;
    //     right: 8px;
    //     bottom: 0;
    //     height: 2px;
    //     border-radius: 99px;
    //     background: #fe771c;
    //   }
    // }
    :deep(.van-tabs__line) {
      bottom: 0;
    }
  }
  &--wrap-top-line {
    :deep(.van-tabs__wrap) {
      // border-top: 0.5px solid rgba(255, 255, 255, 0.1);
    }
  }
  &--wrap-bottom-line {
    :deep(.van-tabs__wrap) {
      // border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
    }
  }
  :deep(.van-tabs__nav--card) {
    margin: 0 !important;
  }
  :deep(.van-tabs__wrap) {
    min-height: 30px !important;
    background: #fff;
  }
  :deep(.van-tabs__nav) {
    background: none;
  }
}
</style>
