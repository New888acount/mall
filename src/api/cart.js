import request from '@/utils/request'

/**
 * 添加购物车
 * @param
 * @returns
 */
export const addCartApi = (data) =>
  request({
    url: '/h5/cart/add',
    method: 'post',
    data,
  })

  /**
 * 购物车列表
 * @param
 * @returns
 */
export const cartListApi = () =>
    request({
      url: '/h5/cart/list',
      method: 'get',
    })

    /**
 * 删除购物车
 * @param
 * @returns
 */
export const deleteCartApi = (ids) =>
    request({
      url: `/h5/cart/remove`,
      method: 'DELETE',
      data: ids,
      // headers: {
      //   'Content-Type': 'text/plain'   // ✅ 强制告诉后端这是纯文本
      // },
      // transformRequest: [(data) => data]
    })

    /**
 * 更新购物车
 * @param
 * @returns
 */
export const updateCartApi = (data) =>
    request({
      url: '/h5/cart/modify',
      method: 'POST',
      data,
    })
