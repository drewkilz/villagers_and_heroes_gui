import Vue from 'vue'

export function initializeApi() {
    // Configure an axios instance for the Villagers & Heroes API with it's URL and authorization pre-configured
    const axios = require('axios')

    Vue.prototype.axiosVnhApi = axios.create({baseURL: process.env.VUE_APP_VNH_API_URL})
    Vue.prototype.axiosVnhApi.interceptors.request.use(function (config) {
        config.headers.Authorization = `Bearer ${process.env.VUE_APP_VNH_API_TOKEN}`
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
}

export function getItem(name) {
    return Vue.prototype.axiosVnhApi.get(`items/${name}`)
        .then(response => {
            return response.data
        })
        .catch(() => {
            return null
        })
}

export function getRecipe(name) {
    return Vue.prototype.axiosVnhApi.get(`recipes/${name}`)
        .then(response => {
            return response.data
        })
        .catch(() => {
            return null
        })
}
