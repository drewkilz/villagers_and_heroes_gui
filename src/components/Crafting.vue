<template>
    <div id="crafting">
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th></th>
                    <!--
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
                    <th>Source</th>
                    -->
                </tr>
            </thead>
            <CraftingHeaderRow :value='"Items"'></CraftingHeaderRow>
            <tbody v-for="objectQuantity in craftingList.items" :key="objectQuantity.name">
                <!-- {% for object_quantity in crafting_list.items.values() %} -->
                <CraftingItemRow :objectQuantity="objectQuantity"></CraftingItemRow>
            </tbody>
            <CraftingHeaderRow :value='"Refined Ingredients"'></CraftingHeaderRow>
            <tbody v-for="objectQuantity in craftingList.refined" :key="objectQuantity.name">
                <!-- {% for object_quantity in crafting_list.refined.values() %} -->
                <CraftingItemRow :objectQuantity="objectQuantity"></CraftingItemRow>
            </tbody>
            <CraftingHeaderRow :value='"Crafting Components"'></CraftingHeaderRow>
            <tbody v-for="objectQuantity in craftingList.components" :key="objectQuantity.name">
                <!-- {% for object_quantity in crafting_list.components.values() %} -->
                <CraftingItemRow :objectQuantity="objectQuantity"></CraftingItemRow>
            </tbody>
            <CraftingHeaderRow :value='"Final Products"'></CraftingHeaderRow>
            <tbody v-for="objectQuantity in craftingList.list" :key="objectQuantity.name">
                <!-- {% for object_quantity in crafting_list.list.values() %} -->
                <CraftingItemRow :objectQuantity="objectQuantity"></CraftingItemRow>
            </tbody>
            <CraftingHeaderRow :value='craftingCost'></CraftingHeaderRow>
        </table>
    </div>
</template>

<script>
    import CraftingHeaderRow from './CraftingHeaderRow.vue'
    import CraftingItemRow from './CraftingItemRow.vue'

    export default {
        name: 'Crafting',
        components: {
            CraftingHeaderRow,
            CraftingItemRow
        },
        data() {
            return {
                craftingList: {}
            }
        },
        computed: {
            craftingCost() {
                return 'Crafting Cost: ' + this.craftingList.cost.gold + ' gp, ' + this.craftingList.cost.silver + ' sp, ' + this.craftingList.cost.copper + ' cp'
            }
        },
        mounted() {
            this.axiosVnhApi.post('crafting_list/', [{recipe: 213, quantity: 40}])
                .then(response => (this.craftingList = response.data))
        }
    }
</script>
