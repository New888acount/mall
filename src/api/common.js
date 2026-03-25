import request from '@/utils/request'

/**
 * 查询常见问题
 * @param
 * @returns
 */
export const getFaqApi = (params) =>
  request({
    url: '/mall/no-auth/questions',
    method: 'get',
    params,
  })

/**
 * 关于我们
 * @param
 * @returns
 */
export const getAboutApi = (params) =>
  request({
    url: '/mall/no-auth/about',
    method: 'get',
    params,
  })

/**
 * 隐私协议
 * @param
 * @returns
 */
export const getPrivacyApi = (params) =>
  request({
    url: '/mall/no-auth/privacy',
    method: 'get',
    params,
  })

/**
 * 查询客服支持
 * @param
 * @returns
 */
export const getSupportApi = (params) =>
  request({
    url: '/mall/no-auth/support',
    method: 'get',
    params,
  })

/**
 * banner图接口
 * @param
 * @returns
 */
export const getBannerApi = (params) =>
  request({
    url: '/mall/no-auth/banner',
    method: 'get',
    params,
  })

/**
 * 弹窗列表
 * @param
 * @returns
 */
export const popupListApi = (params) =>
  request({
    url: '/mall/api/home/popup',
    method: 'get',
    params,
  })

/**
 * 商城埋点数据统计
 * @param
 * type - 类型,1-首页访问;2-首页三大模块点击;3-商品详情页访问;4-详情页停留时间统计;5-加入购物车;6-购物车-点击【去结算】;7-进入支付页点击【结算】;8-结算授权页-点击【确认提交支付】;
visitTime - 详情页停留时间(s),如果type类型是4，则visitTime必填
 * @returns
 */
export const trackingApi = (data) =>
  request({
    url: '/mall/api/home/tracking',
    method: 'post',
    data,
  })

//游客注册、登录
export const getMemberVisitorApi = (data) =>
  request({
    url: '/mall/api/member/visitor',
    method: 'post',
    data,
  })
