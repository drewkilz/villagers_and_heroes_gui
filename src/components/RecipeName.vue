<template>
    <span>
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
            <div v-if="preface" v-html="preface"></div>
            <div><u>Ingredients</u></div>
            <ul>
                <li v-for="ingredient in recipe.ingredients" :key="ingredient.id">
                    {{ ingredient.quantity }}
                    {{ ingredient.item.name }}
                </li>
                <li v-if="recipe.cost.total > 0">{{recipe.cost }}</li>
            </ul>
        </b-popover>
    </span>
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
            },
            preface: {
                type: String,
                required: false
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
