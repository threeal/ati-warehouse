<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col>
          <v-select v-model="selectedSort" :items="sorts" label="Urutkan Data"
              :disabled="fetching" hide-details dense outlined/>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-btn color="primary" @click="onPalletAdd()" :disabled="fetching" block>
            <v-icon left>mdi-plus-circle</v-icon> Tambah Data Palet
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat>
            <v-list>
              <v-list-group value="true">
                <template v-slot:activator>
                  <v-list-item-title>
                    Daftar Data Palet
                  </v-list-item-title>
                </template>
                <div v-if="fetching">
                  <v-divider/>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-progress-circular color="primary" indeterminate/>
                    </v-list-item-content>
                  </v-list-item>
                </div>
                <div v-else-if="pallets.length > 0">
                  <div v-for="(pallet, index) in pallets" :key="index">
                    <v-divider/>
                    <PalletListItem :pallet="pallet" :onClick="onPalletClick"/>
                  </div>
                </div>
                <div v-else>
                  <v-divider/>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title class="d-flex justify-center">
                        Data Palet Kosong
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </div>
              </v-list-group>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import PalletListItem from './PalletListItem'
import PalletService from '../services/PalletService'
import AuthService from '../services/AuthService'

export default {
  name: 'pallet-list',
  components: {
    PalletListItem,
  },
  props: {
    app: { type: Object, required: true },
  },
  data() {
    let sorts = [
      { value: 'time', text: 'Berdasarkan Waktu' },
      { value: 'name', text: 'Berdasarkan Nama' },
    ];

    return {
      fetching: true,
      sorts: sorts,
      selectedSort: sorts[0],
      pallets: [],
    };
  },
  methods: {
    onPalletAdd() {
      this.app.routePush(`/document/${this.$route.params.documentId}/pallet-add`);
    },
    onPalletClick(palletId) {
      this.app.routePush(`/document/${this.$route.params.documentId}/pallet/${palletId}`);
    },
  },
  mounted() {
    PalletService.findAll(this.$route.params.documentId)
      .then((res) => {
        this.pallets = res.data;
        this.fetching = false;
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            this.app.log('Gagal mengambil daftar palet, sesi habis');

            AuthService.signOut();
            this.app.routeReplace('/login');
          }
          else {
            this.app.log('Gagal mengambil daftar palet,'
              + ` kesalahan server (${err.response.status})`);
          }
        }
        else {
          this.app.log('Gagal mengambil daftar palet, tidak ada jaringan');
        }
      });
  }
}
</script>