<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-text-field v-if="!edit" v-model="loadDateLocale" label="Tanggal Muat"
            :disabled="fetching" :loading="fetching" readonly filled outlined
            dense hide-details/>
        <v-text-field v-else v-model="loadDate" label="Tanggal Muat" type="date"
            :disabled="submitting" outlined dense hide-details/>
      </v-col>
      <v-col cols="4">
        <v-text-field v-model="brand" label="Merek"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" :clearable="edit" outlined dense hide-details/>
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
    </v-row>
    <div v-if="fetching" class="d-flex justify-center">
      <v-progress-circular color="primary" indeterminate/>
    </div>
    <v-row v-else>
      <v-col>
        <PalletList :app="app"/>
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
      edit: false,
      loadDate: null,
      brand: null,
    };
  },
  computed: {
    loadDateLocale() {
      return (this.loadDate) ? this.loadDate.toLocaleDateString() : null;
    },
  },
  methods: {
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
    PalletLoadService.find(this.$route.params.documentId)
      .then((res) => {
        this.fetching = false;
        this.loadDate = res.data.loadDate;
        this.brand = res.data.brand;
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
}
</script>