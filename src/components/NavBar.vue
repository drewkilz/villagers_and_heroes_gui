<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-brand to="/">{{ title }}</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item to="/recipes">Recipes</b-nav-item>
                    <b-nav-item to="/equipment">Equipment</b-nav-item>
                    <b-nav-item to="/crafting">Crafting</b-nav-item>
                    <b-nav-item to="/party">Crafting Party</b-nav-item>
                    <!--<b-nav-item to="/village">Village</b-nav-item>-->
                    <!--<b-nav-item to="/upload">Upload</b-nav-item>-->
                </b-navbar-nav>
            </b-collapse>
            <b-navbar-nav class="ml-auto">
                <b-nav-item to="/crafting/list" right id="crafting-list-icon">
                    <span v-if="craftingListCount" :key="craftingListCount">({{ craftingListCount }}) </span>
                    <b-icon-cart></b-icon-cart>
                </b-nav-item>
                <b-popover
                        target="crafting-list-icon"
                        placement="left"
                        triggers="hover">
                    <template v-slot:title>Crafting List</template>
                    <b-table
                            striped
                            small
                            head-variant="dark"
                            :items="craftingListItems"
                            :fields="craftingListFields"
                            primary-key="id"
                            show-empty>
                        <template v-slot:empty>
                            <p>No recipes selected.</p>
                            <p>
                                You can select the recipes and quantities to craft in the
                                <b-link to="/equipment">Equipment</b-link> or
                                <b-link to="/recipes">Recipes</b-link> tool.
                            </p>
                        </template>
                        <template v-slot:cell(name)="data">
                            {{ data.item.object.name }}
                        </template>
                        <template v-slot:cell(quantity)="data">
                            <div class="text-center">
                                {{ data.item.quantity.total }}
                            </div>
                        </template>
                        <template v-slot:table-caption>{{ craftingList.count }} recipes found.</template>
                    </b-table>
                </b-popover>
                <b-nav-item right>
                    <b-iconstack v-b-tooltip.hover title="Clear Crafting List" v-on:click="clearCraftingList">
                        <b-icon-cart stacked variant="" scale="0.75"></b-icon-cart>
                        <b-icon-slash-square stacked variant="secondary"></b-icon-slash-square>
                    </b-iconstack>
                </b-nav-item>
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script>
    import { compareValues } from '@/utility'
    import { CraftingList } from '@/crafting/list'

    export default {
        name: 'NavBar',
        props: {
            title: {
                type: String,
                required: true
            },
            craftingList: {
                type: CraftingList,
                required: true
            }
        },
        data() {
            return {
                craftingListFields: [
                    {key: 'name'},
                    {key: 'quantity'}
                ],
                craftingListCount: 0
            }
        },
        methods: {
            clearCraftingList() {
                this.$emit('clear-crafting-list')
            },
            craftingListItems() {
                let items = []

                for (let key in this.craftingList.list) {
                    items.push(this.craftingList.list[key])
                }

                items.sort(compareValues('object.name'))

                return items
            },
            updateCraftingListCount() {
                this.craftingListCount = this.craftingList.count
            }
        }
    }
</script>
