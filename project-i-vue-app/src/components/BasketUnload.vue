<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field v-model="unloadDate" label="Tanggal Bongkar" type="date"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" outlined dense hide-details/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="line" label="Line"
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
        <BasketList :app="app"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="onDelete()" :disabled="fetching || deleting" :loading="deleting"
            color="error" block>
          <v-icon left>mdi-delete</v-icon> Hapus Data Muat Basket
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BasketList from './BasketList'
import BasketUnloadService from '../services/BasketUnloadService'
import AuthService from '../services/AuthService'

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
      deleting: false,
      edit: false,
      unloadDate: null,
      line: null,
    };
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
              this.app.log('Detail data bongkar basket gagal diperbaharui, sesi habis');

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
      this.deleting = true;

      BasketUnloadService.remove(this.$route.params.documentId)
        .then(() => {
          this.app.log('Data bongkar basket berhasil dihapus');
          this.deleting = false;

          if (typeof this.deleteCallback === 'function') {
            this.deleteCallback();
          }
          else {
            this.$router.go(-1);
          }
        })
        .catch((err) => {
          if (err.response) {
            this.deleting = false;
            if (err.response.status === 401) {
              this.app.log('Data bongkar basket gagal dihapus, sesi habis');

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
            this.app.log('Gagal mengambil detail data bongkar basket, sesi habis');

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