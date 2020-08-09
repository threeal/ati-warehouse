<template>
  <v-container>
    <v-row justify="center">
      <v-col class="hidden-md-and-up" cols="12" sm="8" md="4">
        <v-btn color="primary" @click="productKindAdd = true" :disabled="fetching" block>
          <v-icon left>mdi-plus-thick</v-icon> Tambah Jenis Produk
        </v-btn>
      </v-col>
      <v-col class="hidden-sm-and-down" cols="4">
        <ProductKindAdd :app="app" :successCallback="onProductKindAddSuccess"/>
      </v-col>
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-toolbar color="primary" dark flat dense>
            <v-toolbar-title>Daftar Jenis Produk</v-toolbar-title>
          </v-toolbar>
          <v-list>
            <div v-if="fetching">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-progress-circular color="primary" indeterminate/>
                </v-list-item-content>
              </v-list-item>
            </div>
            <div v-else-if="productKinds.length > 0">
              <div v-for="(productKind, index) in productKinds" :key="index">
                <v-divider v-if="index > 0"/>
                <v-list-item  @click="onProductKindClick(productKind.id)" link>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ productKind.name }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </div>
            <div v-else>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title class="d-flex justify-center">
                    Jenis Produk Kosong
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-if="$vuetify.breakpoint.smAndDown" v-model="productKindAdd"
        :fullscreen="$vuetify.breakpoint.xsOnly" max-width="65%" scrollable>
      <ProductKindAdd :app="app" :cancelCallback="onProductKIndAddCancel"
          :successCallback="onProductKindAddSuccess"/>
    </v-dialog>
  </v-container>
</template>

<script>
import ProductKindAdd from '../components/ProductKindAdd'
import ProductKindService from '../services/ProductKindService'
import AuthService from '../services/AuthService'

export default {
  name: 'document-list',
  components: {
    ProductKindAdd,
  },
  props: {
    app: { type: Object, required: true },
  },
  data() {
    return {
      fetching: true,
      productKindAdd: false,
      productKinds: [],
    };
  },
  methods: {
    reset() {
      this.productKinds = [];
      this.fetching = true;

      ProductKindService.findAll()
        .then((res) => {
          this.productKinds = res.data;
          this.fetching = false;
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Sesi habis, harap masuk kembali');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else {
              this.app.log('Gagal mengambil daftar jenis produk,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Gagal mengambil daftar jenis produk, tidak ada jaringan');
          }
        });
    },
    onProductKIndAddCancel() {
      this.productKindAdd = false;
    },
    onProductKindAddSuccess() {
      this.productKindAdd = false;
      this.reset();
    },
    onProductKindClick(productKindId) {
      this.app.routePush(`/product-kind/${productKindId}`);
    },
  },
  created() {
    this.app.setAppBar(true, 'Daftar Jenis Produk');
  },
  mounted() {
    this.reset();
  },
}
</script>