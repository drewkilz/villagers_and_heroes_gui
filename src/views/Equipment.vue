<template>
    <div>
        <div style="border: thin solid; margin-bottom: 5px; padding: 5px">
            <div class="font-weight-bold">
                Options
                <b-link size="sm" @click="showHide('options')">
                    <b-icon-chevron-double-up v-if="show['options']" scale="0.75"></b-icon-chevron-double-up>
                    <b-icon-chevron-double-down v-else scale="0.75"></b-icon-chevron-double-down>
                </b-link>
            </div>
            <b-form v-show="show['options']">
                <b-row class="text-left">
                    <b-col lg="1" order-lg="1" md="2" order-md="1">
                        <label for="form-level">Level</label>
                    </b-col>
                    <b-col lg="2" order-lg="2" md="4" order-md="2">
                        <b-input
                                id="form-level"
                                class="mb-2 mr-sm-2 mb-sm-0 ml-2"
                                v-model="options.level"
                                v-b-tooltip.hover
                                title="The starting level to display equipment for (e.g. 1)"
                                :debounce="debounce"
                                type="number" number min="1" max="95" step="1"
                                size="sm"></b-input>
                    </b-col>
                    <b-col lg="1" order-lg="3" md="2" order-md="5">
                        <label for="form-hero-class">Hero Class</label>
                    </b-col>
                    <b-col lg="2" order-lg="4" md="4" order-md="6">
                        <b-input-group size="sm">
                            <b-form-select id="form-hero-class" v-model="options.heroClasses"
                                           :options="heroClassOptions" multiple>
                            </b-form-select>
                        </b-input-group>
                    </b-col>
                    <b-col lg="1" order-lg="5" md="2" order-md="7">
                        <label for="form-hero-sub-class">Hero Sub-Class</label>
                    </b-col>
                    <b-col lg="2" order-lg="6" md="4" order-md="8">
                        <b-input-group size="sm">
                            <b-form-select id="form-hero-sub-class" v-model="options.heroSubClasses"
                                           :options="heroSubClassOptions" multiple>
                            </b-form-select>
                        </b-input-group>
                    </b-col>
                    <b-col lg="1" order-lg="7" md="2" order-md="3">
                        <label for="form-villager-class">Villager Class</label>
                    </b-col>
                    <b-col lg="2" order-lg="8" md="4" order-md="4">
                        <b-input-group size="sm">
                            <b-form-select id="form-villager-class" v-model="options.villagerClasses"
                                           :options="villagerClassOptions" multiple>
                            </b-form-select>
                        </b-input-group>
                    </b-col>
                    <b-col order="9">
                        <b-button size="sm" v-on:click="clearFilters">Clear Filters</b-button>
                    </b-col>
                </b-row>
            </b-form>
        </div>
        <EquipmentTable :options="options" :craftingList="craftingList" @add-to-crafting-list="addToCraftingList"></EquipmentTable>
    </div>
</template>

<script>
    import EquipmentTable from '@/components/EquipmentTable'
    import { getCategory } from '@/vnhApi'
    import { compareValues } from '@/utility'
    import { EquipmentOptions } from '@/equipment/options'
    import { CraftingList } from '@/crafting/list'

    export default {
        name: 'Equipment',
        props: {
            craftingList: {
                type: CraftingList,
                required: true
            }
        },
        components: {
            EquipmentTable
        },
        data() {
            return {
                debounce: 200,
                heroClassOptions: [],
                heroSubClassOptions: [],
                options: new EquipmentOptions(),
                show: {
                    options: true
                },
                villagerClassOptions: []
            }
        },
        methods: {
            addToCraftingList(object) {
                this.$emit('add-to-crafting-list', object)
            },
            clearFilters() {
                this.options.level = 1
                this.options.heroClasses = []
                this.options.heroSubClasses = []
                this.options.villagerClasses = []
            },
            getOptions(name) {
                let options = []

                return getCategory(name).then(data => {
                    let types = data.types
                    for (let index in types) {
                        let type = types[index]
                        // Exclude the "All" option
                        if (type.name === 'All')
                            continue
                        options.push({text: type.name, value: type.id})
                    }

                    options.sort(compareValues('text'))

                    return options
                })
            },
            showHide(name) {
                this.show[name] = !this.show[name]
            }
        },
        mounted() {
            this.getOptions('Class').then(data => { this.heroClassOptions = data })
            this.getOptions('Sub Class').then(data => { this.heroSubClassOptions = data })
            this.getOptions('Villager Class').then(data => { this.villagerClassOptions = data })
        },
        watch: {
            // 'craftingList.options.salvaging'() {
            //     this.calculateList()
            // },
            // 'craftingList.options.ingredientSalvagePercent'() {
            //     this.calculateList()
            // },
            // 'craftingList.options.componentSalvagePercent'() {
            //     this.calculateList()
            // },
            // 'craftingList.options.craftingCostReduction'() {
            //     this.getTotalCost()
            // },
        }
    }
</script>
