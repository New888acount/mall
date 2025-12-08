// 格式化库存
export function formatStock(type, num) {
  num = num + ''
  if (type === 'exact') {
    return '库存' + num
  } else {
    if (num < 10) {
      return '库存≤10'
    } else {
      let a = Math.pow(10, num.length - 1)
      return '库存 ' + parseInt(num / a) * a + '+'
    }
  }
}

export function getOrderStatusName(status) {
  switch (status) {
    case 0:
      return '待付款'
    case 1:
      return '待发货'
    case 2:
      return '待收货'
    case 3:
      return '已完成'
    case 4:
      return '已取消'
    case 5:
      return '无效订单'
  }
}

export function formatOrderColor(type) {
  if (type === 2 || type === 1) {
    return 'color: yellow'
  } else if (type === 4 || type === 5) {
    return 'color: red'
  } else if (type === 3) {
    return 'color: var(--color-light)'
  } else if (type === 0) {
    return 'color: green'
  }
}
