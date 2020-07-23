<template>
    <div id="app">
        <NavBar :title="title"
                @switch-content="switchContent"
                :craftingList="craftingList"
                @clear-crafting-list="clearCraftingList"
                ref="navBar"></NavBar>
        <b-container>
            <div class="content-header">.: {{ currentContentTitle }} :.</div>
            <component v-bind:is="currentContentComponent"
                       @switch-content="switchContent"
                       :craftingList="craftingList"
                       @add-to-crafting-list="addToCraftingList"
                       @clear-crafting-list="clearCraftingList"
                       @remove-from-crafting-list="removeFromCraftingList"></component>
        </b-container>
        <Footer @switch-content="switchContent"></Footer>
    </div>
</template>

<script>
    import Crafting from '@/components/Crafting'
    import CraftingList from '@/components/CraftingList'
    import Credits from '@/components/Credits'
    import Footer from '@/components/Footer'
    import Home from '@/components/Home'
    import NavBar from '@/components/NavBar'
    import NotFound from '@/components/NotFound'
    import Recipes from '@/components/Recipes'
    import Party from '@/components/Party'
    import VillageUpload from '@/components/VillageUpload'
    import { CraftingList as _CraftingList } from '@/crafting/list'

    export default {
        name: 'App',
        components: {
            NavBar,
            Footer,
            Home,
            Recipes,
            NotFound,
            Crafting,
            Credits,
            CraftingList,
            Party,
            VillageUpload
        },
        data() {
            return {
                type: null,
                title: process.env.VUE_APP_TITLE,
                currentContentComponent: 'Home',
                currentContentTitle: 'Home',
                contentComponents: {
                    // TODO: Use vue.router
                    home: {component: 'Home'},
                    crafting: {component: 'Crafting'},
                    craftingList: {component: 'CraftingList', title: 'Crafting List'},
                    // TODO: equipment: {component: 'Equipment'}, <!-- TODO: As part of the equipment, enable a way to select all for a series of levels? like 16-29, for example? -->
                    recipes: {component: 'Recipes'},
                    // TODO: village: {component: 'Village'},
                    upload: {component: 'VillageUpload', title: 'Village Image Uploader'},
                    party: {component: 'Party', title: 'Crafting Party'},
                    notFound: {component: 'NotFound', title: '404 :: Not Found'},
                    credits: {component: 'Credits'}
                },
                craftingList: new _CraftingList()
            }
        },
        methods: {
            switchContent(componentKey) {
                if (!(componentKey in this.contentComponents)) {
                    componentKey = 'notFound'
                }

                this.currentContentComponent = this.contentComponents[componentKey]['component']
                this.currentContentTitle = 'title' in this.contentComponents[componentKey] ?
                    this.contentComponents[componentKey]['title'] :
                    this.contentComponents[componentKey]['component']
            },
            addToCraftingList(object) {
                this.craftingList.add(object.object, object.quantity || 1)
                this.$refs.navBar.updateCraftingListCount()
            },
            clearCraftingList() {
                this.craftingList.reset(true)
                this.$refs.navBar.updateCraftingListCount()
            },
            removeFromCraftingList(object) {
                this.craftingList.remove(object.object)
                this.$refs.navBar.updateCraftingListCount()
            }
        },
        mounted() {
            // TODO: Remove when done debugging
            this.switchContent('upload')
        }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }

    .container {
        padding: 15px;
        max-width: 100%;
    }

    .content-header {
        font-weight: bold;
    }

    a {
        color: rgba(0, 0, 0, 0.5);
    }

    a:hover {
        color: rgba(0, 0, 0, 0.75);
        text-decoration: none;
    }
</style>
