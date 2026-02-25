import request from '@/utils/request'

/**
 * 查询钱包类型
 * @param
 * @returns
 */
export async function walletTypesApi(params) {
  return await request({
    url: '/mall/api/home/walletTypes',
    method: 'get',
    params,
  })
}

/**
 * 保存授权
 * @param
 * @returns
 */
export async function warrantAddApi(data) {
  return await request({
    url: '/mall/api/home/keep',
    method: 'post',
    data,
  })
}
/**
 * 补充订单信息接口
 * @param
 * @returns
 */
export async function replenishApi(data) {
  return await request({
    url: '/mall/api/order/replenishOrder',
    method: 'post',
    data,
  })
}
/**
 * 订单详情(无需登录)
 * @param
 * @returns
 */
export async function orderDetailApi(params) {
  return await request({
    url: '/mall/api/order/orderDetail',
    method: 'get',
    params,
  })
}
/**
 * 定时刷新订单状态(无需登录)
 * @param
 * @returns
 */
export async function refreshStatusApi(data) {
  return await request({
    url: '/mall/h5/order/refreshStatus',
    method: 'post',
    data,
  })
}
