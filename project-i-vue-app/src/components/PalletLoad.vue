<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field v-model="loadDate" label="Tanggal Muat" type="date"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" outlined dense hide-details/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="brand" label="Merek"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" :clearable="edit" outlined dense hide-details/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
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
        <v-btn @click="onDelete()" :disabled="fetching || deleting" :loading="deleting"
            color="error" block>
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
      deleting: false,
      edit: false,
      loadDate: null,
      brand: null,
    };
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
              this.app.log('Detail data muat palet gagal diperbaharui, sesi habis');

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
      this.deleting = true;

      PalletLoadService.remove(this.$route.params.documentId)
        .then(() => {
          this.app.log('Data muat palet berhasil dihapus');
          this.deleting = false;

          if (typeof this.deleteCallback === 'function') {
            this.deleteCallback();
          }
          else {
            this.$router.go(-1);
          }
        })
        .catch((err) => {
          this.deleting = false;

          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Data muat palet gagal dihapus, sesi habis');

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
            this.app.log('Gagal mengambil data muat palet, sesi habis');

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