  
  // 长期级别存储
import store from 'store2'
export default function useLocalCache() {
  // 0.清除所有缓存
  function clearCache() {
    store.clearAll()
  }
  // 1.首页埋点缓存
  function getBuried() {
    return store.get('bury')
  }
  // 2.设置埋点缓存
  function setBuried(res) {
    store.set('bury', res)
  }
  // 3.移除埋点缓存
  function removeBuried() {
    store.remove('bury')
  }

  // 1.获取国际化 start
  function getLanguage() {
    return store.get('language')
  }
  // 2.设置国际化
  function setLanguage(res) {
    store.set('language', res)
  }
  // 3.移除国际化
  function removeLanguage() {
    store.remove('language')
  }
   // 1.获取token
   function getCacheToken() {
    return store.get('token')
  }
  // 2.设置Token
  function setCacheToken(res) {
    return store.set('token', res)
  }
  // 3.移除Token
  function removeCacheToken() {
    store.remove('token')
  }

    //是否注册成功
    function setIsRegister(res) {
      store.set('isRegister', res)
    }
  
    //获取注册成功
    function getIsRegister() {
      return store.get('isRegister')
    }
  
    //移除注册成功
    function removeIsRegister() {
      store.remove('isRegister')
    }

    function setSearchHistory(res) {
      store.set('searchHistory', res)
    }
  
    //获取注册成功
    function getSearchHistory() {
      return store.get('searchHistory')
    }
  
    //移除注册成功
    function removeSearchHistory() {
      store.remove('searchHistory')
    }

    function setAreaHistory(res) {
      store.set('areaData', res)
    }
  
    //获取注册成功
    function getAreaHistory() {
      return store.get('areaData')
    }
  
    //移除注册成功
    function removeAreaHistory() {
      store.remove('areaData')
    }

  return {
    getLanguage,
    setLanguage,
    removeLanguage,
    getBuried,
    setBuried,
    removeBuried,
    getCacheToken,
    setCacheToken,
    removeCacheToken,
    clearCache,
    setIsRegister,
    getIsRegister,
    removeIsRegister,
    setSearchHistory,
    getSearchHistory,
    removeSearchHistory,
    setAreaHistory,
    getAreaHistory,
    removeAreaHistory
  }}