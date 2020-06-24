<template>
    <div id="crafting">
        <div v-if="craftingList.count && !isBusy">
            <p>No recipes selected.</p>
            <p>
                You can select the recipes and quantities to craft in either the
                <b-link href="#" v-on:click="switchContent('equipment')">Equipment</b-link> or
                <b-link href="#" v-on:click="switchContent('recipes')">Recipes</b-link> tool.
            </p>
        </div>
        <b-table
                striped
                hover
                responsive="true"
                head-variant="dark"
                :items="items"
                :fields="fields"
                :busy="isBusy"
                primary-key="id"
                small>
            <template v-slot:cell(quantity)="row">
                <div class="row">
                    <div class="col">
                        N: <CraftingQuantity :item="row.item" :quantity="row.item.neededQuantity" :currentQuantity="row.item.obtainedQuantity" readonly></CraftingQuantity>
                    </div>
                    <div class="col">
                        O: <CraftingQuantity :item="row.item" :quantity="row.item.quantity" :currentQuantity="row.item.obtainedQuantity" complete @value-change="valueChange"></CraftingQuantity>
                    </div>
                    <div class="col">
                        T: <CraftingQuantity :item="row.item" :quantity="row.item.quantity" :currentQuantity="row.item.obtainedQuantity" readonly></CraftingQuantity>
                    </div>
                </div>
<!--                <b-link :id="getRowItemId(row.index, 'name-link')"-->
<!--                        :href="getWikiLink(row.item.item.name)"-->
<!--                        target="_blank"-->
<!--                        rel="noopener">-->
<!--                    {{ row.item.name }}-->
<!--                </b-link>-->
<!--                <b-popover-->
<!--                        :target="getRowItemId(row.index, 'name-link')"-->
<!--                        placement="bottomright"-->
<!--                        triggers="hover focus">-->
<!--                    <template v-slot:title>{{ row.item.name }}</template>-->
<!--                    <ul>-->
<!--                        <li v-for="ingredient in row.item.ingredients" :key="ingredient.id">-->
<!--                            {{ ingredient.quantity }}-->
<!--                            {{ ingredient.item.name }}-->
<!--                        </li>-->
<!--                        <li v-if="row.item.cost > 0">{{row.item.cost | craftingCostFilter }}</li>-->
<!--                    </ul>-->
<!--                </b-popover>-->
            </template>
<!--            <template v-slot:thead-top>-->
<!--                <b-tr class="thead-light">-->
<!--                    <b-th>-->
<!--                        <b-input-group size="sm">-->
<!--                            <b-form-input :debounce="debounce" v-model="nameFilter" type="search" placeholder="Type to Search"></b-form-input>-->
<!--                        </b-input-group>-->
<!--                    </b-th>-->
<!--                    <b-th>-->
<!--                        <b-input-group size="sm">-->
<!--                            <b-form-input :debounce="debounce" v-model="minLevelFilter" type="number" placeholder="min" number min="1" max="95" step="1"></b-form-input>-->
<!--                        </b-input-group>-->
<!--                        <b-input-group size="sm">-->
<!--                            <b-form-input :debounce="debounce" v-model="maxLevelFilter" type="number" placeholder="max" number min="1" max="95" step="1"></b-form-input>-->
<!--                        </b-input-group>-->
<!--                    </b-th>-->
<!--                    <b-th>-->
<!--                        <b-input-group size="sm">-->
<!--                            <b-form-select v-model="classFilter" :options="classOptions" multiple>-->
<!--                            </b-form-select>-->
<!--                        </b-input-group>-->
<!--                    </b-th>-->
<!--                    <b-th>-->
<!--                        <b-input-group size="sm">-->
<!--                            <b-form-select v-model="subclassFilter" :options="subclassOptions" multiple>-->
<!--                            </b-form-select>-->
<!--                        </b-input-group>-->
<!--                    </b-th>-->
<!--                    <b-th>-->
<!--                        <b-input-group size="sm">-->
<!--                            <b-form-select v-model="skillFilter" :options="skillOptions" multiple>-->
<!--                            </b-form-select>-->
<!--                        </b-input-group>-->
<!--                    </b-th>-->
<!--                    <b-th>-->
<!--                        <b-input-group size="sm">-->
<!--                            <b-form-select v-model="typeFilter" :options="typeOptions" multiple>-->
<!--                            </b-form-select>-->
<!--                        </b-input-group>-->
<!--                    </b-th>-->
<!--                    <b-th>-->
<!--                        <b-button v-on:click="clearFilters">Clear Filters</b-button>-->
<!--                    </b-th>-->
<!--                </b-tr>-->
<!--            </template>-->
<!--            <template v-slot:head(add)>-->
<!--                <div id="header-add">Crafting List</div>-->
<!--                <b-popover-->
<!--                        target="header-add"-->
<!--                        placement="left"-->
<!--                        triggers="hover focus">-->
<!--                    <template v-slot:title>Add to Crafting List</template>-->
<!--                    <div>-->
<!--                        Enter a quantity then click the <b-icon-cart-plus></b-icon-cart-plus> icon to the right to add-->
<!--                        the recipe to your Crafting List.-->
<!--                    </div>-->
<!--                </b-popover>-->
<!--            </template>-->
<!--            <template v-slot:table-busy>-->
<!--                <div class="text-center">-->
<!--                    <b-spinner small class="align-middle"></b-spinner> <strong>Loading...</strong>-->
<!--                </div>-->
<!--            </template>-->
<!--            <template v-slot:cell(add)="row">-->
<!--                <b-input-group size="sm">-->
<!--                    <b-form-input v-model="row.item.quantity" size="sm" style="width: 42px" :debounce="debounce" type="number" placeholder="qty" number min="1" step="1"></b-form-input>-->
<!--                    <b-button size="sm" @click="addToList(row)" v-b-tooltip:hover title="Add to Crafting List"><b-icon-cart-plus></b-icon-cart-plus></b-button>-->
<!--                </b-input-group>-->
<!--            </template>-->
<!--            <template v-slot:table-caption>{{ totalRows }} recipes found.</template>-->
        </b-table>

        <!-- TODO: Implement a crafting list view where you can review and add/remove/update quantities before finalizing the crafting list -->
        <!-- TODO: Add in an options panel for salvaging, percentages, etc. -->
        <!-- TODO: potentially change to b-table -->

        <!-- OLD -->
<!--        <table v-else class="table table-striped table-hover">-->
<!--            <thead>-->
<!--                <tr>-->
<!--                    <th></th>-->
<!--                    &lt;!&ndash;-->
<!--                    TODO: Implement Needed and Obtained with textboxes-->
<!--                    <th colspan="3" class="text-center">Needed</th>-->
<!--                    <th colspan="3" class="text-center">Obtained</th>-->
<!--                    &ndash;&gt;-->
<!--                    <th colspan="3" class="text-center">Total</th>-->
<!--                    &lt;!&ndash;-->
<!--                    <th></th>-->
<!--                    &ndash;&gt;-->
<!--                </tr>-->
<!--                <tr>-->
<!--                    <th>Name</th>-->
<!--                    &lt;!&ndash;-->
<!--                    TODO: Needed and Obtained with textboxes-->
<!--                    <th class="text-center">Stacks</th>-->
<!--                    <th class="text-center">Individual</th>-->
<!--                    <th class="text-center">Total</th>-->
<!--                    <th class="text-center">Stacks</th>-->
<!--                    <th class="text-center">Individual</th>-->
<!--                    <th class="text-center">Total</th>-->
<!--                    &ndash;&gt;-->
<!--                    <th class="text-center">Stacks</th>-->
<!--                    <th class="text-center">Individual</th>-->
<!--                    <th class="text-center">Total</th>-->
<!--                    &lt;!&ndash;-->
<!--                    TODO: Source-->
<!--                    <th>Source</th>-->
<!--                    &ndash;&gt;-->
<!--                </tr>-->
<!--            </thead>-->
<!--            <tbody v-if="emptyList && craftingListLoading">-->
<!--                <tr>-->
<!--                    &lt;!&ndash; TODO: Upgrade to the nice busy loading symbol &ndash;&gt;-->
<!--                    <td colspan="99">Loading...</td>-->
<!--                </tr>-->
<!--            </tbody>-->
<!--            <template v-else>-->
<!--                <CraftingHeaderRow :value='"Items"'></CraftingHeaderRow>-->
<!--                <tbody v-for="objectQuantity in craftingList_.items" :key="objectQuantity.name">-->
<!--                    &lt;!&ndash; {% for object_quantity in crafting_list.items.values() %} &ndash;&gt;-->
<!--                    <CraftingItemRow :objectQuantity="objectQuantity"></CraftingItemRow>-->
<!--                </tbody>-->
<!--                <CraftingHeaderRow :value='"Refined Ingredients"'></CraftingHeaderRow>-->
<!--                <tbody v-for="objectQuantity in craftingList_.refined" :key="objectQuantity.name">-->
<!--                    &lt;!&ndash; {% for object_quantity in crafting_list.refined.values() %} &ndash;&gt;-->
<!--                    <CraftingItemRow :objectQuantity="objectQuantity"></CraftingItemRow>-->
<!--                </tbody>-->
<!--                <CraftingHeaderRow :value='"Crafting Components"'></CraftingHeaderRow>-->
<!--                <tbody v-for="objectQuantity in craftingList_.components" :key="objectQuantity.name">-->
<!--                    &lt;!&ndash; {% for object_quantity in crafting_list.components.values() %} &ndash;&gt;-->
<!--                    <CraftingItemRow :objectQuantity="objectQuantity"></CraftingItemRow>-->
<!--                </tbody>-->
<!--                <CraftingHeaderRow :value='"Final Products"'></CraftingHeaderRow>-->
<!--                <tbody v-for="objectQuantity in craftingList_.list" :key="objectQuantity.name">-->
<!--                    &lt;!&ndash; {% for object_quantity in crafting_list.list.values() %} &ndash;&gt;-->
<!--                    <CraftingItemRow :objectQuantity="objectQuantity"></CraftingItemRow>-->
<!--                </tbody>-->
<!--                <CraftingHeaderRow :value='this.craftingList_.cost | craftingCostFilter'></CraftingHeaderRow>-->
<!--            </template>-->
<!--        </table>-->
    </div>
</template>

<script>
    import CraftingQuantity from './CraftingQuantity.vue'
    import { CraftingList, Quantity } from '@/crafting.js'

    export default {
        name: 'Crafting',
        props: {
            craftingList: {
                type: CraftingList,
                required: true
            }
        },
        components: {
            CraftingQuantity
        },
        data() {
            return {
                items: [],
                fields: [
                    {key: 'name', sortable: true, stickyColumn: true},
                    {key: 'quantity'},
                    // {key: 'subclass', sortable: true, formatter: 'getSubClassName', label:'Sub-Class'},
                    // {key: 'skill', sortable: true, formatter: 'getEnumValue'},
                    // {key: 'type', sortable: true, formatter: 'getEnumValue'},
                    // {key: 'add', label: ''}
                ],
                isBusy: false
            }
        },
        methods: {
            switchContent(content) {
                return this.$emit('switch-content', content)
            },
            valueChange(item, quantity) {
                item.neededQuantity.total = item.quantity.total - quantity.total
            }
        },
        computed: {
            // emptyList() {
            //     return Object.keys(this.craftingList_).length === 0
            // }
        },
        created() {
            // TODO: Remove when finished debugging
            this.craftingList = new CraftingList()
            this.craftingList.add(
                {"cost":"0.2660","id":164,"ingredients":[{"item":{"class_":{"category":1,"id":1,"name":"All"},"id":87,"level":30,"name":"Ash Timber","rarity":{"category":4,"id":57,"name":"Common"},"salvageable":false,"stack_size":350,"subclass":{"category":7,"id":75,"name":"All"},"type":{"category":3,"id":33,"name":"Crafting Ingredient"}},"quantity":5}],"item":{"class_":{"category":1,"id":1,"name":"All"},"id":219,"level":34,"name":"Ash Pitch","rarity":{"category":4,"id":59,"name":"Rare"},"salvageable":false,"stack_size":null,"subclass":{"category":7,"id":75,"name":"All"},"type":{"category":3,"id":39,"name":"Preparation"}},"level":34,"name":"Ash Pitch","skill":{"category":6,"id":68,"name":"Woodcrafting"},"type":{"category":2,"id":26,"name":"Wood Resins and Pitch"}},
                500)
            console.clear()
        },
        mounted() {
            this.items = []

            this.craftingList.calculate().then(() => {
                for (let key in this.craftingList.items) {
                    let item = this.craftingList.items[key]

                    item.neededQuantity = item.quantity.clone()
                    item.obtainedQuantity = new Quantity(0, item.quantity.stack_size)

                    this.items.push(item)
                }

                // TODO: Finish adding items to tables with appropriate values
            })

            //             // this.craftingList_.components['Gallant Helm Clasp'] = {id, name, cost, quantity, remainder, stacks, type (Crafting Component), ingredients, ...} <-- recipes
            //             // this.craftingList_.items['Ash'] = {id, name, quantity, remainder, stacks, type (all sorts), ...} <-- items
            //             // this.craftingList_.refined['Ash Timber'] = {id, name, quantity, remainder, stacks, type (Refined Ingredients), ingredients, ...} <-- recipes
            //             // this.craftingList_.list['Oread\'s Helm'] = {id, name, quantity, remainder, stacks, type (all sorts), ingredients, ...} <-- recipes
            //             // this.craftingList_.cost = {total, gold, silver, copper}
            //
        }
    }
</script>
