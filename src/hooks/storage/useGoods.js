import i18n from '@/i18n/index'

const t = i18n.global.t
// 格式化库存
export function formatStock(type, num) {
  num = num + ''
  if (type === 'exact') {
    return t('stock') + num
  } else {
    if (num < 10) {
      return `${t('stock')}≤10`
    } else {
      let a = Math.pow(10, num.length - 1)
      return t('stock') + parseInt(num / a) * a + '+'
    }
  }
}

export function getOrderStatusName(status) {
  switch (status) {
    case 0:
      return t('order.state0')
    case 1:
      return t('order.state1')
    case 2:
      return t('order.state2')
    case 3:
      return t('order.state3')
    case 4:
      return t('order.state4')
    case 5:
      return t('order.state5')
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
