import { createApp } from 'vue'
import setVueAppConfig from '@/utils/vueAppConfig'
export default class AppMountComponent {
	/**
	 *
	 * @param { String } name - 组件的名字，（必须)
	 * @param { Object } component - 组件引用，(必须)
	 * @param { String } key - 用于同组件，同时多个弹窗
	 * @param { Object } props - 组件的props
	 * @param { String } type - 组件的类型必须为'show', 'hide', 'remount', 'unmount'中的一个，
	 * show 显示组件（默认选项），如果没有挂载组件会自动创建,（不会重复挂载）,第一次创建会触发组件的onMounted()
	 * hide是隐藏组件(不会销毁)如果隐藏的组件不存在那么会忽视，相当于操作了组件show.value=false
	 * remount是重载组件，会销毁已有的组件，进行重新挂载,会触发组件的onMounted(),onUnmounted()
	 * unmount是卸载组件，会销毁已有的组件，会触发组件的onUnmounted()
	 * @param { Number } duration - 延迟多长时间卸载组件(目的是为了组件卸载之前可以执行完组件关闭的动画)
	 * @param { Function } config - 给当前自己组件配置插件
	 * @param { Function } mountBefore - 挂载之前执行的函数（如果return false 会终止挂载)只会执行一次
	 * @param { Function } mountAfter - 挂载之后执行的函数（如果mountBefore函数return false 那么不会执行mountAfter函数）只会执行一次
	 * @returns Promise
	 *
	 * @example
	 *  testMount目录
	 *    testMount目录下面创建index.vue文件
	 *    index.vue代码:
	 *    <template>
	 *        <van-popup v-model:show="show" >
	 *    </<template>
	 *    <script setup>
	 *      const show=ref(false)
	 *      // show 一定要暴露,因为app.mount(mountNode) 会返回组件defineExpose({})暴露的值，然后我们将这个值存在window里面
	 *      // 这样我们通过操作保存在window里面show的值，就可以控制组件里面show的值
	 *      defineExpose({
	 *         show,
	 *      })
	 *    </script>
	 *
	 *    testMount目录下面创建index.js文件
	 *    index.js代码：
	 *    import component from './index.vue'
	 *    import AppMountComponent from '@/utils/appMountComponent.js'
	 *    const defaultParmas = {
	 *    name: 'TestMount', // 必须
	 *    component, // 必须
	 *   }
	 *    export default (parmas = {}) => {
	 *     parmas = Object.assign(parmas, defaultParmas)
	 *     return new AppMountComponent(parmas)
	 *   }
	 *
	 *  app.vue页面
	 *    <script setup>
	 *       import testMountComponent from '@/views/testMount/index.js'
	 *
	 *    // 显示组件
	 *
	 *       testMountComponent({type:'show'})
	 *       或者这样testMountComponent()
	 *
	 *    // 显示组件并且传递参数,props参数是传递给组件的props只有在组件初次挂载才有效
	 *
	 *       testMountComponent({type:'show',props:{a:1}})
	 *       或者这样testMountComponent({props:{a:1}})
	 *
	 *    // 隐藏组件（不会卸载组件）
	 *
	 *       testMountComponent({type:'hide'})
	 *
	 *    // 卸载组件,会先执行show.value=false 然后300 毫秒(默认是500毫秒)以后执行卸载组件,duration 目的是为了让弹窗执行完关闭动画再卸载组件
	 *
	 *       testMountComponent({type:'unmount',duration:300})
	 *
	 *    // 重载组件,会先执行show.value=false 然后500 毫秒(默认是500毫秒)以后执行卸载组件,duration 目的是为了让弹窗执行完关闭动画再卸载组件
	 *    // 卸载以后会重新执行挂载组件testMountComponent({type:'show'})
	 *       testMountComponent({type:'remount'})
	 *
	 *    // 异步挂载组件
	 *
	 *       onMounted(async()=>{
	 *          await testMountComponent()
	 *          console.log('挂载完组件才执行这段代码')
	 *       })
	 *
	 *    // 在别的页面可以这样判断组件是否已经挂载了,（就是页面是否已经有显示该弹窗了）
	 *
	 *       if (window['myTestMount'] && window['myTestMount'].state.show) {
	 *          console.log('TestMount组件已挂载')
	 *       }
	 *
	 *    // 同一个组件同时多次弹出，要传key,销毁的时候也要把对应的key 传入进去
	 *
	 *       for(let i=0;i<3;i++){
	 *          testMountComponent({type:'show',key:i})
	 *       }
	 *
	 *    // 销毁第一个组件弹窗
	 *
	 *       testMountComponent({type:'remount',key:0})
	 *
	 * </script>
	 *
	 */

	constructor(parmas) {
		const defaultParams = {
			name: '', // 挂载的组件名字
			component: null, // 挂载的组件
			key: '', // 组件的key,用于同一个组件同时弹出多个弹窗,这样组件的名字会加上这个key值
			props: {}, // 挂载组件传递的参数
			type: 'show', // 挂载组件的类型,show,hide,remount,unmount
			duration: 500, // 延迟多长时间卸载组件，只有type 等于'remount', 'unmount'才有效
			config: () => {}, // 配置当前组件的插件
			mountBefore: () => {}, // 挂载之前,比如弹窗需要登录才能显示，那么逻辑就可以写在里面，如果没登录直接返回return false,这样组件就不会挂载了
			mountAfter: () => {}, // 挂载之后(和组件的onMounted一样)
		}
		this.parmas = Object.assign(defaultParams, parmas)
		this.myComponentName = `my${this.parmas.name}${this.parmas.key}` // 名字前面加my是为了防止跟window的其他属性重叠
		return new Promise((resolve, reject) => {
			this.interceptors(resolve, reject)
		})
	}

	/** 隐藏 */
	hide() {
		if (window[this.myComponentName]) {
			window[this.myComponentName].state.show = false
		}
	}

	/** 显示 */
	show() {
		if (window[this.myComponentName]) {
			window[this.myComponentName].state.show = true
		}
	}

	/** 挂载组件之前进行拦截判断 */
	async interceptors(resolve, reject) {
		try {
			if (
				['remount', 'unmount'].includes(this.parmas.type) &&
				window[this.myComponentName]
			) {
				this.hide()
				await new Promise((resolve) => {
					setTimeout(() => {
						window[this.myComponentName].app.unmount(
							window[this.myComponentName].mountNode
						)
						document.body.removeChild(
							window[this.myComponentName].mountNode
						)
						delete window[this.myComponentName]
						return resolve()
					}, this.parmas.duration)
				})
			}

			if (window[this.myComponentName]) {
				window[this.myComponentName].type = this.parmas.type
			}
			if (this.parmas.type === 'hide') {
				this.hide()
				if (window[this.myComponentName])
					return resolve(window[this.myComponentName])
			}
			if (this.parmas.type === 'show') {
				this.show()
				if (window[this.myComponentName])
					return resolve(window[this.myComponentName])
			}
			// 挂载之前或销毁组件
			if (
				this.parmas.mountBefore() === false ||
				this.parmas.type === 'unmount'
			)
				return resolve()
			this.mountComponent(resolve, reject)
		} catch (error) {
			return reject(error)
		}
	}

	/** 挂载组件 */
	mountComponent(resolve, reject) {
		try {
			const mountNode = document.createElement('div')
			document.body.appendChild(mountNode)
			// 注意：app里面的_instance在生产环境会为null，所有不能使用_instance去操作组件的状态
			const app = createApp(this.parmas.component, {
				...this.parmas.props,
			})
			// 挂载全局插件
			setVueAppConfig(app)
			// 挂载组件自己插件
			this.parmas.config(app)
			// app.mount(mountNode) 会返回组件defineExpose({})暴露的值,暴露的值是响应式的
			//组件的'show', 'hide', 'remount', 'unmount都会操作到组件的const show=ref(false)，所有show 一定要暴露出来 defineExpose({show})
			const state = app.mount(mountNode)
			window[this.myComponentName] = {
				...this.parmas,
				app,
				state,
				mountNode,
				myComponentName: this.myComponentName,
			}
			this.show()
			resolve(window[this.myComponentName])
			this.parmas.mountAfter()
		} catch (error) {
			return reject(error)
		}
	}
}
