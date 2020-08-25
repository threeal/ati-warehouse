<template>
  <v-card>
    <v-toolbar class="flex-grow-0" color="primary" dark flat>
      <v-btn v-if="typeof cancelCallback === 'function'" @click="onClose()" icon dark>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Tambah Data Palet</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-divider v-if="typeof cancelCallback === 'function'" inset vertical/>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="palletNumber" label="Nomor Palet" type="number"
              :disabled="submitting" clearable hide-details dense outlined/>
        </v-col>
        <v-col cols="12">
          <v-combobox v-model="basketNumbers" label="Nomor Basket" type="number"
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
          <v-text-field v-model="layerQuantity" label="Jumlah Layer" type="number"
              :disabled="submitting" clearable hide-details dense outlined/>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="canQuantity" label="Jumlah Kaleng" type="number"
              :disabled="submitting" clearable hide-details dense outlined/>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="loader" label="Loader"
              :disabled="submitting" clearable hide-details dense outlined/>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="remarks" label="Keterangan"
              :disabled="submitting" clearable hide-details dense outlined/>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-toolbar color="primary" dark flat dense>
              <v-toolbar-title>Kondisi</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <v-checkbox v-model="seamingCondition" label="Seaming" hide-details
                      off-icon="mdi-close-box" on-icon="mdi-checkbox-marked"/>
                  <v-checkbox v-model="cleanCondition" label="Bersih" hide-details
                      off-icon="mdi-close-box" on-icon="mdi-checkbox-marked"/>
                </v-col>
                <v-col cols="6">
                  <v-checkbox v-model="noRustCondition" label="Tidak Karat" hide-details
                      off-icon="mdi-close-box" on-icon="mdi-checkbox-marked"/>
                  <v-checkbox v-model="noOilyCondition" label="Tidak Minyak" hide-details
                      off-icon="mdi-close-box" on-icon="mdi-checkbox-marked"/>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-toolbar color="primary" dark flat dense>
              <v-toolbar-title>Hasil Print</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-row>
                <v-col cols="4">
                  <v-checkbox v-model="bottomPrintResult" label="Bawah" hide-details
                      off-icon="mdi-close-box" on-icon="mdi-checkbox-marked"/>
                </v-col>
                <v-col cols="4">
                  <v-checkbox v-model="middlePrintResult" label="Tengah" hide-details
                      off-icon="mdi-close-box" on-icon="mdi-checkbox-marked"/>
                </v-col>
                <v-col cols="4">
                  <v-checkbox v-model="topPrintResult" label="Atas" hide-details
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
              Submit Data Palet
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
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
      palletNumber: 1,
      basketNumbers: null,
      startTime: (new Date()).toTimeInput(),
      endTime: (new Date()).toTimeInput(),
      layerQuantity: null,
      canQuantity: null,
      loader: null,
      remarks: null,
      seamingCondition: true,
      cleanCondition: true,
      noRustCondition: true,
      noOilyCondition: true,
      bottomPrintResult: true,
      middlePrintResult: true,
      topPrintResult: true,
      submitting: false,
    };
  },
  computed: {
    addDisabled() {
      return this.submitting || !this.palletNumber || !this.basketNumbers
        || !this.startTime || !this.endTime || !this.loader
        || (!this.layerQuantity && !this.canQuantity);
    }
  },
  methods: {
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
        layerQuantity: this.layerQuantity,
        canQuantity: this.canQuantity,
        loader: this.loader,
        remarks: this.remarks,
        seamingCondition: this.seamingCondition || false,
        cleanCondition: this.cleanCondition || false,
        noRustCondition: this.noRustCondition || false,
        noOilyCondition: this.noOilyCondition || false,
        bottomPrintResult: this.bottomPrintResult || false,
        middlePrintResult: this.middlePrintResult || false,
        topPrintResult: this.topPrintResult || false,
      };

      PalletService.create(this.$route.params.documentId, data)
        .then(() => {
          this.app.log('Data palet berhasil ditambahkan');

          this.submitting = false;

          this.palletNumber = this.palletNumber + 1;
          this.basketNumbers = null;
          this.startTime = this.endTime;
          this.remarks = null;
          this.seamingCondition = true;
          this.cleanCondition = true;
          this.noRustCondition = true;
          this.noOilyCondition = true;
          this.bottomPrintResult = true;
          this.middlePrintResult = true;
          this.topPrintResult = true;

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
  mounted() {
    PalletService.findAll(this.$route.params.documentId)
      .then((res) => {
        if (res.data) {
          let lastPallet = res.data[res.data.length - 1];

          this.palletNumber = lastPallet.palletNumber + 1;
          this.startTime = lastPallet.endTime;
          this.endTime = lastPallet.endTime;
          this.loader = lastPallet.loader;
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            this.app.log('Sesi habis, harap masuk kembali');

            AuthService.signOut();
            this.app.routeReplace('/login');
          }
        }
      });
  },
}
</script>