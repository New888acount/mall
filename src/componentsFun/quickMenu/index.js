import component from './index.vue'
import AppMountComponent from '@/utils/appMountComponent.js'
const defaultParmas = {
  name: 'quickMenu',
  component,
}
export default (parmas = {}) => {
  parmas = Object.assign(parmas, defaultParmas)
  return new AppMountComponent(parmas)
}
