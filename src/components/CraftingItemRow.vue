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
                <span v-b-tooltip.hover title="The number of items displayed for Salvage Kits is the number of charges needed, not the number of kits.">***</span>
            </template>
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
    import { Recipe } from '@/models/recipe'
    import {SALVAGE_KIT} from "@/vnhApi";

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
                source: this.getSource(this.object.object)
            }
        },
        methods: {
            getSource(object) {
                let source = {
                    link: null,
                    text: null
                }

                if (object.name === SALVAGE_KIT.name) {
                    source.link = this.getWikiLink('Littia Remus')
                    source.text = 'Littia Remus (Ardent City:D3)'
                }
                else if (object instanceof Recipe)
                    source.text = `${object.skill.name} (${object.level})`
                else if (object.type.name === 'Plant')
                    source.text = `Plant Lore (${object.level}-${object.level+14})`
                else if (object.type.name === 'Bug')
                    source.text = `Bug Lore (${object.level}-${object.level+14})`
                else if (object.type.name === 'Mineral')
                    source.text = `Mining (${object.level}-${object.level+14})`
                else if (object.type.name === 'Fish')
                    source.text = `Fishing (${object.level}-${object.level+14})`
                else if (object.name.indexOf('Pelt') !== -1) {
                    // TODO : Level mapping for boars
                    source.text = `Ranching: Boars (?), Beasts (${object.level}-${object.level+14})`
                }

                if (source.text)
                    return source

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
            isSalvageKit(object) {
                return object.name === SALVAGE_KIT.name
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