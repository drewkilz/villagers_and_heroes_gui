<template>
    <div id="recipes">
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Level</th>
                    <th>Class</th>
                    <th>Skill</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="recipes.length === 0">
                    <td colspan="7">No recipes available.</td>
                </tr>
                <tr v-else v-for="recipe in recipes" :key="recipe.id">
                    <td>{{ recipe.name }}</td>
                    <td>{{ recipe.level }}</td>
                    <td>{{ recipe.class_ ? recipe.class_ : 'All' }}
                    </td>
                    <td>{{ recipe.skill.name }}</td>
                    <td>{{ recipe.type.name }}</td>
                    <td></td>
                    <td><a href="#">Add</a></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: 'Recipes',
        data() {
            return {
                recipes: []
            }
        },
        mounted() {
            this.axiosVnhApi.get('recipes/')
                .then(response => (this.recipes = response.data.recipes))
        }
    }
</script>
