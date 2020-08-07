<template>
    <div id="equipment-table">
        <div v-if="isBusy">
            <div class="text-center">
                <b-spinner small class="align-middle"></b-spinner>
                <div class="font-weight-bold">Retrieving equipment...</div>
            </div>
        </div>
        <div v-else-if="noRecipes">
            <div class="text-center">
                <div class="font-weight-bold">No recipes found.</div>
                <div>
                    Please enter a level to start at and select a hero class, hero sub-class, and/or a villager class.
                </div>
            </div>
        </div>
        <b-table-simple
                striped
                hover
                responsive="true"
                head-variant="dark"
                primary-key="id"
                small
                bordered
                v-else>
            <b-thead>
                <b-tr>
                    <b-th></b-th>
                    <b-th v-for="level in levels" :key="level" class="text-center" style="width: 16.66%">{{ level }}</b-th>
                    <b-th class="text-center">
                        <b-link href="#" v-on:click="setLevel(options.level + options.numLevels)">
                            <b-iconstack v-b-tooltip.hover :title="setLevelTitle">
                                <b-icon-chevron-double-right scale="0.75"></b-icon-chevron-double-right>
                            </b-iconstack>
                        </b-link>
                    </b-th>
                </b-tr>
            </b-thead>
            <TableHeaderRow value="Hero Equipment" name="heroEquipment" :show="show['heroEquipment']" @show-hide="setShowHide"></TableHeaderRow>
            <b-tbody v-show="show['heroEquipment']">
                <EquipmentRow name="Armor" :recipes="recipes.heroEquipment.armor" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Weapon" :recipes="recipes.heroEquipment.weapon" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Shield" :recipes="recipes.heroEquipment.shield" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Belt" :recipes="recipes.heroEquipment.belt" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Glove" :recipes="recipes.heroEquipment.glove" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Boots" :recipes="recipes.heroEquipment.boots" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Headwear" :recipes="recipes.heroEquipment.headwear" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Trinket" description="x2" :recipes="recipes.heroEquipment.trinket" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
            </b-tbody>
            <TableHeaderRow value="Preparations" name="preparations" :show="show['preparations']" @show-hide="setShowHide"></TableHeaderRow>
            <b-tbody v-show="show['preparations']">
                <EquipmentRow name="Metal Powder" description="Weapon (Expertise)" :recipes="recipes.preparations.powder" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Mineral Oil" description="Headwear (Blasting)" :recipes="recipes.preparations.oil" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Cloth Embroidery" description="Armor (Armor)" :recipes="recipes.preparations.embroidery" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Leather Stitching" description="Belt (Poise)" :recipes="recipes.preparations.stitching" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Wood Resin" description="Glove (Savagery)" :recipes="recipes.preparations.resin" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Wood Pitch" description="Boots (Onslaught)" :recipes="recipes.preparations.pitch" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
            </b-tbody>
            <TableHeaderRow value="Consumables" name="consumables" :show="show['consumables']" @show-hide="setShowHide"></TableHeaderRow>
            <b-tbody v-show="show['consumables']">
                <EquipmentRow name="Mana Roll" description="Intellect & Will" duration="3600" :recipes="recipes.consumables.manaRoll" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Fish Dinner" description="Health" duration="3600" :recipes="recipes.consumables.fishDinner" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Breakfast" description="Armor, Magic Resist, Intellect, Will, Vitality & Vigor" duration="3600" :recipes="recipes.consumables.breakfast" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Pie" description="Experience" duration="7200" :recipes="recipes.consumables.pie" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Dram" description="Various" duration="3600" :recipes="recipes.consumables.dram" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Mana Potion" description="Restores Mana" duration="30" :recipes="recipes.consumables.manaPotion" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Health Potion" description="Restores Health" duration="30" :recipes="recipes.consumables.healthPotion" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Triad Potion" duration="1800" description="Crafting Cost Reduction, Supply Batch Boost, Abundant Harvest, Bountiful Gathering & Supply Find" :recipes="recipes.consumables.triadPotion" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
            </b-tbody>
            <TableHeaderRow value="Villager Equipment" name="villagerEquipment" :show="show['villagerEquipment']" @show-hide="setShowHide"></TableHeaderRow>
            <b-tbody v-show="show['villagerEquipment']">
                <EquipmentRow name="Crafting Tool" description="Experience" :recipes="recipes.villagerEquipment.tool" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Crafter's Necklace" description="Various" :recipes="recipes.villagerEquipment.necklace" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
                <EquipmentRow name="Crafter's Special" description="Experience" :recipes="recipes.villagerEquipment.special" :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentRow>
            </b-tbody>
        </b-table-simple>
    </div>
</template>

<script>
    import EquipmentRow from '@/components/EquipmentRow'
    import TableHeaderRow from '@/components/TableHeaderRow'
    import { EquipmentOptions } from '@/equipment/options'
    import { CraftingType } from '@/models/type'
    import { getEquipment } from '@/vnhApi'
    import { compareValues } from '@/utility'
    import { CraftingList } from '@/crafting/list'

    export default {
        name: 'EquipmentTable',
        props: {
            options: {
                type: EquipmentOptions,
                required: true
            },
            craftingList: {
                type: CraftingList,
                required: true
            }
        },
        components: {
            TableHeaderRow,
            EquipmentRow
        },
        data() {
            return {
                isBusy: false,
                noRecipes: false,
                levels: Array.from(new Array(this.options.numLevels), (x, i) => i + this.options.level),
                recipes: {},
                setLevelTitle: `Advance to next level (${this.options.level + this.options.numLevels})`,
                show: {
                    consumables: false,
                    heroEquipment: false,
                    preparations: false,
                    villagerEquipment: false
                },
            }
        },
        methods: {
            addToCraftingList(object) {
                this.$emit('add-to-crafting-list', object)
            },
            async displayEquipment() {
                this.isBusy = true

                let recipes = await getEquipment(this.options)

                if (recipes === null) {
                    this.initializeRecipes()
                }
                else {
                    this.noRecipes = false

                    this.recipes.heroEquipment.armor = this.getRecipesByLevel(recipes, CraftingType.ARMOR)
                    this.recipes.heroEquipment.weapon = this.getRecipesByLevel(recipes, 'Weapon')
                    this.recipes.heroEquipment.shield = this.getRecipesByLevel(recipes, CraftingType.SHIELD)
                    this.recipes.heroEquipment.belt = this.getRecipesByLevel(recipes, CraftingType.BELT)
                    this.recipes.heroEquipment.glove = this.getRecipesByLevel(recipes, CraftingType.GLOVE)
                    this.recipes.heroEquipment.boots = this.getRecipesByLevel(recipes, CraftingType.BOOTS)
                    this.recipes.heroEquipment.headwear = this.getRecipesByLevel(recipes, CraftingType.HATS)
                    this.recipes.heroEquipment.trinket = this.getRecipesByLevel(recipes, CraftingType.TRINKET)

                    this.recipes.preparations.powder = this.getRecipesByLevel(recipes, CraftingType.POWDER, ['Powder'])
                    this.recipes.preparations.oil = this.getRecipesByLevel(recipes, CraftingType.POWDER,
                        ['Extract', 'Spirits', 'Distillate'])
                    this.recipes.preparations.embroidery = this.getRecipesByLevel(recipes, CraftingType.EMBROIDERY,
                        ['Embroidery'])
                    this.recipes.preparations.stitching = this.getRecipesByLevel(recipes, CraftingType.EMBROIDERY,
                        ['Stitching'])
                    this.recipes.preparations.resin = this.getRecipesByLevel(recipes, CraftingType.RESIN, ['Resin'])
                    this.recipes.preparations.pitch = this.getRecipesByLevel(recipes, CraftingType.RESIN, ['Pitch'])

                    this.recipes.consumables.manaRoll = this.getRecipesByLevel(recipes, 'Mana Roll')
                    this.recipes.consumables.fishDinner = this.getRecipesByLevel(recipes, 'Fish Dinner')
                    this.recipes.consumables.breakfast = this.getRecipesByLevel(recipes, 'Breakfast')
                    this.recipes.consumables.pie = this.getRecipesByLevel(recipes, 'Pie')
                    this.recipes.consumables.dram = this.getRecipesByLevel(recipes, CraftingType.DRAM)
                    this.recipes.consumables.manaPotion = this.getRecipesByLevel(recipes, CraftingType.MANA)
                    this.recipes.consumables.healthPotion = this.getRecipesByLevel(recipes, CraftingType.HEALTH)
                    this.recipes.consumables.triadPotion = this.getRecipesByLevel(recipes, CraftingType.TRIAD)

                    this.recipes.villagerEquipment.tool = this.getRecipesByLevel(recipes, CraftingType.TOOL)
                    this.recipes.villagerEquipment.necklace = this.getRecipesByLevel(recipes, CraftingType.NECKLACE)
                    this.recipes.villagerEquipment.special = this.getRecipesByLevel(recipes, 'Villager Special')

                    this.showOrHideSections()
                }

                this.isBusy = false
            },
            getRecipesByLevel(recipesDictionary, key, nameSearches = []) {
                let recipesByLevel = {next: [], recipes: Array.from(new Array(this.options.numLevels), () => [])}

                if (key in recipesDictionary) {
                    for (const recipe of recipesDictionary[key].recipes) {
                        if (nameSearches.length === 0)
                            recipesByLevel.recipes[recipe.level - this.options.level].push(recipe)
                        else {
                            for (const nameSearch of nameSearches) {
                                if (recipe.name.indexOf(nameSearch) !== -1)
                                    recipesByLevel.recipes[recipe.level - this.options.level].push(recipe)
                            }
                        }
                    }

                    let currentRecipes = []
                    if (nameSearches.length === 0) {
                        currentRecipes = recipesDictionary[key].previous
                        recipesByLevel.next = recipesDictionary[key].next
                    }
                    else {
                        for (const recipe of recipesDictionary[key].previous) {
                            if (nameSearches.length > 0) {
                                for (const nameSearch of nameSearches) {
                                    if (recipe.name.indexOf(nameSearch) !== -1)
                                        currentRecipes.push(recipe)
                                }
                            }
                        }
                        for (const recipe of recipesDictionary[key].next) {
                            if (nameSearches.length > 0) {
                                for (const nameSearch of nameSearches) {
                                    if (recipe.name.indexOf(nameSearch) !== -1)
                                        recipesByLevel.next.push(recipe)
                                }
                            }
                        }
                    }

                    for (const index in recipesByLevel.recipes) {
                        if (recipesByLevel.recipes[index].length === 0) {
                            for (const recipe of currentRecipes) {
                                recipesByLevel.recipes[index].push(recipe)
                            }
                        }
                        else {
                            currentRecipes = recipesByLevel.recipes[index]
                        }
                    }
                }

                // Sorting - sort by class, then sub-class, then skill, then rarity
                for (const recipeList of recipesByLevel.recipes) {

                    recipeList.sort(function (a, b) {
                        let sortKeys = ['item.class.name', 'item.subclass.name', 'skill.name', 'item.rarity.name']

                        for (const sortKey of sortKeys) {
                            let sortValue = compareValues(sortKey)(a, b)
                            if (sortValue !== 0)
                                return sortValue
                        }
                    })
                }

                return recipesByLevel
            },
            initializeRecipes() {
                let defaultRecipes = {next: [], recipes: Array.from(new Array(this.options.numLevels), () => [])}

                this.recipes = {
                    heroEquipment: {
                        armor: defaultRecipes,
                        weapon: defaultRecipes,
                        shield: defaultRecipes,
                        belt: defaultRecipes,
                        glove: defaultRecipes,
                        boots: defaultRecipes,
                        headwear: defaultRecipes,
                        trinket: defaultRecipes,
                    },
                    preparations: {
                        powder: defaultRecipes,
                        oil: defaultRecipes,
                        embroidery: defaultRecipes,
                        stitching: defaultRecipes,
                        resin: defaultRecipes,
                        pitch: defaultRecipes,
                    },
                    consumables: {
                        manaRoll: defaultRecipes,
                        fishDinner: defaultRecipes,
                        breakfast: defaultRecipes,
                        pie: defaultRecipes,
                        dram: defaultRecipes,
                        manaPotion: defaultRecipes,
                        healthPotion: defaultRecipes,
                        triadPotion: defaultRecipes,
                    },
                    villagerEquipment: {
                        tool: defaultRecipes,
                        necklace: defaultRecipes,
                        special: defaultRecipes,
                    }
                }

                this.showOrHideSections()

                this.noRecipes = true
            },
            setLevel(newLevel) {
                this.options.level = newLevel
            },
            setShowHide(name) {
                this.show[name] = !this.show[name]
            },
            showOrHideSection(name) {
                for (const property in this.recipes[name]) {
                    for (const recipes of this.recipes[name][property].recipes) {
                        for (const recipesForLevel of recipes) {
                            if (recipesForLevel.length !== 0 ) {
                                this.show[name] = true
                                return
                            }
                        }
                    }
                }

                this.show[name] = false
                return this.show[name]
            },
            showOrHideSections() {
                for (const property in this.show) {
                    this.showOrHideSection(property)
                }
            }
        },
        created() {
            this.initializeRecipes()
        },
        watch: {
            'options.level'() {
                this.levels = Array.from(new Array(this.options.numLevels), (x, i) => i + this.options.level)
                this.displayEquipment()
            },
            'options.heroClasses'() {
                this.displayEquipment()
            },
            'options.heroSubClasses'() {
                this.displayEquipment()
            },
            'options.villagerClasses'() {
                this.displayEquipment()
            }
        }
    }
</script>
