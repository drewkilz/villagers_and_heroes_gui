<template>
    <div>
        <p>This website contains a series of tools to supplement your gaming experience in Villagers & Heroes.</p>
        <dt><b-link to="/crafting">Crafting</b-link></dt>
        <dd>
            Allows you to calculate the items, refined ingredients, and crafting components you will need to make recipes.
            You can select the recipes and quantities to craft in the
            <!--TODO: <b-link to="/equipment">Equipment</b-link> or -->
            <b-link to="/recipes">Recipes</b-link> tool.
        </dd>
        <br />
        <dt><b-link to="/recipes">Recipes</b-link></dt>
        <dd>
            A searchable listing of all of the crafting recipes in the game. You can search and filter for the recipes
            you would like to make then utilize the <b-link to="/crafting">Crafting</b-link> tool to calculate the
            necessary resources.
        </dd>
        <br />
        <dt><b-link to="/party">Crafting Party Supplies</b-link></dt>
        <dd>
            Have a crafting party coming up and don't know how many supplies to gather ahead of time? Use
            this tool to calculate the amount of raw resources you will need to take full advantage of the craft party.
        </dd>
        <!-- TODO:
        <br />
        <dt><b-link to="/equipment">Equipment</b-link></dt>
        <dd>
            [Work in Progress] Displays the crafted equipment (armor, weapons, potions, etc.) by level for the class of
            your choosing. From this tool, you can select equipment to make and then utilize the
            <b-link to="/crafting">Crafting</b-link> tool to calculate the necessary resources.
        </dd>
        <br />
        <dt><b-link to="/village">Village Tracker</b-link></dt>
        <dd>
            [Work in Progress] An interface to track the contributions of characters to village projects over time.
        </dd>
        -->
    </div>
</template>

<script>
    export default {
        name: 'Home'
    }
</script>
