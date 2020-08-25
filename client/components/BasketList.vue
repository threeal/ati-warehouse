<template>
  <v-row>
    <v-col cols="12">
      <v-select v-model="selectedSort" :items="sorts" label="Urutkan Data"
          :disabled="fetching" hide-details dense outlined/>
    </v-col>
    <v-col cols="12">
      <v-btn color="primary" @click="basketAdd = true" :disabled="fetching" block>
        <v-icon left>mdi-plus-thick</v-icon> Tambah Data Basket
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-toolbar color="primary" dark flat dense>
          <v-toolbar-title>Daftar Data Basket</v-toolbar-title>
        </v-toolbar>
        <v-list>
          <div v-if="fetching">
            <v-divider/>
            <v-list-item two-line>
              <v-list-item-content>
                <v-progress-circular color="primary" indeterminate/>
              </v-list-item-content>
            </v-list-item>
          </div>
          <div v-else-if="baskets.length > 0">
            <div v-for="(basket, index) in baskets" :key="index">
              <v-divider v-if="index > 0"/>
              <BasketListItem :basket="basket" :onClick="onBasketClick"/>
            </div>
          </div>
          <div v-else>
            <v-divider/>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="d-flex justify-center">
                  Data Basket Kosong
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-list>
      </v-card>
    </v-col>
    <v-dialog v-model="basketAdd" :fullscreen="$vuetify.breakpoint.xsOnly"
        :max-width="($vuetify.breakpoint.smAndDown) ? '65%' : '45%'" scrollable>
      <BasketAdd :app="app" :cancelCallback="onBasketAddCancel"
          :successCallback="onBasketAddSuccess"/>
    </v-dialog>
  </v-row>
</template>

<script>
import BasketAdd from './BasketAdd'
import BasketListItem from './BasketListItem'
import BasketService from '../services/BasketService'
import AuthService from '../services/AuthService'

export default {
  name: 'basket-list',
  components: {
    BasketAdd,
    BasketListItem,
  },
  props: {
    app: { type: Object, required: true },
    resetCallback: { type: Function },
  },
  data() {
    let sorts = [
      { value: 'time', text: 'Berdasarkan Waktu' },
      { value: 'name', text: 'Berdasarkan Nama' },
    ];

    return {
      fetching: true,
      sorts: sorts,
      selectedSort: sorts[0],
      basketAdd: false,
      baskets: [],
    };
  },
  methods: {
    reset() {
      BasketService.findAll(this.$route.params.documentId)
        .then((res) => {
          this.baskets = res.data;
          this.fetching = false;

          if (typeof this.resetCallback === 'function') {
            this.resetCallback();
          }
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Sesi habis, harap masuk kembali');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else {
              this.app.log('Gagal mengambil daftar basket,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Gagal mengambil daftar basket, tidak ada jaringan');
          }
        });
    },
    onBasketAddCancel() {
      this.basketAdd = false;
    },
    onBasketAddSuccess() {
      this.basketAdd = false;
      this.reset();
    },
    onBasketClick(basketId) {
      this.app.routePush(`/document/${this.$route.params.documentId}/basket/${basketId}`);
    },
  },
  mounted() {
    this.reset();
  }
}
</script>