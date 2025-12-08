import request from '@/utils/request'

/**
 * 商品列表
 * @param
 * @returns
 */
export const goodsListApi = (data) =>
  request({
    url: '/no-auth/product/list',
    method: 'post',
    data,
  })

  /**
 * 商品详情
 * @param
 * @returns
 */
export const goodsDetailsApi = (id) =>
  request({
    url: '/no-auth/product/detail/' + id,
    method: 'get',
  })

