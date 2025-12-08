<template>
  <div :class="['my-loading', ]">
    <!-- `my-loading--${appStore.themeSystem}` -->
    <!-- my-loading 图标或动画 -->
    <!-- <div class="spinner"></div>
    <div class="spinner"></div>
    <div class="spinner"></div>
    <div class="spinner"></div> -->
    <div class="loader loader--style1" title="0">
      <svg
        version="1.1"
        id="loader-1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="40px"
        height="40px"
        viewBox="0 0 40 40"
        enable-background="new 0 0 40 40"
        xml:space="preserve"
      >
        <path
          opacity="0.2"
          fill="#000"
          d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
    s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
    c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
        />
        <path
          fill="#000"
          d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
    C22.32,8.481,24.301,9.057,26.013,10.047z"
        >
          <animateTransform
            attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="0 20 20"
            to="360 20 20"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  </div>
</template>

<script setup>
// import useAppStore from '@/store/modules/app.js'
// const appStore = useAppStore()
</script>

<!-- <style scoped lang="less">
.my-loading,
.my-loading > div {
  position: relative;
  box-sizing: border-box;
}

.my-loading {
  display: block;
  font-size: 0;
  color: var(--adm-color-primary);
  z-index: 99999;
  margin: 20px auto;
}

.my-loading.la-dark {
  color: #333;
}

.my-loading > div {
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid currentColor;
}

.my-loading {
  width: 8px;
  height: 8px;
}

.my-loading > div {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 100%;
  transform: translate(-50%, -50%);
  animation: ball-fussion-ball1 1s 0s ease infinite;
}

.my-loading > div:nth-child(1) {
  top: 0;
  left: 50%;
  z-index: 1;
}

.my-loading > div:nth-child(2) {
  top: 50%;
  left: 100%;
  z-index: 2;
  animation-name: ball-fussion-ball2;
}

.my-loading > div:nth-child(3) {
  top: 100%;
  left: 50%;
  z-index: 1;
  animation-name: ball-fussion-ball3;
}

.my-loading > div:nth-child(4) {
  top: 50%;
  left: 0;
  z-index: 2;
  animation-name: ball-fussion-ball4;
}

.my-loading.la-sm {
  width: 4px;
  height: 4px;
}

.my-loading.la-sm > div {
  width: 6px;
  height: 6px;
}

.my-loading.la-2x {
  width: 16px;
  height: 16px;
}

.my-loading.la-2x > div {
  width: 24px;
  height: 24px;
}

.my-loading.la-3x {
  width: 24px;
  height: 24px;
}

.my-loading.la-3x > div {
  width: 36px;
  height: 36px;
}

@keyframes ball-fussion-ball2 {
  0% {
    opacity: 0.35;
  }

  50% {
    top: 200%;
    left: 200%;
    opacity: 1;
  }

  100% {
    top: 100%;
    left: 50%;
    z-index: 1;
    opacity: 0.35;
  }
}

@keyframes ball-fussion-ball1 {
  0% {
    opacity: 0.35;
  }

  50% {
    top: -100%;
    left: 200%;
    opacity: 1;
  }

  100% {
    top: 50%;
    left: 100%;
    z-index: 2;
    opacity: 0.35;
  }
}

@keyframes ball-fussion-ball3 {
  0% {
    opacity: 0.35;
  }

  50% {
    top: 200%;
    left: -100%;
    opacity: 1;
  }

  100% {
    top: 50%;
    left: 0;
    z-index: 2;
    opacity: 0.35;
  }
}

@keyframes ball-fussion-ball4 {
  0% {
    opacity: 0.35;
  }

  50% {
    top: -100%;
    left: -100%;
    opacity: 1;
  }

  100% {
    top: 0;
    left: 50%;
    z-index: 1;
    opacity: 0.35;
  }
}
</style> -->

<style scoped lang="less">
.my-loading {
  svg path,
  svg rect {
    fill: #777;
  }
}
</style>
