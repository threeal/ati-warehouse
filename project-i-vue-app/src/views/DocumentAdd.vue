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
        <v-btn @click="onAdd()" :disabled="!productKind || !productionDate"
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
    };
  },
  methods: {
    onAdd() {
      let data = {
        productKind: this.productKind,
        productionDate: this.productionDate,
      };

      DocumentService.create(data)
        .then((res) => {
          console.log(res.data);
          this.$router.push('document-list');
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.app.title = 'Tambah Dokumen';
  },
}
</script>