<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="palletNumber" label="Nomor Palet"
                :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
                :filled="!edit" :clearable="edit" hide-details dense outlined/>
          </v-col>
          <v-col cols="12">
            <v-combobox v-if="edit" v-model="basketNumbers" label="Nomor Basket"
                :disabled="submitting" clearable hide-details outlined
                multiple chips deletable-chips/>
            <v-text-field v-else :value="basketNumbers.toListString()" label="Nomor Palet"
                :disabled="fetching" :loading="fetching" readonly
                filled hide-details dense outlined/>
          </v-col>
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
          <v-col v-if="edit || (stackQuantity && stackQuantity > 0)"
              :cols="(edit || (canQuantity && canQuantity > 0)) ? 6 : 12">
            <v-text-field v-model="stackQuantity" label="Jumlah Tingkat" type="number"
                :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
                :filled="!edit" :clearable="edit" hide-details dense outlined/>
          </v-col>
          <v-col v-if="edit || (canQuantity && canQuantity > 0)"
              :cols="(edit || (stackQuantity && stackQuantity > 0)) ? 6 : 12">
            <v-text-field v-model="canQuantity" label="Sisa Kaleng" type="number"
                :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
                :filled="!edit" :clearable="edit" hide-details dense outlined/>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="loader" label="Loader"
                :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
                :filled="!edit" :clearable="edit" hide-details dense outlined/>
          </v-col>
          <v-col cols="12">
            <v-btn v-if="!edit" @click="onEdit()" :disabled="fetching" color="primary" block>
              <v-icon left>mdi-pencil</v-icon> Ubah Detail
            </v-btn>
            <v-btn v-else @click="onSave()" :disabled="submitting || submitDisabled"
                :loading="submitting" color="success" block>
              <v-icon left>mdi-content-save</v-icon> Simpan Perubahan
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn @click="onDelete()" :disabled="fetching" color="error" block>
              <v-icon left>mdi-delete</v-icon> Hapus Data Palet
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PalletService from '../services/PalletService'
import AuthService from '../services/AuthService'
import '../plugins/utility'

export default {
  name: 'pallet-detail',
  props: {
    app: { type: Object, required: true },
  },
  data() {
    return {
      fetching: true,
      submitting: false,
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
  computed: {
    submitDisabled() {
      return this.submitting || !this.palletNumber || !this.basketNumbers
        || !this.startTime || !this.endTime || !this.loader
        || (!this.stackQuantity && !this.canQuantity);
    }
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
        .catch((err) => {
          this.submitting = false;

          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Sesi habis, harap masuk kembali');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else {
              this.app.log('Detail data palet gagal diperbaharui,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Detail data palet gagal diperbaharui, tidak ada jaringan');
          }
        });
    },
    onDelete() {
      this.app.confirm({
        description: 'Apakah anda yakin ingin menghapus data palet ini?',
        promiseCallback: () => {
          return PalletService.remove(
            this.$route.params.documentId, this.$route.params.palletId
          );
        },
        thenCallback: () => {
          this.app.log('Data palet berhasil dihapus');
          this.$router.go(-1);
        },
        catchCallback: (err) => {
          if (err.response) {
            if (err.response.status === 401) {
              this.app.log('Sesi habis, harap masuk kembali');

              AuthService.signOut();
              this.app.routeReplace('/login');
            }
            else {
              this.app.log('Data palet gagal dihapus,'
                + ` kesalahan server (${err.response.status})`);
            }
          }
          else {
            this.app.log('Data palet gagal dihapus, tidak ada jaringan');
          }
        },
      });
    },
  },
  created() {
    this.app.setAppBar(true, 'Detail Data Palet');
  },
  mounted() {
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
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            this.app.log('Sesi habis, harap masuk kembali');

            AuthService.signOut();
            this.app.routeReplace('/login');
          }
          else {
            this.app.log('Gagal mengambil detail data palet,'
              + ` kesalahan server (${err.response.status})`);
          }
        }
        else {
          this.app.log('Gagal mengambil detail data palet, tidak ada jaringan');
        }
      });
  },
}
</script>