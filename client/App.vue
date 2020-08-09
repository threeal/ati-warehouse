<template>
  <v-app>
    <v-app-bar v-if="appBar" app color="primary" dark>
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = true"/>
      <v-toolbar-title>
        <b class="hidden-sm-and-down">ATI Warehouse | </b>{{ title }}
      </v-toolbar-title>
      <v-spacer class="hidden-sm-and-down"/>
      <v-btn v-for="link in links" :key="link.title" class="hidden-sm-and-down"
          @click="link.onClick()" text>
        <v-icon left>{{ link.icon }}</v-icon> {{ link.title }}
      </v-btn>
    </v-app-bar>
    <Drawer v-if="appBar && $vuetify.breakpoint.smAndDown" class="hidden-md-and-up"
        :app="this" :links="links"/>
    <Toast :app="this"/>
    <Confirmation :app="this"/>
    <v-content>
      <router-view :app="this"/>
    </v-content>
  </v-app>
</template>

<script>
import Drawer from './components/Drawer'
import Toast from './components/Toast'
import Confirmation from './components/Confirmation'
import AuthService from './services/AuthService'

export default {
  name: 'app',
  components: {
    Drawer,
    Toast,
    Confirmation,
  },
  data() {
    return {
      title: '',
      drawer: false,
      appBar: false,
      links: [
        {
          title: 'Daftar Dokumen',
          icon: 'mdi-view-list',
          onClick: () => {
            this.routePush('/document');
          },
        },
        {
          title: 'Daftar Jenis Produk',
          icon: 'mdi-view-list',
          onClick: () => {
            this.routePush('/product-kind');
          },
        },
        {
          title: 'Tema',
          icon: 'mdi-theme-light-dark',
          onClick: () => {
            this.swapTheme();
          },
        },
        {
          title: 'Keluar',
          icon: 'mdi-logout',
          onClick: () => {
            AuthService.signOut();
            this.routeReplace('/login');
          },
        },
      ],
    };
  },
  methods: {
    log(message) {
      console.log(message);
    },
    confirm() {
    },
    setAppBar(enable, title) {
      this.appBar = enable;
      this.title = title;
      document.title = `${this.title} | ATI Warehouse`;
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
    swapTheme() {
      let theme = {
        dark: !this.$vuetify.theme.dark,
      };

      this.$vuetify.theme.dark = theme.dark || false;
      localStorage.setItem('theme', JSON.stringify(theme));
    },
  },
  mounted() {
    const theme = JSON.parse(localStorage.getItem('theme'));
    if (theme) {
      this.$vuetify.theme.dark = theme.dark || false;
    }
  },
}
</script>
