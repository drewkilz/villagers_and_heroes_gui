<template>
    <b-tr :class="index % 2 ? 'alternate-row' : ''">
        <b-td>
            <b-link :id="getRowItemId(object, 'name-link')"
                    :href="getWikiLink(object.object.name)"
                    target="_blank"
                    rel="noopener">
                {{ object.object.name }}
            </b-link>
            <b-popover
                    :target="getRowItemId(object, 'name-link')"
                    placement="bottomright"
                    triggers="hover focus"
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
            {{ getSource(object.object) }}
        </b-td>
    </b-tr>
</template>

<script>
    import CraftingQuantity from '@/components/CraftingQuantity'
    import { getWikiLink } from '@/utility'
    import { CraftingObject } from '@/crafting/object'
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
        methods: {
            getSource(object) {
                if (object instanceof Recipe)
                    return `${object.skill.name} (${object.level})`

                if (object.type.name === 'Plant') {
                    return `Plant Lore (${object.level}-${object.level+14})`
                }
                else if (object.type.name === 'Bug') {
                    return `Bug Lore (${object.level}-${object.level+14})`
                }
                else if (object.type.name === 'Mineral') {
                    return `Mining (${object.level}-${object.level+14})`
                }
                else if (object.type.name === 'Fish') {
                    return `Fishing (${object.level}-${object.level+14})`
                }
                else if (object.name.indexOf('Pelt') !== -1) {
                    // TODO : Level mapping for boars
                    return `Ranching: Boars (?), Beasts (${object.level}-${object.level+14})`
                }
                // TODO: Finish source mapping
                return JSON.stringify(object)
            },
            getRowItemId(object, name) {
                return `crafting-${name}-${object.object.id}`
            },
            getWikiLink(page) {
                return getWikiLink(page)
            },
            isRecipeOrHasCost(object) {
                return object instanceof Recipe || (object.cost && object.cost.total)
            },
            valueChange(object, quantity) {
                return this.$emit('value-change', object, quantity)
            }
        }
    }
</script>

<style>
    .alternate-row {
        background-color: rgba(0, 0, 0, 0.05)
    }
</style>