<template>
    <div id="crafting-party">
        <p>
            The crafting party tool is intended to help you determine how many gathered materials you need to bring to
            the party to fully utilize the crafting buffs.
        </p>
        <p>
            As you select options, the total amounts below will be updated based on the skill you plan on crafting with.
            Currently, it is intended to only craft one skill per party. For example, if you increment the obtained
            quantities of the Smithing skill, it will not decrement the totals of the other skills to account for the
            time those ingredients will take to craft, so just select a single skill row to gather resources for.
        </p>
        <div style="border: thin solid; margin-bottom: 5px; padding: 5px">
            <div class="font-weight-bold">
                Options
                <b-link size="sm" @click="showHide">
                    <b-icon-chevron-double-up v-if="show" scale="0.75"></b-icon-chevron-double-up>
                    <b-icon-chevron-double-down v-else scale="0.75"></b-icon-chevron-double-down>
                </b-link>
            </div>
            <div v-show="show">
                <b-form @submit.prevent inline>
                    <label for="form-crystals">
                        <b-link :href="getWikiLink('Crystal of the Benevolent Villager')"
                                target="_blank"
                                rel="noopener">Crystals of the Benevolent Villager</b-link>
                    </label>
                    <b-input
                            id="form-crystals"
                            class="mb-2 mr-sm-2 mb-sm-0 ml-2"
                            v-model="options.crystals"
                            v-b-tooltip.hover
                            title="This determines how long you will be crafting for. Each crystal lasts roughly 20 minutes."
                            :debounce="debounce"
                            type="number" number min="1" max="100" step="1"
                            size="sm"></b-input>
                </b-form>
                <div class="row">
                    <div class="col-sm-6">
                        <p class="mt-1 mb-0">
                            <b-link :href="getWikiLink('Village_Projects#Crafting_Stations')"
                                    target="_blank"
                                    rel="noopener">Village Crafting Projects</b-link></p>
                        <div class="row">
                            <div class="col-sm-2"><label for="form-kitchen">Kitchen</label></div>
                            <div class="col-sm-10">
                                <b-form-select
                                        id="form-kitchen"
                                        v-model="options.village.kitchen"
                                        :options="kitchenOptions"
                                        size="sm"
                                        style="width: 312px">
                                </b-form-select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-2"><label for="form-smithy">Smithy</label></div>
                            <div class="col-sm-10">
                                <b-form-select
                                        id="form-smithy"
                                        v-model="options.village.smithy"
                                        :options="smithyOptions"
                                        size="sm"
                                        style="width: 312px">
                                </b-form-select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-2"><label for="form-tailory">Tailory</label></div>
                            <div class="col-sm-10">
                                <b-form-select
                                        id="form-tailory"
                                        v-model="options.village.tailory"
                                        :options="tailoryOptions"
                                        size="sm"
                                        style="width: 312px">
                                </b-form-select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-2"><label for="form-woodshop">Woodshop</label></div>
                            <div class="col-sm-10">
                                <b-form-select
                                        id="form-woodshop"
                                        v-model="options.village.woodshop"
                                        :options="woodshopOptions"
                                        size="sm"
                                        style="width: 312px">
                                </b-form-select>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        Premium Tools (20% Faster)
                        <div class="row">
                            <div class="col-sm-12">
                                <b-form-checkbox
                                        class="mb-2 mr-sm-2 mb-sm-0"
                                        v-model="options.tools.cooking">
                                    Forever Spoon (Cooking)
                                </b-form-checkbox>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12">
                                <b-form-checkbox
                                        class="mb-2 mr-sm-2 mb-sm-0"
                                        v-model="options.tools.smithing">
                                    Crackling Hammer (Smithing)
                                </b-form-checkbox>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12">
                                <b-form-checkbox
                                        class="mb-2 mr-sm-2 mb-sm-0"
                                        v-model="options.tools.tailoring">
                                    Spool of the Depths (Tailoring)
                                </b-form-checkbox>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12">
                                <b-form-checkbox
                                        class="mb-2 mr-sm-2 mb-sm-0"
                                        v-model="options.tools.woodcrafting">
                                    Molten Chisel (Woodcrafting)
                                </b-form-checkbox>
                            </div>
                        </div>
                    </div>
                </div>
                <b-form class="my-1" inline>
                    <b-form-checkbox
                            id="form-villager-insight"
                            class="mb-2 mr-sm-2 mb-sm-0"
                            v-model="options.villagerInsight"
                            v-b-tooltip.hover
                            title="Villager Insight is granted upon gaining a level. If you are low level or are near to a level, you can select this to increase the number of materials you will need as you will be crafting faster.">
                        <b-link :href="getWikiLink('Villager Insight')"
                                target="_blank"
                                rel="noopener"
                                class="mr-1">Villager Insight</b-link>&nbsp;(0.5s faster)
                    </b-form-checkbox>
                </b-form>
                <b-row>
                    <b-col cols="2" class="align-middle">
                        <label for="form-motes">
                            <b-link :href="getWikiLink('Mote of Yorick')"
                                    target="_blank"
                                    rel="noopener">Motes of Yorick</b-link>
                        </label>
                    </b-col>
                    <b-col md="auto">
                        <b-form class="my-1" inline @submit.prevent>
                            <b-input
                                id="form-motes"
                                class="mb-2 mr-sm-2 mb-sm-0 ml-2"
                                v-model="options.motes"
                                v-b-tooltip.hover
                                title="Motes of Yorick allow you to craft faster."
                                :debounce="debounce"
                                type="number" number min="0" step="1"
                                size="sm"
                                :key="forceUpdateMotes"></b-input>
                        </b-form>
                    </b-col>
                    <div class="w-100"></div>
                    <b-col cols="2" class="align-middle">
                        <label for="form-mass-craft">
                            Mass Craft Amount
                        </label>
                    </b-col>
                    <b-col md="auto">
                        <b-form class="my-1" inline @submit.prevent>
                            <b-input
                                    id="form-mass-craft"
                                    class="mb-2 mr-sm-2 mb-sm-0 ml-2"
                                    v-model="massCraft"
                                    v-b-tooltip.hover
                                    title="Mass crafting using Motes of Yorick allows you to craft faster. For example, enter 3 if you are crafting 3 items at a time."
                                    :debounce="debounce"
                                    type="number" number min="0" step="1" :max="massCraftMax"
                                    size="sm"
                                    :key="forceUpdateMassCraft"></b-input>
                        </b-form>
                    </b-col>
                    <div class="w-100"></div>
                    <b-col cols="2">
                        <label for="form-mote-reduction">
                            Mote Reduction
                        </label>
                    </b-col>
                    <b-col md="auto">
                        <b-form class="my-1" inline @submit.prevent>
                            <b-input
                                    id="form-mote-reduction"
                                    class="mb-2 mr-sm-2 mb-sm-0 ml-2"
                                    v-model="options.moteReduction"
                                    v-b-tooltip.hover
                                    title="Chance to refund half of motes used while mass crafting"
                                    :debounce="debounce"
                                    type="number" number min="0" step="1"
                                    size="sm"></b-input>%
                        </b-form>
                    </b-col>
                    <div class="w-100"></div>
                    <b-col cols="2">
                        <label for="form-overage">Overage</label>
                    </b-col>
                    <b-col md="auto">
                        <b-form class="my-1" inline @submit.prevent>
                            <b-input
                                    id="form-overage"
                                    class="mb-2 mr-sm-2 mb-sm-0 ml-2"
                                    v-model="options.overage"
                                    v-b-tooltip.hover
                                    title="Enter an overage amount if you feel you might run out during the session."
                                    :debounce="debounce"
                                    type="number" number min="0" step="1"
                                    size="sm"></b-input>%
                        </b-form>
                    </b-col>
                    <div class="w-100"></div>
                </b-row>
            </div>
        </div>
        <b-table
                striped
                hover
                responsive="true"
                head-variant="dark"
                :items="items"
                :fields="fields"
                sort-icon-left
                small>
            <template v-slot:cell(skill)="row">
                <b-link :href="getWikiLink(row.item.skill)"
                        target="_blank"
                        rel="noopener">
                    {{ row.item.skill }}
                </b-link>
            </template>
            <template v-slot:cell(material)="row">
                <b-link v-for="name in row.item.object.object"
                        :key="name"
                        :href="getWikiLink(name)"
                        target="_blank"
                        rel="noopener">
                    {{ name }}
                </b-link>
            </template>
            <template v-slot:cell(needed)="row">
                <CraftingQuantity :object="row.item.object" type="needed" readonly></CraftingQuantity>
            </template>
            <template v-slot:cell(obtained)="row">
                <CraftingQuantity :object="row.item.object" type="obtained" complete @value-change="valueChange"></CraftingQuantity>
            </template>
            <template v-slot:cell(total)="row">
                <CraftingQuantity :object="row.item.object" type="total" readonly></CraftingQuantity>
            </template>
        </b-table>
    </div>
</template>

<script>
    import CraftingQuantity from '@/components/CraftingQuantity'
    import { getWikiLink, toRoman } from '@/utility'
    import { CraftingSkill } from '@/models/type'
    import { CraftingObject } from '@/crafting/object'
    import { CraftingQuantity as _CraftingQuantity } from '@/crafting/quantity'

    export default {
        name: 'Party',
        components: {
            CraftingQuantity
        },
        data() {
            return {
                options: {
                    crystals: 1,
                    village: {
                        smithy: 1.0,
                        woodshop: 1.0,
                        tailory: 1.0,
                        kitchen: 1.0
                    },
                    tools: {
                        smithing: false,
                        woodcrafting: false,
                        tailoring: false,
                        cooking: false
                    },
                    villagerInsight: false,
                    motes: 0,
                    moteReduction: 0,
                    overage: 0,
                    massCraft: 0
                },
                fields: [
                    {key: 'skill', sortable: true, formatter: 'getSkill', sortByFormatted: true},
                    {key: 'material', sortable: true, formatter: 'getMaterial', sortByFormatted: true},
                    {key: 'needed'},
                    {key: 'obtained'},
                    {key: 'total'}
                ],
                debounce: 200,
                items: [
                    {skill: CraftingSkill.COOKING, object: new CraftingObject(['Oil Fish'], new _CraftingQuantity(0, 350))},
                    {skill: CraftingSkill.SMITHING, object: new CraftingObject(['Ore'], new _CraftingQuantity(0, 350))},
                    {skill: CraftingSkill.TAILORING, object: new CraftingObject(['Fleece', 'Silkworm', 'Pelt'], new _CraftingQuantity(0, 350))},
                    {skill: CraftingSkill.WOODCRAFTING, object: new CraftingObject(['Wood'], new _CraftingQuantity(0, 350))},
                ],
                projects: {
                    smithy: ['Fire Pit', 'Forge', 'Furnace'],
                    woodshop: ['Wood Bench', 'Lumber Yard', 'Sawmill'],
                    tailory: ['Sewing Table', 'Tailory', 'Loom'],
                    kitchen: ['Cooking Stove', 'Oven', 'Kitchen']
                },
                smithyOptions: [],
                woodshopOptions: [],
                tailoryOptions: [],
                kitchenOptions: [],
                show: true,
                defaultSecondsPerCraft: 3.0,
                forceUpdateMotes: 0,
                forceUpdateMassCraft: 0
            }
        },
        computed: {
            massCraft: {
                get: function () {
                    return this.options.massCraft
                },
                set: function (value) {
                    if (value > this.options.motes) {
                        // Don't set the value if set to higher than the number of Motes of Yorick available - reset to
                        //  previously set value
                        this.massCraft = this.options.motes

                        // Force an update as the GUI does not update
                        this.forceUpdateMassCraft += 1

                        return
                    }

                    this.options.massCraft = value
                }
            },
            massCraftMax() {
                return this.options.motes > 50 ? 50 : this.options.motes
            }
        },
        methods: {
            calculate() {
                let totalTimeInMinutes = 20 * this.options.crystals

                for (let index in this.items) {
                    let item = this.items[index]

                    // Calculate the number of crafts based on skill
                    let numberOfCrafts = Math.ceil(totalTimeInMinutes * 60 / this.getSecondsPerCraft(item.skill))

                    let numberOfCraftedItems = numberOfCrafts

                    if (this.options.crystals > 0)
                    {
                        // Add in items based on motes
                        let motes = this.options.motes

                        if (this.options.massCraft > 1) {
                            // Only add more items if mass craft is set to more than 1

                            // Calculate the number of mass crafts than can be done
                            let massCrafts = Math.floor(motes / this.options.massCraft)

                            // Add more motes based on reduction: for each mass craft, you can get the number of motes
                            // used / 2, rounded up, so:
                            //  mass craft  motes   returned
                            //  ----------  -----   --------
                            //      1         0        0
                            //      2         2        1
                            //      3         3        2
                            //      4         4        2
                            //      5         5        3
                            //     etc.
                            motes += massCrafts * (Math.ceil(this.options.massCraft / 2) * (this.options.moteReduction / 100))

                            // Recalculate the number of mass crafts that can be done based on the returned motes
                            massCrafts = Math.floor(motes / this.options.massCraft)

                            // Limit the number of mass crafts that can actually be done in the time given
                            if (massCrafts > numberOfCrafts)
                                massCrafts = numberOfCrafts

                            // Calculate the additional number of crafted items that could be made
                            numberOfCraftedItems = numberOfCraftedItems - massCrafts + massCrafts * this.options.massCraft
                        }
                    }

                    // Lastly, add the overage
                    numberOfCraftedItems *= (1 + (this.options.overage / 100))

                    // Round to next integer
                    numberOfCraftedItems = Math.floor(numberOfCraftedItems)

                    // Double the number of items as each crafted item takes two components
                    numberOfCraftedItems *= 2

                    // Water is used in a 2:1 ratio
                    if (item.object.object === 'Water')
                        numberOfCraftedItems /= 2

                    // Calculate the difference between the previous total and the new total
                    let difference = numberOfCraftedItems - item.object.quantity.total

                    item.object.quantity.total += difference
                    item.object.neededQuantity.total += difference
                }
            },
            getMaterial(value, key, item) {
                return `${item.object.object}`
            },
            getSecondsPerCraft(skill) {
                let secondsPerCraftModifier = 1.0

                if (skill === CraftingSkill.COOKING) {
                    secondsPerCraftModifier = this.options.village.kitchen
                    if (this.options.tools.cooking)
                        secondsPerCraftModifier -= (20 / 100)
                }
                else if (skill === CraftingSkill.SMITHING) {
                    secondsPerCraftModifier = this.options.village.smithy
                    if (this.options.tools.smithing)
                        secondsPerCraftModifier -= (20 / 100)
                }
                else if (skill === CraftingSkill.TAILORING) {
                    secondsPerCraftModifier = this.options.village.tailory
                    if (this.options.tools.tailoring)
                        secondsPerCraftModifier -= (20 / 100)
                }
                else if (skill === CraftingSkill.WOODCRAFTING) {
                    secondsPerCraftModifier = this.options.village.woodshop
                    if (this.options.tools.woodcrafting)
                        secondsPerCraftModifier -= (20 / 100)
                }

                let reduction = this.options.villagerInsight ? 0.5 : 0.0

                return this.defaultSecondsPerCraft * secondsPerCraftModifier - reduction
            },
            getSkill(value, key, item) {
                return `${item.skill}`
            },
            getVillageProjectOptions(name) {
                let options = []

                for (let level = 1; level <= 10; level++) {
                    let _name = this.getVillageProjectName(name, level)
                    let faster = 0

                    if (level >= 4 && level <= 6)
                        faster = 10
                    else if (level >= 7 && level <= 9)
                        faster = 20
                    else if (level === 10)
                        faster = 40

                    let option = {
                        text: `${toRoman(level)}: ${_name} (${faster}% faster)`,
                        value: (100 - faster) / 100
                    }

                    options.push(option)
                }

                return options
            },
            getVillageProjectName(name, level) {
                let preface = ''
                let _name = ''

                if (level === 2 || level === 5 || level === 8)
                    preface = 'Basic '
                else if (level === 4 || level === 7 || level === 10)
                    preface = 'Master '

                if (level >= 8 && level <= 10)
                    preface += 'Imperial '

                if (level === 1)
                    _name = this.projects[name][0]
                else if ((level >= 2 && level <= 4) || (level >= 8 && level <= 10))
                    _name = this.projects[name][1]
                else if (level >= 5 && level <= 7)
                    _name = this.projects[name][2]

                return `${preface}${_name}`
            },
            getWikiLink(page) {
                return getWikiLink(page)
            },
            showHide() {
                this.show = !this.show
            },
            valueChange(object, difference) {
                object.neededQuantity.total += difference
                // TODO: Implement multiple crafting skills at once, e.g. if you increment the obtained quantity for
                //  smithing, it should decrement from the total of cooking as you are still limited by the total time
                //  of the crafting party
            }
        },
        watch: {
            'options.crystals'() { this.calculate() },
            'options.village.smithy'() { this.calculate() },
            'options.village.woodshop'() { this.calculate() },
            'options.village.tailory'() { this.calculate() },
            'options.village.kitchen'() { this.calculate() },
            'options.tools.smithing'() { this.calculate() },
            'options.tools.woodcrafting'() { this.calculate() },
            'options.tools.tailoring'() { this.calculate() },
            'options.tools.cooking'() { this.calculate() },
            'options.villagerInsight'() { this.calculate() },
            'options.motes'(newVal, oldVal) {
                if (newVal === 1) {
                    // minimum of 2 as 1 mote cannot be used, or set to zero if decrementing from 2 by 1
                    this.options.motes = oldVal === 2 ? 0 : 2

                    // Force an update as if you decrement from 2 to 1, it will save motes as 2, but not update the
                    //  GUI to 2
                    this.forceUpdateMotes += 1
                }
                else {
                    this.options.motes = newVal
                }

                if (newVal < this.options.massCraft) {
                    this.options.massCraft = newVal
                }

                this.calculate()
            },
            'options.massCraft'() { this.calculate() },
            'options.moteReduction'() { this.calculate() },
            'options.overage'() { this.calculate() },
        },
        mounted() {
            this.smithyOptions = this.getVillageProjectOptions('smithy')
            this.woodshopOptions = this.getVillageProjectOptions('woodshop')
            this.tailoryOptions = this.getVillageProjectOptions('tailory')
            this.kitchenOptions = this.getVillageProjectOptions('kitchen')

            this.calculate()
        }
    }
</script>
