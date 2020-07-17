<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field v-model="loadDate" label="Tanggal Muat" type="date"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" outlined dense hide-details/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="brand" label="Merk"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" :clearable="edit" outlined dense hide-details/>
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
    <div v-if="fetching" class="d-flex justify-center">
      <v-progress-circular color="primary" indeterminate/>
    </div>
    <v-row v-else>
      <v-col>
        <PalletList :app="app"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="onDelete()" :disabled="fetching || deleting" :loading="deleting"
            color="error" block>
          Hapus Data Muat Palet
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PalletList from './PalletList'
import PalletLoadService from '../services/PalletLoadService'

export default {
  name: 'pallet-load',
  components: {
    PalletList
  },
  props: {
    app: { type: Object, required: true },
    deleteCallback: { type: Function },
  },
  data() {
    return {
      fetching: true,
      submitting: false,
      deleting: false,
      edit: false,
      loadDate: null,
      brand: null,
    };
  },
  methods: {
    onEdit() {
      this.edit = true;
    },
    onSave() {
      this.submitting = true;

      let data = {
        loadDate: this.loadDate,
        brand: this.brand,
      };

      PalletLoadService.update(this.$route.params.documentId, data)
        .then(() => {
          this.app.log('Detail data muat palet berhasil diperbaharui');
          this.edit = false;
          this.submitting = false;
        })
        .catch(() => {
          this.app.log('Detail data muat palet gagal diperbaharui');
          this.submitting = false;
        });
    },
    onDelete() {
      this.deleting = true;

      PalletLoadService.remove(this.$route.params.documentId)
        .then(() => {
          this.app.log('Data muat palet berhasil dihapus');
          this.deleting = false;

          if (typeof this.deleteCallback === 'function') {
            this.deleteCallback();
          }
          else {
            this.$router.go();
          }
        })
        .catch(() => {
          this.app.log('Data muat palet gagal dihapus');
          this.deleting = false;
        });
    },
  },
  mounted() {
    PalletLoadService.find(this.$route.params.documentId)
      .then((res) => {
        this.fetching = false;
        this.loadDate = res.data.loadDate;
        this.brand = res.data.brand;
      })
      .catch(() => {
        this.app.log('Error: Gagal mengambil detail data muat palet dari database');
      });
  },
}
</script>