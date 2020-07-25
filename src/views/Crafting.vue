<template>
    <div id="crafting">
        <div v-if="!craftingList.count && !isBusy">
            <p>No recipes selected.</p>
            <p>
                You can select the recipes and quantities to craft in the
                <!--TODO: <b-link to="/equipment">Equipment</b-link> or-->
                <b-link to="/recipes">Recipes</b-link> tool.
            </p>
        </div>
        <div v-else>
            <div class="font-italic">
                If you need to modify your crafting list:
                <ul>
                    <li>
                        Click the <b-icon-cart></b-icon-cart> icon in the top right to add/remove quantities from
                        currently items
                    </li>
                    <li>
                        To add new recipes, you can do so in the
                        <!--TODO: <b-link to="/equipment">Equipment</b-link> or-->
                        <b-link to="/recipes">Recipes</b-link> tool
                    </li>
                </ul>
            </div>
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
                    <b-row class="text-left">
                        <b-col cols="3">
                            <label for="form-crafting-cost-reduction">Crafting Cost Reduction</label>
                        </b-col>
                        <b-col md="auto">
                            <b-input
                                    id="form-crafting-cost-reduction"
                                    class="mb-2 mr-sm-2 mb-sm-0 ml-2"
                                    v-model="craftingList.options.craftingCostReduction"
                                    v-b-tooltip.hover
                                    title="The percentage at which crafting recipes cost less gold."
                                    :debounce="debounce"
                                    type="number" number min="0" max="100" step="1"
                                    size="sm"></b-input>
                        </b-col>
                        <b-col md="auto">
                            %
                        </b-col>
                    </b-row>
                </b-form>
            </div>
            <div v-if="isBusy">
                <div class="text-center">
                    <b-spinner small class="align-middle"></b-spinner>
                    <div class="font-weight-bold" v-if="!calculatedRecipes.count">Calculating...</div>
                    <div v-else>{{ calculatedRecipes.count }} of {{ this.craftingList.count }} recipes calculated...</div>
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
                    <tbody v-show="show['items']" v-for="(item, index) in sortBySourceAndLevel(craftingList.items)" :key="item.id">
                        <CraftingItemRow :object="item" :index="index" @value-change="valueChange"></CraftingItemRow>
                    </tbody>
                    <CraftingHeaderRow value="Refined Ingredients" name="refined" :show="show['refined']" @show-hide="showHide"></CraftingHeaderRow>
                    <tbody v-show="show['refined']" v-for="(item, index) in sortBySourceAndLevel(craftingList.refined)" :key="item.id">
                        <CraftingItemRow :object="item" :index="index" @value-change="valueChange"></CraftingItemRow>
                    </tbody>
                    <CraftingHeaderRow value="Crafting Components" name="components" :show="show['components']" @show-hide="showHide"></CraftingHeaderRow>
                    <tbody v-show="show['components']" v-for="(item, index) in sortBySourceAndLevel(craftingList.components)" :key="item.id">
                        <CraftingItemRow :object="item" :index="index" @value-change="valueChange"></CraftingItemRow>
                    </tbody>
                    <!-- TODO: When making items, reduce number of salvage kits required as well - it is currently static -->
                    <!-- TODO: When updating obtained quantities with salvaging checked, it does some funky stuff - need to add in salvaging to the quantities somehow or do something -->
                    <CraftingHeaderRow value="Final Products" name="final" :show="show['final']" @show-hide="showHide"></CraftingHeaderRow>
                    <tbody v-show="show['final']" v-for="(item, index) in sortBySourceAndLevel(craftingList.list)" :key="item.id">
                        <CraftingItemRow :object="item" :index="index" @value-change="valueChange"></CraftingItemRow>
                    </tbody>
                    <CraftingHeaderRow :value='cost'></CraftingHeaderRow>
                </b-table-simple>
            </div>
        </div>
    </div>
</template>

<script>
    import CraftingHeaderRow from '@/components/CraftingHeaderRow'
    import CraftingItemRow from '@/components/CraftingItemRow'
    import { CraftingList } from '@/crafting/list'
    import { getSource } from '@/crafting/source'
    import { compareValues } from '@/utility'
    import { Cost } from '@/models/cost'

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
                calculatedRecipes: {count: 0},
                show: {
                    options: true,
                    items: true,
                    refined: true,
                    components: true,
                    final: true
                },
                cost: ''
            }
        },
        methods: {
            calculateList() {
                this.isBusy = true

                this.calculatedRecipes = {'count': 0}
                this.craftingObjects = []
                this.craftingQuantities = []

                this.craftingList.calculate(this.calculatedRecipes).then(() => {
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

                    this.getTotalCost()
                    this.isBusy = false
                })
            },
            getTotalCost() {
                let cost = this.craftingList.cost
                if (this.craftingList.options.craftingCostReduction > 0)
                    cost = new Cost(this.craftingList.cost.total * (100 - this.craftingList.options.craftingCostReduction) / 100)
                this.cost = `Cost: ${cost}`
            },
            showHide(name) {
                this.show[name] = !this.show[name]
            },
            sortBySourceAndLevel(list) {
                let sortingList = []

                for (let key in list) {
                    let object = list[key]
                    sortingList.push({craftingObject: object, source: getSource(object.object)})
                }

                sortingList.sort(compareValues('source.text'))

                let sortedList = []

                for (let index in sortingList)
                    sortedList.push(sortingList[index].craftingObject)

                return sortedList
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
                    if (object.neededQuantity.total + difference < 0) {
                        // Ensure the difference will not make us dip below zero, for example, when 180 remainder are
                        //  needed and the total is 1 stack, 120 remainder, then if you enter 1 into the stack input, it
                        //  would remove 350 and put us into negative territory
                        difference = 0 - object.neededQuantity.total
                    }
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
            },
            'craftingList.options.craftingCostReduction'() {
                this.getTotalCost()
            },
        }
    }
</script>
