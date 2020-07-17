<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field v-model="palletNumber" label="Nomor Palet"
            :disabled="submitting" clearable hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-combobox v-model="basketNumbers" label="Nomor Basket"
            :disabled="submitting" clearable hide-details outlined
            multiple chips deletable-chips/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="startTime" label="Waktu Mulai" type="time"
            :disabled="submitting" hide-details dense outlined/>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="endTime" label="Waktu Selesai" type="time"
            :disabled="submitting" hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="stackQuantity" label="Jumlah Tingkat" type="number"
            :disabled="submitting" clearable hide-details dense outlined/>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="canQuantity" label="Jumlah Kaleng" type="number"
            :disabled="submitting" clearable hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="loader" label="Loader"
            :disabled="submitting" clearable hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="onAdd()" :disabled="addDisabled"
            :loading="submitting" color="success" block>
          Submit Data Palet
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import '../plugins/utility'
import PalletService from '../services/PalletService';

export default {
  name: 'pallet-add',
  props: {
    app: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      palletNumber: null,
      basketNumbers: null,
      startTime: (new Date()).toTimeInput(),
      endTime: (new Date()).toTimeInput(),
      stackQuantity: null,
      canQuantity: null,
      loader: null,
      submitting: false,
    };
  },
  computed: {
    addDisabled() {
      return this.submitting || !this.palletNumber || !this.basketNumbers
        || !this.startTime || !this.endTime || !this.loader
        || (!this.stackQuantity && !this.canQuantity);
    }
  },
  methods: {
    onAdd() {
      this.submitting = true;

      let data = {
        palletNumber: this.palletNumber,
        basketNumbers: this.basketNumbers,
        startTime: this.startTime,
        endTime: this.endTime,
        stackQuantity: this.stackQuantity,
        canQuantity: this.canQuantity,
        loader: this.loader,
      };

      PalletService.create(this.$route.params.documentId, data)
        .then(() => {
          this.app.log('Data Palet berhasil ditambahkan');
          this.$router.push(`/document/${this.$route.params.documentId}`);
        })
        .catch(() => {
          this.app.log('Data Palet gagal ditambahkan');
          this.submitting = false;
        });
    },
  },
  mounted() {
    this.app.title = 'Tambah Data Palet';
  },
}
</script>