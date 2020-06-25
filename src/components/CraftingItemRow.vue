<template>
    <b-tr :class="index % 2 ? 'alternate-row' : ''">
        <b-td>
            <b-link :id="getRowItemId(item, 'name-link')"
                    :href="getWikiLink(item.name)"
                    target="_blank"
                    rel="noopener">
                {{ item.name }}
            </b-link>
            <b-popover
                    :target="getRowItemId(item, 'name-link')"
                    placement="bottomright"
                    triggers="hover focus"
                    v-if="item.ingredients || item.cost">
                <template v-slot:title>{{ item.name }}</template>
                <ul>
                    <li v-for="ingredient in item.ingredients" :key="ingredient.id">
                        {{ ingredient.quantity }}
                        {{ ingredient.item.name }}
                    </li>
                    <li v-if="item.cost > 0">{{item.cost | craftingCostFilter }}</li>
                </ul>
            </b-popover>
        </b-td>
        <b-td>
            <CraftingQuantity :item="item" :quantity="item.neededQuantity" :currentQuantity="item.obtainedQuantity" readonly></CraftingQuantity>
        </b-td>
        <b-td>
            <CraftingQuantity :item="item" :quantity="item.quantity" :currentQuantity="item.obtainedQuantity" complete @value-change="valueChange"></CraftingQuantity>
        </b-td>
        <b-td>
            <CraftingQuantity :item="item" :quantity="item.quantity" :currentQuantity="item.obtainedQuantity" readonly></CraftingQuantity>
        </b-td>
        <b-td>
            {{ getSource(item) }}
        </b-td>
    </b-tr>
</template>

<script>
    import CraftingQuantity from "@/components/CraftingQuantity.vue"
    import { getWikiLink} from "@/utility.js"

    export default {
        name: 'CraftingItemRow',
        props: {
            item: {
                type: Object,
                required: true
            },
            index: {
                type: Number,
                required: true
            }
        },
        components: {
            CraftingQuantity
        },
        methods: {
            valueChange(item, quantity) {
                return this.$emit('value-change', item, quantity)
            },
            getSource(item) {
                if (item.type.name === 'Plant') {
                    return `Plant Lore (${item.level}-${item.level+14})`
                }
                else if (item.skill) {
                    return `${item.skill.name} (${item.level})`
                }
                else if (item.name.indexOf('Pelt') !== -1) {
                    // TODO : Level mapping for boars
                    return `Ranching: Boars (?), Beasts (${item.level}-${item.level+14})`
                }
                // TODO: Finish source mapping
                return JSON.stringify(item)
            },
            getRowItemId(item, name) {
                return `crafting-${name}-${item.id}`
            },
            getWikiLink(page) {
                return getWikiLink(page)
            }
        }
    }
</script>

<style>
    .alternate-row {
        background-color: rgba(0, 0, 0, 0.05)
    }
</style>