<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field v-model="basketNumber" label="Nomor Basket"
            :disabled="submitting" clearable hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="basketId" label="Id Basket"
            :disabled="submitting" clearable hide-details dense outlined/>
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
        <v-text-field v-model="basketQuantity" label="Jumlah Basket" type="number"
            :disabled="submitting" clearable hide-details dense outlined/>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="canQuantity" label="Sisa Kaleng" type="number"
            :disabled="submitting" clearable hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="rejectQuantity" label="Jumlah Rijek" type="number"
            :disabled="submitting" clearable hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row v-if="rejectQuantity && rejectQuantity > 0">
      <v-col>
        <v-text-field v-model="rejectKind" label="Jenis Rijek"
            :disabled="submitting" clearable hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="onAdd()" :disabled="addDisabled"
            :loading="submitting" color="success" block>
          <v-icon left>mdi-upload</v-icon> Submit Data Basket
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import '../plugins/utility'
import BasketService from '../services/BasketService'
import AuthService from '../services/AuthService'

export default {
  name: 'basket-add',
  props: {
    app: { type: Object, required: true },
  },
  data() {
    return {
      basketNumber: null,
      basketId: null,
      startTime: (new Date()).toTimeInput(),
      endTime: (new Date()).toTimeInput(),
      basketQuantity: null,
      canQuantity: null,
      rejectQuantity: null,
      rejectKind: null,
      submitting: false,
    };
  },
  computed: {
    addDisabled() {
      return this.submitting || !this.basketNumber || !this.basketId
        || !this.startTime || !this.endTime || (!this.basketQuantity && !this.canQuantity)
        || (this.rejectQuantity && this.rejectQuantity > 0 && !this.rejectKind);
    }
  },
  methods: {
    onAdd() {
      this.submitting = true;

      let data = {
        basketNumber: this.basketNumber,
        basketId: this.basketId,
        startTime: this.startTime,
        endTime: this.endTime,
        basketQuantity: this.basketQuantity,
        canQuantity: this.canQuantity,
        rejectQuantity: this.rejectQuantity,
        rejectKind: this.rejectKind,
      };

      BasketService.create(this.$route.params.documentId, data)
        .then(() => {
          this.app.log('Data basket berhasil ditambahkan');
          this.$router.go(-1);
        })
        .catch((err) => {
          this.submitting = false;

          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Data basket gagal ditambahkan, sesi habis');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else {
              this.app.log('Data basket gagal ditambahkan,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Data basket gagal ditambahkan, tidak ada jaringan');
          }
        });
    },
  },
  mounted() {
    this.app.setAppBar(true, 'Tambah Data Basket');
  },
}
</script>