<template>
    <div>
        <p>This website contains a series of tools to supplement your gaming experience in Villagers & Heroes.</p>
        <p class="font-weight-light font-italic">
            NOTE: This website is hosted on a free Heroku server, so the first data query may take up to 10 seconds to
            retrieve, to wake the server up.
        </p>
        <dt><b-link href="#" v-on:click="switchContent('crafting')">Crafting</b-link></dt>
        <dd>
            Allows you to calculate the items, refined ingredients, and crafting components you will need to make recipes.
            You can select the recipes and quantities to craft in either the
            <b-link href="#" v-on:click="switchContent('equipment')">Equipment</b-link> or
            <b-link href="#" v-on:click="switchContent('recipes')">Recipes</b-link> tool.
        </dd>
        <br />
        <dt><b-link href="#" v-on:click="switchContent('equipment')">Equipment</b-link></dt>
        <dd>
            Displays the crafted equipment (armor, weapons, potions, etc.) by level for the class of your choosing. From
            this tool, you can select equipment to make and then utilize the
            <b-link href="#" v-on:click="switchContent('crafting')">Crafting</b-link> tool to calculate the
            necessary resources.
        </dd>
        <br />
        <dt><b-link href="#" v-on:click="switchContent('recipes')">Recipes</b-link></dt>
        <dd>
            A searchable listing of all of the crafting recipes in the game. You can search and filter for the recipes you
            would like to make then utilize the
            <b-link href="#" v-on:click="switchContent('crafting')">Crafting</b-link> tool to calculate the
            necessary resources.
        </dd>
        <br />
        <dt><b-link href="#" v-on:click="switchContent('village')">Village Tracker</b-link></dt>
        <dd>
            An interface to track the contributions of characters to village projects over time.
        </dd>
        <br />
        <dt><b-link href="#" v-on:click="switchContent('party')">Crafting Party Supplies</b-link></dt>
        <dd>
            Have a crafting party coming up and don't know how many supplies to gather ahead of time? Use
            this tool to calculate the amount of raw resources you will need to take full advantage of the craft party.
        </dd>
    </div>
</template>

<script>
    export default {
        name: 'Home',
        methods: {
            switchContent(content) {
                return this.$emit('switch-content', content)
            }
        }
    }
</script>
