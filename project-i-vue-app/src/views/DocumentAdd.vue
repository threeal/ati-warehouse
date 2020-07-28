<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field v-model="productKind" label="Jenis Produk"
            :disabled="submitting" clearable hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="productionDate" label="Tanggal Produksi" type="date"
            :disabled="submitting" hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="onAdd()" :disabled="submitting || !productKind || !productionDate"
            :loading="submitting" color="success" block>
          <v-icon left>mdi-upload</v-icon> Submit Dokumen
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import '../plugins/utility'
import DocumentService from '../services/DocumentService'
import AuthService from '../services/AuthService'

export default {
  name: 'document-add',
  props: {
    app: { type: Object, required: true },
  },
  data() {
    return {
      productKind: null,
      productionDate: (new Date()).toDateInput(),
      submitting: false,
    };
  },
  methods: {
    onAdd() {
      this.submitting = true;

      let data = {
        productKind: this.productKind,
        productionDate: this.productionDate,
      };

      DocumentService.create(data)
        .then(() => {
          this.app.log('Dokumen berhasil ditambahkan');
          this.$router.go(-1);
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
  mounted() {
    this.app.setAppBar(true, 'Tambah Dokumen');
  },
}
</script>