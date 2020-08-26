<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-if="!edit" v-model="unloadDateLocale" label="Tanggal Bongkar"
            :disabled="fetching" :loading="fetching" readonly filled outlined
            dense hide-details/>
        <v-text-field v-else v-model="unloadDate" label="Tanggal Bongkar" type="date"
            :disabled="submitting" outlined dense hide-details/>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="line" label="Line"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" :clearable="edit" outlined dense hide-details/>
      </v-col>
      <v-col v-if="!edit" :cols="(canQuantity > 0) ? 6 : 12">
        <v-text-field v-model="trayQuantity" label="Jumlah Tray" :disabled="fetching"
            :loading="fetching" readonly filled outlined dense hide-details/>
      </v-col>
      <v-col v-if="!edit && canQuantity > 0" cols="6">
        <v-text-field v-model="canQuantity" label="Jumlah Kaleng" :disabled="fetching"
            :loading="fetching" readonly filled outlined dense hide-details/>
      </v-col>
      <v-col v-if="!edit" cols="12">
        <v-text-field v-model="rejectQuantity" label="Jumlah Rijek" :disabled="fetching"
            :loading="fetching" readonly filled outlined dense hide-details/>
      </v-col>
      <v-col v-if="!edit" cols="6">
        <v-text-field v-model="totalCan" label="Total Kaleng" :disabled="fetching"
            :loading="fetching" readonly filled outlined dense hide-details/>
      </v-col>
      <v-col v-if="!edit" cols="6">
        <v-text-field v-model="totalCase" label="Total Case" :disabled="fetching"
            :loading="fetching" readonly filled outlined dense hide-details/>
      </v-col>
      <v-col v-if="!edit" cols="12">
        <v-text-field v-model="casePerHour" label="Case per Jam" :disabled="fetching"
            :loading="fetching" readonly filled outlined dense hide-details/>
      </v-col>
      <v-col v-if="!edit" cols="6">
        <v-text-field v-model="totalDuration" label="Total Durasi" :disabled="fetching"
            :loading="fetching" readonly filled outlined dense hide-details/>
      </v-col>
      <v-col v-if="!edit" cols="6">
        <v-text-field v-model="averageDuration" label="Rata-rata Durasi"
            :disabled="fetching" :loading="fetching" readonly filled
            outlined dense hide-details/>
      </v-col>
      <v-col cols="12">
        <v-btn v-if="!edit" @click="onEdit()" :disabled="fetching" color="primary" block>
          <v-icon left>mdi-pencil</v-icon> Ubah Detail
        </v-btn>
        <v-btn v-else @click="onSave()" :disabled="submitting" :loading="submitting"
             color="success" block>
          <v-icon left>mdi-content-save</v-icon> Simpan Perubahan
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-btn @click="onDownload()" :disabled="downloading" :loading="downloading"
            color="primary" block>
          <v-icon left>mdi-download</v-icon> Unduh XLSX
        </v-btn>
      </v-col>
    </v-row>
    <div v-if="fetching" class="d-flex justify-center">
      <v-progress-circular color="primary" indeterminate/>
    </div>
    <v-row v-else>
      <v-col>
        <BasketList :app="app" :resetCallback="reset"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="onDelete()" :disabled="fetching" color="error" block>
          <v-icon left>mdi-delete</v-icon> Hapus Data Bongkar Basket
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BasketList from './BasketList'
import BasketUnloadService from '../services/BasketUnloadService'
import AuthService from '../services/AuthService'
import BasketUnloadXlsx from '../services/BasketUnloadXlsx'
import '../plugins/utility'

export default {
  name: 'basket-unload',
  components: {
    BasketList
  },
  props: {
    app: { type: Object, required: true },
    deleteCallback: { type: Function },
    resetCallback: { type: Function },
  },
  data() {
    return {
      fetching: true,
      submitting: false,
      downloading: false,
      edit: false,
      unloadDate: null,
      line: null,
      trayQuantity: 0,
      canQuantity: 0,
      rejectQuantity: 0,
      totalCan: 0,
      totalCase: 0,
      casePerHour: 0,
      totalDuration: '00:00',
      averageDuration: '00:00',
    };
  },
  computed: {
    unloadDateLocale() {
      return (this.unloadDate) ? this.unloadDate.toLocaleDateString() : null;
    },
  },
  methods: {
    reset() {
      BasketUnloadService.find(this.$route.params.documentId)
        .then((res) => {
          this.fetching = false;
          this.unloadDate = res.data.unloadDate;
          this.line = res.data.line;
          this.trayQuantity = res.data.trayQuantity || 0;
          this.canQuantity = res.data.canQuantity || 0;
          this.rejectQuantity = res.data.rejectQuantity || 0;
          this.totalCan = res.data.totalCan || 0;
          this.totalCase = res.data.totalCase || 0;
          this.casePerHour = res.data.casePerHour || 0;
          this.totalDuration = res.data.totalDuration || '00:00';
          this.averageDuration = res.data.averageDuration || '00:00';

          if (typeof this.resetCallback === 'function') {
            this.resetCallback();
          }
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Sesi habis, harap masuk kembali');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else {
              this.app.log('Gagal mengambil detail data bongkar basket,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Gagal mengambil detail data bongkar basket, tidak ada jaringan');
          }
        });
    },
    onEdit() {
      this.edit = true;
    },
    onSave() {
      this.submitting = true;

      let data = {
        unloadDate: this.unloadDate,
        line: this.line,
      };

      BasketUnloadService.update(this.$route.params.documentId, data)
        .then(() => {
          this.app.log('Detail data bongkar basket berhasil diperbaharui');
          this.edit = false;
          this.submitting = false;
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
              this.app.log('Detail data bongkar basket gagal diperbaharui,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Detail data bongkar basket gagal diperbaharui, tidak ada jaringan');
          }
        });
    },
    onDownload() {
      this.downloading = true;
      BasketUnloadXlsx.download(this.$route.params.documentId)
        .then(() => {
          this.app.log('Data bongkar basket berhasil diunduh');

          this.downloading = false;
        })
        .catch((err) => {
          this.downloading = false;

          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Sesi habis, harap masuk kembali');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else {
              this.app.log('Gagal mengunduh data bongkar basket dalam bentuk xlsx,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else if (err.request) {
            this.app.log('Gagal mengunduh dokumen dalam bentuk xlsx, tidak ada jaringan');
          }
          else {
            this.app.log('Gagal mengunduh data bongkar basket dalam bentuk xlsx,'
              + ` kesalahan klien (${err.message})`);
          }
        });
    },
    onDelete() {
      this.app.confirm({
        description: 'Apakah anda yakin ingin menghapus data bongkar basket ini?',
        promiseCallback: () => {
          return  BasketUnloadService.remove(this.$route.params.documentId);
        },
        thenCallback: () => {
          this.app.log('Data bongkar basket berhasil dihapus');

          if (typeof this.deleteCallback === 'function') {
            this.deleteCallback();
          }
          else {
            this.$router.go(-1);
          }
        },
        catchCallback: (err) => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Sesi habis, harap masuk kembali');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else {
              this.app.log('Data bongkar basket gagal dihapus,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Data bongkar basket gagal dihapus, tidak ada jaringan');
          }
        },
      });
    },
  },
  mounted() {
    this.reset();
  },
}
</script>