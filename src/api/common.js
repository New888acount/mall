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
