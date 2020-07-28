<template>
  <v-card>
    <v-toolbar color="primary" dark flat>
      <v-btn icon dark @click="onClose()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Tambah Data Bongkar Basket</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="palletNumber" label="Nomor Palet"
              :disabled="submitting" clearable hide-details dense outlined/>
        </v-col>
        <v-col cols="12">
          <v-combobox v-model="basketNumbers" label="Nomor Basket"
              :disabled="submitting" clearable hide-details outlined
              multiple chips deletable-chips/>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="startTime" label="Waktu Mulai" type="time"
              :disabled="submitting" hide-details dense outlined/>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="endTime" label="Waktu Selesai" type="time"
              :disabled="submitting" hide-details dense outlined/>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="stackQuantity" label="Jumlah Tingkat" type="number"
              :disabled="submitting" clearable hide-details dense outlined/>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="canQuantity" label="Sisa Kaleng" type="number"
              :disabled="submitting" clearable hide-details dense outlined/>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="loader" label="Loader"
              :disabled="submitting" clearable hide-details dense outlined/>
        </v-col>
        <v-col cols="12">
          <v-btn @click="onAdd()" :disabled="addDisabled"
              :loading="submitting" color="success" block>
            Submit Data Palet
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import '../plugins/utility'
import PalletService from '../services/PalletService'
import AuthService from '../services/AuthService'

export default {
  name: 'pallet-add',
  props: {
    app: { type: Object, required: true },
    cancelCallback: { type: Function },
    successCallback: { type: Function },
  },
  data() {
    return {
      palletNumber: null,
      basketNumbers: null,
      startTime: (new Date()).toTimeInput(),
      endTime: (new Date()).toTimeInput(),
      stackQuantity: null,
      canQuantity: null,
      loader: null,
      submitting: false,
    };
  },
  computed: {
    addDisabled() {
      return this.submitting || !this.palletNumber || !this.basketNumbers
        || !this.startTime || !this.endTime || !this.loader
        || (!this.stackQuantity && !this.canQuantity);
    }
  },
  methods: {
    reset() {
      this.palletNumber = null;
      this.basketNumbers = null;
      this.startTime = (new Date()).toTimeInput();
      this.endTime = (new Date()).toTimeInput();
      this.stackQuantity = null;
      this.canQuantity = null;
    },
    onClose() {
      if (typeof this.cancelCallback === 'function') {
        this.cancelCallback();
      }
    },
    onAdd() {
      this.submitting = true;

      let data = {
        palletNumber: this.palletNumber,
        basketNumbers: this.basketNumbers,
        startTime: this.startTime,
        endTime: this.endTime,
        stackQuantity: this.stackQuantity,
        canQuantity: this.canQuantity,
        loader: this.loader,
      };

      PalletService.create(this.$route.params.documentId, data)
        .then(() => {
          this.app.log('Data palet berhasil ditambahkan');

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
              this.app.log('Data palet gagal ditambahkan, sesi habis');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else {
              this.app.log('Data palet gagal ditambahkan,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Data palet gagal ditambahkan, tidak ada jaringan');
          }
        });
    },
  },
}
</script>