import i18n from '@/i18n/index'

const t = i18n.global.t
// 格式化库存
export function formatStock(type, num) {
  num = num + ''
  if (type === 'exact') {
    return t('cart.Inventory') + num
  } else {
    if (num < 10) {
      return `${t('cart.Inventory')}≤10`
    } else {
      let a = Math.pow(10, num.length - 1)
      return t('cart.Inventory') + ' ' + parseInt(num / a) * a + '+'
    }
  }
}

export function getOrderStatusName(status) {
  switch (status) {
    case 0:
      return t('order.status1')
    case 1:
      return t('order.status2')
    case 2:
      return t('order.status3')
    case 3:
      return t('order.status4')
    case 4:
      return t('order.status5')
    case 5:
      return t('order.status6')
  }
}

export function formatOrderColor(type) {
  if (type === 2 || type === 1) {
    return 'color: var(--color-yellow)'
  } else if (type === 4 || type === 5) {
    return 'color: var(--color-red)'
  } else if (type === 3) {
    return 'color: var(--color-light)'
  } else if (type === 0) {
    return 'color: var(--adm-color-primary)'
  }
}
