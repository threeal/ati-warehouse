<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field v-model="unloadDate" label="Tanggal Bongkar" type="date"
            :disabled="fetching || submitting" :loading="fetching" :readonly="!edit"
            :filled="!edit" outlined dense hide-details/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="line" label="Line"
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
        <BasketList :app="app"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="onDelete()" :disabled="fetching || deleting" :loading="deleting"
            color="error" block>
          Hapus Data Muat Basket
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BasketList from './BasketList'
import BasketUnloadService from '../services/BasketUnloadService'

export default {
  name: 'basket-unload',
  components: {
    BasketList
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
      unloadDate: null,
      line: null,
    };
  },
  methods: {
    onEdit() {
      this.edit = true;
    },
    onSave() {
      this.submitting = true;

      let data = {
        unloadDate: this.unloadDate,
        line: this.line,
      };

      BasketUnloadService.update(this.$route.params.documentId, data)
        .then(() => {
          this.app.log('Detail data bongkar basket berhasil diperbaharui');
          this.edit = false;
          this.submitting = false;
        })
        .catch(() => {
          this.app.log('Detail data bongkar basket gagal diperbaharui');
          this.submitting = false;
        });
    },
    onDelete() {
      this.deleting = true;

      BasketUnloadService.remove(this.$route.params.documentId)
        .then(() => {
          this.app.log('Data bongkar basket berhasil dihapus');
          this.deleting = false;

          if (typeof this.deleteCallback === 'function') {
            this.deleteCallback();
          }
          else {
            this.$router.go();
          }
        })
        .catch(() => {
          this.app.log('Data bongkar basket gagal dihapus');
          this.deleting = false;
        });
    },
  },
  mounted() {
    BasketUnloadService.find(this.$route.params.documentId)
      .then((res) => {
        this.fetching = false;
        this.unloadDate = res.data.unloadDate;
        this.line = res.data.line;
      })
      .catch(() => {
        this.app.log('Error: Gagal mengambil detail data bongkar basket dari database');
      });
  },
}
</script>