<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-if="!edit" v-model="loadDateLocale" label="Tanggal Muat"
            :disabled="fetching" :loading="fetching" readonly filled outlined
            dense hide-details/>
        <v-text-field v-else v-model="loadDate" label="Tanggal Muat" type="date"
            :disabled="submitting" outlined dense hide-details/>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="brand" label="Merek"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" :clearable="edit" outlined dense hide-details/>
      </v-col>
      <v-col v-if="!edit" :cols="(canQuantity > 0) ? 6 : 12">
        <v-text-field v-model="layerQuantity" label="Jumlah Layer" :disabled="fetching"
            :loading="fetching" readonly filled outlined dense hide-details/>
      </v-col>
      <v-col v-if="!edit && canQuantity > 0" cols="6">
        <v-text-field v-model="canQuantity" label="Jumlah Kaleng" :disabled="fetching"
            :loading="fetching" readonly filled outlined dense hide-details/>
      </v-col>
      <v-col v-if="!edit" cols="12">
        <v-text-field v-model="totalCan" label="Total Kaleng" :disabled="fetching"
            :loading="fetching" readonly filled outlined dense hide-details/>
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
        <PalletList :app="app" :reset-callback="reset"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="onDelete()" :disabled="fetching" color="error" block>
          <v-icon left>mdi-delete</v-icon> Hapus Data Muat Palet
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PalletList from './PalletList'
import PalletLoadService from '../services/PalletLoadService'
import AuthService from '../services/AuthService'
import PalletLoadXlsx from '../services/PalletLoadXlsx'
import '../plugins/utility'

export default {
  name: 'pallet-load',
  components: {
    PalletList
  },
  props: {
    app: { type: Object, required: true },
    deleteCallback: { type: Function },
  },
  data() {
    return {
      fetching: true,
      submitting: false,
      downloading: false,
      edit: false,
      loadDate: null,
      brand: null,
      layerQuantity: null,
      canQuantity: null,
      totalCan: null,
    };
  },
  computed: {
    loadDateLocale() {
      return (this.loadDate) ? this.loadDate.toLocaleDateString() : null;
    },
  },
  methods: {
    reset() {
      PalletLoadService.find(this.$route.params.documentId)
        .then((res) => {
          this.fetching = false;
          this.loadDate = res.data.loadDate;
          this.brand = res.data.brand;
          this.layerQuantity = res.data.layerQuantity;
          this.canQuantity = res.data.canQuantity;
          this.totalCan = res.data.totalCan;
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Sesi habis, harap masuk kembali');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else {
              this.app.log('Gagal mengambil data muat palet,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Gagal mengambil data muat palet, tidak ada jaringan');
          }
        });
    },
    onEdit() {
      this.edit = true;
    },
    onSave() {
      this.submitting = true;

      let data = {
        loadDate: this.loadDate,
        brand: this.brand,
      };

      PalletLoadService.update(this.$route.params.documentId, data)
        .then(() => {
          this.app.log('Detail data muat palet berhasil diperbaharui');
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
              this.app.log('Detail data muat palet gagal diperbaharui,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Detail data muat palet gagal diperbaharui, tidak ada jaringan');
          }
        });
    },
    onDownload() {
      this.downloading = true;
      PalletLoadXlsx.download(this.$route.params.documentId)
        .then(() => {
          this.app.log('Data muat palet berhasil diunduh');

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
              this.app.log('Gagal mengunduh data muat palet dalam bentuk xlsx,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else if (err.request) {
            this.app.log('Gagal mengunduh dokumen dalam bentuk xlsx, tidak ada jaringan');
          }
          else {
            this.app.log('Gagal mengunduh data muat palet dalam bentuk xlsx,'
              + ` kesalahan klien (${err.message})`);
          }
        });
    },
    onDelete() {
      this.app.confirm({
        description: 'Apakah anda yakin ingin menghapus data muat palet ini?',
        promiseCallback: () => {
          return PalletLoadService.remove(this.$route.params.documentId);
        },
        thenCallback: () => {
          this.app.log('Data muat palet berhasil dihapus');

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
              this.app.log('Data muat palet gagal dihapus,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Data muat palet gagal dihapus, tidak ada jaringan');
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