<template>
    <b-tr>
        <b-th>
            <div>
                {{ name }}
                <span v-if="duration" class="float-right" style="font-size: 75%; font-weight: normal"
                      v-b-tooltip.hover :title="formatDuration(duration, true)">
                    {{ formatDuration(duration, false) }}
                </span>
            </div>
            <div v-if="description || duration" class="font-italic" style="font-size: 75%; font-weight: normal">
                <div v-if="description" v-b-tooltip.hover :title="description">{{ getRowHeaderDescription() }}</div>
            </div>
        </b-th>
        <b-td v-for="(recipesForLevel, index) in recipes" :key="index">
            <div v-for="(recipe, recipeIndex) in recipesForLevel" :key="recipeIndex" :class="firstOccurrence(recipe, index) ? 'firstOccurrence' : 'notFirstOccurrence'" style="border-width: thin; border-radius: 5px; margin-bottom: 5px; padding: 5px">
                <div>
                    <RecipeName :recipe="recipe" :index="getIndex(name, index, recipeIndex)" :preface="getPreface(recipe)"></RecipeName>
                    <b-img width="15" height="15" :src="getRarityIconSource(recipe.item.rarity)" right v-b-tooltip.hover
                           :title="recipe.item.rarity.name"></b-img>
                </div>
                <div>
                    <b-img width="15" height="15" class="mr-1" :src="getClassIconSource(recipe.item.class)"
                           v-b-tooltip.hover :title="recipe.item.class.name"></b-img>
                    <b-img width="15" height="15" :src="getSubClassIconSource(recipe.item.subclass)" v-b-tooltip.hover
                           :title="recipe.item.subclass.name"></b-img>
                    <div class="float-right">
                        <span :key="forceUpdateQuantity" v-text="getQuantity(recipe)"
                              style="font-size: 75%" class="mr-1 font-italic" v-b-tooltip.hover
                              title="Quantity in your crafting list"></span>
                        <b-link href="#" @click="addToList(recipe)">
                            <b-img width="15" height="15" :src="getSkillIconSource(recipe.skill)"
                                   v-b-tooltip.hover.html :title="getCraftingTitle(recipe)"></b-img>
                        </b-link>
                    </div>
                </div>
            </div>
        </b-td>
    </b-tr>
</template>

<script>
    import RecipeName from '@/components/RecipeName'
    import { CraftingObject } from '@/crafting/object'
    import { CraftingType, SkillType } from '@/models/type'
    import { getWikiLink } from '@/utility'
    import { CraftingList } from '@/crafting/list'
    import {EquipmentOptions} from '@/equipment/options'

    export default {
        name: 'EquipmentTable',
        props: {
            name: {
                type: String,
                required: true
            },
            recipes: {
                type: Array,
                required: true
            },
            description: {
                type: String,
                required: false
            },
            duration: {
                type: String,
                required: false
            },
            craftingList: {
                type: CraftingList,
                required: true
            },
            options: {
                type: EquipmentOptions,
                required: true
            },
        },
        components: {
            RecipeName
        },
        data() {
            return {
                debounce: 200,
                forceUpdateQuantity: 0
            }
        },
        methods: {
            addToList(recipe) {
                this.$emit('add-to-crafting-list', new CraftingObject(recipe, 1))

                this.$bvToast.toast(
                    `Added ${recipe.name} to crafting list.`, {
                        toaster: 'b-toaster-bottom-center',
                        appendToast: true,
                        variant: 'success',
                        autoHideDelay: 2000,
                        noCloseButton: true
                    })

                this.forceUpdateQuantity += 1
            },
            firstOccurrence(recipe, index) {
                return recipe.level === index + this.options.level
            },
            formatDuration(seconds, full = true) {
                let secondsAsInt = parseInt(seconds)

                if (secondsAsInt <= 60) {
                    let plural = secondsAsInt > 1 ? 's' : ''
                    return full ? `${secondsAsInt} second${plural}` : `${secondsAsInt}s`
                }
                else if (secondsAsInt < 3600) {
                    let plural = secondsAsInt / 60 > 1 ? 's' : ''
                    return full ? `${secondsAsInt / 60} minute${plural}` : `${secondsAsInt / 60}m`
                }
                else {
                    let plural = secondsAsInt / 3600 > 1 ? 's' : ''
                    return full ? `${secondsAsInt / 3600} hour${plural}` : `${secondsAsInt / 3600}h`
                }
            },
            getClassIconSource(class_) {
                return require(`../assets/icons/hero/class/${class_.name.toLowerCase()}-color.png`)
            },
            getCraftingTitle(recipe) {
                return `Crafted with ${recipe.skill.name}.<br/>Click to add to crafting list.`
            },
            getIndex(name, index, recipeIndex) {
                let hash = 0, i, chr;
                for (i = 0; i < name.length; i++) {
                    chr   = name.charCodeAt(i);
                    hash  = ((hash << 5) - hash) + chr;
                    hash |= 0; // Convert to 32bit integer
                }
                return hash + index * 1000 + recipeIndex;
            },
            getPreface(recipe) {
                let note = null
                if (recipe.type.name === CraftingType.DRAM) {
                    if (recipe.name.endsWith('Armor'))
                        note = 'Increases Armor by X'
                    else if (recipe.name.endsWith('Clarity'))
                        note = 'Increases Clarity by X'
                    else if (recipe.name.endsWith('Expertise'))
                        note = 'Increases Expertise by X'
                    else if (recipe.name.endsWith('Haste'))
                        note = 'Increases Haste by X'
                    else if (recipe.name.endsWith('Healing'))
                        note = 'All healing done to you is increased by X'
                    else if (recipe.name.endsWith('Liberty'))
                        note = 'Reduces the duration of most stuns, snares, and slows by 80%'
                    else if (recipe.name.endsWith('Magic'))
                        note = 'Increases Magic Resist by X'
                    else if (recipe.name.endsWith('Malice'))
                        note = 'Increases Savagery and Brutality by X'
                    else if (recipe.name.endsWith('Mastery'))
                        note = 'Increases Masteries by X'
                    else if (recipe.name.endsWith('Treasure'))
                        note = 'Increases Magic Find by X'
                }
                else if (recipe.type.name === CraftingType.NECKLACE) {
                    if (recipe.skill.name === SkillType.SMITHING)
                        note = 'Crafting costs are reduced by X%'
                    else if (recipe.skill.name === SkillType.TAILORING)
                        note = 'You have a X% increased chance at finding a Mote of Yorick while gathering. Additionally, your chance to find supplies is boosted by Y%.'
                    else if (recipe.skill.name === SkillType.WOODCRAFTING)
                        note = 'While rapid crafting using Motes of Yorick, you have a X% chance to recover half of the motes spent'
                }

                if (note === null)
                    return null

                return `<div class="font-italic" style="font-size: 80%">${note}</div>`
            },
            getQuantity(recipe) {
                if (this.inCraftingList(recipe))
                    return this.craftingList.list[recipe.name].quantity.total

                return ''
            },
            getRarityIconSource(rarity) {
                return require(`../assets/icons/rarity/${rarity.name.toLowerCase()}.jpg`)
            },
            getRowHeaderDescription() {
                if (this.description) {
                    if (this.description.length > 25)
                        return this.description.slice(0, 20) + '...'
                    else
                        return this.description
                }
            },
            getSkillIconSource(skill) {
                return require(`../assets/icons/villager/skill/${skill.name.toLowerCase()}-color.png`)
            },
            getSubClassIconSource(subClass) {
                return require(`../assets/icons/hero/subclass/${subClass.name.toLowerCase()}.jpg`)
            },
            getWikiLink(page) {
                return getWikiLink(page)
            },
            inCraftingList(recipe) {
                return recipe.name in this.craftingList.list
            }
        },
        created() {
        },
        watch: {
            // 'options.level'() {
            //     this.displayEquipment()
            // },
            // 'options.heroClasses'() {
            //     this.displayEquipment()
            // },
            // 'options.heroSubClasses'() {
            //     this.displayEquipment()
            // },
            // 'options.villagerClasses'() {
            //     this.displayEquipment()
            // }
        }
    }
</script>

<style scoped>
    .firstOccurrence {
        border-color: black;
        border-style: solid;
    }

    .notFirstOccurrence {
        border-color: rgb(214, 216, 219);
        border-style: dashed;
    }
</style>