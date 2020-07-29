<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-text-field v-if="!edit" v-model="unloadDateLocale" label="Tanggal Bongkar"
            :disabled="fetching" :loading="fetching" readonly filled outlined
            dense hide-details/>
        <v-text-field v-else v-model="unloadDate" label="Tanggal Bongkar" type="date"
            :disabled="submitting" outlined dense hide-details/>
      </v-col>
      <v-col cols="4">
        <v-text-field v-model="line" label="Line"
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
        <BasketList :app="app"/>
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
import '../plugins/utility'

export default {
  name: 'basket-unload',
  components: {
    BasketList
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
      unloadDate: null,
      line: null,
    };
  },
  computed: {
    unloadDateLocale() {
      return (this.unloadDate) ? this.unloadDate.toLocaleDateString() : null;
    },
  },
  methods: {
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
    BasketUnloadService.find(this.$route.params.documentId)
      .then((res) => {
        this.fetching = false;
        this.unloadDate = res.data.unloadDate;
        this.line = res.data.line;
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
}
</script>