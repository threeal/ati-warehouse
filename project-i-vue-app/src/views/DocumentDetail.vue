<template>
  <v-container>
    <v-container>
      <v-row>
        <v-text-field v-model="productKind" label="Jenis Produk"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" outlined dense/>
      </v-row>
      <v-row>
        <v-text-field v-model="productionDate" label="Tanggal Produksi" type="date"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" outlined dense/>
      </v-row>
      <v-row>
        <v-btn v-if="!edit" @click="onEdit()" :disabled="fetching" color="primary" block>
          Ubah Detail
        </v-btn>
        <v-btn v-else @click="onSave()" :disabled="submitting" :loading="submitting"
             color="success" block>
          Simpan Perubahan
        </v-btn>
      </v-row>
    </v-container>
    <v-card>
      <v-tabs v-model="tab" background-color="primary" grow dark>
        <v-tab href="#pallet-load">
          Muat Pallet
        </v-tab>
        <v-tab href="#basket-unload">
          Bongkar Basket
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item value="pallet-load">
          <PalletLoad/>
        </v-tab-item>
        <v-tab-item value="basket-unload">
          <BasketUnload/>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <v-container>
      <v-row>
        <v-btn @click="onDelete()" :disabled="deleting" :loading="deleting"
            color="error" block>
          Hapus Dokumen
        </v-btn>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import BasketUnload from '../components/BasketUnload'
import PalletLoad from '../components/PalletLoad'
import DocumentService from '../services/DocumentService'

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
          this.app.log('Detail Dokumen gagal diperbaharui');
          this.submitting = false;
        });
    },
    onDelete() {
      this.deleting = true;

      DocumentService.delete(this.$route.params.id)
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
  },
  mounted() {
    this.app.title = 'Detail Dokumen';

    DocumentService.get(this.$route.params.id)
      .then((res) => {
        this.fetching = false;
        this.productKind = res.data.productKind;
        this.productionDate = res.data.productionDate;
      })
      .catch(() => {
        this.app.log('Error: Gagal mengambil detail dokumen dari database');
      });
  },
}
</script>