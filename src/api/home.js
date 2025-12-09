import request from '@/utils/request'

/**
 * 登录
 * @param
 * @returns
 */
export const homeVisitApi = () =>
  request({
    url: '/mall/api/home/visit',
    method: 'get',
  })
