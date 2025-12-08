import { moneyFormat } from '@/utils/index'

const fn = (el, binding) => {
  el.innerHTML = moneyFormat(binding.value)
}

export default fn
