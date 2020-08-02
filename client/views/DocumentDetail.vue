<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-row>
          <v-col cols="12">
            <v-select v-if="edit"  v-model="productKindSelect" :items="productKindList"
                label="Jenis Produk" no-data-text="Jenis produk kosong"
                item-text="name" item-value="id" return object
                :disabled="productKindFetching || submitting"
                :loading="productKindFetching" hide-details dense outlined/>
            <v-text-field v-else label="Jenis Produk" :value="productKindName"
                :disabled="fetching" :loading="fetching" readonly filled
                outlined dense hide-details/>
          </v-col>
          <v-col cols="12">
            <v-text-field v-if="!edit" v-model="productionDateLocale" label="Tanggal Produksi"
                :disabled="fetching"  :loading="fetching" readonly filled outlined
                dense hide-details/>
            <v-text-field v-else v-model="productionDate" label="Tanggal Produksi" type="date"
                :disabled="submitting" outlined dense hide-details/>
          </v-col>
          <v-col cols="12">
            <v-btn v-if="!edit" @click="onEdit()" :disabled="fetching" color="primary" block>
              <v-icon left>mdi-pencil</v-icon> Ubah Detail
            </v-btn>
            <v-btn v-else @click="onSave()" :disabled="submitDisabled"
                :loading="submitting" color="success" block>
              <v-icon left>mdi-content-save</v-icon> Simpan Perubahan
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn @click="onDownload()" :disabled="downloadDisabled" :loading="downloading"
                color="primary" block>
              <v-icon left>mdi-download</v-icon> Unduh XLSX
            </v-btn>
          </v-col>
          <v-col class="hidden-sm-and-down" cols="12">
            <v-btn @click="onDelete()" :disabled="fetching" color="error" block>
              <v-icon left>mdi-delete</v-icon> Hapus Dokumen
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="8" md="6">
        <div v-if="fetching" class="d-flex justify-center">
          <v-progress-circular color="primary" indeterminate/>
        </div>
        <v-card v-else>
          <v-tabs v-model="tab" background-color="primary" grow dark>
            <v-tab href="#pallet-load">
              Muat Palet
            </v-tab>
            <v-tab href="#basket-unload">
              Bongkar Basket
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item value="pallet-load">
              <v-container v-if="palletLoadFetching">
                <div class="d-flex justify-center">
                  <v-progress-circular color="primary" indeterminate/>
                </div>
              </v-container>
              <PalletLoad v-else-if="palletLoadExist" :app="app"
                  :deleteCallback="palletLoadReset"/>
              <v-container v-else>
                <v-container>
                  <v-row>
                    <v-btn color="primary" @click="palletLoadAdd = true" block>
                      <v-icon left>mdi-plus-circle</v-icon> Tambah Data Muat Palet
                    </v-btn>
                  </v-row>
                </v-container>
              </v-container>
            </v-tab-item>
            <v-tab-item value="basket-unload">
              <v-container v-if="basketUnloadFetching">
                <div class="d-flex justify-center">
                  <v-progress-circular color="primary" indeterminate/>
                </div>
              </v-container>
              <BasketUnload v-else-if="basketUnloadExist" :app="app"
                  :deleteCallback="basketUnloadReset"/>
              <v-container v-else>
                <v-container>
                  <v-row>
                    <v-btn color="primary" @click="basketUnloadAdd = true" block>
                      <v-icon left>mdi-plus-circle</v-icon> Tambah Data Bongkar Basket
                    </v-btn>
                  </v-row>
                </v-container>
              </v-container>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
      <v-col class="hidden-md-and-up" cols="12" sm="8">
        <v-btn @click="onDelete()" :disabled="fetching" color="error" block>
          <v-icon left>mdi-delete</v-icon> Hapus Dokumen
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="palletLoadAdd" max-width="480">
      <PalletLoadAdd :app="app" :cancelCallback="onPalletLoadAddCancel"
          :successCallback="onPalletLoadAddSuccess"/>
    </v-dialog>
    <v-dialog v-model="basketUnloadAdd" max-width="480">
      <BasketUnloadAdd :app="app" :cancelCallback="onBasketUnloadAddCancel"
          :successCallback="onBasketUnloadAddSuccess"/>
    </v-dialog>
  </v-container>
</template>

<script>
import PalletLoad from '../components/PalletLoad'
import PalletLoadAdd from '../components/PalletLoadAdd'
import BasketUnload from '../components/BasketUnload'
import BasketUnloadAdd from '../components/BasketUnloadAdd'
import DocumentService from '../services/DocumentService'
import ProductKindService from '../services/ProductKindService'
import PalletLoadService from '../services/PalletLoadService'
import BasketUnloadService from '../services/BasketUnloadService'
import AuthService from '../services/AuthService'
import XlsxService from '../services/XlsxService'
import '../plugins/utility'

export default {
  name: 'document-detail',
  components: {
    PalletLoad,
    PalletLoadAdd,
    BasketUnload,
    BasketUnloadAdd,
  },
  props: {
    app: { type: Object, required: true },
  },
  data() {
    return {
      fetching: true,
      productKind: null,
      productKindSelect: null,
      productKindList: [],
      productKindFetching: true,
      productionDate: null,
      submitting: false,
      downloading: false,
      edit: false,
      palletLoadFetching: true,
      palletLoadExist: false,
      palletLoadAdd: false,
      basketUnloadFetching: true,
      basketUnloadExist: false,
      basketUnloadAdd: false,
      tab: null,
    };
  },
  computed: {
    productKindName() {
      return this.productKind || "(Jenis Produk Hilang)";
    },
    productionDateLocale() {
      return (this.productionDate) ? this.productionDate.toLocaleDateString() : null;
    },
    submitDisabled() {
      return this.submitting || !this.productKindSelect || !this.productionDate;
    },
    downloadDisabled() {
      return this.downloading || !this.palletLoadExist || !this.basketUnloadExist;
    }
  },
  methods: {
    onEdit() {
      this.edit = true;
    },
    onSave() {
      this.submitting = true;

      let productKind = this.productKindList.find(o => o.id === this.productKindSelect);
      this.productKind = productKind.name;

      let data = {
        productKindId: this.productKindSelect,
        productionDate: this.productionDate,
      };

      DocumentService.update(this.$route.params.documentId, data)
        .then(() => {
          this.app.log('Detail dokumen berhasil diperbaharui');
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
              this.app.log('Detail dokumen gagal diperbaharui,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Detail dokumen gagal diperbaharui, tidak ada jaringan');
          }
        });
    },
    onDownload() {
      this.downloading = true;
      XlsxService.generateDocument(this.$route.params.documentId)
        .then(() => {
          this.app.log('Dokumen berhasil diunduh');

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
              this.app.log('Gagal mengunduh dokumen dalam bentuk xlsx,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else if (err.request) {
            this.app.log('Gagal mengunduh dokumen dalam bentuk xlsx, tidak ada jaringan');
          }
          else {
            this.app.log('Gagal mengunduh dokumen dalam bentuk xlsx,'
              + ` kesalahan klien (${err.message})`);
          }
        });
    },
    onDelete() {
      this.app.confirm({
        description: 'Apakah anda yakin ingin menghapus dokumen ini?',
        promiseCallback: () => {
          return DocumentService.remove(this.$route.params.documentId);
        },
        thenCallback: () => {
          this.app.log('Dokumen berhasil dihapus');
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
              this.app.log('Dokumen gagal dihapus,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Dokumen gagal dihapus, tidak ada jaringan');
          }
        },
      });
    },
    palletLoadReset() {
      this.palletLoadFetching = true;
      this.palletLoadExist = false;

      PalletLoadService.find(this.$route.params.documentId)
        .then(() => {
          this.palletLoadFetching = false;
          this.palletLoadExist = true;
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Sesi habis, harap masuk kembali');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else if (err.response.status === 404) {
              this.palletLoadFetching = false;
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
    onPalletLoadAddCancel() {
      this.palletLoadAdd = false;
    },
    onPalletLoadAddSuccess() {
      this.palletLoadAdd = false;
      this.palletLoadReset();
    },
    basketUnloadReset() {
      this.basketUnloadFetching = true;
      this.basketUnloadExist = false;

      BasketUnloadService.find(this.$route.params.documentId)
        .then(() => {
          this.basketUnloadFetching = false;
          this.basketUnloadExist = true;
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Sesi habis, harap masuk kembali');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else if (err.response.status === 404) {
              this.basketUnloadFetching = false;
            }
            else {
              this.app.log('Gagal mengambil data bongkar basket,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Gagal mengambil data bongkar basket, tidak ada jaringan');
          }
        });
    },
    onBasketUnloadAddCancel() {
      this.basketUnloadAdd = false;
    },
    onBasketUnloadAddSuccess() {
      this.basketUnloadAdd = false;
      this.basketUnloadReset();
    },
  },
  created() {
    this.app.setAppBar(true, 'Detail Dokumen');
  },
  mounted() {
    DocumentService.findOne(this.$route.params.documentId)
      .then((res) => {
        this.productKind = res.data.productKind;
        this.productKindSelect = res.data.productKindId;
        this.productionDate = res.data.productionDate;

        this.fetching = false;

        this.palletLoadReset();
        this.basketUnloadReset();
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
              this.app.log('Sesi habis, harap masuk kembali');

            AuthService.signOut();
            this.app.routeReplace('/login');
          }
          else {
            this.app.log('Gagal mengambil dokumen,'
              + ` kesalahan server (${err.response.status})`);
          }
        }
        else {
          this.app.log('Gagal mengambil dokumen, tidak ada jaringan');
        }
      });

    ProductKindService.findAll()
      .then((res) => {
        this.productKindList = [];
        res.data.forEach((productKind) => {
          this.productKindList.push({
            id: productKind.id,
            name: productKind.name,
          });
        });

        this.productKindFetching = false;
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            this.app.log('Sesi habis, harap masuk kembali');

            AuthService.signOut();
            this.app.routeReplace('/login');
          }
          else {
            this.app.log('Gagal mengambil daftar jenis produk,'
              + ` kesalahan server (${err.response.status})`);
          }
        }
        else {
          this.app.log('Gagal mengambil daftar jenis produk, tidak ada jaringan');
        }
      });
  },
}
</script>