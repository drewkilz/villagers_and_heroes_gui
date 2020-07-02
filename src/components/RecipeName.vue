<template>
    <div>
        <b-link :id="getRowItemId(index, 'name-link')"
                :href="getWikiLink(recipe.name)"
                target="_blank"
                rel="noopener">
            {{ recipe.name }}
        </b-link>
        <b-popover
                :target="getRowItemId(index, 'name-link')"
                placement="bottomright"
                triggers="hover">
            <template v-slot:title>{{ recipe.name }}</template>
            <ul>
                <li v-for="ingredient in recipe.ingredients" :key="ingredient.id">
                    {{ ingredient.quantity }}
                    {{ ingredient.item.name }}
                </li>
                <li v-if="recipe.cost.total > 0">{{recipe.cost }}</li>
            </ul>
        </b-popover>
    </div>
</template>

<script>
    import { getWikiLink } from '@/utility'
    import { Recipe } from "@/models/recipe";

    export default {
        name: 'RecipeName',
        props: {
            recipe: {
                type: Recipe,
                required: true
            },
            index: {
                type: Number,
                required: true
            }
        },
        methods: {
            getRowItemId(index, name) {
                return `recipes-${name}-${index}`
            },
            getWikiLink(page) {
                return getWikiLink(page)
            },
        }
    }
</script>
