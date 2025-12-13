import request from '@/utils/request'

/**
 * 登录
 * @param
 * @returns
 */
export const loginApi = (data) =>
  request({
    url: '/mall/api/member/login',
    method: 'post',
    data,
  })

/**
 *获取验证码
 * @param
 * @returns
 */
export const getCodeApi = () =>
  request({
    url: '/mall/api/member/captcha',
    method: 'get',
  })

/**
 * 注册
 * @param
 * @returns
 */
export const registerApi = (data) =>
  request({
    url: '/mall/api/member/register',
    method: 'post',
    data,
  })

/**
 * 个人信息
 * @param
 * @returns
 */
export const profileApi = () =>
  request({
    url: '/mall/h5/member/info',
    method: 'GET',
  })

/**
 * 获取公钥
 * @param
 * @returns
 */
export const getPublicKey = () =>
  request({
    url: '/api/common/getPublicKey',
    method: 'GET',
  })


  
