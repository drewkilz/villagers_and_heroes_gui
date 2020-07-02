<template>
    <b-tr :class="index % 2 ? 'alternate-row' : ''" :variant="this.object.neededQuantity.total === 0 ? 'success' : ''">
        <b-td>
            <b-link :id="getRowItemId(object, 'name-link')"
                    :href="getWikiLink(object.object.name)"
                    target="_blank"
                    rel="noopener">
                {{ object.object.name }}
            </b-link>
            <template v-if="isSalvageKit(object.object)">
                <span v-b-tooltip.hover title="The number of items displayed for Salvage Kits is the number of charges needed. The stacks is the number of Salvage Kits needed.">***</span>
            </template>
            <b-popover
                    :target="getRowItemId(object, 'name-link')"
                    placement="bottomright"
                    triggers="hover"
                    v-if="isRecipeOrHasCost(object.object)">
                <template v-slot:title>{{ object.object.name }}</template>
                <ul>
                    <li v-for="ingredient in object.object.ingredients" :key="ingredient.id">
                        {{ ingredient.quantity }}
                        {{ ingredient.item.name }}
                    </li>
                    <li v-if="object.object.cost && object.object.cost.total > 0">{{ object.object.cost }}</li>
                </ul>
            </b-popover>
        </b-td>
        <b-td>
            <CraftingQuantity :object="object" type="needed" readonly></CraftingQuantity>
        </b-td>
        <b-td>
            <CraftingQuantity :object="object" type="obtained" complete @value-change="valueChange"></CraftingQuantity>
        </b-td>
        <b-td>
            <CraftingQuantity :object="object" type="total" readonly></CraftingQuantity>
        </b-td>
        <b-td>
            <template v-if="source.link">
                <b-link :href="source.link" target="_blank" rel="noopener">{{ source.text }}</b-link>
            </template>
            <template v-else>
                {{ source.text }}
            </template>
        </b-td>
    </b-tr>
</template>

<script>
    import CraftingQuantity from '@/components/CraftingQuantity'
    import { getWikiLink } from '@/utility'
    import { CraftingObject } from '@/crafting/object'
    import { getSource } from '@/crafting/source'
    import { SALVAGE_KIT_NAME } from '@/models/item'
    import { Recipe } from '@/models/recipe'

    export default {
        name: 'CraftingItemRow',
        props: {
            object: {
                type: CraftingObject,
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
        data() {
            return {
                source: getSource(this.object.object)
            }
        },
        methods: {
            getRowItemId(object, name) {
                return `crafting-${name}-${object.object.id}`
            },
            getWikiLink(page) {
                return getWikiLink(page)
            },
            isRecipeOrHasCost(object) {
                return object instanceof Recipe || (object.cost && object.cost.total)
            },
            isSalvageKit(object) {
                return object.name === SALVAGE_KIT_NAME
            },
            valueChange(object, quantity) {
                return this.$emit('value-change', object, quantity)
            }
        },
    }
</script>

<style>
    .alternate-row {
        background-color: rgba(0, 0, 0, 0.05)
    }
</style>
