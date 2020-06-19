import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = true

// Configure an axios instance for the Villagers & Heroes API with it's URL and authorization pre-configured
const axios = require('axios')

Vue.prototype.axiosVnhApi = axios.create({baseURL: process.env.VUE_APP_VNH_API_URL})
Vue.prototype.axiosVnhApi.interceptors.request.use(function (config) {
  config.headers.Authorization = 'Bearer ' + process.env.VUE_APP_VNH_API_TOKEN
  return config
})

new Vue({
  render: h => h(App),
}).$mount('#app')
