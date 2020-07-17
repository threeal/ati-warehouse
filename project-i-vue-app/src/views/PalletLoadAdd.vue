<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field v-model="loadDate" label="Tanggal Muat" type="date"
            :disabled="submitting" dense hide-details outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="brand" label="Merek"
            :disabled="submitting" clearable dense hide-details outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="onAdd()" :disabled="submitting || !loadDate || !brand"
            :loading="submitting" color="success" block>
          Submit Data
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import '../plugins/utility'
import PalletLoadService from '../services/PalletLoadService';

export default {
  name: 'pallet-load-add',
  props: {
    app: { type: Object, required: true, },
  },
  data() {
    return {
      loadDate: (new Date()).toDateInput(),
      brand: null,
      submitting: false,
    };
  },
  methods: {
    onAdd() {
      this.submitting = true;

      let data = {
        loadDate: this.loadDate,
        brand: this.brand,
      };

      PalletLoadService.create(this.$route.params.documentId, data)
        .then(() => {
          this.app.log('Data muat palet berhasil ditambahkan');
          this.$router.push(`/document/${this.$route.params.documentId}`);
        })
        .catch(() => {
          this.app.log('Data muat palet gagal ditambahkan');
          this.submitting = false;
        });
    },
  },
  mounted() {
    this.app.title = 'Tambah Data Muat Palet';
  },
}
</script>