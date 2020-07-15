import Vue from 'vue'

import './plugins/index'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import api from '@/api/index'
import request from '@/utils/request'
import '@/icons' // icon
import '@/permission' // permission control

Vue.prototype.$http = request
Vue.prototype.$api = api
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
