<template>
    <div id="recipes">
        <b-table
                striped
                hover
                responsive="true"
                head-variant="dark"
                :items="recipeProvider"
                :fields="fields"
                :busy="recipesLoading"
                primary-key="id"
                sort-icon-left
                :current-page="currentPage"
                :per-page="perPage">
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
                            <b-form-select v-model="classFilter" :options="classOptions" multiple select-size="2">
                            </b-form-select>
                        </b-input-group>
                    </b-th>
                    <b-th>
                        <b-input-group size="sm">
                            <b-form-select v-model="subclassFilter" :options="subclassOptions" multiple select-size="2">
                            </b-form-select>
                        </b-input-group>
                    </b-th>
                    <b-th>
                        <b-input-group size="sm">
                            <b-form-select v-model="skillFilter" :options="skillOptions" multiple select-size="2">
                            </b-form-select>
                        </b-input-group>
                    </b-th>
                    <b-th>
                        <b-input-group size="sm">
                            <b-form-select v-model="typeFilter" :options="typeOptions" multiple select-size="2">
                            </b-form-select>
                        </b-input-group>
                    </b-th>
                    <b-th></b-th>
                </b-tr>
            </template>
            <template v-slot:table-busy>
                <div class="text-center">
                    <b-spinner small class="align-middle"></b-spinner> <strong>Loading...</strong>
                </div>
            </template>
            <template v-slot:cell(add)>
                [ ] <b-link href="#">Add to List</b-link>
            </template>
        </b-table>
        <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                align="fill"
                size="sm"></b-pagination>
    </div>
</template>

<script>
    import { compareValues } from '../utility.js'

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
                recipesLoading: false,
                totalRows: 1,
                currentPage: 1,
                perPage: 5,
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
                this.recipesLoading = true

                let params = `?page=${ctx.currentPage}&perPage=${ctx.perPage}`
                if (ctx.sortBy)
                    params = `${params}&sortBy=${ctx.sortBy}&sortOrder=${ctx.sortDesc ? 'desc' : 'asc'}`

                const promise = this.axiosVnhApi.get(`recipes/${params}`)

                return promise.then(response => {
                    this.recipesLoading = false
                    this.totalRows = response.data.count
                    return response.data.recipes || []
                })
            },
            getCategoryOptions(categoryName) {
                return this.axiosVnhApi.get(`categories/${categoryName}`)
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
            }
        },
        mounted() {
            this.getCategoryOptions('Class').then(data => {this.classOptions = data})
            this.getCategoryOptions('Sub Class').then(data => {this.subclassOptions = data})
            this.getCategoryOptions('Skill').then(data => {this.skillOptions = data})
            this.getCategoryOptions('Crafting Type').then(data => {this.typeOptions = data})
        }
    }
</script>
