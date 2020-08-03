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
        <v-col cols="6">
          <v-text-field v-model="basketNumber" label="Nomor Basket"
              :disabled="submitting" clearable hide-details dense outlined/>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="basketId" label="Id Basket"
              :disabled="submitting" clearable hide-details dense outlined/>
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
          <v-text-field v-model="basketQuantity" label="Jumlah Basket" type="number"
              :disabled="submitting" clearable hide-details dense outlined/>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="canQuantity" label="Sisa Kaleng" type="number"
              :disabled="submitting" clearable hide-details dense outlined/>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="rejectQuantity" label="Jumlah Rijek" type="number"
              :disabled="submitting" clearable hide-details dense outlined/>
        </v-col>
        <v-col v-if="rejectQuantity && rejectQuantity > 0" cols="12">
          <v-select v-model="rejectKind" :items="rejectKindList" label="Jenis Rijek"
              item-text="name" item-value="id" :disabled="submitting"
              hide-details dense outlined/>
        </v-col>
        <v-col cols="4">
          <v-checkbox v-model="seamingCondition" label="Seaming"
              off-icon="mdi-close-box" on-icon="mdi-checkbox-marked"/>
        </v-col>
        <v-col cols="4">
          <v-checkbox v-model="canMarkCondition" label="Can Mark"
              off-icon="mdi-close-box" on-icon="mdi-checkbox-marked"/>
        </v-col>
        <v-col cols="4">
          <v-checkbox v-model="indicatorCondition" label="Indicator"
              off-icon="mdi-close-box" on-icon="mdi-checkbox-marked"/>
        </v-col>
        <v-col cols="12">
          <v-btn @click="onAdd()" :disabled="addDisabled"
              :loading="submitting" color="success" block>
            <v-icon left>mdi-upload</v-icon> Submit Data Basket
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import '../plugins/utility'
import BasketService from '../services/BasketService'
import AuthService from '../services/AuthService'

export default {
  name: 'basket-add',
  props: {
    app: { type: Object, required: true },
    cancelCallback: { type: Function },
    successCallback: { type: Function },
  },
  data() {
    return {
      basketNumber: null,
      basketId: null,
      startTime: (new Date()).toTimeInput(),
      endTime: (new Date()).toTimeInput(),
      basketQuantity: null,
      canQuantity: null,
      rejectQuantity: null,
      rejectKind: null,
      rejectKindList: [
        { id: 'PJ', name: 'Penyok Jatuh (PJ)' },
        { id: 'TJ', name: 'Terjepit (TJ)' },
        { id: 'SB', name: 'Score Break (SB)' },
        { id: 'PB', name: 'Penyok dari Basket (PB)' },
        { id: 'FD', name: 'Flange Down (FD)' },
      ],
      seamingCondition: true,
      canMarkCondition: true,
      indicatorCondition: true,
      submitting: false,
    };
  },
  computed: {
    addDisabled() {
      return this.submitting || !this.basketNumber || !this.basketId
        || !this.startTime || !this.endTime || (!this.basketQuantity && !this.canQuantity)
        || (this.rejectQuantity && this.rejectQuantity > 0 && !this.rejectKind);
    }
  },
  methods: {
    reset() {
      this.basketNumber = null;
      this.basketId = null;
      this.startTime = (new Date()).toTimeInput();
      this.endTime = (new Date()).toTimeInput();
      this.basketQuantity = null;
      this.canQuantity = null;
      this.rejectQuantity = null;
      this.rejectKind = null;
      this.seamingCondition = false;
      this.canMarkCondition = false;
      this.indicatorCondition = false;
    },
    onClose() {
      if (typeof this.cancelCallback === 'function') {
        this.cancelCallback();
      }
    },
    onAdd() {
      this.submitting = true;

      let data = {
        basketNumber: this.basketNumber,
        basketId: this.basketId,
        startTime: this.startTime,
        endTime: this.endTime,
        basketQuantity: this.basketQuantity,
        canQuantity: this.canQuantity,
        rejectQuantity: this.rejectQuantity,
        rejectKind: this.rejectKind,
        seamingCondition: this.seamingCondition,
        canMarkCondition: this.canMarkCondition,
        indicatorCondition: this.indicatorCondition,
      };

      BasketService.create(this.$route.params.documentId, data)
        .then(() => {
          this.app.log('Data basket berhasil ditambahkan');

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
              this.app.log('Data basket gagal ditambahkan,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Data basket gagal ditambahkan, tidak ada jaringan');
          }
        });
    },
  },
  created() {
    this.app.setAppBar(true, 'Tambah Data Basket');
  },
}
</script>