<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="name" label="Nama"
                :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
                :filled="!edit" :clearable="edit" hide-details dense outlined/>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="cansPerBasketTray" label="Kaleng Per Tray Basket"
                type="number" :disabled="fetching || submitting" :loading="fetching"
                :readonly="!edit" :filled="!edit" :clearable="edit"
                hide-details dense outlined/>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="cansPerPalletLayer" label="Kaleng Per Layer Palet"
                type="number" :disabled="fetching || submitting" :loading="fetching"
                :readonly="!edit" :filled="!edit" :clearable="edit"
                hide-details dense outlined/>
          </v-col>
          <v-col cols="12">
            <v-btn v-if="!edit" @click="onEdit()" :disabled="fetching" color="primary" block>
              <v-icon left>mdi-pencil</v-icon> Ubah Detail
            </v-btn>
            <v-btn v-else @click="onSave()" :disabled="submitting || submitDisabled"
                :loading="submitting" color="success" block>
              <v-icon left>mdi-content-save</v-icon> Simpan Perubahan
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn @click="onDelete()" :disabled="fetching" color="error" block>
              <v-icon left>mdi-delete</v-icon> Hapus Jenis Produk
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProductKindService from '../services/ProductKindService'
import AuthService from '../services/AuthService'

export default {
  name: 'product-kind-detail',
  props: {
    app: { type: Object, required: true },
  },
  data() {
    return {
      fetching: true,
      submitting: false,
      edit: false,
      name: null,
      cansPerBasketTray: null,
      cansPerPalletLayer: null,
    };
  },
  computed: {
    submitDisabled() {
      return this.submitting || !this.name;
    }
  },
  methods: {
    onEdit() {
      this.edit = true;
    },
    onSave() {
      this.submitting = true;

      let data = {
        name: this.name,
        cansPerBasketTray: this.cansPerBasketTray,
        cansPerPalletLayer: this.cansPerPalletLayer,
      };

      ProductKindService.update(this.$route.params.productKindId, data)
        .then(() => {
          this.app.log('Detail jenis produk berhasil diperbaharui');
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
              this.app.log('Detail jenis produk gagal diperbaharui,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Detail jenis produk gagal diperbaharui, tidak ada jaringan');
          }
        });
    },
    onDelete() {
      this.app.confirm({
        description: 'Apakah anda yakin ingin menghapus jenis produk ini?',
        promiseCallback: () => {
          return ProductKindService.remove(this.$route.params.productKindId);
        },
        thenCallback: () => {
          this.app.log('Jenis produk berhasil dihapus');
          this.$router.go(-1);
        },
        catchCallback: (err) => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Sesi habis, harap masuk kembali');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else {
              this.app.log('Jenis produk gagal dihapus,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Jenis produk gagal dihapus, tidak ada jaringan');
          }
        },
      });
    },
  },
  created() {
    this.app.setAppBar(true, 'Detail Jenis Produk');
  },
  mounted() {
    ProductKindService.findOne(this.$route.params.productKindId)
      .then((res) => {
        this.name = res.data.name;
        this.cansPerBasketTray = res.data.cansPerBasketTray;
        this.cansPerPalletLayer = res.data.cansPerPalletLayer;

        this.fetching = false;
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            this.app.log('Sesi habis, harap masuk kembali');

            AuthService.signOut();
            this.app.routeReplace('/login');
          }
          else {
            this.app.log('Gagal mengambil detail jenis produk,'
              + ` kesalahan server (${err.response.status})`);
          }
        }
        else {
          this.app.log('Gagal mengambil detail jenis produk, tidak ada jaringan');
        }
      });
  },
}
</script>