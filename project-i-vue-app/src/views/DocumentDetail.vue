<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field v-model="productKind" label="Jenis Produk"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" :clearable="edit" outlined dense hide-details/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="productionDate" label="Tanggal Produksi" type="date"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" outlined dense hide-details/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn v-if="!edit" @click="onEdit()" :disabled="fetching" color="primary" block>
          Ubah Detail
        </v-btn>
        <v-btn v-else @click="onSave()" :disabled="submitting" :loading="submitting"
             color="success" block>
          Simpan Perubahan
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
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
                  :deleteCallback="onPalletLoadFetch"/>
              <v-container v-else>
                <v-container>
                  <v-row>
                    <v-btn color="primary" @click="onPalletLoadAdd()" block>
                      Tambah Data Muat Palet
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
                  :deleteCallback="onBasketUnloadFetch"/>
              <v-container v-else>
                <v-container>
                  <v-row>
                    <v-btn color="primary" @click="onBasketUnloadAdd()" block>
                      Tambah Data Bongkar Basket
                    </v-btn>
                  </v-row>
                </v-container>
              </v-container>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="onDelete()" :disabled="fetching || deleting" :loading="deleting"
            color="error" block>
          Hapus Dokumen
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BasketUnload from '../components/BasketUnload'
import PalletLoad from '../components/PalletLoad'
import DocumentService from '../services/DocumentService'
import PalletLoadService from '../services/PalletLoadService'
import BasketUnloadService from '../services/BasketUnloadService'
import AuthService from '../services/AuthService'

export default {
  name: 'document-detail',
  components: {
    BasketUnload,
    PalletLoad,
  },
  props: {
    app: { type: Object, required: true },
  },
  data() {
    return {
      fetching: true,
      submitting: false,
      deleting: false,
      edit: false,
      palletLoadFetching: true,
      palletLoadExist: false,
      basketUnloadFetching: true,
      basketUnloadExist: false,
      productKind: null,
      productionDate: null,
      tab: null,
    };
  },
  methods: {
    onEdit() {
      this.edit = true;
    },
    onSave() {
      this.submitting = true;

      let data = {
        productKind: this.productKind,
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
              this.app.log('Detail dokumen gagal diperbaharui, sesi habis');

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
    onDelete() {
      this.deleting = true;

      DocumentService.remove(this.$route.params.documentId)
        .then(() => {
          this.app.log('Dokumen berhasil dihapus');
          this.deleting = false;

          this.app.routePush('/document');
        })
        .catch((err) => {
          this.deleting = false;

          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Dokumen gagal dihapus, sesi habis');

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
        });
    },
    onPalletLoadFetch() {
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
              this.app.log('Gagal mengambil data muat palet, sesi habis');

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
    onPalletLoadAdd() {
      this.app.routePush(`/document/${this.$route.params.documentId}/pallet-load-add`);
    },
    onBasketUnloadFetch() {
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
              this.app.log('Gagal mengambil data bongkar basket, sesi habis');

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
    onBasketUnloadAdd() {
      this.app.routePush(`/document/${this.$route.params.documentId}/basket-unload-add`);
    },
  },
  mounted() {
    this.app.setAppBar(true, 'Detail Dokumen');

    DocumentService.findOne(this.$route.params.documentId)
      .then((res) => {
        this.productKind = res.data.productKind;
        this.productionDate = res.data.productionDate;

        this.fetching = false;

        this.onPalletLoadFetch();
        this.onBasketUnloadFetch();
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            this.app.log('Gagal mengambil dokumen, sesi habis');

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
  },
}
</script>