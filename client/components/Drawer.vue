<template>
  <v-navigation-drawer v-model="app.drawer" app temporary>
    <v-list color="primary" dark>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            ATI Warehouse
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list dense nav>
      <v-list-item
        v-for="link in links"
        :key="link.title"
        @click="onLinkClick(link)"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ link.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ link.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "add-tutorial",
  props: {
    app: { type: Object, required: true },
    links: { type: Array, required: true }
  },
  methods: {
    onLinkClick(link) {
      if (typeof link.onClick === "function") {
        link.onClick();
        this.app.drawer = false;
      }
    }
  }
};
</script>
