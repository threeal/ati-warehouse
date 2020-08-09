<template>
  <v-card>
    <v-toolbar class="flex-grow-0" color="primary" dark flat>
      <v-btn v-if="typeof cancelCallback === 'function'" @click="onClose()" icon dark>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Tambah Data Basket</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-divider v-if="typeof cancelCallback === 'function'" inset vertical/>
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="basketNumber" label="No Basket"
              :disabled="submitting" clearable hide-details dense outlined/>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="basketId" label="ID Basket"
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
          <v-text-field v-model="trayQuantity" label="Jumlah Tray" type="number"
              :disabled="submitting" clearable hide-details dense outlined/>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="canQuantity" label="Jumlah Kaleng" type="number"
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
        <v-col cols="12">
          <v-card>
            <v-toolbar color="primary" dark flat dense>
              <v-toolbar-title>Kondisi</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-row>
                <v-col cols="4">
                  <v-checkbox v-model="seamingCondition" label="Seaming" hide-details
                      off-icon="mdi-close-box" on-icon="mdi-checkbox-marked"/>
                </v-col>
                <v-col cols="4">
                  <v-checkbox v-model="canMarkCondition" label="Can Mark" hide-details
                      off-icon="mdi-close-box" on-icon="mdi-checkbox-marked"/>
                </v-col>
                <v-col cols="4">
                  <v-checkbox v-model="indicatorCondition" label="Indicator" hide-details
                      off-icon="mdi-close-box" on-icon="mdi-checkbox-marked"/>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-container>
        <v-row no-gutters>
          <v-col cols="12">
            <v-btn @click="onAdd()" :disabled="addDisabled"
                :loading="submitting" color="success" block>
              <v-icon left>mdi-upload</v-icon> Submit Data Basket
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
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
      trayQuantity: null,
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
        || !this.startTime || !this.endTime || (!this.trayQuantity && !this.canQuantity)
        || (this.rejectQuantity && this.rejectQuantity > 0 && !this.rejectKind);
    }
  },
  methods: {
    reset() {
      this.basketNumber = null;
      this.basketId = null;
      this.startTime = (new Date()).toTimeInput();
      this.endTime = (new Date()).toTimeInput();
      this.trayQuantity = null;
      this.canQuantity = null;
      this.rejectQuantity = null;
      this.rejectKind = null;
      this.seamingCondition = true;
      this.canMarkCondition = true;
      this.indicatorCondition = true;
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
        trayQuantity: this.trayQuantity,
        canQuantity: this.canQuantity,
        rejectQuantity: this.rejectQuantity,
        rejectKind: this.rejectKind,
        seamingCondition: this.seamingCondition || false,
        canMarkCondition: this.canMarkCondition || false,
        indicatorCondition: this.indicatorCondition || false,
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
}
</script>