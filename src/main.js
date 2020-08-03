import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueAnalytics from 'vue-analytics';

import { initializeApi } from '@/vnhApi'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

// For Google Analytics
Vue.use(VueAnalytics, {
    id: 'UA-174224589-2',
    router
})

Vue.config.productionTip = true

initializeApi()

import App from '@/App'

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
