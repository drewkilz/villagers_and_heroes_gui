import Vue from 'vue'

import { Category } from '@/models/category'
import { SALVAGE_KIT_NAME, Item } from '@/models/item'
import { Recipe } from '@/models/recipe'
import { Type } from '@/models/type'

let qs = require('qs');

export let SALVAGE_KIT = null

export function getCategory(name) {
    return Vue.prototype.axiosVnhApi.get(`categories/${name}`)
        .then(response => {
            if (response.status === 204)
                return null
            return Category.fromJson(response.data)
        })
        .catch(() => {
            return null
        })
}

export function getItem(name) {
    return Vue.prototype.axiosVnhApi.get(`items/${name}`)
        .then(response => {
            if (response.status === 204)
                return null
            return Item.fromJson(response.data)
        })
        .catch(() => {
            return null
        })
}

export function getRecipe(name) {
    return Vue.prototype.axiosVnhApi.get(`recipes/${name}`)
        .then(response => {
            if (response.status === 204)
                return null
            return Recipe.fromJson(response.data)
        })
        .catch(() => {
            return null
        })
}

export function getRecipes(ctx) {
    let params = `?page=${ctx.currentPage}&perPage=${ctx.perPage}`
    if (ctx.sortBy)
        params = `${params}&sortBy=${ctx.sortBy}&sortOrder=${ctx.sortDesc ? 'desc' : 'asc'}`

    const promise = Vue.prototype.axiosVnhApi.post(`recipes/${params}`, {
        filter: ctx.filter
    })

    return promise.then(response => {
        let recipes = []
        for (let index in response.data.recipes)
            recipes.push(Recipe.fromJson(response.data.recipes[index]))
        return {recipes: recipes, count: response.data.count}
    }).catch(() => {
        return []
    })
}

export function getSkills(name) {
    return Vue.prototype.axiosVnhApi.get(`skills/${name}`)
        .then(response => {
            let skills = []

            if (!response.data.types)
                return []

            for (let index in response.data.types) {
                skills.push(Type.fromJson(response.data.types[index]))
            }

            return skills
        })
        .catch(() => {
            return []
        })
}

export function initializeApi() {
    // Configure an axios instance for the Villagers & Heroes API with it's URL and authorization pre-configured
    const axios = require('axios')

    Vue.prototype.axiosVnhApi = axios.create({baseURL: process.env.VUE_APP_VNH_API_URL})
    Vue.prototype.axiosVnhApi.interceptors.request.use(function (config) {
        config.headers.Authorization = `Bearer ${process.env.VUE_APP_VNH_API_TOKEN}`
        return config
    })

    // Retrieve the Salvage Kit item
    getItem(SALVAGE_KIT_NAME).then(data => {
        SALVAGE_KIT = data
    })
}

export function upload(formData) {
    return Vue.prototype.axiosVnhApi.post(`village/upload/`, formData)
        .then(response => {
            return response.data
        })
        .catch(() => {
            return []
        })
}

export function status(url) {
    let shortened_url = url.replace(Vue.prototype.axiosVnhApi.defaults.baseURL, '')
    return Vue.prototype.axiosVnhApi.get(shortened_url)
        .then(response => {
            return response
        })
        .catch(() => {
            return []
        })
}

export function getEquipment(options) {
    let params = {
        level: options.level,
        numLevels: options.numLevels
    }

    if (options.heroClasses.length === 0 && options.heroSubClasses.length === 0 && options.villagerClasses.length === 0)
        // No data to fetch without a class specified
        return null

    if (options.heroClasses.length !== 0)
        params.heroClass = options.heroClasses

    if (options.heroSubClasses.length !== 0)
        params.heroSubClass = options.heroSubClasses

    if (options.villagerClasses.length !== 0)
        params.villagerClass = options.villagerClasses

    return Vue.prototype.axiosVnhApi.get('equipment/', {
        params: params,
        paramsSerializer: function(params) {
            return qs.stringify(params, {indices: false})
        }
    }).then(response => {
        let data = {}

        for (const group in response.data) {
            data[group] = []
            for (const recipe of response.data[group]) {
                data[group].push(Recipe.fromJson(recipe))
            }
        }

        return data
    })
    .catch(() => {
        return null
    })
}
