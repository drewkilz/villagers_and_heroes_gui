<template>
    <div id="crafting">
        <div v-if="!craftingList.count && !isBusy">
            <p>No recipes selected.</p>
            <p>
                You can select the recipes and quantities to craft in either the
                <b-link href="#" v-on:click="switchContent('equipment')">Equipment</b-link> or
                <b-link href="#" v-on:click="switchContent('recipes')">Recipes</b-link> tool.
            </p>
        </div>
        <!-- TODO: Implement a crafting list view where you can review and add/remove/update quantities before finalizing the crafting list -->
        <div v-else>
            <div style="border: thin solid; margin-bottom: 5px; padding: 5px">
                <div class="font-weight-bold">
                    Options
                    <b-link size="sm" @click="showHide('options')">
                        <b-icon-chevron-double-up v-if="show['options']" scale="0.75"></b-icon-chevron-double-up>
                        <b-icon-chevron-double-down v-else scale="0.75"></b-icon-chevron-double-down>
                    </b-link>
                </div>
                <b-form v-show="show['options']">
                    <b-row class="text-left">
                        <b-col md="auto">
                            <b-form-checkbox
                                    id="form-salvaging"
                                    class="mb-2 mr-sm-2 mb-sm-0"
                                    v-model="craftingList.options.salvaging"
                                    v-b-tooltip.hover
                                    title="Enable salvaging of ingredients and components from final products">
                                Salvaging?
                            </b-form-checkbox>
                        </b-col>
                    </b-row>
                    <template v-if="craftingList.options.salvaging">
                        <b-row class="text-left">
                            <b-col cols="3">
                                <label for="form-ingredient-salvage-percent">Ingredient Salvage Percent</label>
                            </b-col>
                            <b-col md="auto">
                                <b-input
                                        id="form-ingredient-salvage-percent"
                                        class="mb-2 mr-sm-2 mb-sm-0 ml-2"
                                        v-model="craftingList.options.ingredientSalvagePercent"
                                        v-b-tooltip.hover
                                        title="The percentage at which ingredients are salvaged from final products (default: 65%)"
                                        :debounce="debounce"
                                        type="number" number min="1" max="100" step="1"
                                        size="sm"></b-input>
                            </b-col>
                            <b-col md="auto">
                                %
                            </b-col>
                            <div class="w-100"></div>
                            <b-col cols="3">
                                <label for="form-component-salvage-percent">Component Salvage Percent</label>
                            </b-col>
                            <b-col md="auto">
                                <b-input
                                        id="form-component-salvage-percent"
                                        class="mb-2 mr-sm-2 mb-sm-0 ml-2"
                                        v-model="craftingList.options.componentSalvagePercent"
                                        v-b-tooltip.hover
                                        title="The percentage at which components are salvaged from final products (default: 20%)"
                                        :debounce="debounce"
                                        type="number" number min="1" max="100" step="1"
                                        size="sm"></b-input>
                            </b-col>
                            <b-col md="auto">
                                %
                            </b-col>
                        </b-row>
                    </template>
                </b-form>
            </div>
            <div v-if="isBusy">
                <div class="text-center">
                    <b-spinner small class="align-middle"></b-spinner> <strong>Loading...</strong>
                </div>
            </div>
            <div v-else>
                <b-table-simple
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
                    <CraftingHeaderRow value="Items" name="items" :show="show['items']" @show-hide="showHide"></CraftingHeaderRow>
                    <!-- TODO: Add sorting by source type and level -->
                    <tbody v-show="show['items']" v-for="(item, key, index) in craftingList.items" :key="item.id">
                        <CraftingItemRow :object="item" :index="index" @value-change="valueChange"></CraftingItemRow>
                    </tbody>
                    <CraftingHeaderRow value="Refined Ingredients" name="refined" :show="show['refined']" @show-hide="showHide"></CraftingHeaderRow>
                    <tbody v-show="show['refined']" v-for="(item, key, index) in craftingList.refined" :key="item.id">
                        <CraftingItemRow :object="item" :index="index" @value-change="valueChange"></CraftingItemRow>
                    </tbody>
                    <CraftingHeaderRow value="Crafting Components" name="components" :show="show['components']" @show-hide="showHide"></CraftingHeaderRow>
                    <tbody v-show="show['components']" v-for="(item, key, index) in craftingList.components" :key="item.id">
                        <CraftingItemRow :object="item" :index="index" @value-change="valueChange"></CraftingItemRow>
                    </tbody>
                    <!-- TODO: When updating obtained quantities with salvaging checked, it does some funky stuff - need to add in salvaging to the quantities somehow or do something -->
                    <!-- TODO: Add in ability to update/delete final product needed quantities, etc. -->
                    <CraftingHeaderRow value="Final Products" name="final" :show="show['final']" @show-hide="showHide"></CraftingHeaderRow>
                    <tbody v-show="show['final']" v-for="(item, key, index) in craftingList.list" :key="item.id">
                        <CraftingItemRow :object="item" :index="index" @value-change="valueChange"></CraftingItemRow>
                    </tbody>
                    <CraftingHeaderRow :value='getTotalCost(craftingList.cost)'></CraftingHeaderRow>
                </b-table-simple>
            </div>
        </div>
    </div>
</template>

<script>
    import CraftingHeaderRow from '@/components/CraftingHeaderRow'
    import CraftingItemRow from '@/components/CraftingItemRow'
    import { CraftingList } from '@/crafting/list'

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
                fields: [
                    {key: 'name', stickyColumn: true, label: 'Items'},
                    {key: 'needed', label: ''},
                    {key: 'obtained', label: ''},
                    {key: 'total', label: ''},
                    {key: 'source', label: ''}
                ],
                isBusy: false,
                craftingObjects: [],
                craftingQuantities: [],
                debounce: 200,
                show: {
                    options: true,
                    items: true,
                    refined: true,
                    components: true,
                    final: true
                }
            }
        },
        methods: {
            calculateList() {
                this.isBusy = true

                this.craftingObjects = []
                this.craftingQuantities = []

                this.craftingList.calculate().then(() => {
                    for (let key in this.craftingList.all) {
                        let object = this.craftingList.all[key]

                        // As the objects and quantities are created post-initialization of this Vue component, they
                        //  do not have reactive getters and setters - by storing their references in a local list, the
                        //  reactive functions are added
                        this.craftingObjects.push(object)
                        this.craftingQuantities.push(object.quantity)
                        this.craftingQuantities.push(object.neededQuantity)
                        this.craftingQuantities.push(object.obtainedQuantity)
                    }

                    this.isBusy = false
                })
            },
            getTotalCost(cost) {
                return `Cost: ${cost}`
            },
            showHide(name) {
                this.show[name] = !this.show[name]
            },
            switchContent(content) {
                return this.$emit('switch-content', content)
            },
            valueChange(object, difference, child = false) {
                if (child) {
                    // Child recipe/item of a user operation, so reduce/increment the total quantity
                    if (object.quantity.total + difference < 0) {
                        // Don't go below zero
                        object.quantity.total = 0
                    }
                    else
                        object.quantity.total += difference

                    // Reduce/Increment the needed quantity
                    if (object.neededQuantity.total + difference < 0) {
                        // Don't go below zero
                        object.neededQuantity.total = 0
                    }
                    else {
                        object.neededQuantity.total += difference
                    }

                    if (object.quantity.total < object.obtainedQuantity.total) {
                        // Match the current quantity to total quantity in the case where, for example, 30 of an item
                        //  was gathered, but then a refined ingredient was made and only 28 are now needed
                        object.obtainedQuantity.total = object.quantity.total
                        object.neededQuantity.total = 0
                    }
                }
                else {
                    // Reduce/Increment the needed quantity
                    object.neededQuantity.total += difference
                }

                for (let key in object.object.ingredients) {
                    let ingredient = object.object.ingredients[key]
                    let ingredientRowObject = this.craftingList.all[ingredient.item.name]
                    this.valueChange(ingredientRowObject, difference * ingredient.quantity, true)
                }
            }
        },
        created() {
            this.calculateList()
        },
        watch: {
            'craftingList.options.salvaging'() {
                this.calculateList()
            },
            'craftingList.options.ingredientSalvagePercent'() {
                this.calculateList()
            },
            'craftingList.options.componentSalvagePercent'() {
                this.calculateList()
            }
        }
    }
</script>
