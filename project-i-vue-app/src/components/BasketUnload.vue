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
    <v-row dense>
      <v-col>
        <v-btn @click="onDelete()" :disabled="fetching || deleting" :loading="deleting"
            color="error" block>
          Hapus Data
        </v-btn>
      </v-col>
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
    <v-row dense>
      <v-col>
        <v-btn color="primary" block>Tambah Data Basket</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-list>
            <v-list-group value="true">
              <template v-slot:activator>
                <v-list-item-title>
                  Daftar Data Palet
                </v-list-item-title>
              </template>
              <div v-for="(row, index) in rows" :key="index">
                <v-divider/>
                <v-list-item two-line link>
                  <v-list-item-content eager>
                    <v-list-item-title>
                      <div class="d-flex justify-space-between">
                        <div>
                          Basket {{ row.basketNumber }} (ID {{ row.basketId }})
                        </div>
                        <div>
                          {{ row.quantity }}
                        </div>
                      </div>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <div class="d-flex justify-space-between">
                        <div>
                          {{ row.startTime }} - {{ row.endTime }}
                        </div>
                        <div v-if="row.rejectQuantity > 0">
                          Rijek: {{ row.rejectQuantity }} ({{ row.rejectKind }})
                        </div>
                      </div>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-list-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BasketUnloadService from '../services/BasketUnloadService'

export default {
  name: 'basket-unload',
  props: {
    app: {
      type: Object,
      required: true,
    },
    deleteCallback: {
      type: Function,
    },
  },
  data() {
    return {
      fetching: true,
      submitting: false,
      deleting: false,
      edit: false,
      unloadDate: null,
      line: null,
      panel: 0,
      rows: [
        {
          basketNumber: '1',
          basketId: '32',
          startTime: '05.00',
          endTime: '06.00',
          quantity: '50 Basket',
          rejectQuantity: 10,
          rejectKind: 'PJ',
        },
        {
          basketNumber: '2',
          basketId: '16',
          startTime: '04.00',
          endTime: '07.00',
          quantity: '32 Basket 6 Kaleng',
          rejectQuantity: 0,
          rejectKind: '',
        },
      ],
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