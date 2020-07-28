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
          <v-text-field v-model="productKind" label="Jenis Produk"
              :disabled="submitting" clearable hide-details dense outlined/>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="productionDate" label="Tanggal Produksi" type="date"
              :disabled="submitting" hide-details dense outlined/>
        </v-col>
        <v-col cols="12">
          <v-btn @click="onAdd()" :disabled="submitting || !productKind || !productionDate"
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
      productKind: null,
      productionDate: (new Date()).toDateInput(),
      submitting: false,
    };
  },
  methods: {
    reset() {
      this.productKind = null;
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
        productKind: this.productKind,
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
              this.app.log('Dokumen gagal ditambahkan, sesi habis');

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
}
</script>