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
    export default {
        name: 'Recipes',
        data() {
            return {
                fields: [
                    {key: 'name', sortable: true, stickyColumn: true},
                    {key: 'level', sortable: true},
                    {key: 'class', sortable: true, filterByFormatted: true,
                        formatter: 'getClassName'},
                    {key: 'subclass', sortable: true, filterByFormatted: true,
                        formatter: 'getSubClassName', label:'Sub-Class'},
                    {key: 'skill', sortable: true, filterByFormatted: true,
                        formatter: 'getEnumValue'},
                    {key: 'type', sortable: true, filterByFormatted: true,
                        formatter: 'getEnumValue'},
                    {key: 'add', label: ''}
                ],
                recipesLoading: false,
                totalRows: 1,
                currentPage: 1,
                perPage: 5
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
            }
        },
        mounted() {
            this.axiosVnhApi.get('recipes/')
                .then(response => {
                    this.recipes = response.data.recipes
                    this.recipesLoading = false
                })
        }
    }
</script>
