import Layout from '@/layout/index.vue'
import { createRouter, createWebHistory } from 'vue-router'
/**
 * meta参数说明
 * @param title	页面标题
 * @param bgColor	背景颜色，可以在项目全局normal.less文件定义  desktop 表示pc    mobile 表示移动端
 * @param isToken	页面是否登录可以访问  true必须要登录  false 不需要登录
 * @param inTitle	国际化字段
 * @param navShow	导航栏是否显示  desktop 表示pc    mobile 表示移动端    navigation 移动端导航栏是否展示  footer 移动端版权信息   收 showMobileNavBar  移动端是否展示顶部导航栏   Pcfooter pc端版权信息   pageMax //是否添加页面版心page-max-width-wrap
 * @param navbar 顶部搜索导航
 * @param navigation 底部导航
 *
 * @returns
 */

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(),
  scrollBehavior() {
    // 始终滚动到顶部
    return { top: 0 }
  },
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      meta: {
        title: '404',
      },
      component: async () => await import('@/views/errorPage/404.vue'),
    },
    {
      path: '/',
      redirect: '/home',
      component: Layout,
      name: 'index',
      children: [
        {
          path: '/home',
          name: 'home',
          meta: {
            navShow: {
              navigation: true,
              navbar: true,
            },
            // bgColor: {
            //   desktop: 'html-bg-default',
            //   mobile: 'html-bg-mobile-home',
            // },
          },
          component: async () => await import('@/views/home/index.vue'),
        },
        {
          path: '/goods/list', // 动态参数 :id
          name: 'goods-list',
          meta: {
            navShow: {
              navigation: false,
              navbar: false,
            },
          },
          component: async () => await import('@/views/goods/list.vue'),
        },
        {
          path: '/goods/index', // 动态参数 :id
          name: 'goodsDetail',
          meta: {
            // requiresAuth: true,
            navShow: {
              navigation: false,
              navbar: false,
            },
          },
          component: async () => await import('@/views/goods/index.vue'),
        },
        {
          path: '/cart',
          name: 'cart',
          meta: {
            navShow: {
              navbar: false,
              navigation: true,
            },
          },
          component: async () => await import('@/views/cart/index.vue'),
        },
        {
          path: '/profile',
          name: 'profile',
          meta: {
            navShow: {
              navbar: false,
              navigation: true,
            },
          },
          component: async () => await import('@/views/profile/index.vue'),
        },
        {
          path: '/order',
          name: 'order',
          meta: {
            requiresAuth: true,
            navShow: {
              navbar: false,
              navigation: true,
            },
          },
          component: async () => await import('@/views/order/index.vue'),
        },
        {
          path: '/order/list',
          name: 'order-list',
          meta: {
            requiresAuth: true,
            navShow: {
              navbar: false,
              navigation: false,
            },
          },
          component: async () => await import('@/views/order/list.vue'),
        },
        {
          path: '/order/detail',
          name: 'order-detail',
          meta: {
            requiresAuth: true,
            navShow: {
              navbar: false,
              navigation: false,
            },
          },
          component: async () => await import('@/views/order/detail.vue'),
        },
        {
          path: '/pay',
          name: 'pay',
          meta: {
            requiresAuth: true,
            navShow: {
              navbar: false,
              navigation: false,
            },
          },
          component: async () => await import('@/views/pay/index.vue'),
        },
        {
          path: '/address/list',
          name: 'address',
          meta: {
            requiresAuth: true,
            navShow: {
              navbar: false,
              navigation: false,
            },
          },
          component: async () => await import('@/views/address/index.vue'),
        },
        {
          path: '/address/edit',
          name: 'addressDetail',
          meta: {
            requiresAuth: true,
            navShow: {
              navbar: false,
              navigation: false,
            },
          },
          component: async () => await import('@/views/address/addressDetail.vue'),
        },
        {
          path: 'search',
          name: 'search',
          meta: {
            navShow: {
              navbar: false,
              navigation: false,
            },
          },
          component: async () => await import('@/views/search/index.vue'),
        },
        {
          path: 'faq',
          name: 'faq',
          meta: {
            navShow: {
              navbar: false,
              navigation: false,
            },
          },
          component: async () => await import('@/views/faq/index.vue'),
        },
        {
          path: 'privacy',
          name: 'privacy',
          meta: {
            navShow: {
              navbar: false,
              navigation: false,
            },
          },
          component: async () => await import('@/views/privacy/index.vue'),
        },
        {
          path: 'about',
          name: 'about',
          meta: {
            navShow: {
              navbar: false,
              navigation: false,
            },
          },
          component: async () => await import('@/views/about/index.vue'),
        },
        {
          path: 'favorite',
          name: 'favorite',
          meta: {
            navShow: {
              navbar: false,
              navigation: false,
            },
          },
          component: async () => await import('@/views/favorite/index.vue'),
        },
      ],
    },
  ],
})

export default router
