import request from '@/utils/request'

/**
 * 计算订单信息
 * @param
 * @returns
 */
export const orderCalcApi = (data) =>
  request({
    url: '/mall/h5/order/addOrderCheck',
    method: 'POST',
    data,
  })

/**
 * 创建订单
 * @param
 * @returns
 */
export const orderCreateApi = (data) =>
  request({
    url: '/mall/h5/order/add',
    method: 'POST',
    data,
  })

/**
 * 订单列表
 * @param
 * @returns
 */
export const orderListApi = (params) =>
  request({
    url: '/mall/h5/order/page',
    method: 'get',
    params,
  })

/**
 * 订单数量
 * @param
 * @returns
 */
export const orderCountApi = () =>
  request({
    url: '/mall/h5/order/countOrder',
    method: 'get',
  })

  /**
 * 订单详情
 * @param
 * @returns
 */
export const orderDetailApi = (id) =>
  request({
    url: `/mall/h5/order/orderDetail?orderId=${id}`,
    method: 'GET',
  })

/**
 * 取消订单
 * @param
 * @returns
 */
export const orderCancelApi = (data) =>
  request({
    url: '/mall/h5/order/orderCancel',
    method: 'POST',
    data,
  })

/**
 * 删除订单
 * @param
 * @returns
 */
export const orderDeleteApi = (id) =>
  request({
    url: `/mall/h5/order/order/${id}`,
    method: 'DELETE',
  })



/**
 * 确认收货
 * @param
 * @returns
 */
export const orderConfirmApi = (id) =>
  request({
    url: `/mall/h5/order/orderComplete?orderId=${id}`,
    method: 'GET',
    // params: {orderId: id},
  })
