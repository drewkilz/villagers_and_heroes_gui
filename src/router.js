import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home'
import NotFound from './views/Home'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Villagers & Heroes Utilities',
        component: Home
    },
    {
        path: '/contact',
        name: 'Contact',
        component: () => import(/* webpackChunkName: 'about' */ './views/Contact')
    },
    {
        path: '/crafting',
        name: 'Crafting',
        component: () => import(/* webpackChunkName: 'about' */ './views/Crafting')
    },
    {
        path: '/crafting/list',
        name: 'Crafting List',
        component: () => import(/* webpackChunkName: 'about' */ './views/CraftingList')
    },
    {
        path: '/credits',
        name: 'Credits',
        component: () => import(/* webpackChunkName: 'about' */ './views/Credits')
    },
    {
        path: '/equipment',
        name: 'Equipment',
        component: () => import(/* webpackChunkName: 'about' */ './views/Equipment')
    },
    {
        path: '/party',
        name: 'Crafting Party',
        component: () => import(/* webpackChunkName: 'about' */ './views/Party')
    },
    {
        path: '/recipes',
        name: 'Recipes',
        component: () => import(/* webpackChunkName: 'about' */ './views/Recipes')
    },
    // {
    //     path: '/village',
    //     name: 'Village',
    //     component: () => import(/* webpackChunkName: 'about' */ './views/Village')
    // },
    {
        path: '/village/upload',
        name: 'Village Image Uploader',
        component: () => import(/* webpackChunkName: 'about' */ './views/VillageUpload')
    },
    {
        path: '*',
        name: '404 :: Not Found',
        component: NotFound
    },
    {
        path: '/policies',
        name: 'Policies',
        component: () => import(/* webpackChunkName: 'policies' */ './views/Policies')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
