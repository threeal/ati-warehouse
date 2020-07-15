<template>
  <v-container>
    <v-container>
      <v-row>
        <v-text-field v-model="productKind" label="Jenis Produk"
            :disabled="!edit" dense outlined/>
      </v-row>
      <v-row>
        <v-text-field v-model="productDate" label="Tanggal Produksi" type="date"
            :disabled="!edit" dense outlined/>
      </v-row>
      <v-row>
        <v-btn v-if="!edit" @click="onEdit()" color="primary" block>Ubah Keterangan</v-btn>
        <v-btn v-else @click="onSave()" color="primary" block>Simpan Perubahan</v-btn>
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
        <v-btn color="error" block>Hapus Dokumen</v-btn>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import BasketUnload from '../components/BasketUnload'
import PalletLoad from '../components/PalletLoad'

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
      edit: false,
      productKind: 'T2 112 PR PCSD EO SA',
      productDate: '2020-01-01',
      tab: null,
    };
  },
  methods: {
    onEdit() {
      this.edit = true;
    },
    onSave() {
      this.edit = false;
    },
  },
  mounted() {
    this.app.title = 'Detail Dokumen';
  },
}
</script>