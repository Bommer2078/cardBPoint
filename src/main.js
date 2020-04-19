import Vue from 'vue'
import vCard from './App'
import { Table, TableColumn, Pagination, Tree, Message, MessageBox, TimeSelect,
	Select, Option, Dialog, Switch, Button, Avatar, Radio, Checkbox, RadioGroup,
	RadioButton, DatePicker, Loading, Breadcrumb, BreadcrumbItem} from 'element-ui'
import router from './router'
import api from './libs/api'
import utils from './libs/utils'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'
import axios from './http'
import VueUeditorWrap from 'vue-ueditor-wrap'
import upload from '@/mixin/uploadImg.js'
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tree)
Vue.use(Pagination)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Switch)
Vue.use(Button)
Vue.use(Avatar)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(Loading)
Vue.use(TimeSelect)
Vue.use(DatePicker)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.config.productionTip = false

Vue.prototype.$api = api
Vue.prototype.$utils = utils
Vue.prototype.$http = axios
Vue.prototype.$message = Message
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.mixin(upload)
Vue.prototype.$EventBus = new Vue()
Vue.component('vue-ueditor-wrap', VueUeditorWrap)
/* eslint-disable no-new */
const $vue = new Vue({
	router,
	el        : '#vCard',
	components: { vCard },
	template  : '<vCard/>'
})

export default $vue
