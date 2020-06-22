import Vue from 'vue'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import {CraftingCost} from "@/utility"

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

// Wake up the API in Heroku on loading the GUI if it's not awake, otherwise a significant delay occurs
Vue.prototype.axiosVnhApi.get('/')
    .then(() => {
        console.log('API is alive.')
        return []
    })
    .catch(() => {
        return []
    })

Vue.filter('craftingCostFilter', function (total) {
    return new CraftingCost(total)
})

new Vue({
    render: h => h(App),
}).$mount('#app')
