<template>
    <div id="crafting">
        <div v-if="emptyList && !craftingListLoading">
            <p>No recipes selected.</p>
            <p>
                You can select the recipes and quantities to craft in either the
                <b-link href="#" v-on:click="switchContent('equipment')">Equipment</b-link> or
                <b-link href="#" v-on:click="switchContent('recipes')">Recipes</b-link> tool.
            </p>
        </div>
        <!-- TODO: Implement a crafting list view where you can review and add/remove/update quantities before finalizing the crafting list -->
        <!-- TODO: Add in an options panel for salvaging, percentages, etc. -->
        <!-- TODO: potentially change to b-table -->
        <table v-else class="table table-striped table-hover">
            <thead>
                <tr>
                    <th></th>
                    <!--
                    TODO: Implement Needed and Obtained with textboxes
                    <th colspan="3" class="text-center">Needed</th>
                    <th colspan="3" class="text-center">Obtained</th>
                    -->
                    <th colspan="3" class="text-center">Total</th>
                    <!--
                    <th></th>
                    -->
                </tr>
                <tr>
                    <th>Name</th>
                    <!--
                    TODO: Needed and Obtained with textboxes
                    <th class="text-center">Stacks</th>
                    <th class="text-center">Individual</th>
                    <th class="text-center">Total</th>
                    <th class="text-center">Stacks</th>
                    <th class="text-center">Individual</th>
                    <th class="text-center">Total</th>
                    -->
                    <th class="text-center">Stacks</th>
                    <th class="text-center">Individual</th>
                    <th class="text-center">Total</th>
                    <!--
                    TODO: Source
                    <th>Source</th>
                    -->
                </tr>
            </thead>
            <tbody v-if="emptyList && craftingListLoading">
                <tr>
                    <!-- TODO: Upgrade to the nice busy loading symbol -->
                    <td colspan="99">Loading...</td>
                </tr>
            </tbody>
            <template v-else>
                <CraftingHeaderRow :value='"Items"'></CraftingHeaderRow>
                <tbody v-for="objectQuantity in craftingList_.items" :key="objectQuantity.name">
                    <!-- {% for object_quantity in crafting_list.items.values() %} -->
                    <CraftingItemRow :objectQuantity="objectQuantity"></CraftingItemRow>
                </tbody>
                <CraftingHeaderRow :value='"Refined Ingredients"'></CraftingHeaderRow>
                <tbody v-for="objectQuantity in craftingList_.refined" :key="objectQuantity.name">
                    <!-- {% for object_quantity in crafting_list.refined.values() %} -->
                    <CraftingItemRow :objectQuantity="objectQuantity"></CraftingItemRow>
                </tbody>
                <CraftingHeaderRow :value='"Crafting Components"'></CraftingHeaderRow>
                <tbody v-for="objectQuantity in craftingList_.components" :key="objectQuantity.name">
                    <!-- {% for object_quantity in crafting_list.components.values() %} -->
                    <CraftingItemRow :objectQuantity="objectQuantity"></CraftingItemRow>
                </tbody>
                <CraftingHeaderRow :value='"Final Products"'></CraftingHeaderRow>
                <tbody v-for="objectQuantity in craftingList_.list" :key="objectQuantity.name">
                    <!-- {% for object_quantity in crafting_list.list.values() %} -->
                    <CraftingItemRow :objectQuantity="objectQuantity"></CraftingItemRow>
                </tbody>
                <CraftingHeaderRow :value='craftingCost'></CraftingHeaderRow>
            </template>
        </table>
    </div>
</template>

<script>
    import CraftingHeaderRow from './CraftingHeaderRow.vue'
    import CraftingItemRow from './CraftingItemRow.vue'

    export default {
        name: 'Crafting',
        props: {
            craftingList: {
                type: Object,
                required: true
            }
        },
        components: {
            CraftingHeaderRow,
            CraftingItemRow
        },
        data() {
            return {
                craftingList_: {},
                craftingListLoading: false
            }
        },
        methods: {
            switchContent(content) {
                return this.$emit('switch-content', content)
            }
        },
        computed: {
            emptyList() {
                return Object.keys(this.craftingList_).length === 0
            },
            craftingCost() {
                let gold = 0, silver = 0, copper = 0;

                if (!this.emptyList) {
                    gold = this.craftingList_.cost.gold
                    silver = this.craftingList_.cost.silver
                    copper = this.craftingList_.cost.copper
                }

                return `Crafting Cost: ${gold} gp, ${silver} sp, ${copper} cp`
            }
        },
        mounted() {
            this.craftingListLoading = true

            let post_data = []

            for (let key in this.craftingList) {
                let recipe = this.craftingList[key]
                post_data.push({recipe: recipe.id, quantity: recipe.quantity})
            }

            if (post_data.length)
                this.axiosVnhApi.post('crafting_list/', post_data)
                    .then(response => {
                        this.craftingList_ = response.data
                        console.log(JSON.stringify(response.data))
                        this.craftingListLoading = false
                    })
            else
                this.craftingListLoading = false
        }
    }
</script>
