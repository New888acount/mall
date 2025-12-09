import request from '@/utils/request'

/**
 * 默认地址
 * @param
 * @returns
 */
export const getAddressDefaultApi = () =>
  request({
    url: '/mall/h5/member/address/default',
    method: 'GET',
  })

/**
 * 地址列表
 * @param
 * @returns
 */
export const addressListApi = () =>
  request({
    url: '/mall/h5/member/address/list',
    method: 'GET',
  })

/**
 * 地址详情
 * @param
 * @returns
 */
export const addressDetailApi = (id) =>
  request({
    url: `/mall/h5/member/address/${id}`,
    method: 'GET',
  })

/**
 * 获取地区
 * @param
 * @returns
 */
export const areaApi = () =>
  request({
    url: `/mall/h5/area`,
    method: 'GET',
  })

/**
 * 创建地址
 * @param
 * @returns
 */
export const createAddressApi = (data) =>
  request({
    url: `/mall/h5/member/address/create`,
    method: 'POST',
    data,
  })

/**
 * 更新地址
 * @param
 * @returns
 */
export const updateAddressApi = (data) =>
  request({
    url: `/mall/h5/member/address/update`,
    method: 'PUT',
    data,
  })

/**
 * 删除地址
 * @param
 * @returns
 */
export const deteleAddressApi = (id) =>
  request({
    url: `/mall/h5/member/address/${id}`,
    method: 'DELETE',
  })
