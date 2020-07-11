<template>
  <v-app>
    <v-app-bar @click="drawer = !drawer" app color="primary" dark>
      <v-app-bar-nav-icon app/>
      <v-toolbar-title>Project I</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
    </v-navigation-drawer>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      drawer: false,
    };
  },
}
</script>
