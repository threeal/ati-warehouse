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
        <v-btn color="primary" block>Tambah Data Palet</v-btn>
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
                          Palet {{ row.palletNumber }} (Basket {{ row.basketNumbers }})
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
                        <div>
                          Loader: {{ row.loader }}
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
import PalletLoadService from '../services/PalletLoadService'

export default {
  name: 'pallet-load',
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
      loadDate: null,
      brand: null,
      panel: 0,
      rows: [
        {
          palletNumber: '1',
          basketNumbers: '5, 6, 7',
          quantity: '50 Tingkat',
          startTime: '05.00',
          endTime: '06.00',
          loader: 'Udin'
        },
        {
          palletNumber: '2',
          basketNumbers: '3, 2',
          quantity: '13 Tingkat 6 Kaleng',
          startTime: '06.00',
          endTime: '06.30',
          loader: 'Udin'
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