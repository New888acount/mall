import { createApp } from "vue";

import Loading from "@/components/MyLoading/index.vue";

const loading = {
  mounted(el, binding) {
    const app = createApp(Loading);
    const instance = app.mount(document.createElement("div"));
    el.instance = instance;
    el.style.position = "relative";
    if (binding.value) {
      appendEl(el);
    }
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      binding.value ? appendEl(el) : removeEl(el);
    }
  },
};

const appendEl = (el) => {
  el.appendChild(el.instance.$el);
};

const removeEl = (el) => {
  el.removeChild(el.instance.$el);
};

export default loading;
