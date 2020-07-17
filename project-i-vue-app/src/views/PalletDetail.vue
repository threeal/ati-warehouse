<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field v-model="palletNumber" label="Nomor Palet"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" :clearable="edit" hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-combobox v-model="basketNumbers" label="Nomor Basket"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :clearable="edit" hide-details outlined
            multiple chips deletable-chips/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="startTime" label="Waktu Mulai" type="time"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" hide-details dense outlined/>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="endTime" label="Waktu Selesai" type="time"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="stackQuantity" label="Jumlah Tingkat" type="number"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" :clearable="edit" hide-details dense outlined/>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="canQuantity" label="Jumlah Kaleng" type="number"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" :clearable="edit" hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="loader" label="Loader"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" :clearable="edit" hide-details dense outlined/>
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
        <v-btn @click="onDelete()" :disabled="fetching || deleting" :loading="deleting"
            color="error" block>
          Hapus Data Palet
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PalletService from '../services/PalletService'
export default {
  name: 'pallet-detail',
  props: {
    app: { type: Object, required: true },
  },
  data() {
    return {
      fetching: true,
      submitting: false,
      deleting: false,
      edit: false,
      palletNumber: null,
      basketNumbers: null,
      startTime: null,
      endTime: null,
      stackQuantity: null,
      canQuantity: null,
      loader: null,
    };
  },
  methods: {
    onEdit() {
      this.edit = true;
    },
    onSave() {
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

      PalletService.update(this.$route.params.documentId, this.$route.params.palletId, data)
        .then(() => {
          this.app.log('Detail data palet berhasil diperbaharui');
          this.edit = false;
          this.submitting = false;
        })
        .catch(() => {
          this.app.log('Detail data palet gagal diperbaharui');
          this.submitting = false;
        });
    },
    onDelete() {
      this.deleting = true;

      PalletService.remove(this.$route.params.documentId, this.$route.params.palletId)
        .then(() => {
          this.app.log('Data palet berhasil dihapus');
          this.deleting = false;

          this.$router.push(`/document/${this.$route.params.documentId}`);
        })
        .catch(() => {
          this.app.log('Data palet gagal dihapus');
          this.deleting = false;
        });
    },
  },
  mounted() {
    this.app.title = 'Detail Data Palet';

    PalletService.findOne(this.$route.params.documentId, this.$route.params.palletId)
      .then((res) => {
        this.palletNumber = res.data.palletNumber;
        this.basketNumbers = res.data.basketNumbers;
        this.startTime = res.data.startTime;
        this.endTime = res.data.endTime;
        this.stackQuantity = res.data.stackQuantity;
        this.canQuantity = res.data.canQuantity;
        this.loader = res.data.loader;

        this.fetching = false;
      })
      .catch(() => {
        this.app.log('Error: Gagal mengambil detail data palet dari database');
      });
  },
}
</script>