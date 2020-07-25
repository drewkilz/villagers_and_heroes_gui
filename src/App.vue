<template>
    <div id="app">
        <NavBar :title="title"
                :craftingList="craftingList"
                @clear-crafting-list="clearCraftingList"
                ref="navBar"></NavBar>
        <b-container>
            <div class="content-header">.: {{ this.$router.currentRoute.name }} :.</div>
            <router-view :craftingList="craftingList"
                         @add-to-crafting-list="addToCraftingList"
                         @clear-crafting-list="clearCraftingList"
                         @remove-from-crafting-list="removeFromCraftingList"></router-view>
        </b-container>
        <Footer></Footer>
    </div>
</template>

<script>
    import Footer from '@/components/Footer'
    import NavBar from '@/components/NavBar'
    import { CraftingList as _CraftingList } from '@/crafting/list'

    export default {
        name: 'App',
        components: {
            NavBar,
            Footer
        },
        data() {
            return {
                type: null,
                title: process.env.VUE_APP_TITLE,
                craftingList: new _CraftingList()
            }
        },
        methods: {
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
