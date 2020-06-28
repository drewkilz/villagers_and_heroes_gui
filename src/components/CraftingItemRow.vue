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
    import { SALVAGE_KIT_NAME, WATER_NAME } from '@/models/item'
    import { ItemType, GatheringSkillType } from '@/models/type'
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
                source: this.getSource(this.object.object),
                ranchingAnimalHarvestLevelMap: {
                    1: {min: 1, max: 9},
                    15: {min: 10, max: 19},
                    30: {min: 20, max: 29},
                    45: {min: 30, max: 34},
                    60: {min: 35, max: 39},
                    75: {min: 40, max: 44},
                    90: {min: 45, max: 49}
                }
            }
        },
        methods: {
            getRowItemId(object, name) {
                return `crafting-${name}-${object.object.id}`
            },
            getSource(object) {
                let source = {
                    link: null,
                    text: null
                }
                if (object instanceof Recipe) {
                    source.text = `${object.skill.name} (${object.level})`

                    if (object.type.name.endsWith('Leather'))
                        source.text += `, Beasts (${this.getSourceLevelRangeText(object.level)})`
                }
                else if (object.name === SALVAGE_KIT_NAME) {
                    source.link = this.getWikiLink('Littia Remus')
                    source.text = 'Littia Remus (Ardent City:D3)'
                }
                else if (object.name === WATER_NAME) {
                    source.link = this.getWikiLink('Water Well')
                    source.text = 'Water Well'
                }
                else if (object.type.name === ItemType.PLANT)
                    source.text = this.getSourceGatheringText(GatheringSkillType.PLANT_LORE, object.level)
                else if (object.type.name === ItemType.BUG)
                    source.text = this.getSourceGatheringText(GatheringSkillType.BUG_LORE, object.level)
                else if (object.type.name === ItemType.MINERAL)
                    source.text = this.getSourceGatheringText(GatheringSkillType.MINING, object.level)
                else if (object.type.name === ItemType.FISH)
                    source.text = this.getSourceGatheringText(GatheringSkillType.FISHING, object.level)
                else if (object.name.endsWith('Pelt')) {
                    source.text = `Ranching: Boars (${this.getSourceLevelRangeRanchingText(object.level)}), Beasts (${this.getSourceLevelRangeText(object.level)})`
                }
                else if (object.type.name.endsWith(ItemType.TOOL)) {
                    source.link = this.getWikiLink('Tool Vendor')
                    source.text = 'Tool Vendor'
                }

                if (source.text)
                    return source

                return 'Unknown'
            },
            getSourceGatheringText(skill, level) {
                return `${skill} (${this.getSourceLevelRangeText(level)})`
            },
            getSourceLevelRangeText(level, range = 14) {
                return `${level}-${level + range}`
            },
            getSourceLevelRangeRanchingText(level) {
                let levelRange = this.ranchingAnimalHarvestLevelMap[level]

                return this.getSourceLevelRangeText(level, levelRange.max - levelRange.min)
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
