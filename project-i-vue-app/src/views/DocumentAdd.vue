<template>
  <v-container>
    <v-container>
      <v-row>
        <v-text-field v-model="productKind" label="Jenis Produk"
            dense outlined/>
      </v-row>
      <v-row>
        <v-text-field v-model="productionDate" label="Tanggal Produksi" type="date"
            dense outlined/>
      </v-row>
      <v-row>
        <v-btn @click="onAdd()" :disabled="submitting || !productKind || !productionDate"
            color="primary" block>
          Tambah Dokumen
        </v-btn>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import '../plugins/utility'
import DocumentService from '../services/DocumentService';

export default {
  name: 'document-add',
  props: {
    app: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      productKind: null,
      productionDate: (new Date()).toDateInput(),
      submitting: false,
    };
  },
  methods: {
    onAdd() {
      this.submitting = true;

      let data = {
        productKind: this.productKind,
        productionDate: this.productionDate,
      };

      DocumentService.create(data)
        .then(() => {
          this.app.log('Dokumen berhasil ditambahkan');
          this.$router.push('document-list');
        })
        .catch(() => {
          this.app.log('Dokumen gagal ditambahkan');
          this.submitting = false;
        });
    },
  },
  mounted() {
    this.app.title = 'Tambah Dokumen';
  },
}
</script>