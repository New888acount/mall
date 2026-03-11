import AppMountComponent from '@/utils/appMountComponent.js'
import component from './index.vue'
const defaultParmas = {
  name: 'languagePop',
  component,
}
export default (parmas = {}) => {
  parmas = Object.assign(parmas, defaultParmas)
  return new AppMountComponent(parmas)
}
