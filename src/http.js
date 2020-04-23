import axios from 'axios'
import router from './router'
import {Message} from 'element-ui'
import Vue from './main'

axios.default.timeout = 8000
// axios.default.baseUrl = ''

let loading = null
// http request 拦截器

axios.interceptors.request.use(
	(config) => {
		loading = Vue.$loading({
			lock      : true,
			text      : 'Loading',
			spinner   : 'el-icon-loading',
			background: 'rgba(0, 0, 0, 0.7)'
		})
		// const key = localStorage.getItem('Authorization')

		// if (key) { // 判断token是否存在
		// 	config.headers.Authorization = key // 将token设置成请求头
		// }
		return config
	},
	(err) => {
		return Promise.reject(err)
	}
)

// http response 拦截器
axios.interceptors.response.use(
	(response) => {
		loading.close()
		const arr = [ -1001, -1002, -1003, -1004, -1005, -1006 ]

		if (arr.indexOf(response.data.code) >= 0) {
			Message.error('登录已过期，请重新登录')
			router.replace('/login')
		}
		return response
	},
	(error) => {
		loading.close()
		let reg = RegExp(/401/)

		if (error.message.match(reg)) {
			Message.error('登录已过期，请重新登录')
			router.replace('/login')
		}
		return Promise.reject(error)
	}
)
export default axios
