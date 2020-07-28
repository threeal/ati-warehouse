<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field v-model="unloadDate" label="Tanggal Bongkar" type="date"
            :disabled="submitting" dense hide-details outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="line" label="Line"
            :disabled="submitting" clearable dense hide-details outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="onAdd()" :disabled="submitting || !unloadDate || !line"
            :loading="submitting" color="success" block>
          <v-icon left>mdi-upload</v-icon> Submit Data
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import '../plugins/utility'
import BasketUnloadService from '../services/BasketUnloadService'
import AuthService from '../services/AuthService'

export default {
  name: 'basket-unload-add',
  props: {
    app: { type: Object, required: true },
  },
  data() {
    return {
      unloadDate: (new Date()).toDateInput(),
      line: null,
      submitting: false,
    };
  },
  methods: {
    onAdd() {
      this.submitting = true;

      let data = {
        unloadDate: this.unloadDate,
        line: this.line,
      };

      BasketUnloadService.create(this.$route.params.documentId, data)
        .then(() => {
          this.app.log('Data bongkar basket berhasil ditambahkan');
          this.$router.go(-1);
        })
        .catch((err) => {
          this.submitting = false;

          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Data bongkar basket gagal ditambahkan, sesi habis');

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
  mounted() {
    this.app.setAppBar(true, 'Tambah Data Bongkar Basket');
  },
}
</script>