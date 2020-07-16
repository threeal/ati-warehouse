<template>
  <v-app>
    <v-app-bar @click="drawer = !drawer" app color="primary" dark>
      <v-app-bar-nav-icon app/>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
    </v-navigation-drawer>
    <v-content>
      <router-view :app="this"/>
    </v-content>
    <Toast :app="this"/>
  </v-app>
</template>

<script>
import Toast from './components/Toast'

export default {
  name: 'App',
  components: {
    Toast
  },
  data() {
    return {
      title: '',
      drawer: false,
    };
  },
  methods: {
    log(message) {
      console.log(message);
    },
  },
}
</script>
