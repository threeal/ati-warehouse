<template>
  <v-navigation-drawer v-model="app.drawer" absolute temporary>
    <v-list color="primary" dark>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Project-I
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ username }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider/>
    <v-list dense nav>
      <v-list-item v-for="item in items" :key="item.title" @click="item.onClick()" link>
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import AuthService from '../services/AuthService'

export default {
  name: 'add-tutorial',
  props: {
    app: { type: Object, required: true },
  },
  data() {
    let user = JSON.parse(localStorage.getItem('user'));
    return {
      username: user.username,
      items: [
        {
          title: 'Daftar Dokumen',
          icon: 'mdi-view-list',
          onClick: () => {
            this.app.drawer = false;
            this.app.routePush('/document');
          },
        },
        {
          title: 'Keluar',
          icon: 'mdi-logout',
          onClick: () => {
            AuthService.signOut();
            this.app.drawer = false;
            this.app.routeReplace('/login');
          },
        },
      ],
    };
  },
}
</script>