<template>
  <div id="app">
    <NavBar :title="title"
            @switch-content="switchContent"></NavBar>
    <b-container>
      <div class="content-header">.: {{ currentContentTitle }} :.</div>
      <component v-bind:is="currentContentComponent"
                 @switch-content="switchContent"></component>
    </b-container>
    <Footer></Footer>
  </div>
</template>

<script>
import Crafting from './components/Crafting.vue'
import Footer from './components/Footer.vue'
import Home from './components/Home.vue'
import NavBar from './components/NavBar.vue'
import NotFound from './components/NotFound.vue'
import Recipes from './components/Recipes.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    Footer,
    Home,
    Recipes,
    NotFound,
    Crafting
  },
  data() {
    return {
      title: process.env.VUE_APP_TITLE,
      currentContentComponent: 'Home',
      currentContentTitle: 'Home',
      contentComponents: {
        home: {component: 'Home'},
        crafting: {component: 'Crafting'},
        // TODO: equipment: {component: 'Equipment'},
        recipes: {component: 'Recipes'},
        // TODO: village: {component: 'Village'},
        // TODO: party: {component: 'Party', title: 'Crafting Party'},
        notFound: {component: 'NotFound', title: '404 :: Not Found'}
      },
    }
  },
  methods: {
    switchContent(componentKey) {
      if (!(componentKey in this.contentComponents)) {
        componentKey = 'notFound'
      }

      this.currentContentComponent = this.contentComponents[componentKey]['component']
      this.currentContentTitle = 'title' in this.contentComponents[componentKey] ?
              this.contentComponents[componentKey]['title'] :
              this.contentComponents[componentKey]['component']
    }
  }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .container {
    padding: 15px;
    max-width: 100%;
  }

  .content-header {
    font-weight: bold;
  }
</style>
