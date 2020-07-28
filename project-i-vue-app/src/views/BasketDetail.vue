<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field v-model="basketNumber" label="Nomor Basket"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" :clearable="edit" hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="basketId" label="Id Basket"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" :clearable="edit" hide-details dense outlined/>
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
      <v-col v-if="edit || (basketQuantity && basketQuantity > 0)"
          :cols="(edit || (canQuantity && canQuantity > 0)) ? 6 : 12">
        <v-text-field v-model="basketQuantity" label="Jumlah Basket" type="number"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" :clearable="edit" hide-details dense outlined/>
      </v-col>
      <v-col v-if="edit || (canQuantity && canQuantity > 0)"
          :cols="(edit || (basketQuantity && basketQuantity > 0)) ? 6 : 12">
        <v-text-field v-model="canQuantity" label="Sisa Kaleng" type="number"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" :clearable="edit" hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row v-if="edit || (rejectQuantity && rejectQuantity > 0)">
      <v-col>
        <v-text-field v-model="rejectQuantity" label="Jumlah Rijek"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" :clearable="edit" hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row v-if="rejectQuantity && rejectQuantity > 0">
      <v-col>
        <v-text-field v-model="rejectKind" label="Jenis Rijek" type="number"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" :clearable="edit" hide-details dense outlined/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn v-if="!edit" @click="onEdit()" :disabled="fetching" color="primary" block>
          <v-icon left>mdi-pencil</v-icon> Ubah Detail
        </v-btn>
        <v-btn v-else @click="onSave()" :disabled="submitting || submitDisabled"
            :loading="submitting" color="success" block>
          <v-icon left>mdi-content-save</v-icon> Simpan Perubahan
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="onDelete()" :disabled="fetching || deleting" :loading="deleting"
            color="error" block>
          <v-icon left>mdi-delete</v-icon> Hapus Data Basket
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BasketService from '../services/BasketService'
import AuthService from '../services/AuthService'

export default {
  name: 'basket-detail',
  props: {
    app: { type: Object, required: true },
  },
  data() {
    return {
      fetching: true,
      submitting: false,
      deleting: false,
      edit: false,
      basketNumber: null,
      basketId: null,
      startTime: null,
      endTime: null,
      basketQuantity: null,
      canQuantity: null,
      rejectQuantity: null,
      rejectKind: null,
    };
  },
  computed: {
    submitDisabled() {
      return this.submitting || !this.basketNumber || !this.basketId
        || !this.startTime || !this.endTime || (!this.basketQuantity && !this.canQuantity)
        || (this.rejectQuantity && this.rejectQuantity > 0 && !this.rejectKind);
    }
  },
  methods: {
    onEdit() {
      this.edit = true;
    },
    onSave() {
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

      BasketService.update(this.$route.params.documentId, this.$route.params.basketId, data)
        .then(() => {
          this.app.log('Detail data basket berhasil diperbaharui');
          this.edit = false;
          this.submitting = false;
        })
        .catch((err) => {
          this.submitting = false;

          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Detail data basket gagal diperbaharui, sesi habis');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else {
              this.app.log('Detail data basket gagal diperbaharui,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Detail data basket gagal diperbaharui, tidak ada jaringan');
          }
        });
    },
    onDelete() {
      this.deleting = true;

      BasketService.remove(this.$route.params.documentId, this.$route.params.basketId)
        .then(() => {
          this.app.log('Data basket berhasil dihapus');
          this.deleting = false;

          this.$router.go(-1);
        })
        .catch((err) => {
          this.deleting = false;

          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Data basket gagal dihapus, sesi habis');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else {
              this.app.log('Data basket gagal dihapus,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Data basket gagal dihapus, tidak ada jaringan');
          }
        });
    },
  },
  mounted() {
    this.app.setAppBar(true, 'Detail Data Basket');

    BasketService.findOne(this.$route.params.documentId, this.$route.params.basketId)
      .then((res) => {
        this.basketNumber = res.data.basketNumber;
        this.basketId = res.data.basketId;
        this.startTime = res.data.startTime;
        this.endTime = res.data.endTime;
        this.basketQuantity = res.data.basketQuantity;
        this.canQuantity = res.data.canQuantity;
        this.rejectQuantity = res.data.rejectQuantity;
        this.rejectKind = res.data.rejectKind;

        this.fetching = false;
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            this.app.log('Gagal mengambil detail data basket, sesi habis');

            AuthService.signOut();
            this.app.routeReplace('/login');
          }
          else {
            this.app.log('Gagal mengambil detail data basket,'
              + ` kesalahan server (${err.response.status})`);
          }
        }
        else {
          this.app.log('Gagal mengambil detail data basket, tidak ada jaringan');
        }
      });
  },
}
</script>