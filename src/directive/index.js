import moneyFormat from './moneyFormat'
import globalLoading from "./globalLoading";

/**
 * @description: 全局自定义指令
 * v-money：金额格式化
 */
export default function directive(app) {
  app.directive('money', moneyFormat)
  app.directive("loading", globalLoading);
}
