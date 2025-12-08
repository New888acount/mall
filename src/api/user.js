import request from '@/utils/request'

/**
 * 登录
 * @param
 * @returns
 */
export const loginApi = (data) =>
  request({
    url: '/api/member/login',
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
    url: '/api/member/captcha',
    method: 'get',
  })

/**
 * 注册
 * @param
 * @returns
 */
export const registerApi = (data) =>
  request({
    url: '/api/member/register',
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
    url: '/h5/member/info',
    method: 'GET',
  })

export const imgApi = (url) =>
  request({
    url: url,
    method: 'GET',
  })

  
