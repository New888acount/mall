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

/**
 * 添加收藏
 * @param
 * @returns
 */
export const addFavoriteApi = (data) =>
  request({
    url: '/mall/h5/member/favorite/add',
    method: 'post',
    data,
  })

/**
 * 取消收藏
 * @param
 * @returns
 */
export const cancelFavoriteApi = (data) =>
  request({
    url: '/mall/h5/member/favorite/cancel',
    method: 'post',
    data,
  })

/**
 * 收藏列表
 * @param
 * @returns
 */
export const getFavoriteListApi = (data) =>
  request({
    url: '/mall/h5/member/favorite/list',
    method: 'post',
    data,
  })
