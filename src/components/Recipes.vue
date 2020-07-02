<template>
    <div id="recipes">
        <b-table
                striped
                hover
                responsive="true"
                head-variant="dark"
                :items="recipeProvider"
                :fields="fields"
                :busy="isBusy"
                :filter="filter"
                primary-key="id"
                sort-icon-left
                :current-page="currentPage"
                :per-page="perPage"
                small>
            <template v-slot:thead-top>
                <b-tr class="thead-light">
                    <b-th>
                        <b-input-group size="sm">
                            <b-form-input :debounce="debounce" v-model="nameFilter" type="search" placeholder="Type to Search"></b-form-input>
                        </b-input-group>
                    </b-th>
                    <b-th>
                        <b-input-group size="sm">
                            <b-form-input :debounce="debounce" v-model="minLevelFilter" type="number" placeholder="min" number min="1" max="95" step="1"></b-form-input>
                        </b-input-group>
                        <b-input-group size="sm">
                            <b-form-input :debounce="debounce" v-model="maxLevelFilter" type="number" placeholder="max" number min="1" max="95" step="1"></b-form-input>
                        </b-input-group>
                    </b-th>
                    <b-th>
                        <b-input-group size="sm">
                            <b-form-select v-model="classFilter" :options="classOptions" multiple>
                            </b-form-select>
                        </b-input-group>
                    </b-th>
                    <b-th>
                        <b-input-group size="sm">
                            <b-form-select v-model="subclassFilter" :options="subclassOptions" multiple>
                            </b-form-select>
                        </b-input-group>
                    </b-th>
                    <b-th>
                        <b-input-group size="sm">
                            <b-form-select v-model="skillFilter" :options="skillOptions" multiple>
                            </b-form-select>
                        </b-input-group>
                    </b-th>
                    <b-th>
                        <b-input-group size="sm">
                            <b-form-select v-model="rarityFilter" :options="rarityOptions" multiple>
                            </b-form-select>
                        </b-input-group>
                    </b-th>
                    <b-th>
                        <b-input-group size="sm">
                            <b-form-select v-model="typeFilter" :options="typeOptions" multiple>
                            </b-form-select>
                        </b-input-group>
                    </b-th>
                    <b-th>
                        <b-button v-on:click="clearFilters">Clear Filters</b-button>
                    </b-th>
                </b-tr>
            </template>
            <template v-slot:head(add)>
                <div id="header-add">Crafting List</div>
                <b-popover
                        target="header-add"
                        placement="left"
                        triggers="hover">
                    <template v-slot:title>Add to Crafting List</template>
                    <div>
                        Enter a quantity then click the <b-icon-cart-plus></b-icon-cart-plus> icon to the right to add
                        the recipe to your Crafting List.
                    </div>
                </b-popover>
            </template>
            <template v-slot:table-busy>
                <div class="text-center">
                    <b-spinner small class="align-middle"></b-spinner> <strong>Loading...</strong>
                </div>
            </template>
            <template v-slot:cell(name)="row">
                <RecipeName :recipe="row.item.object" :index="row.index"></RecipeName>
            </template>
            <template v-slot:cell(add)="row">
                <b-input-group size="sm">
                    <b-form-input v-model="row.item.quantity" size="sm" style="width: 42px" :debounce="debounce" type="number" placeholder="qty" number min="1" step="1"></b-form-input>
                    <b-button size="sm" @click="addToList(row.item)"><b-icon-cart-plus></b-icon-cart-plus></b-button>
                </b-input-group>
            </template>
            <template v-slot:table-caption>{{ totalRows }} recipes found.</template>
        </b-table>
        <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                align="fill"
                size="sm"
                limit="10"
                first-number
                last-number></b-pagination>
    </div>
</template>

<script>
    import RecipeName from '@/components/RecipeName'
    import { CraftingObject } from '@/crafting/object'
    import { compareValues, getWikiLink } from '@/utility'
    import { getCategory, getRecipes, getSkills } from '@/vnhApi'

    export default {
        name: 'Recipes',
        components: {
            RecipeName
        },
        data() {
            return {
                debounce: 200,
                fields: [
                    {key: 'name', sortable: true, stickyColumn: true},
                    {key: 'level', sortable: true, formatter: 'getLevel'},
                    {key: 'class', sortable: true, formatter: 'getClassName'},
                    {key: 'subclass', sortable: true, formatter: 'getSubClassName', label:'Sub-Class'},
                    {key: 'skill', sortable: true, formatter: 'getEnumValue'},
                    {key: 'rarity', sortable: true, formatter: 'getRarity'},
                    {key: 'type', sortable: true, formatter: 'getEnumValue'},
                    {key: 'add', label: ''}
                ],
                isBusy: false,

                totalRows: 1,
                currentPage: 1,
                perPage: 10,

                filter: [],

                nameFilter: '',
                minLevelFilter: '',
                maxLevelFilter: '',
                classFilter: [],
                subclassFilter: [],
                skillFilter: [],
                rarityFilter: [],
                typeFilter: [],

                classOptions: [],
                subclassOptions: [],
                skillOptions: [],
                rarityOptions: [],
                typeOptions: []
            }
        },
        methods: {
            addFilter(field, op, value, includeOp) {
                // Set up a local filter_ based off of the component's filter
                let filter_ = []
                if (this.filter)
                    filter_ = this.filter

                // If the field already exists in the filter, remove it as we will be replacing it
                if (includeOp)
                    this.removeFilter(filter_, field, op)
                else
                    this.removeFilter(filter_, field)

                // Add the new filter
                filter_.push({field: field, op: op, value: value})

                // Set the component's filter to the local filter to trigger a filtering event
                this.filter = filter_
            },
            addToList(object) {
                this.$emit('add-to-crafting-list', object.clone())

                this.$bvToast.toast(
                    `Added ${object.quantity ? object.quantity : 1} ${object.object.name} to crafting list.`, {
                    toaster: 'b-toaster-bottom-center',
                    appendToast: true,
                    variant: 'success',
                    autoHideDelay: 2000,
                    noCloseButton: true
                })

                // Clear out the quantity entered from the UI
                object.quantity = ''
            },
            changeFilter(newVal, field, op, includeOp) {
                let addFilter = false
                if (typeof(newVal) === 'object') {
                    if (newVal.length > 0)
                        addFilter = true
                }
                else if (newVal)
                    addFilter = true

                if (addFilter)
                    this.addFilter(field, op, newVal, includeOp)
                else
                    this.removeFilter(this.filter, field, op)
            },
            clearFilters() {
                this.filter = []
                this.nameFilter = ''
                this.minLevelFilter = ''
                this.maxLevelFilter = ''
                this.classFilter = []
                this.subclassFilter = []
                this.skillFilter = []
                this.rarityFilter = []
                this.typeFilter = []
            },
            getClassName(value, key, item) {
                return item.object.item.class.name
            },
            getEnumValue(value, key, item) {
                return `${item.object[key].name}`
            },
            getLevel(value, key, item) {
                return item.object.level
            },
            getOptions(type, name) {
                let function_ = type === 'Category' ? getCategory : getSkills

                let options = []

                return function_(name).then(data => {
                    let types = type === 'Category' ? data.types : data
                    for (let index in types) {
                        let type = types[index]
                        options.push({text: type.name, value: type.id})
                    }

                    options.sort(compareValues('text'))

                    return options
                })
            },
            getRarity(value, key, item) {
                return item.object.item.rarity.name
            },
            getRowItemId(index, name) {
                return `recipes-${name}-${index}`
            },
            getSubClassName(value, key, item) {
                return item.object.item.subclass.name
            },
            getWikiLink(page) {
                return getWikiLink(page)
            },
            recipeProvider(ctx) {
                return getRecipes(ctx).then(data => {
                    this.totalRows = data.count
                    let objects = []
                    for (let index in data.recipes) {
                        objects.push(new CraftingObject(data.recipes[index], ''))
                    }
                    return objects
                })
            },
            removeFilter(filter, field, op) {
                for (let index = filter.length; index--;)
                    if (filter[index]['field'] === field) {
                        if (op) {
                            if (filter[index]['op'] === op)
                                filter.splice(index, 1)
                        }
                        else
                            filter.splice(index, 1)
                    }
            }
        },
        mounted() {
            this.getOptions('Category', 'Class').then(data => {this.classOptions = data})
            this.getOptions('Category', 'Sub Class').then(data => {this.subclassOptions = data})
            this.getOptions('Skill', 'Crafting').then(data => {this.skillOptions = data})
            this.getOptions('Category', 'Crafting Type').then(data => {this.typeOptions = data})
            this.getOptions('Category', 'Rarity').then(data => {this.rarityOptions = data})
        },
        watch: {
            nameFilter(newVal) {
                this.changeFilter(`%${newVal}%`, 'name', 'ilike')
            },
            minLevelFilter(newVal) {
                this.changeFilter(newVal, 'level', '>=', true)
            },
            maxLevelFilter(newVal) {
                this.changeFilter(newVal, 'level', '<=', true)
            },
            classFilter(newVal) {
                this.changeFilter(newVal, 'class', 'in')
            },
            subclassFilter(newVal) {
                this.changeFilter(newVal, 'subclass', 'in')
            },
            skillFilter(newVal) {
                this.changeFilter(newVal, 'skill', 'in')
            },
            rarityFilter(newVal) {
                this.changeFilter(newVal, 'rarity', 'in')
            },
            typeFilter(newVal) {
                this.changeFilter(newVal, 'type', 'in')
            }
        }
    }
</script>

<style>
    /* Modify the select filter boxes to be three lines - select-size is only respected by some browsers and causes warnings in Vue, so use CSS instead */
    .custom-select {
        max-height: 69px;
        overflow: auto;
    }
</style>
