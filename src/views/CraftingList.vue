<template>
    <div id="crafting-list">
        <div v-if="!craftingList.count">
            <p>No recipes selected.</p>
            <p>
                You can select the recipes and quantities to craft in the
                <b-link to="/equipment">Equipment</b-link> or
                <b-link to="/recipes">Recipes</b-link> tool.
            </p>
        </div>
        <div v-else>
            <b-table
                    striped
                    hover
                    responsive="true"
                    head-variant="dark"
                    :items="items"
                    :fields="fields"
                    sort-icon-left
                    small>
                <template v-slot:cell(name)="row">
                    <RecipeName :recipe="row.item.object" :index="row.index"></RecipeName>
                </template>
                <template v-slot:cell(quantity)="row">
                    <CraftingQuantity :object="row.item" type="total" noMax></CraftingQuantity>
                </template>
                <template v-slot:cell(delete)="row">
                    <b-button size="sm" @click="removeFromList(row.item)">
                        <b-icon-cart-dash></b-icon-cart-dash>
                    </b-button>
                </template>
                <template v-slot:table-caption>
                    {{ craftingList.count }} recipes found.
                    <div class="float-right">
                        <b-button size="sm" to="/crafting" class="mr-2">Craft All</b-button>
                        <b-button size="sm" @click="clearCraftingList()">Delete All</b-button>
                    </div>
                </template>
            </b-table>
        </div>
    </div>
</template>

<script>
    import CraftingQuantity from '@/components/CraftingQuantity'
    import RecipeName from '@/components/RecipeName'
    import { CraftingList } from '@/crafting/list'
    import { compareValues } from '@/utility'

    export default {
        name: 'CraftingList',
        props: {
            craftingList: {
                type: CraftingList,
                required: true
            }
        },
        components: {
            CraftingQuantity,
            RecipeName
        },
        data() {
            return {
                fields: [
                    {key: 'name', sortable: true, stickyColumn: true, formatter: 'getName', sortByFormatted: true},
                    {key: 'level', sortable: true, formatter: 'getLevel', sortByFormatted: true},
                    {key: 'skill', sortable: true, formatter: 'getEnumValue', sortByFormatted: true},
                    {key: 'type', sortable: true, formatter: 'getEnumValue', sortByFormatted: true},
                    {key: 'quantity'},
                    {key: 'delete'}
                ],
                debounce: 200,
                items: []
            }
        },
        methods: {
            clearCraftingList() {
                this.$emit('clear-crafting-list')
            },
            getEnumValue(value, key, item) {
                return `${item.object[key].name}`
            },
            getLevel(value, key, item) {
                return item.object.level
            },
            getName(value, key, item) {
                return item.object.name
            },
            removeFromList(object) {
                const index = this.items.indexOf(object)
                if (index > -1) {
                    this.items.splice(index, 1)
                    this.$emit('remove-from-crafting-list', object)
                }
            }
        },
        mounted() {
            this.items = []

            for (let key in this.craftingList.list) {
                this.items.push(this.craftingList.list[key])
            }

            this.items.sort(compareValues('object.name'))
        }
    }
</script>
