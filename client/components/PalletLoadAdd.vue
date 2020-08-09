<template>
  <v-card>
    <v-toolbar class="flex-grow-0" color="primary" dark flat>
      <v-btn v-if="typeof cancelCallback === 'function'" @click="onClose()" icon dark>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Tambah Data Muat Palet</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-divider v-if="typeof cancelCallback === 'function'" inset vertical/>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="loadDate" label="Tanggal Muat" type="date"
              :disabled="submitting" dense hide-details outlined/>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="brand" label="Merek"
              :disabled="submitting" clearable dense hide-details outlined/>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-container>
        <v-row no-gutters>
          <v-col cols="12">
            <v-btn @click="onAdd()" :disabled="submitting || !loadDate || !brand"
                :loading="submitting" color="success" block>
              <v-icon left>mdi-upload</v-icon> Submit Data
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
import '../plugins/utility'
import PalletLoadService from '../services/PalletLoadService'
import AuthService from '../services/AuthService'

export default {
  name: 'pallet-load-add',
  props: {
    app: { type: Object, required: true, },
    cancelCallback: { type: Function },
    successCallback: { type: Function },
  },
  data() {
    return {
      loadDate: (new Date()).toDateInput(),
      brand: null,
      submitting: false,
    };
  },
  methods: {
    reset() {
      this.loadDate = (new Date()).toDateInput();
      this.brand = null;
    },
    onClose() {
      if (typeof this.cancelCallback === 'function') {
        this.cancelCallback();
      }
    },
    onAdd() {
      this.submitting = true;

      let data = {
        loadDate: this.loadDate,
        brand: this.brand,
      };

      PalletLoadService.create(this.$route.params.documentId, data)
        .then(() => {
          this.app.log('Data muat palet berhasil ditambahkan');

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
              this.app.log('Data muat palet gagal ditambahkan,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Data muat palet gagal ditambahkan, tidak ada jaringan');
          }
        });
    },
  },
}
</script>