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
                        triggers="hover focus">
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
                <b-link :id="getRowItemId(row.index, 'name-link')"
                        :href="getWikiLink(row.item.item.name)"
                        target="_blank"
                        rel="noopener">
                    {{ row.item.name }}
                </b-link>
                <b-popover
                        :target="getRowItemId(row.index, 'name-link')"
                        placement="bottomright"
                        triggers="hover focus">
                    <template v-slot:title>{{ row.item.name }}</template>
                    <ul>
                        <li v-for="ingredient in row.item.ingredients" :key="ingredient.id">
                            {{ ingredient.quantity }}
                            {{ ingredient.item.name }}
                        </li>
                        <li v-if="row.item.cost > 0">{{row.item.cost | craftingCostFilter }}</li>
                    </ul>
                </b-popover>
            </template>
            <template v-slot:cell(add)="row">
                <b-input-group size="sm">
                    <b-form-input v-model="row.item.quantity" size="sm" style="width: 42px" :debounce="debounce" type="number" placeholder="qty" number min="1" step="1"></b-form-input>
                    <b-button size="sm" @click="addToList(row)" v-b-tooltip:hover title="Add to Crafting List"><b-icon-cart-plus></b-icon-cart-plus></b-button>
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
    import { compareValues, getWikiLink } from '../utility.js'

    export default {
        name: 'Recipes',
        data() {
            return {
                fields: [
                    {key: 'name', sortable: true, stickyColumn: true},
                    {key: 'level', sortable: true},
                    {key: 'class', sortable: true, formatter: 'getClassName'},
                    {key: 'subclass', sortable: true, formatter: 'getSubClassName', label:'Sub-Class'},
                    {key: 'skill', sortable: true, formatter: 'getEnumValue'},
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
                typeFilter: [],
                classOptions: [],
                subclassOptions: [],
                skillOptions: [],
                typeOptions: [],
                debounce: 200
            }
        },
        methods: {
            getRowItemId(index, name) {
                return `recipes-${name}-${index}`
            },
            getEnumValue(value) {
                return `${value.name}`
            },
            getClassName(value, key, item) {
                return item.item.class_.name
            },
            getSubClassName(value, key, item) {
                return item.item.subclass.name
            },
            recipeProvider(ctx) {
                let params = `?page=${ctx.currentPage}&perPage=${ctx.perPage}`
                if (ctx.sortBy)
                    params = `${params}&sortBy=${ctx.sortBy}&sortOrder=${ctx.sortDesc ? 'desc' : 'asc'}`

                const promise = this.axiosVnhApi.post(`recipes/${params}`, {
                    filter: ctx.filter
                })

                return promise.then(response => {
                    this.totalRows = response.data.count
                    return response.data.recipes || []
                }).catch(() => {
                    return []
                })
            },
            getCategoryOptions(categoryName, skillType) {
                let url = `categories/${categoryName}`
                if (skillType)
                    url = `skills/${skillType}`

                return this.axiosVnhApi.get(url)
                    .then(response => {
                        let options = []

                        if (!response.data.types)
                            return []

                        for (let index in response.data.types) {
                            let type = response.data.types[index]
                            options.push({text: type.name, value: type.id})
                        }

                        options.sort(compareValues('text'))

                        return options
                    })
                .catch(() => {
                    return []
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
            },
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
                this.typeFilter = []
            },
            addToList(row) {
                let recipe = JSON.parse(JSON.stringify(row.item))

                this.$emit('add-to-crafting-list', recipe, recipe.quantity || 1)

                this.$bvToast.toast(`Added ${recipe.quantity} ${recipe.name} to crafting list.`, {
                    toaster: 'b-toaster-bottom-center',
                    appendToast: true,
                    variant: 'success',
                    autoHideDelay: 2000,
                    noCloseButton: true
                })

                // Clear out the quantity entered from the UI
                row.item.quantity = ''
            },
            getWikiLink(page) {
                return getWikiLink(page)
            }
        },
        mounted() {
            this.getCategoryOptions('Class').then(data => {this.classOptions = data})
            this.getCategoryOptions('Sub Class').then(data => {this.subclassOptions = data})
            this.getCategoryOptions('Skill', 'Crafting').then(data => {this.skillOptions = data})
            this.getCategoryOptions('Crafting Type').then(data => {this.typeOptions = data})
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
