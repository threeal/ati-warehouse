<template>
  <v-card>
    <v-toolbar color="primary" dark flat>
      <v-btn icon dark @click="onClose()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Tambah Data Bongkar Basket</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-divider inset vertical/>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="unloadDate" label="Tanggal Bongkar" type="date"
              :disabled="submitting" dense hide-details outlined/>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="line" label="Line"
              :disabled="submitting" clearable dense hide-details outlined/>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-container>
        <v-row no-gutters>
          <v-col cols="12">
            <v-btn @click="onAdd()" :disabled="submitting || !unloadDate || !line"
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
import BasketUnloadService from '../services/BasketUnloadService'
import AuthService from '../services/AuthService'

export default {
  name: 'basket-unload-add',
  props: {
    app: { type: Object, required: true },
    cancelCallback: { type: Function },
    successCallback: { type: Function },
  },
  data() {
    return {
      unloadDate: (new Date()).toDateInput(),
      line: null,
      submitting: false,
    };
  },
  methods: {
    reset() {
      this.unloadDate = (new Date()).toDateInput();
      this.line = null;
    },
    onClose() {
      if (typeof this.cancelCallback === 'function') {
        this.cancelCallback();
      }
    },
    onAdd() {
      this.submitting = true;

      let data = {
        unloadDate: this.unloadDate,
        line: this.line,
      };

      BasketUnloadService.create(this.$route.params.documentId, data)
        .then(() => {
          this.app.log('Data bongkar basket berhasil ditambahkan');

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
              this.app.log('Data bongkar basket gagal ditambahkan,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Data bongkar basket gagal ditambahkan, tidak ada jaringan');
          }
        });
    },
  },
}
</script>