<template>
  <router-view></router-view>
</template>

<script setup>
/** ***引入相关包start*****/
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useLocalCache from '@/hooks/storage/localStorage'
import useAppStore from './store/modules/app.js'
import useCacheData from '@/store/modules/cacheData.js'
import { useCartStore } from '@/store/modules/cart'
import { getChannerl } from '@/utils'
/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/
const router = useRouter()
const { setCacheToken, getCacheToken } = useLocalCache()
// 获取store
const appStore = useAppStore()
const cacheData = useCacheData()
// 购物车数据
const cartStore = useCartStore()
/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/
// 处理调用不同客服类型
const handleServer = async (res, channel) => {
  res = 'livechat'
  // livechat插件
  if (res.includes('livechat')) {
    const { data: infoRes } = await reqContactInfo({
      type: 'livechat',
      channel,
    })
    // 动态引入和加载livechat插件
    const scriptEl = document.createElement('script')
    scriptEl.innerHTML = `
      window.__lc = window.__lc || {};
      window.__lc.license = ${infoRes.serviceUrl};
      ; (function (n, t, c) { function i(n) { return e._h ? e._h.apply(null, n) : e._q.push(n) } var e = { _q: [], _h: null, _v: "2.0", on: function () { i(["on", c.call(arguments)]) }, once: function () { i(["once", c.call(arguments)]) }, off: function () { i(["off", c.call(arguments)]) }, get: function () { if (!e._h) throw new Error("[LiveChatWidget] You can't use getters before load."); return i(["get", c.call(arguments)]) }, call: function () { i(["call", c.call(arguments)]) }, init: function () { var n = t.createElement("script"); n.async = !0, n.type = "text/javascript", n.src = "https://cdn.livechatinc.com/tracking.js", t.head.appendChild(n) } }; !n.__lc.asyncInit && e.init(), n.LiveChatWidget = n.LiveChatWidget || e }(window, document, [].slice))

      var chatContainerVisible = false
      var chatWidgetObserver
      var liveChatObserver
      var bodyObserver = new MutationObserver(function(mutations, observer){
        var chatWidgeEl = document.querySelector('#chat-widget')
        if (chatWidgeEl && !chatWidgetObserver) {
          chatWidgetObserver = new MutationObserver(function(mutations, observer){
            var chatWidgeDisplay = chatWidgeEl.style.display
            if (chatWidgeDisplay === 'block') {
              chatContainerVisible = true
              liveChatEl.style.opacity = 1
              liveChatEl.style.visibility = 'visible'
              liveChatEl.style.width = '90%'
              liveChatEl.style.maxWidth = '90%'
              liveChatEl.style.height = '80%'
              liveChatEl.style.maxHeight = '80%'
              liveChatEl.style.top = '0'
              liveChatEl.style.left = '0'
              liveChatEl.style.right = '0'
              liveChatEl.style.bottom = '0'
              liveChatEl.style.margin = 'auto'
              liveChatEl.style.borderRadius = '10px'
              liveChatEl.style.zIndex = 232425
            } else if (chatWidgeDisplay === 'none') {
              chatContainerVisible = false
            }
          });
          chatWidgetObserver.observe(chatWidgeEl, { attributes:true });
        }

        var liveChatEl = document.querySelector('#chat-widget-container')
        if (liveChatEl && !liveChatObserver) {
          liveChatObserver = new MutationObserver(function(mutations, observer){
            if (!chatContainerVisible && liveChatEl.style.opacity == 1) {
              liveChatEl.style.opacity = 0
              liveChatEl.style.visibility = 'hidden'
              liveChatEl.style.zIndex = -1

              document.getElementById('chat-widget-minimized').display = 'none'
              if (window.contactUsDialog) {
                window.contactUsDialog.livechatVisible = true
              }
            }
          });

          liveChatObserver.observe(liveChatEl, { attributes:true });

          if (chatWidgeEl) {
            bodyObserver = null
          }
        }
      });
      var bodyEl = document.querySelector('body');
      var  options = {
        'childList': true
      };
      bodyObserver.observe(bodyEl, options);
    `
    document.body.appendChild(scriptEl)
    const noscriptEl = document.createElement('noscript')
    noscriptEl.innerHTML = `
      <a
        href="https://www.livechat.com/chat-with/${infoRes.serviceUrl}/"
        rel="nofollow"
      >Chat with us</a>
      , powered by
      <a
        href="https://www.livechat.com/?welcome"
        rel="noopener nofollow"
        target="_blank"
      >LiveChat</a>
    `
    document.body.appendChild(noscriptEl)
  }
}

// 获取客服列表
const initServer = () => {
  const channel = getChannerl()
  reqServerList({ channel }).then((o) => {
    const res = o.data
    if (res && res.length) {
      appStore.serverList.forEach((item) => {
        const str = item.name.toLowerCase()
        if (res.includes(str)) {
          item.show = true
        }
      })
      // 设置已经获取了客服，避免重复获取
      appStore.setServerList(appStore.serverList)
      // 处理调用不同类型客服
      handleServer(res, channel)
    }
  })
}
/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {
  const token = getCacheToken()
  if (token) {
    setCacheToken(token)
    cartStore.getList()
  }

  appStore.initApp()
  cacheData.hotlist()
  cacheData.recommendlist()
})
/** ***生命周期end*****/
</script>

<style scoped lang="less"></style>
