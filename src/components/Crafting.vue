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
            <tbody v-for="(item, key, index) in craftingList.items" :key="item.id">
                <CraftingItemRow :object="item" :index="index" @value-change="valueChange"></CraftingItemRow>
            </tbody>
            <CraftingHeaderRow :value='"Refined Ingredients"'></CraftingHeaderRow>
            <tbody v-for="(item, key, index) in craftingList.refined" :key="item.id">
                <CraftingItemRow :object="item" :index="index" @value-change="valueChange"></CraftingItemRow>
            </tbody>
            <CraftingHeaderRow :value='"Crafting Components"'></CraftingHeaderRow>
            <tbody v-for="(item, key, index) in craftingList.components" :key="item.id">
                <CraftingItemRow :object="item" :index="index" @value-change="valueChange"></CraftingItemRow>
            </tbody>
            <CraftingHeaderRow :value='"Final Products"'></CraftingHeaderRow>
            <tbody v-for="(item, key, index) in craftingList.list" :key="item.id">
                <CraftingItemRow :object="item" :index="index" @value-change="valueChange"></CraftingItemRow>
            </tbody>
            <CraftingHeaderRow :value='getTotalCost(craftingList.cost)'></CraftingHeaderRow>
        </b-table-simple>
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
                test: 100,
                craftingObjects: [],
                craftingQuantities: []
            }
        },
        methods: {
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
            },
            getTotalCost(cost) {
                return `Cost: ${cost}`
            }
        },
        created() {
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
        }
    }
</script>
