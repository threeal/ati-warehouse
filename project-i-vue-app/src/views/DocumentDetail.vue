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
    <v-row dense>
      <v-col>
        <v-btn @click="onDelete()" :disabled="fetching || deleting" :loading="deleting"
            color="error" block>
          Hapus Dokumen
        </v-btn>
      </v-col>
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
        <v-card>
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
              <PalletLoad v-else-if="palletLoadExist" :app="app" :exist="palletLoadExist"/>
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
              <BasketUnload/>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BasketUnload from '../components/BasketUnload'
import PalletLoad from '../components/PalletLoad'
import DocumentService from '../services/DocumentService'
import PalletLoadService from '../services/PalletLoadService'

export default {
  name: 'document-detail',
  components: {
    BasketUnload,
    PalletLoad,
  },
  props: {
    app: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fetching: true,
      submitting: false,
      deleting: false,
      edit: false,
      palletLoadFetching: true,
      palletLoadExist: false,
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

      DocumentService.update(this.$route.params.id, data)
        .then(() => {
          this.app.log('Detail dokumen berhasil diperbaharui');
          this.edit = false;
          this.submitting = false;
        })
        .catch(() => {
          this.app.log('Detail dokumen gagal diperbaharui');
          this.submitting = false;
        });
    },
    onDelete() {
      this.deleting = true;

      DocumentService.remove(this.$route.params.id)
        .then(() => {
          this.app.log('Dokumen berhasil dihapus');
          this.deleting = false;

          this.$router.push('/document');
        })
        .catch(() => {
          this.app.log('Dokumen gagal dihapus');
          this.deleting = false;
        });
    },
    onPalletLoadAdd() {
      this.$router.push(`/document/${this.$route.params.id}/pallet-load-add`);
    },
  },
  mounted() {
    this.app.title = 'Detail Dokumen';

    DocumentService.findOne(this.$route.params.id)
      .then((res) => {
        this.fetching = false;
        this.productKind = res.data.productKind;
        this.productionDate = res.data.productionDate;

        PalletLoadService.find(this.$route.params.id)
          .then(() => {
            this.palletLoadFetching = false;
            this.palletLoadExist = true;
          })
          .catch(() => {
            this.palletLoadFetching = false;
          });
      })
      .catch(() => {
        this.app.log('Error: Gagal mengambil detail dokumen dari database');
      });
  },
}
</script>