<template>
  <v-card>
    <v-toolbar color="primary" dark flat>
      <v-btn icon dark @click="onClose()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Tambah Jenis Produk</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="name" label="Nama"
              :disabled="submitting" clearable hide-details dense outlined/>
        </v-col>
        <v-col cols="12">
          <v-btn @click="onAdd()" :disabled="submitting || !name"
              :loading="submitting" color="success" block>
            <v-icon left>mdi-upload</v-icon> Submit Jenis Produk
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import '../plugins/utility'
import ProductKindService from '../services/ProductKindService'
import AuthService from '../services/AuthService'

export default {
  name: 'product-kind-add',
  props: {
    app: { type: Object, required: true },
    cancelCallback: { type: Function },
    successCallback: { type: Function },
  },
  data() {
    return {
      name: null,
      submitting: false,
    };
  },
  methods: {
    reset() {
      this.name = null;
    },
    onClose() {
      if (typeof this.cancelCallback === 'function') {
        this.cancelCallback();
      }
    },
    onAdd() {
      this.submitting = true;

      let data = {
        name: this.name,
      };

      ProductKindService.create(data)
        .then(() => {
          this.app.log('Jenis produk berhasil ditambahkan');

          this.submitting = false;
          this.reset();

          if (typeof this.successCallback === 'function') {
            this.successCallback();
          }
        })
        .catch((err) => {
          this.submitting = false;

          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Sesi habis, harap masuk kembali');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else {
              this.app.log('Jenis produk gagal ditambahkan,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Jenis produk gagal ditambahkan, tidak ada jaringan');
          }
        });
    },
  },
}
</script>