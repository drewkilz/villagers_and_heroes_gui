<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#" v-on:click="switchContent('home')">{{ title }}</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#" v-on:click="switchContent('crafting')">Crafting</b-nav-item>
          <b-nav-item href="#" v-on:click="switchContent('equipment')">Equipment</b-nav-item>
          <b-nav-item href="#" v-on:click="switchContent('recipes')">Recipes</b-nav-item>
          <b-nav-item href="#" v-on:click="switchContent('village')">Village</b-nav-item>
          <b-nav-item href="#" v-on:click="switchContent('party')">Crafting Party</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
      <b-navbar-nav class="ml-auto">
        <b-nav-item right id="crafting-list-icon">
          <span v-if="Object.keys(craftingList).length">({{ Object.keys(craftingList).length }}) </span>
          <b-icon-cart></b-icon-cart>
        </b-nav-item>
        <b-popover
                target="crafting-list-icon"
                placement="bottomleft"
                triggers="hover focus">
          <template v-slot:title>Crafting List</template>
          <b-table
                  striped
                  small
                  head-variant="dark"
                  :items="craftingListItems"
                  :fields="craftingListFields"
                  primary-key="id">
            <template v-slot:cell(quantity)="data"><div class="text-center">{{ data.value }}</div></template>
            <template v-slot:table-caption>{{ Object.keys(craftingList).length }} recipes found.</template>
          </b-table>
        </b-popover>
        <b-nav-item right>
          <b-iconstack v-b-tooltip:hover title="Clear Crafting List" v-on:click="clearCraftingList">
            <b-icon-cart stacked variant="" scale="0.75"></b-icon-cart>
            <b-icon-slash-square stacked variant="secondary"></b-icon-slash-square>
          </b-iconstack>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
  import {compareValues} from "@/utility";

  export default {
    name: 'NavBar',
    props: {
      title: {
        type: String,
        required: true
      },
      craftingList: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        craftingListFields: [
          {key: 'name'},
          {key: 'quantity'}
        ]
      }
    },
    methods: {
      switchContent(content) {
        return this.$emit('switch-content', content)
      },
      clearCraftingList() {
        this.$emit('clear-crafting-list',)
      },
      craftingListItems() {
        let items = []

        for (let key in this.craftingList) {
          let recipe = this.craftingList[key]

          console.log(JSON.stringify(recipe))

          items.push(recipe)
        }

        items.sort(compareValues('name'))

        return items
      }
    }
  }
</script>
