<template>
    <div id="crafting">
        <!-- TODO: Bug: If you add items to the crafting list, come to crafting, navigate away, then come back, all sorts of errors occur - no idea why! -->
        <div v-if="!craftingList.count && !isBusy">
            <p>No recipes selected.</p>
            <p>
                You can select the recipes and quantities to craft in either the
                <b-link href="#" v-on:click="switchContent('equipment')">Equipment</b-link> or
                <b-link href="#" v-on:click="switchContent('recipes')">Recipes</b-link> tool.
            </p>
        </div>
        <!-- TODO: Implement a crafting list view where you can review and add/remove/update quantities before finalizing the crafting list -->
        <!-- TODO: Add in an options panel for salvaging, percentages, etc. -->
        <div v-else-if="isBusy">
            <div class="text-center">
                <b-spinner small class="align-middle"></b-spinner> <strong>Loading...</strong>
            </div>
        </div>
        <b-table-simple
                v-else
                hover
                responsive="true"
                head-variant="dark"
                :fields="fields"
                primary-key="id"
                small>
            <b-thead class="thead-dark">
                <b-tr>
                    <b-th>Name</b-th>
                    <b-th>Needed</b-th>
                    <b-th>Obtained</b-th>
                    <b-th>Total</b-th>
                    <b-th>Source</b-th>
                </b-tr>
            </b-thead>
            <CraftingHeaderRow :value='"Items"'></CraftingHeaderRow>
            <tbody v-for="(item, key, index) in this.craftingList.items" :key="item.id">
                <CraftingItemRow :item="item" :index="index" @value-change="valueChange"></CraftingItemRow>
            </tbody>
            <CraftingHeaderRow :value='"Refined Ingredients"'></CraftingHeaderRow>
            <tbody v-for="(item, key, index) in this.craftingList.refined" :key="item.id">
                <CraftingItemRow :item="item" :index="index" @value-change="valueChange"></CraftingItemRow>
            </tbody>
            <CraftingHeaderRow :value='"Crafting Components"'></CraftingHeaderRow>
            <tbody v-for="(item, key, index) in this.craftingList.components" :key="item.id">
                <CraftingItemRow :item="item" :index="index" @value-change="valueChange"></CraftingItemRow>
            </tbody>
            <CraftingHeaderRow :value='"Final Products"'></CraftingHeaderRow>
            <tbody v-for="(item, key, index) in this.craftingList.list" :key="item.id">
                <CraftingItemRow :item="item" :index="index" @value-change="valueChange"></CraftingItemRow>
            </tbody>
            <CraftingHeaderRow :value='getTotalCost(this.craftingList.cost)'></CraftingHeaderRow>
        </b-table-simple>
        <!-- TODO: Remove when done debugging -->
        <pre v-show="false">{{ JSON.stringify(this.craftingList, null, 2) }}</pre>
    </div>
</template>

<script>
    import CraftingHeaderRow from './CraftingHeaderRow.vue'
    import CraftingItemRow from './CraftingItemRow.vue'
    import { CraftingCost } from "@/utility"
    import { CraftingList, Quantity } from '@/crafting.js'
    import {getRecipe} from "@/vnhApi";

    export default {
        name: 'Crafting',
        props: {
            craftingList: {
                type: CraftingList,
                required: true
            }
        },
        components: {
            CraftingHeaderRow,
            CraftingItemRow,
        },
        data() {
            return {
                items: [],
                fields: [
                    {key: 'name', stickyColumn: true, label: 'Items'},
                    {key: 'needed', label: ''},
                    {key: 'obtained', label: ''},
                    {key: 'total', label: ''},
                    {key: 'source', label: ''}
                ],
                isBusy: false
            }
        },
        methods: {
            switchContent(content) {
                return this.$emit('switch-content', content)
            },
            valueChange(item, quantity) {
                let object = this.craftingList.find(item.name)

                console.log(`object=${JSON.stringify(object)}`)

                object.neededQuantity.total = item.quantity.total - quantity.total

                for (let key in item.ingredients) {
                    let ingredient = item.ingredients[key]
                    console.log(`ingredient=${JSON.stringify(ingredient)}`)
                    // name, quantity
                    this.valueChange(ingredient.item, new Quantity(ingredient.quantity))
                }
            },
            getTotalCost(cost) {
                return `Cost: ${new CraftingCost(cost).toString()}`
            },
            onLoad() {
                this.isBusy = true

                this.items = []

                getRecipe("Oread's Axe").then(recipe => {
                    this.craftingList.reset()
                    this.craftingList.add(recipe, 5)
                    this.craftingList.calculate().then(() => {
                        let locals = ['items', 'refined', 'components', 'list']
                        for (let index in locals) {
                            let listName = locals[index]
                            for (let key in this.craftingList[listName]) {
                                let object = this.craftingList[listName][key]
                                object.neededQuantity = object.quantity.clone()
                                object.obtainedQuantity = new Quantity(0, object.quantity.stack_size ?
                                    object.quantity.stack_size :
                                    object.item.stack_size)

                                this.items.push(object)
                            }
                        }

                        this.isBusy = false
                    })
                })
            }
        },
        created() {
            console.log('test')
            this.onLoad()
        }
    }
</script>
