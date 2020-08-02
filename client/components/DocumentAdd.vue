<template>
  <v-card>
    <v-toolbar color="primary" dark flat>
      <v-btn icon dark @click="onClose()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Tambah Dokumen</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-select v-model="productKindSelect" :items="productKindList"
              label="Jenis Produk" no-data-text="Jenis produk kosong"
              item-text="name" item-value="id" return object
              :disabled="productKindFetching || submitting"
              :loading="productKindFetching" hide-details dense outlined/>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="productionDate" label="Tanggal Produksi" type="date"
              :disabled="submitting" hide-details dense outlined/>
        </v-col>
        <v-col cols="12">
          <v-btn @click="onAdd()" :disabled="submitting || !productKindSelect || !productionDate"
              :loading="submitting" color="success" block>
            <v-icon left>mdi-upload</v-icon> Submit Dokumen
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import '../plugins/utility'
import ProductKindService from '../services/ProductKindService'
import DocumentService from '../services/DocumentService'
import AuthService from '../services/AuthService'

export default {
  name: 'document-add',
  props: {
    app: { type: Object, required: true },
    cancelCallback: { type: Function },
    successCallback: { type: Function },
  },
  data() {
    return {
      productKindSelect: null,
      productKindList: [],
      productKindFetching: true,
      productionDate: (new Date()).toDateInput(),
      submitting: false,
    };
  },
  methods: {
    reset() {
      this.productKindSelect = null;
      this.productionDate = (new Date()).toDateInput();
    },
    onClose() {
      if (typeof this.cancelCallback === 'function') {
        this.cancelCallback();
      }
    },
    onAdd() {
      this.submitting = true;

      let data = {
        productKindId: this.productKindSelect,
        productionDate: this.productionDate,
      };

      DocumentService.create(data)
        .then(() => {
          this.app.log('Dokumen berhasil ditambahkan');

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
              this.app.log('Dokumen gagal ditambahkan,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Dokumen gagal ditambahkan, tidak ada jaringan');
          }
        });
    },
  },
  mounted() {
    ProductKindService.findAll()
      .then((res) => {
        this.productKindList = [];
        res.data.forEach((productKind) => {
          this.productKindList.push({
            id: productKind.id,
            name: productKind.name,
          });
        });

        this.productKindFetching = false;
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
  }
}
</script>