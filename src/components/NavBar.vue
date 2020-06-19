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
    </b-navbar>
  </div>
</template>

<script>
  export default {
    name: 'NavBar',
    props: {
      title: String
    },
    methods: {
      switchContent(content) {
        return this.$emit('switch-content', content)
      }
    }
  }
</script>
