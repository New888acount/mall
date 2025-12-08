import MyLoading from "@/components/MyLoading";
import { createApp } from "vue";

// 挂载dom节点在绑定了v-loading的标签dom节点之下
const createLoading = (el) => {
  const style = getComputedStyle(el);
  // loading的位置根据父元素定位
  if (!["absolute", "fixed", "relative"].includes(style.position)) {
    el.classList.add("g-relative");
  }
  const loadingDom = document.createElement("div");
  // 添加自定义属性作为标识，避免重复loading
  loadingDom.setAttribute("data-v", "loading");
  loadingDom.style.position = `absolute`;
  loadingDom.style.top = `50%`;
  loadingDom.style.left = `50%`;
  loadingDom.style.transform = `translate(-50%,-50%)`;
  // 创建APP实例，传入loading组件，并且挂载loading组件和创建的标签
  const app = createApp(MyLoading);
  const instance = app.mount(loadingDom);
  loadingDom.appendChild(instance.$el);
  el.appendChild(loadingDom);
};

// 创建自定义指令
const vLoading = {
  //mounted的时候，v-loading变量值为true时，加载loading
  mounted(el, binding) {
    if (binding.value) {
      createLoading(el);
    }
  },
  //update的时候
  updated(el, binding) {
    //v-loading 的值为false，并且该节点下最后一个元素是loading时，移除节点
    if (!binding.value && el.lastChild.dataset?.v === "loading") {
      el.removeChild(el.lastChild);
      el.classList.remove("g-relative");
      return;
    }
    //v-loading 的值为true，并且该节点下没有loading节点时，调用函数，挂载loading
    if (binding.value && el.lastChild.dataset?.v !== "loading") {
      createLoading(el);
    }
  },
};

export default vLoading;
