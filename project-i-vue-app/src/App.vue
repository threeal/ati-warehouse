<template>
  <v-app>
    <v-app-bar v-if="appBar" @click="drawer = true" app color="primary" dark>
      <v-app-bar-nav-icon/>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar>
    <Drawer v-if="appBar" :app="this"/>
    <Toast :app="this"/>
    <v-content>
      <router-view :app="this"/>
    </v-content>
  </v-app>
</template>

<script>
import Drawer from './components/Drawer'
import Toast from './components/Toast'

export default {
  name: 'app',
  components: {
    Drawer,
    Toast,
  },
  data() {
    return {
      title: '',
      drawer: false,
      appBar: false,
    };
  },
  methods: {
    log(message) {
      console.log(message);
    },
    setAppBar(enable, title) {
      this.appBar = enable;
      this.title = title;
      document.title = `${this.title} | Project-I`;
    },
    routePush(path) {
      if (this.$route.path != path) {
        this.$router.push(path);
      }
    },
    routeReplace(path) {
      if (this.$route.path != path) {
        this.$router.replace(path);
      }
    },
  },
}
</script>
